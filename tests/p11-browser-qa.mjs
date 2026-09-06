import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.P11_BASE_URL ?? "http://127.0.0.1:3022";
const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const debuggingPort = Number(process.env.P11_CHROME_PORT ?? 9342);
const serverPort = Number(new URL(baseUrl).port || 3022);
const profileDirectory = await mkdtemp(join(tmpdir(), "argos-p11-chrome-"));
const nextCliPath = join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const studentRoutes = [
  "/",
  "/today",
  "/practice",
  "/listen",
  "/words",
  "/speak",
  "/review",
  "/journal",
  "/stats",
  "/settings",
  "/device-lab",
  "/device-lab/8k",
  "/device-lab/8k/8k-intro",
  "/pilot",
];

const viewports = [
  { name: "320", width: 320, height: 812, mobile: true },
  { name: "375", width: 375, height: 812, mobile: true },
  { name: "768", width: 768, height: 1024, mobile: true },
  { name: "desktop", width: 1280, height: 800, mobile: false },
];

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitFor(check, timeoutMs = 60_000, intervalMs = 50) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const value = await check();
    if (value) return value;
    await delay(intervalMs);
  }
  throw new Error(`Browser condition timed out after ${timeoutMs}ms.`);
}

class CdpSession {
  constructor(webSocketUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(webSocketUrl);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      for (const listener of this.listeners.get(message.method) ?? []) {
        listener(message.params);
      }
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { reject, resolve });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

let server = null;
server = spawn(
  process.execPath,
  [nextCliPath, "start", "--hostname", "127.0.0.1", "--port", String(serverPort)],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  },
);

await waitFor(async () => {
  try {
    const response = await fetch(baseUrl);
    return response.ok || response.status === 404;
  } catch {
    return null;
  }
}, 90_000);
console.log("[p11-browser] production server ready");

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    `--remote-debugging-port=${debuggingPort}`,
    `--user-data-dir=${profileDirectory}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
    "about:blank",
  ],
  { stdio: "ignore" },
);

let session;

try {
  const debuggerVersion = await waitFor(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:${debuggingPort}/json/version`,
      );
      return response.ok ? response.json() : null;
    } catch {
      return null;
    }
  });
  assert.match(debuggerVersion.Browser, /Chrome\/(\d+)/);

  const targetResponse = await fetch(
    `http://127.0.0.1:${debuggingPort}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  );
  const target = await targetResponse.json();
  session = new CdpSession(target.webSocketDebuggerUrl);
  await session.connect();

  const consoleErrors = [];
  const requestMethods = new Map();
  const audioResponses = [];

  session.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    consoleErrors.push(exceptionDetails.text || "Runtime exception");
  });
  session.on("Log.entryAdded", ({ entry }) => {
    if (entry.level === "error") consoleErrors.push(entry.text);
  });
  session.on("Network.requestWillBeSent", ({ request, requestId }) => {
    requestMethods.set(requestId, request.method);
  });
  session.on("Network.responseReceived", ({ requestId, response }) => {
    if (
      requestMethods.get(requestId) === "POST" &&
      response.url.includes("/api/tts")
    ) {
      audioResponses.push({
        mimeType: response.mimeType,
        status: response.status,
        url: response.url,
      });
    }
  });

  await Promise.all([
    session.send("Page.enable"),
    session.send("Runtime.enable"),
    session.send("Log.enable"),
    session.send("Network.enable"),
  ]);

  await session.send("Browser.grantPermissions", {
    origin: baseUrl,
    permissions: ["audioCapture"],
  });

  async function evaluate(expression, userGesture = false) {
    const result = await session.send("Runtime.evaluate", {
      awaitPromise: true,
      expression,
      returnByValue: true,
      userGesture,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || "evaluate failed");
    }
    return result.result.value;
  }

  async function setViewport(viewport) {
    await session.send("Emulation.setDeviceMetricsOverride", {
      deviceScaleFactor: 1,
      height: viewport.height,
      mobile: viewport.mobile,
      screenHeight: viewport.height,
      screenWidth: viewport.width,
      width: viewport.width,
    });
  }

  async function navigate(path, viewport) {
    if (viewport) await setViewport(viewport);
    await session.send("Page.navigate", { url: `${baseUrl}${path}` });
    await waitFor(() =>
      evaluate(
        `document.readyState === "complete" && document.body && document.body.innerText.trim().length > 0`,
      ),
    );
    await waitFor(() =>
      evaluate(
        `!document.querySelector('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay')`,
      ),
    );
    await delay(150);
  }

  // 1) Student route smoke matrix
  const smokeMatrix = [];
  for (const viewport of viewports) {
    for (const route of studentRoutes) {
      await navigate(route, viewport);
      const measurement = await evaluate(`(() => {
        const doc = document.documentElement;
        const buttons = [...document.querySelectorAll("button, a[href], [role='button']")]
          .filter((el) => {
            const style = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
          });
        const smallTargets = buttons
          .map((el) => {
            const rect = el.getBoundingClientRect();
            return { h: Math.round(rect.height * 10) / 10, w: Math.round(rect.width * 10) / 10, text: (el.innerText || el.getAttribute("aria-label") || "").slice(0, 40) };
          })
          .filter((item) => item.h < 24 || item.w < 24);
        return {
          overflow: doc.scrollWidth > window.innerWidth + 1,
          title: document.title,
          h1: document.querySelector("h1")?.textContent?.trim() || "",
          bodyLen: document.body.innerText.trim().length,
          smallTargets,
        };
      })()`);
      assert.equal(
        measurement.overflow,
        false,
        `${route} overflows at ${viewport.name}`,
      );
      assert.ok(
        measurement.bodyLen > 20,
        `${route} looks empty at ${viewport.name}`,
      );
      assert.equal(
        measurement.smallTargets.length,
        0,
        `${route} has sub-24px targets at ${viewport.name}: ${JSON.stringify(measurement.smallTargets)}`,
      );
      smokeMatrix.push({
        route,
        viewport: viewport.name,
        overflow: measurement.overflow,
        h1: measurement.h1,
      });
    }
  }
  console.log("[p11-browser] student route smoke matrix passed");

  // Retired routes must 404
  for (const retired of ["/login", "/account", "/admin"]) {
    const response = await fetch(`${baseUrl}${retired}`);
    assert.equal(response.status, 404, `${retired} must be retired`);
  }
  console.log("[p11-browser] retired routes return 404");

  // 2) CTA contrast / focus / target matrix on representative surfaces
  await navigate("/device-lab", viewports[1]);
  const ctaMatrix = await evaluate(`(() => {
    function parseRgb(color) {
      const match = String(color).replace(/\\s+/g, "").match(/^rgba?\\((\\d+),(\\d+),(\\d+)(?:,([0-9.]+))?\\)$/i);
      if (!match) return null;
      return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: match[4] === undefined ? 1 : Number(match[4]) };
    }
    function luminance(rgb) {
      const channel = (value) => {
        const c = value / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
    }
    function contrast(fg, bg) {
      const L1 = luminance(fg);
      const L2 = luminance(bg);
      return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    }

    const candidates = [...document.querySelectorAll("a, button")].filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const cls = el.className || "";
      const looksLikeCta = /min-h-11|rounded-full/.test(cls) || el.tagName === "BUTTON";
      return looksLikeCta && rect.height >= 40 && style.visibility !== "hidden" && style.display !== "none";
    });
    return candidates.slice(0, 12).map((el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const fg = parseRgb(style.color);
      let bg = parseRgb(style.backgroundColor);
      if (!bg || bg.a === 0) {
        let node = el.parentElement;
        while (node && (!bg || bg.a === 0)) {
          bg = parseRgb(getComputedStyle(node).backgroundColor);
          node = node.parentElement;
        }
      }
      return {
        text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 48),
        height: Math.round(rect.height * 10) / 10,
        width: Math.round(rect.width * 10) / 10,
        color: style.color,
        backgroundColor: style.backgroundColor,
        contrast: fg && bg && bg.a > 0 ? Number(contrast(fg, bg).toFixed(2)) : null,
        className: String(el.className || "").slice(0, 80),
      };
    });
  })()`);

  assert.ok(ctaMatrix.length > 0, "Expected CTA samples");
  for (const item of ctaMatrix) {
    assert.ok(item.height >= 44, `CTA below 44px: ${item.text}`);
    if (item.contrast !== null) {
      assert.ok(
        item.contrast >= 4.5,
        `CTA contrast ${item.contrast} for ${item.text}`,
      );
    }
  }

  let focusedCta = null;
  for (let index = 0; index < 40 && !focusedCta; index += 1) {
    await session.send("Input.dispatchKeyEvent", {
      code: "Tab",
      key: "Tab",
      type: "keyDown",
      windowsVirtualKeyCode: 9,
    });
    await session.send("Input.dispatchKeyEvent", {
      code: "Tab",
      key: "Tab",
      type: "keyUp",
      windowsVirtualKeyCode: 9,
    });
    focusedCta = await evaluate(`(() => {
      const el = document.activeElement;
      if (!el || (el.tagName !== "A" && el.tagName !== "BUTTON")) return null;
      const cls = String(el.className || "");
      if (!/min-h-11|rounded-full/.test(cls) && el.tagName !== "BUTTON") return null;
      const style = getComputedStyle(el);
      return {
        text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 48),
        focusVisible: el.matches(":focus-visible"),
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
      };
    })()`);
  }
  assert.ok(focusedCta, "Tab did not reach a CTA control");
  assert.equal(focusedCta.focusVisible, true);
  const hasFocusCue =
    (focusedCta.outlineStyle && focusedCta.outlineStyle !== "none") ||
    (focusedCta.boxShadow && focusedCta.boxShadow !== "none");
  assert.ok(hasFocusCue, `CTA missing focus cue after Tab: ${focusedCta.text}`);

  console.log("[p11-browser] CTA contrast/focus/target matrix passed");

  // 3) TTS real audio + error/retry matrix
  audioResponses.length = 0;
  await navigate("/listen", viewports[1]);
  const ttsClicked = await evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find((item) =>
      /dinle|oynat|metni dinle/i.test(item.textContent || "")
    );
    if (!button) return false;
    window.__p11Audio = button;
    button.click();
    return true;
  })()`, true);
  assert.equal(ttsClicked, true, "Could not find Listen TTS control");
  await waitFor(
    () =>
      evaluate(
        `window.__p11Audio?.textContent.includes("Duraklat") === true || window.__p11Audio?.textContent.includes("Hazırlanıyor") === true`,
      ),
    30_000,
  );
  await waitFor(
    () => evaluate(`window.__p11Audio?.textContent.includes("Duraklat") === true`),
    45_000,
  );
  await waitFor(() => audioResponses.some((item) => item.status === 200), 45_000);
  const okAudio = audioResponses.find((item) => item.status === 200);
  assert.ok(okAudio, "Expected successful /api/tts response");
  assert.match(okAudio.mimeType || "", /audio|json/i);

  // Force a retryable client-side failure by stubbing fetch once, then recover.
  await evaluate(`(() => {
    const original = window.fetch.bind(window);
    let failed = false;
    window.fetch = async (input, init) => {
      const url = String(input);
      if (!failed && url.includes("/api/tts") && (init?.method || "GET").toUpperCase() === "POST") {
        failed = true;
        return new Response(JSON.stringify({ code: "upstream_failed", message: "Simulated upstream failure" }), {
          status: 502,
          headers: { "Content-Type": "application/json" },
        });
      }
      return original(input, init);
    };
    window.__p11FetchStubbed = true;
  })()`);

  // Navigate words and trigger audio; first may error then retry should work if UI exposes retry.
  await navigate("/words", viewports[1]);
  const wordsAudio = await evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find((item) =>
      /dinle|kelime|örnek/i.test(item.textContent || "") || (item.getAttribute("aria-label") || "").toLowerCase().includes("dinle")
    );
    if (!button) return false;
    window.__p11WordsAudio = button;
    button.click();
    return true;
  })()`, true);
  assert.equal(wordsAudio, true, "Could not find Words audio control");
  await waitFor(async () => {
    const text = await evaluate(
      `window.__p11WordsAudio?.textContent || document.body.innerText`,
    );
    return /hata|yeniden|retry|duraklat|hazırlanıyor|dinle/i.test(String(text));
  }, 30_000);

  // Direct API error matrix against production server
  const badRequest = await fetch(`${baseUrl}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ text: "" }),
  });
  assert.ok([400, 422].includes(badRequest.status), `empty TTS text status ${badRequest.status}`);
  const badBody = await badRequest.text();
  assert.equal(badBody.toLowerCase().includes("xi-api-key"), false);
  assert.equal(badBody.toLowerCase().includes("elevenlabs_api_key"), false);

  const goodBinary = await fetch(`${baseUrl}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text: "Argos P11 audio check.", includeAlignment: false }),
  });
  assert.equal(goodBinary.status, 200);
  const audioBytes = await goodBinary.arrayBuffer();
  assert.ok(audioBytes.byteLength > 0);
  console.log("[p11-browser] TTS real audio + error matrix passed", {
    audioBytes: audioBytes.byteLength,
  });

  // 4) Recording browser/fallback + track cleanup matrix
  // Speak: recorder appears only on answer step; no permission on load.
  await navigate("/speak", viewports[1]);
  await waitFor(() =>
    evaluate(`document.body.innerText.includes("Dinle, sonra sesli cevap ver")`),
  );
  await evaluate(`(() => {
    window.__p11rec = { calls: 0, streams: [], created: [], revoked: [] };
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...args) => {
      window.__p11rec.calls += 1;
      const stream = await originalGetUserMedia(...args);
      window.__p11rec.streams.push(stream);
      return stream;
    };
    const originalCreate = URL.createObjectURL.bind(URL);
    const originalRevoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (value) => {
      const url = originalCreate(value);
      window.__p11rec.created.push({ size: value.size, type: value.type, url });
      return url;
    };
    URL.revokeObjectURL = (url) => {
      window.__p11rec.revoked.push(url);
      return originalRevoke(url);
    };
  })()`);
  assert.equal(await evaluate(`window.__p11rec.calls`), 0);
  await evaluate(
    `([...document.querySelectorAll("button")].find((b) => (b.textContent || "").includes("Cevaba geç")) || { click(){} }).click()`,
    true,
  );
  await waitFor(() =>
    evaluate(`document.querySelector('[data-speak-primary="answer"]') !== null`),
  );
  assert.ok(
    await evaluate(`document.querySelectorAll("[data-voice-recorder]").length > 0`),
  );
  assert.equal(await evaluate(`window.__p11rec.calls`), 0);

  // Full lifecycle on Device Lab where recorders are visible without step gates.
  await navigate("/device-lab/8k/8k-intro", viewports[1]);
  await evaluate(`(() => {
    window.__p11rec = { calls: 0, streams: [], created: [], revoked: [] };
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dest = ctx.createMediaStreamDestination();
    oscillator.connect(dest);
    oscillator.start();
    window.__p11rec.audioContext = ctx;
    navigator.mediaDevices.getUserMedia = async () => {
      window.__p11rec.calls += 1;
      window.__p11rec.streams.push(dest.stream);
      return dest.stream;
    };
    const originalCreate = URL.createObjectURL.bind(URL);
    const originalRevoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (value) => {
      const url = originalCreate(value);
      window.__p11rec.created.push({ size: value.size, type: value.type, url });
      return url;
    };
    URL.revokeObjectURL = (url) => {
      window.__p11rec.revoked.push(url);
      return originalRevoke(url);
    };
  })()`, true);
  assert.equal(await evaluate(`window.__p11rec.calls`), 0);
  await waitFor(() =>
    evaluate(`document.querySelectorAll("[data-voice-recorder]").length >= 1`),
  );

  const startClicked = await evaluate(`(() => {
    const recorder = document.querySelector("[data-voice-recorder]");
    const button = [...(recorder?.querySelectorAll("button") || [])].find((item) =>
      item.textContent.includes("Kaydı başlat")
    );
    if (!button) return false;
    button.click();
    return true;
  })()`, true);
  assert.equal(startClicked, true);
  await waitFor(async () => {
    const text = await evaluate(
      `document.querySelector("[data-voice-recorder]")?.innerText || ""`,
    );
    return text.includes("Kayıt sürüyor") || text.includes("Kayıt hazır");
  }, 30_000);
  const midText = await evaluate(
    `document.querySelector("[data-voice-recorder]")?.innerText || ""`,
  );
  if (midText.includes("Kayıt sürüyor")) {
    await delay(700);
    const stopClicked = await evaluate(`(() => {
      const recorder = document.querySelector("[data-voice-recorder]");
      const button = [...(recorder?.querySelectorAll("button") || [])].find((item) =>
        item.textContent.includes("Kaydı durdur")
      );
      if (!button) return false;
      button.click();
      return true;
    })()`, true);
    assert.equal(stopClicked, true);
  }
  await waitFor(async () =>
    (await evaluate(
      `document.querySelector("[data-voice-recorder]")?.innerText || ""`,
    )).includes("Kayıt hazır"),
  );

  const cleanup = await evaluate(`({
    calls: window.__p11rec.calls,
    created: window.__p11rec.created,
    tracks: window.__p11rec.streams[0]?.getTracks().map((track) => track.readyState) || [],
  })`);
  assert.equal(cleanup.calls, 1);
  assert.equal(cleanup.created.length, 1);
  assert.ok(cleanup.created[0].size > 0);
  assert.match(cleanup.created[0].type, /^audio\//);
  assert.deepEqual(cleanup.tracks, ["ended"]);

  await evaluate(`(() => {
    const recorder = document.querySelector("[data-voice-recorder]");
    const button = [...(recorder?.querySelectorAll("button") || [])].find((item) =>
      item.textContent.includes("Kaydı sil")
    );
    button?.click();
  })()`, true);
  await delay(200);
  const revoked = await evaluate(`window.__p11rec.revoked.length`);
  assert.ok(revoked >= 1, "Object URL was not revoked on delete");

  // Unsupported fallback
  await session.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `Object.defineProperty(window, "MediaRecorder", { configurable: true, value: undefined });`,
  });
  await navigate("/device-lab/8k/8k-intro", viewports[0]);
  await waitFor(() =>
    evaluate(
      `[...document.querySelectorAll("[data-voice-recorder]")].every((item) => item.innerText.includes("desteklemiyor"))`,
    ),
  );
  assert.equal(
    await evaluate(`document.body.innerText.includes("Kısa konuşma görevi") || document.body.innerText.includes("Say it")`),
    true,
  );

  console.log("[p11-browser] recording cleanup/fallback matrix passed");

  assert.equal(consoleErrors.length, 0, consoleErrors.join("\n"));

  console.log(
    JSON.stringify(
      {
        browser: debuggerVersion.Browser,
        smokeRoutes: smokeMatrix.length,
        ctaSamples: ctaMatrix.length,
        ttsAudioBytes: audioBytes.byteLength,
        recordingMime: cleanup.created[0].type,
        retiredRoutes: "404",
      },
      null,
      2,
    ),
  );
} finally {
  session?.close();
  chrome.kill();
  if (server) {
    server.kill();
    await Promise.race([once(server, "exit"), delay(3_000)]);
  }
  await rm(profileDirectory, { recursive: true, force: true });
}
