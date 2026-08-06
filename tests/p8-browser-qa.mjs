import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { appendFileSync, writeFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.P8_BASE_URL ?? "http://127.0.0.1:3018";
const chromePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const debuggingPort = 9338;
const profileDirectory = await mkdtemp(join(tmpdir(), "argos-p8-chrome-"));
const nextCliPath = join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);
const progressPath = join(tmpdir(), "argos-p8-browser-progress.log");
writeFileSync(progressPath, "", "utf8");

function checkpoint(message) {
  console.log(message);
  appendFileSync(progressPath, `${message}\n`, "utf8");
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitFor(check, timeoutMs = 20_000, intervalMs = 50) {
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
    this.socket.addEventListener("close", () => {
      for (const pending of this.pending.values()) {
        pending.reject(new Error("Chrome DevTools connection closed."));
      }
      this.pending.clear();
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
if (!process.env.P8_BASE_URL) {
  server = spawn(
    process.execPath,
    [nextCliPath, "start", "--hostname", "127.0.0.1", "--port", "3018"],
    { stdio: "ignore", windowsHide: true },
  );
  await waitFor(async () => {
    try {
      const response = await fetch(baseUrl);
      return response.ok;
    } catch {
      return false;
    }
  }, 30_000);
  checkpoint("[p8-browser] production server ready");
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    `--remote-debugging-port=${debuggingPort}`,
    `--user-data-dir=${profileDirectory}`,
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"], windowsHide: true },
);
chrome.stderr.on("data", (data) => {
  appendFileSync(progressPath, `[chrome] ${String(data)}`, "utf8");
});
chrome.on("exit", (code, signal) => {
  checkpoint(`[p8-browser] Chrome exited (code=${code}, signal=${signal})`);
});

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
  checkpoint(`[p8-browser] ${debuggerVersion.Browser} ready`);

  const targetResponse = await fetch(
    `http://127.0.0.1:${debuggingPort}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT", signal: AbortSignal.timeout(5_000) },
  );
  const target = await targetResponse.json();
  checkpoint("[p8-browser] CDP target created");
  session = new CdpSession(target.webSocketDebuggerUrl);
  await session.connect();
  checkpoint("[p8-browser] CDP session connected");

  const consoleErrors = [];
  session.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    consoleErrors.push(exceptionDetails.text || "Runtime exception");
  });
  session.on("Log.entryAdded", ({ entry }) => {
    if (entry.level === "error") consoleErrors.push(entry.text);
  });

  await Promise.all([
    session.send("Page.enable"),
    session.send("Runtime.enable"),
    session.send("Log.enable"),
  ]);

  async function evaluate(expression, userGesture = false) {
    const result = await session.send("Runtime.evaluate", {
      awaitPromise: true,
      expression,
      returnByValue: true,
      userGesture,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }

  async function navigate(pathname, width = 375) {
    await session.send("Emulation.setDeviceMetricsOverride", {
      deviceScaleFactor: 1,
      height: 812,
      mobile: true,
      screenHeight: 812,
      screenWidth: width,
      width,
    });
    await session.send("Page.navigate", { url: `${baseUrl}${pathname}` });
    await waitFor(() =>
      evaluate(
        `document.readyState === "complete" && document.body.innerText.trim().length > 0`,
      ),
    );
    await waitFor(() =>
      evaluate(
        `!document.querySelector('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay')`,
      ),
    );
    await delay(250);
  }

  async function installInstrumentation() {
    await evaluate(`(() => {
      window.__p8 = { calls: 0, streams: [], created: [], revoked: [] };
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async (...args) => {
        window.__p8.calls += 1;
        const stream = await originalGetUserMedia(...args);
        window.__p8.streams.push(stream);
        return stream;
      };
      const originalCreate = URL.createObjectURL.bind(URL);
      const originalRevoke = URL.revokeObjectURL.bind(URL);
      URL.createObjectURL = (value) => {
        const url = originalCreate(value);
        window.__p8.created.push({ size: value.size, type: value.type, url });
        return url;
      };
      URL.revokeObjectURL = (url) => {
        window.__p8.revoked.push(url);
        return originalRevoke(url);
      };
    })()`);
  }

  async function clickRecorderButton(label, buttonText) {
    const clicked = await evaluate(`(() => {
      const recorder = document.querySelector('[data-voice-recorder=${JSON.stringify(label)}]');
      const button = [...(recorder?.querySelectorAll("button") || [])].find((item) =>
        item.textContent.includes(${JSON.stringify(buttonText)})
      );
      if (!button) return false;
      button.click();
      return true;
    })()`, true);
    assert.equal(clicked, true, `Could not click ${buttonText} for ${label}`);
  }

  async function recorderText(label) {
    return evaluate(
      `document.querySelector('[data-voice-recorder=${JSON.stringify(label)}]')?.innerText || ""`,
    );
  }

  await navigate("/speak");
  await installInstrumentation();
  checkpoint("[p8-browser] speak loaded without permission request");
  assert.equal(await evaluate(`window.__p8.calls`), 0, "Permission was requested on page load.");

  const speakMetrics = await evaluate(`(() => {
    const recorders = [...document.querySelectorAll("[data-voice-recorder]")];
    const buttons = recorders.flatMap((item) => [...item.querySelectorAll("button")]);
    return {
      count: recorders.length,
      minButtonHeight: Math.min(...buttons.map((button) => button.getBoundingClientRect().height)),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  })()`);
  assert.equal(speakMetrics.count, 2);
  assert.ok(speakMetrics.minButtonHeight >= 44);
  assert.equal(speakMetrics.overflow, false);

  await clickRecorderButton("First try ses kaydı", "Kaydı başlat");
  await waitFor(async () => (await recorderText("First try ses kaydı")).includes("Kayıt sürüyor"));
  assert.equal(await evaluate(`window.__p8.calls`), 1);
  await delay(750);
  await clickRecorderButton("First try ses kaydı", "Kaydı durdur");
  await waitFor(async () => (await recorderText("First try ses kaydı")).includes("Kayıt hazır"));
  checkpoint("[p8-browser] first recording stopped");

  const stoppedRecording = await evaluate(`({
    created: window.__p8.created,
    tracks: window.__p8.streams[0].getTracks().map((track) => track.readyState),
  })`);
  assert.equal(stoppedRecording.created.length, 1);
  assert.ok(stoppedRecording.created[0].size > 0);
  assert.match(stoppedRecording.created[0].type, /^audio\//);
  assert.deepEqual(stoppedRecording.tracks, ["ended"]);

  await clickRecorderButton("First try ses kaydı", "Kaydı dinle");
  await waitFor(async () => (await recorderText("First try ses kaydı")).includes("Dinlemeyi duraklat"));
  await clickRecorderButton("First try ses kaydı", "Dinlemeyi duraklat");
  checkpoint("[p8-browser] playback verified");

  await clickRecorderButton("First try ses kaydı", "Yeniden kaydet");
  await waitFor(async () => (await recorderText("First try ses kaydı")).includes("Kayıt sürüyor"));
  assert.equal(await evaluate(`window.__p8.revoked.length`), 1);
  await delay(500);
  await clickRecorderButton("First try ses kaydı", "Kaydı durdur");
  await waitFor(async () => (await recorderText("First try ses kaydı")).includes("Kayıt hazır"));
  await clickRecorderButton("First try ses kaydı", "Kaydı sil");
  await waitFor(async () => (await recorderText("First try ses kaydı")).includes("En fazla 90 saniye"));
  assert.equal(await evaluate(`window.__p8.revoked.length`), 2);
  checkpoint("[p8-browser] re-record and delete verified");

  await clickRecorderButton("First try ses kaydı", "Kaydı başlat");
  await waitFor(async () => (await recorderText("First try ses kaydı")).includes("Kayıt sürüyor"));
  await delay(500);
  await clickRecorderButton("First try ses kaydı", "Kaydı durdur");
  await waitFor(async () => (await recorderText("First try ses kaydı")).includes("Kayıt hazır"));
  await session.send("Page.reload");
  await waitFor(() =>
    evaluate(
      `document.readyState === "complete" && document.querySelector('[data-voice-recorder="First try ses kaydı"]')?.innerText.includes("En fazla 90 saniye")`,
    ),
  );
  assert.equal(
    await evaluate(
      `document.querySelector('[data-voice-recorder="First try ses kaydı"] audio') === null`,
    ),
    true,
    "A recording must not survive refresh.",
  );
  checkpoint("[p8-browser] refresh clears session recording");

  await installInstrumentation();

  await clickRecorderButton("Second try ses kaydı", "Kaydı başlat");
  await waitFor(async () => (await recorderText("Second try ses kaydı")).includes("Kayıt sürüyor"));
  const navigated = await evaluate(`(() => {
    const link = document.querySelector('a[href="/practice"]');
    if (!link) return false;
    link.click();
    return true;
  })()`, true);
  assert.equal(navigated, true);
  await waitFor(() => evaluate(`location.pathname === "/practice"`));
  assert.deepEqual(
    await evaluate(`window.__p8.streams.at(-1).getTracks().map((track) => track.readyState)`),
    ["ended"],
    "Unmount must stop every microphone track.",
  );
  checkpoint("[p8-browser] unmount cleanup verified");

  await navigate("/device-lab/8k/8k-intro", 320);
  await installInstrumentation();
  const deviceMetrics = await evaluate(`(() => {
    const recorders = [...document.querySelectorAll("[data-voice-recorder]")];
    const buttons = recorders.flatMap((item) => [...item.querySelectorAll("button")]);
    return {
      count: recorders.length,
      labels: recorders.map((item) => item.getAttribute("data-voice-recorder")),
      minButtonHeight: Math.min(...buttons.map((button) => button.getBoundingClientRect().height)),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      permissionCalls: window.__p8.calls,
    };
  })()`);
  assert.deepEqual(deviceMetrics.labels, ["Okuma denemesi", "Say it ses kaydı"]);
  assert.equal(deviceMetrics.count, 2);
  assert.ok(deviceMetrics.minButtonHeight >= 44);
  assert.equal(deviceMetrics.overflow, false);
  assert.equal(deviceMetrics.permissionCalls, 0);
  checkpoint("[p8-browser] device-lab 320px matrix verified");

  let focusedRecorderControl = null;
  for (let index = 0; index < 40 && !focusedRecorderControl; index += 1) {
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
    focusedRecorderControl = await evaluate(`(() => {
      const element = document.activeElement;
      if (!element?.closest?.("[data-voice-recorder]")) return null;
      const style = getComputedStyle(element);
      return {
        boxShadow: style.boxShadow,
        focusVisible: element.matches(":focus-visible"),
        outlineColor: style.outlineColor,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    })()`);
  }
  assert.ok(focusedRecorderControl);
  assert.equal(focusedRecorderControl.focusVisible, true);
  assert.equal(focusedRecorderControl.outlineColor, "rgb(143, 79, 56)");
  assert.notEqual(focusedRecorderControl.outlineStyle, "none");
  assert.ok(Number.parseFloat(focusedRecorderControl.outlineWidth) >= 3);
  checkpoint("[p8-browser] keyboard focus verified");

  await navigate("/speak");
  await evaluate(`navigator.mediaDevices.getUserMedia = () => new Promise(() => {})`);
  await clickRecorderButton("First try ses kaydı", "Kaydı başlat");
  await waitFor(
    async () => (await recorderText("First try ses kaydı")).includes("zaman aşımına uğradı"),
    18_000,
  );
  assert.ok((await recorderText("First try ses kaydı")).includes("Kaydı başlat"));
  checkpoint("[p8-browser] permission timeout verified");

  await session.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `Object.defineProperty(window, "MediaRecorder", { configurable: true, value: undefined });`,
  });
  await navigate("/device-lab/8k/8k-intro");
  await waitFor(() =>
    evaluate(
      `[...document.querySelectorAll("[data-voice-recorder]")].every((item) => item.innerText.includes("desteklemiyor"))`,
    ),
  );
  assert.equal(
    await evaluate(`document.body.innerText.includes("Kısa konuşma görevi")`),
    true,
    "Unsupported recording must not block the text task.",
  );
  checkpoint("[p8-browser] unsupported fallback verified");

  assert.equal(consoleErrors.length, 0, consoleErrors.join("\n"));
  console.log(
    JSON.stringify(
      {
        browser: debuggerVersion.Browser,
        deviceMetrics,
        focus: focusedRecorderControl,
        permission: "requested only after click; pending timeout verified",
        recordingMime: stoppedRecording.created[0].type,
        recording: "play/re-record/delete verified",
        retention: "refresh cleared the session recording",
        cleanup: "stop/unmount tracks ended; object URLs revoked",
        unsupported: "text task remained available",
      },
      null,
      2,
    ),
  );
} finally {
  session?.close();
  chrome.kill();
  await Promise.race([once(chrome, "exit"), delay(3_000)]);
  if (server) {
    server.kill();
    await Promise.race([once(server, "exit"), delay(3_000)]);
  }
  await rm(profileDirectory, {
    force: true,
    maxRetries: 5,
    recursive: true,
    retryDelay: 200,
  });
}
