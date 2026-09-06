import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.P9_BASE_URL ?? "http://127.0.0.1:3019";
const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const debuggingPort = Number(process.env.P9_CHROME_PORT ?? 9339);
const profileDirectory = await mkdtemp(join(tmpdir(), "argos-p9-chrome-"));

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitFor(check, timeoutMs = 60_000, intervalMs = 50) {
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

  async function navigate(width) {
    await session.send("Emulation.setDeviceMetricsOverride", {
      deviceScaleFactor: 1,
      height: 812,
      mobile: true,
      screenHeight: 812,
      screenWidth: width,
      width,
    });
    await session.send("Page.navigate", { url: `${baseUrl}/words` });
    await waitFor(() =>
      evaluate(
        `document.readyState === "complete" && document.body.innerText.includes("Bugün kullanacağın kelimeler")`,
      ),
    );
    await waitFor(() =>
      evaluate(`!document.querySelector('[data-nextjs-dialog]')`),
    );
    await delay(250);
  }

  async function playByAriaLabel(labelFragment, buttonIndex = 0) {
    const responseCountBefore = audioResponses.length;
    await waitFor(() =>
      evaluate(
        `[...document.querySelectorAll("button")].filter((button) =>
          !button.disabled && (button.getAttribute("aria-label") || "").includes(${JSON.stringify(labelFragment)})
        ).length > ${buttonIndex}`,
      ),
    );
    const clicked = await evaluate(
      `(() => {
        const button = [...document.querySelectorAll("button")].filter((item) =>
          !item.disabled && (item.getAttribute("aria-label") || "").includes(${JSON.stringify(labelFragment)})
        )[${buttonIndex}];
        if (!button) return false;
        window.__p9AudioButton = button;
        button.click();
        return true;
      })()`,
      true,
    );
    assert.equal(clicked, true);
    await waitFor(() =>
      evaluate(
        `window.__p9AudioButton?.textContent.includes("Duraklat") === true`,
      ),
    );

    return audioResponses.length - responseCountBefore;
  }

  const measurements = [];

  for (const width of [320, 375]) {
    await navigate(width);
    const initial = await evaluate(`(() => {
      const cards = [...document.querySelectorAll("article")].filter((item) =>
        /Word \\d+/.test(item.textContent || "")
      );
      const visibleCards = cards.filter((item) => {
        const style = getComputedStyle(item);
        const rect = item.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      });
      const revealButton = [...document.querySelectorAll("button")].find((item) =>
        item.textContent.includes("Sonraki 5'i göster")
      );
      return {
        audioActions: [...document.querySelectorAll("button")].filter((button) =>
          /Kelimeyi dinle|Örnek cümleyi dinle/.test(button.getAttribute("aria-label") || "")
        ).length,
        hasReveal: Boolean(revealButton),
        maxCardBottom: Math.max(...visibleCards.map((item) => item.getBoundingClientRect().bottom)),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        visibleCards: visibleCards.length,
        width: window.innerWidth,
      };
    })()`);

    assert.equal(initial.overflow, false, `/words overflows at ${width}px`);
    assert.equal(initial.visibleCards, 5, "Only five word cards should be visible before reveal.");
    assert.equal(initial.hasReveal, true);
    assert.ok(initial.maxCardBottom > 812, "The first viewport should not contain ten large cards.");
    measurements.push(initial);
  }

  await navigate(375);
  const ttsStatus = await evaluate(`fetch("/api/tts").then((response) => response.json())`);
  assert.equal(
    ttsStatus.configured,
    true,
    `TTS must be configured for live word/example playback QA: ${ttsStatus.reason ?? "unknown"}`,
  );
  const firstWordRequestCount = await playByAriaLabel("Kelimeyi dinle");
  assert.ok(firstWordRequestCount <= 1);
  await evaluate(
    `[...document.querySelectorAll("summary")].find((item) => item.textContent.includes("Örnek cümleyi aç")).click()`,
    true,
  );
  await playByAriaLabel("Örnek cümleyi dinle");

  const revealedClick = await evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find((item) =>
      item.textContent.includes("Sonraki 5'i göster")
    );
    if (!button) return false;
    button.click();
    return true;
  })()`, true);
  assert.equal(revealedClick, true);
  await waitFor(() =>
    evaluate(`([...document.querySelectorAll("button")].find((item) =>
      (item.textContent || "").includes("Son 5'i gizle") || item.getAttribute("aria-expanded") === "true"
    ) || null) !== null`),
  );
  const revealed = await evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find((item) =>
      (item.textContent || "").includes("Son 5'i gizle") || item.getAttribute("aria-expanded") === "true"
    );
    const cards = [...document.querySelectorAll("article")].filter((item) => {
      const style = getComputedStyle(item);
      const rect = item.getBoundingClientRect();
      return /Word \\d+/.test(item.textContent || "") && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    });
    return {
      ariaExpanded: button ? button.getAttribute("aria-expanded") : null,
      supportCards: cards.filter((item) => (item.textContent || "").includes("Support / review")).length,
      visibleCards: cards.length,
    };
  })()`);
  assert.equal(revealed.ariaExpanded, "true");
  assert.equal(revealed.visibleCards, 10);
  assert.equal(revealed.supportCards, 5);
  await playByAriaLabel("Kelimeyi dinle", 5);

  assert.equal(
    audioResponses.every((response) => response.status === 200),
    true,
    "All /api/tts responses must be successful.",
  );
  assert.equal(
    audioResponses.every((response) => response.mimeType === "audio/mpeg"),
    true,
    "Words should keep the P7 binary MP3 audio path.",
  );
  assert.deepEqual(consoleErrors, []);

  console.log(JSON.stringify({ audioResponses: audioResponses.length, measurements }));
} finally {
  session?.close();
  if (!chrome.killed) {
    chrome.kill();
  }
  await Promise.race([once(chrome, "exit"), delay(2_000)]).catch(() => {});
  await rm(profileDirectory, { force: true, maxRetries: 3, recursive: true });
}
