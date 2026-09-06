import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.P10B_BASE_URL ?? "http://127.0.0.1:3020";
const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const debuggingPort = Number(process.env.P10B_CHROME_PORT ?? 9340);
const profileDirectory = await mkdtemp(join(tmpdir(), "argos-p10b-chrome-"));

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
      });
    }
  });

  await Promise.all([
    session.send("Page.enable"),
    session.send("Runtime.enable"),
    session.send("Log.enable"),
    session.send("Network.enable"),
  ]);

  async function evaluate(expression, userGesture = false) {
    const result = await session.send("Runtime.evaluate", {
      awaitPromise: true,
      expression,
      returnByValue: true,
      userGesture,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text);
    }
    return result.result.value;
  }

  async function navigate(path, width, readyText) {
    await session.send("Emulation.setDeviceMetricsOverride", {
      deviceScaleFactor: 1,
      height: 812,
      mobile: true,
      screenHeight: 812,
      screenWidth: width,
      width,
    });
    await session.send("Page.navigate", { url: `${baseUrl}${path}` });
    await waitFor(() =>
      evaluate(
        `document.readyState === "complete" && document.body.innerText.includes(${JSON.stringify(readyText)})`,
      ),
    );
    await waitFor(() =>
      evaluate(`!document.querySelector('[data-nextjs-dialog]')`),
    );
    await delay(200);
  }

  const listenResults = [];
  for (const width of [320, 375]) {
    await navigate("/listen", width, "Transcript");
    const snapshot = await evaluate(`(() => {
      const primary = [...document.querySelectorAll("button")].filter((button) =>
        (button.getAttribute("aria-label") || "").includes("Metni dinle")
      );
      const transcript = document.querySelector('[aria-label="Transcript"]');
      const save = [...document.querySelectorAll("button")].find((button) =>
        (button.textContent || "").includes("Cevabımı kaydet")
      );
      const focusTarget = primary[0] || save;
      focusTarget?.focus();
      const focused = document.activeElement;
      const style = focused ? getComputedStyle(focused) : null;
      const outline =
        style &&
        (style.outlineWidth !== "0px" ||
          style.boxShadow !== "none" ||
          style.outlineStyle !== "none");
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        primaryCount: primary.length,
        hasTranscript: Boolean(transcript),
        transcriptFontPx: transcript
          ? Number.parseFloat(getComputedStyle(transcript.querySelector("p:last-of-type") || transcript).fontSize)
          : 0,
        saveMinHeight: save ? save.getBoundingClientRect().height : 0,
        focusVisible: Boolean(outline),
        width: window.innerWidth,
      };
    })()`);

    // contrast on primary button
    const contrast = await evaluate(`(() => {
      const button = [...document.querySelectorAll("button")].find((item) =>
        (item.getAttribute("aria-label") || "").includes("Metni dinle") ||
        (item.textContent || "").includes("Dinle")
      );
      if (!button) return null;
      const style = getComputedStyle(button);
      const parse = (color) => {
        const match = String(color).match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
        return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
      };
      const toLin = (c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      const lum = ([r, g, b]) => 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
      const fg = parse(style.color);
      const bg = parse(style.backgroundColor);
      if (!fg || !bg) return null;
      const L1 = lum(fg);
      const L2 = lum(bg);
      return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    })()`);

    assert.equal(snapshot.overflow, false, `/listen overflows at ${width}`);
    assert.equal(snapshot.primaryCount, 1, "Listen must have one primary Metni dinle control");
    assert.equal(snapshot.hasTranscript, true);
    assert.ok(snapshot.transcriptFontPx >= 16, "Transcript should be readable (>=16px)");
    assert.ok(snapshot.saveMinHeight >= 44, "Save control should meet 44px touch target");
    assert.ok(snapshot.focusVisible, "Focused control should show a visible focus ring");
    if (typeof contrast === "number") {
      assert.ok(contrast >= 4.5, `Listen Dinle contrast ${contrast} < 4.5`);
    }
    listenResults.push({ ...snapshot, contrast });
  }

  // Real playback gate on listen
  await navigate("/listen", 375, "Transcript");
  const ttsStatus = await evaluate(
    `fetch("/api/tts").then((response) => response.json())`,
  );
  assert.equal(
    ttsStatus.configured,
    true,
    `TTS must be configured for playback QA: ${ttsStatus.reason ?? "unknown"}`,
  );

  const before = audioResponses.length;
  const clicked = await evaluate(
    `(() => {
      const button = [...document.querySelectorAll("button")].find((item) =>
        !item.disabled && (item.getAttribute("aria-label") || "").includes("Metni dinle")
      );
      if (!button) return false;
      window.__p10bAudio = button;
      button.click();
      return true;
    })()`,
    true,
  );
  assert.equal(clicked, true);
  await waitFor(() =>
    evaluate(
      `window.__p10bAudio?.textContent.includes("Duraklat") === true || window.__p10bAudio?.textContent.includes("Hazırlanıyor") === true`,
    ),
  );
  await waitFor(() =>
    evaluate(`window.__p10bAudio?.textContent.includes("Duraklat") === true`),
  );
  assert.ok(audioResponses.length > before, "Listen playback must hit /api/tts");
  assert.equal(
    audioResponses.slice(before).every((item) => item.status === 200),
    true,
  );

  // Words progressive + density
  const wordsResults = [];
  for (const width of [320, 375]) {
    await navigate("/words", width, "Bugün kullanacağın kelimeler");
    const snapshot = await evaluate(`(() => {
      const cards = [...document.querySelectorAll("article")].filter((item) =>
        /Word \\d+/.test(item.textContent || "")
      );
      const visibleCards = cards.filter((item) => {
        const style = getComputedStyle(item);
        const rect = item.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      });
      const reveal = [...document.querySelectorAll("button")].find((item) =>
        (item.textContent || "").includes("Sonraki 5'i göster")
      );
      const counter = [...document.querySelectorAll("span,p,div")].some((item) =>
        /\\b0\\/10\\b|\\b\\d+\\/10\\b/.test(item.textContent || "")
      );
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        visibleCards: visibleCards.length,
        hasReveal: Boolean(reveal),
        hasCounter: counter,
        maxCardBottom: Math.max(0, ...visibleCards.map((item) => item.getBoundingClientRect().bottom)),
        width: window.innerWidth,
      };
    })()`);
    assert.equal(snapshot.overflow, false, `/words overflows at ${width}`);
    assert.equal(snapshot.visibleCards, 5);
    assert.equal(snapshot.hasReveal, true);
    assert.equal(snapshot.hasCounter, true);
    assert.ok(snapshot.maxCardBottom > 812);
    wordsResults.push(snapshot);
  }

  await navigate("/words", 375, "Bugün kullanacağın kelimeler");
  const wordBefore = audioResponses.length;
  const wordClicked = await evaluate(
    `(() => {
      const button = [...document.querySelectorAll("button")].find((item) =>
        !item.disabled && (item.getAttribute("aria-label") || "").includes("Kelimeyi dinle")
      );
      if (!button) return false;
      window.__p10bWord = button;
      button.click();
      return true;
    })()`,
    true,
  );
  assert.equal(wordClicked, true);
  await waitFor(() =>
    evaluate(`window.__p10bWord?.textContent.includes("Duraklat") === true`),
  );
  assert.ok(audioResponses.length > wordBefore);

  const revealClick = await evaluate(
    `(() => {
      const button = [...document.querySelectorAll("button")].find((item) =>
        (item.textContent || "").includes("Sonraki 5'i göster")
      );
      if (!button) return false;
      button.click();
      return true;
    })()`,
    true,
  );
  assert.equal(revealClick, true);
  await waitFor(() =>
    evaluate(`([...document.querySelectorAll("article")].filter((item) => {
      const style = getComputedStyle(item);
      const rect = item.getBoundingClientRect();
      return /Word \\d+/.test(item.textContent || "") && style.display !== "none" && rect.height > 0;
    }).length) === 10`),
  );

  assert.deepEqual(consoleErrors, []);
  console.log(
    JSON.stringify({
      audioResponses: audioResponses.length,
      listenResults,
      wordsResults,
    }),
  );
} finally {
  session?.close();
  if (!chrome.killed) chrome.kill();
  await Promise.race([once(chrome, "exit"), delay(2_000)]).catch(() => {});
  await rm(profileDirectory, { force: true, maxRetries: 3, recursive: true });
}
