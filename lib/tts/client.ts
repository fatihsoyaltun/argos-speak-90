import type {
  TtsAudioFormat,
  TtsClientResult,
  TtsServiceStatus,
  TtsWordTiming,
} from "./types";

type TtsApiErrorResponse = {
  code?: string;
  message?: string;
  reason?:
    | "missing_api_key"
    | "missing_voice_id"
    | "server_route_error"
    | "loading_timeout"
    | "request_failed";
};

type TtsApiSuccessResponse = {
  audioBase64?: unknown;
  contentType?: unknown;
  alignment?: unknown;
};

const STATUS_TIMEOUT_MS = 6_000;

function base64ToBlob(base64: string, contentType: TtsAudioFormat) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: contentType });
}

function normalizeWordTimings(alignment: unknown): TtsWordTiming[] | undefined {
  if (!Array.isArray(alignment)) {
    return undefined;
  }

  const timings = alignment
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const timing = item as Partial<TtsWordTiming>;
      const text = typeof timing.text === "string" ? timing.text : "";
      const start = Number(timing.start);
      const end = Number(timing.end);

      if (!text || !Number.isFinite(start) || !Number.isFinite(end)) {
        return null;
      }

      return {
        index,
        text,
        start,
        end,
      };
    })
    .filter((item): item is TtsWordTiming => Boolean(item));

  return timings.length > 0 ? timings : undefined;
}

export async function requestTtsAudio(
  text: string,
  signal?: AbortSignal,
): Promise<TtsClientResult> {
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal,
    });

    if (!response.ok) {
      const error = (await response
        .json()
        .catch(() => ({}))) as TtsApiErrorResponse;

      return {
        ok: false,
        code: error.code === "not_configured" ? "not_configured" : "request_failed",
        reason: error.reason,
        message:
          error.message ||
          "Ses oluşturulamadı. Lütfen biraz sonra tekrar dene.",
      };
    }

    const data = (await response.json()) as TtsApiSuccessResponse;

    if (
      typeof data.audioBase64 !== "string" ||
      data.contentType !== "audio/mpeg"
    ) {
      return {
        ok: false,
        code: "request_failed",
        message: "Ses yanıtı okunamadı. Lütfen tekrar dene.",
      };
    }

    return {
      ok: true,
      audio: base64ToBlob(data.audioBase64, data.contentType),
      alignment: normalizeWordTimings(data.alignment),
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        ok: false,
        code: "aborted",
        message: "Ses isteği durduruldu.",
      };
    }

    return {
      ok: false,
      code: "request_failed",
      message: "Ses oluşturulamadı. Lütfen bağlantını kontrol edip tekrar dene.",
    };
  }
}

export async function getTtsServiceStatus(): Promise<TtsServiceStatus> {
  const abortController = new AbortController();
  const timeout = window.setTimeout(() => {
    abortController.abort();
  }, STATUS_TIMEOUT_MS);

  try {
    const response = await fetch(`/api/tts?ts=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
      signal: abortController.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return { configured: false, reason: "server_route_error" };
    }

    return (await response.json()) as TtsServiceStatus;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { configured: false, reason: "loading_timeout" };
    }

    return { configured: false, reason: "request_failed" };
  } finally {
    window.clearTimeout(timeout);
  }
}
