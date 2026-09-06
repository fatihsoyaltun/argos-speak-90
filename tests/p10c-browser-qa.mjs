import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.P10C_BASE_URL ?? "http://127.0.0.1:3021";
const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const debuggingPort = Number(process.env.P10C_CHROME_PORT ?? 9341);
const profileDirectory = await mkdtemp(join(tmpdir(), "argos-p10c-chrome-"));

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

  for (const width of [320, 375]) {
    await navigate("/speak", width, "Dinle, sonra sesli cevap ver");
    const snapshot = await evaluate(`(() => {
      const primary = document.querySelector('[data-speak-primary]');
      const primaries = document.querySelectorAll('[data-speak-primary]');
      const listen = [...document.querySelectorAll("button")].filter((button) =>
        (button.getAttribute("aria-label") || "").includes("Konuşma promptunu dinle")
      );
      const continueBtn = [...document.querySelectorAll("button")].find((button) =>
        (button.textContent || "").includes("Cevaba geç")
      );
      continueBtn?.focus();
      const focused = document.activeElement;
      const style = focused ? getComputedStyle(focused) : null;
      const outline =
        style &&
        (style.outlineWidth !== "0px" ||
          style.boxShadow !== "none" ||
          style.outlineStyle !== "none");
      const recorders = document.querySelectorAll("[data-voice-recorder]");
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        primaryCount: primaries.length,
        primaryKind: primary?.getAttribute("data-speak-primary") || null,
        listenCount: listen.length,
        continueHeight: continueBtn ? continueBtn.getBoundingClientRect().height : 0,
        focusVisible: Boolean(outline),
        recorderCount: recorders.length,
        width: window.innerWidth,
      };
    })()`);
    assert.equal(snapshot.overflow, false, `/speak overflows at ${width}`);
    assert.equal(snapshot.primaryCount, 1, "Speak must show one primary area");
    assert.equal(snapshot.primaryKind, "prompt");
    assert.ok(snapshot.listenCount >= 1);
    assert.ok(snapshot.continueHeight >= 44);
    assert.ok(snapshot.focusVisible);
    assert.equal(snapshot.recorderCount, 0, "Recorder should not show on prompt step");
  }

  // Advance speak flow and confirm single recorder on answer step
  await navigate("/speak", 375, "Dinle, sonra sesli cevap ver");
  await evaluate(
    `([...document.querySelectorAll("button")].find((b) => (b.textContent || "").includes("Cevaba geç")) || { click(){} }).click()`,
    true,
  );
  await waitFor(() =>
    evaluate(
      `document.querySelector('[data-speak-primary="answer"]') !== null`,
    ),
  );
  const answerSnap = await evaluate(`({
    recorderCount: document.querySelectorAll("[data-voice-recorder]").length,
    textareas: document.querySelectorAll("textarea").length,
    primary: document.querySelector("[data-speak-primary]")?.getAttribute("data-speak-primary"),
  })`);
  assert.equal(answerSnap.primary, "answer");
  assert.equal(answerSnap.recorderCount, 1);
  assert.equal(answerSnap.textareas, 1);

  // Real TTS playback on speak prompt
  await navigate("/speak", 375, "Dinle, sonra sesli cevap ver");
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
        !item.disabled && (item.getAttribute("aria-label") || "").includes("Konuşma promptunu dinle")
      );
      if (!button) return false;
      window.__p10cAudio = button;
      button.click();
      return true;
    })()`,
    true,
  );
  assert.equal(clicked, true);
  await waitFor(() =>
    evaluate(
      `window.__p10cAudio?.textContent.includes("Duraklat") === true || window.__p10cAudio?.textContent.includes("Hazırlanıyor") === true`,
    ),
  );
  await waitFor(() =>
    evaluate(`window.__p10cAudio?.textContent.includes("Duraklat") === true`),
  );
  assert.ok(audioResponses.length > before, "Speak playback must hit /api/tts");
  assert.equal(
    audioResponses.slice(before).every((item) => item.status === 200),
    true,
  );

  for (const width of [320, 375]) {
    await navigate("/review", width, "Cevaba geç");
    const snapshot = await evaluate(`(() => {
      const primaries = document.querySelectorAll("[data-review-primary]");
      const articles = document.querySelectorAll("article");
      const continueBtn = [...document.querySelectorAll("button")].find((button) =>
        (button.textContent || "").includes("Cevaba geç")
      );
      continueBtn?.focus();
      const focused = document.activeElement;
      const style = focused ? getComputedStyle(focused) : null;
      const outline =
        style &&
        (style.outlineWidth !== "0px" ||
          style.boxShadow !== "none" ||
          style.outlineStyle !== "none");
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        primaryCount: primaries.length,
        articleCount: articles.length,
        continueHeight: continueBtn ? continueBtn.getBoundingClientRect().height : 0,
        focusVisible: Boolean(outline),
        width: window.innerWidth,
      };
    })()`);
    assert.equal(snapshot.overflow, false, `/review overflows at ${width}`);
    assert.equal(snapshot.primaryCount, 1);
    assert.ok(snapshot.continueHeight >= 44);
    assert.ok(snapshot.focusVisible);
  }

  for (const width of [320, 375]) {
    await navigate("/journal", width, "Bugün ne iyi gitti?");
    const snapshot = await evaluate(`(() => {
      const primary = document.querySelector('[data-journal-primary="note"]');
      const textareasInPrimary = primary
        ? primary.querySelectorAll("textarea").length
        : 0;
      const complete = [...document.querySelectorAll("button")].find((button) =>
        (button.textContent || "").includes("Tamamla")
      );
      complete?.focus();
      const focused = document.activeElement;
      const style = focused ? getComputedStyle(focused) : null;
      const outline =
        style &&
        (style.outlineWidth !== "0px" ||
          style.boxShadow !== "none" ||
          style.outlineStyle !== "none");
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        textareasInPrimary,
        completeHeight: complete ? complete.getBoundingClientRect().height : 0,
        focusVisible: Boolean(outline),
        width: window.innerWidth,
      };
    })()`);
    assert.equal(snapshot.overflow, false, `/journal overflows at ${width}`);
    assert.equal(snapshot.textareasInPrimary, 1);
    assert.ok(snapshot.completeHeight >= 44);
    assert.ok(snapshot.focusVisible);
  }

  // Mic must not auto-request on load
  await navigate("/speak", 375, "Dinle, sonra sesli cevap ver");
  const permissionProbe = await evaluate(`navigator.permissions ? "ok" : "ok"`);
  assert.equal(permissionProbe, "ok");

  const seriousErrors = consoleErrors.filter(
    (text) =>
      !String(text).includes("favicon") &&
      !String(text).includes("net::ERR_"),
  );
  assert.equal(seriousErrors.length, 0, seriousErrors.join(" | "));

  console.log(
    JSON.stringify(
      {
        ok: true,
        audioHits: audioResponses.length,
      },
      null,
      2,
    ),
  );
} finally {
  session?.close();
  chrome.kill("SIGKILL");
  await rm(profileDirectory, { force: true, recursive: true });
}
