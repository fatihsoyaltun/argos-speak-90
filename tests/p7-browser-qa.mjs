import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.P7_BASE_URL ?? "http://127.0.0.1:3017";
const chromePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const debuggingPort = 9337;
const profileDirectory = await mkdtemp(join(tmpdir(), "argos-p7-chrome-"));
const screenshotPath = join(tmpdir(), "argos-p7-device-lab.png");

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitFor(check, timeoutMs = 20_000, intervalMs = 50) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const value = await check();

    if (value) {
      return value;
    }

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

        if (!pending) {
          return;
        }

        this.pending.delete(message.id);

        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result);
        }

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
  { stdio: "ignore", windowsHide: true },
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
    if (entry.level === "error") {
      consoleErrors.push(entry.text);
    }
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

  async function openDetails(text) {
    const opened = await evaluate(
      `(() => {
        const summary = [...document.querySelectorAll("summary")].find((item) =>
          item.textContent.includes(${JSON.stringify(text)})
        );
        if (!summary) return false;
        summary.closest("details").open = true;
        return true;
      })()`,
    );
    assert.equal(opened, true, `Could not open details containing ${text}`);
  }

  async function playByAriaLabel(labelFragment) {
    const responseCountBefore = audioResponses.length;
    await waitFor(() =>
      evaluate(
        `[...document.querySelectorAll("button")].some((item) =>
          !item.disabled && (item.getAttribute("aria-label") || "").includes(${JSON.stringify(labelFragment)})
        )`,
      ),
    );
    const clicked = await evaluate(
      `(() => {
        const button = [...document.querySelectorAll("button")].find((item) =>
          !item.disabled && (item.getAttribute("aria-label") || "").includes(${JSON.stringify(labelFragment)})
        );
        if (!button) return false;
        window.__p7AudioButton = button;
        button.click();
        return true;
      })()`,
      true,
    );
    assert.equal(clicked, true, `Could not click audio action ${labelFragment}`);

    await waitFor(() =>
      evaluate(
        `window.__p7AudioButton?.textContent.includes("Duraklat") === true`,
      ),
    );
    const playingCount = await evaluate(
      `[...document.querySelectorAll("button")].filter((button) => button.textContent.includes("Duraklat")).length`,
    );
    assert.equal(playingCount, 1, "Exactly one learning item should be playing.");

    return audioResponses.length - responseCountBefore;
  }

  async function pauseAndResumeCurrentAudio() {
    await evaluate(`window.__p7AudioButton.click()`, true);
    await waitFor(() =>
      evaluate(
        `window.__p7AudioButton?.textContent.includes("Devam et") === true`,
      ),
    );
    await evaluate(`window.__p7AudioButton.click()`, true);
    await waitFor(() =>
      evaluate(
        `window.__p7AudioButton?.textContent.includes("Duraklat") === true`,
      ),
    );
  }

  async function measureRoute(pathname, width) {
    await navigate(pathname, width);
    return evaluate(`(() => {
      const audioButtons = [...document.querySelectorAll("button")].filter((button) =>
        /dinle|sesi|sesini/i.test(button.getAttribute("aria-label") || "")
      );
      return {
        audioActions: audioButtons.length,
        hasContent: document.body.innerText.trim().length > 0,
        hasOverlay: Boolean(document.querySelector('[data-nextjs-dialog]')),
        maxAudioTargetHeight: Math.max(0, ...audioButtons.map((button) => button.getBoundingClientRect().height)),
        minAudioTargetHeight: Math.min(...audioButtons.map((button) => button.getBoundingClientRect().height)),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        width: window.innerWidth,
      };
    })()`);
  }

  const routeMatrix = [];

  await navigate("/listen");
  await playByAriaLabel("Metni dinle");
  await openDetails("Sesli tekrar et");
  await playByAriaLabel("Hedef cümle 1 sesini dinle");
  await pauseAndResumeCurrentAudio();
  routeMatrix.push({ route: "/listen", result: "transcript + key line" });

  await navigate("/words");
  await playByAriaLabel("Kelimeyi dinle");
  await openDetails("Örnek cümleyi aç");
  await playByAriaLabel("Örnek cümleyi dinle");
  routeMatrix.push({ route: "/words", result: "word + example" });

  await navigate("/speak");
  await playByAriaLabel("Konuşma promptunu dinle");
  await openDetails("Konuşmanda kullanabileceğin çizgiler");
  await playByAriaLabel("Hedef cümle 1 sesini dinle");
  routeMatrix.push({ route: "/speak", result: "prompt + target line" });

  await navigate("/review");
  await playByAriaLabel("Review görevi 1 promptunu dinle");
  const reviewPrepared = await evaluate(`(() => {
    const textarea = document.querySelector("textarea");
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
    setter.call(textarea, "not the expected answer");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    const button = [...document.querySelectorAll("button")].find((item) => item.textContent.includes("Kontrol et"));
    button.click();
    return true;
  })()`, true);
  assert.equal(reviewPrepared, true);
  await waitFor(() =>
    evaluate(`document.body.innerText.includes("Tekrar bak:")`),
  );
  await playByAriaLabel("Review görevi 1 örnek cevabını dinle");
  routeMatrix.push({ route: "/review", result: "prompt + example answer" });

  await navigate("/device-lab/8k/8k-intro");
  const firstDeviceRequestCount = await playByAriaLabel("Cihaz tanıtımını dinle");
  assert.equal(firstDeviceRequestCount, 1);
  await playByAriaLabel("Hap bilgi 1 sesini dinle");
  await playByAriaLabel("kelimesini dinle");
  await playByAriaLabel("Cihaz dinleme metnini dinle");
  await playByAriaLabel("Say it konuşma promptunu dinle");
  const requestCountBeforeCacheReplay = audioResponses.length;
  await playByAriaLabel("Cihaz tanıtımını dinle");
  assert.equal(
    audioResponses.length,
    requestCountBeforeCacheReplay,
    "Replaying a cached learning item should not call /api/tts again.",
  );
  routeMatrix.push({
    route: "/device-lab/8k/8k-intro",
    result: "intro + fact + word + listening + say-it + cache replay",
  });

  const screenshot = await session.send("Page.captureScreenshot", {
    captureBeyondViewport: false,
    format: "png",
  });
  await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

  await navigate("/journal");
  const journalAudioActions = await evaluate(
    `[...document.querySelectorAll("button")].filter((button) => /dinle|sesi|sesini/i.test(button.getAttribute("aria-label") || "")).length`,
  );
  assert.equal(journalAudioActions, 0);
  routeMatrix.push({ route: "/journal", result: "Turkish prompts excluded" });

  const responsiveRoutes = ["/listen", "/words", "/speak", "/review", "/journal", "/device-lab/8k/8k-intro"];
  const responsiveMatrix = [];

  for (const width of [320, 375]) {
    for (const route of responsiveRoutes) {
      const measurement = await measureRoute(route, width);
      assert.equal(measurement.hasContent, true);
      assert.equal(measurement.hasOverlay, false);
      assert.equal(measurement.overflow, false, `${route} overflows at ${width}px`);

      if (measurement.audioActions > 0) {
        assert.ok(
          measurement.minAudioTargetHeight >= 44,
          `${route} has an audio target below 44px at ${width}px`,
        );
      }

      responsiveMatrix.push({ route, ...measurement });
    }
  }

  await navigate("/speak", 320);
  let focusedAudioControl = null;

  for (let index = 0; index < 30 && !focusedAudioControl; index += 1) {
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
    focusedAudioControl = await evaluate(`(() => {
      const element = document.activeElement;
      const label = element?.getAttribute?.("aria-label") || "";
      if (!/dinle|sesi|sesini/i.test(label)) return null;
      const style = getComputedStyle(element);
      return {
        focusVisible: element.matches(":focus-visible"),
        label,
        outlineColor: style.outlineColor,
        outline: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        shadow: style.boxShadow,
      };
    })()`);
  }

  assert.ok(focusedAudioControl, "Keyboard Tab did not reach an audio control.");
  assert.equal(focusedAudioControl.focusVisible, true);
  assert.ok(
    focusedAudioControl.outline !== "none" &&
      Number.parseFloat(focusedAudioControl.outlineWidth) >= 3,
    "Focused audio control has no visible focus treatment.",
  );

  assert.equal(consoleErrors.length, 0, consoleErrors.join("\n"));
  assert.ok(audioResponses.length >= 10);
  assert.ok(audioResponses.every((response) => response.status === 200));
  assert.ok(
    audioResponses.every((response) =>
      ["audio/mpeg", "application/json"].includes(response.mimeType),
    ),
  );

  console.log(
    JSON.stringify(
      {
        audioResponses: audioResponses.length,
        browser: debuggerVersion.Browser,
        focus: focusedAudioControl,
        responsiveChecks: responsiveMatrix.length,
        routeMatrix,
        screenshotPath,
      },
      null,
      2,
    ),
  );
} finally {
  session?.close();
  chrome.kill();
  await Promise.race([once(chrome, "exit"), delay(3_000)]);
  await rm(profileDirectory, {
    force: true,
    maxRetries: 5,
    recursive: true,
    retryDelay: 200,
  });
}
