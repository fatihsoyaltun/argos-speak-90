import type {
  TtsAudioFormat,
  TtsAudioMetadata,
  TtsClientResult,
  TtsFailureCode,
  TtsServiceStatus,
  TtsStatusReason,
  TtsWordTiming,
} from "./types";

type TtsApiErrorResponse = {
  code?: TtsFailureCode | string;
  message?: string;
  reason?: TtsStatusReason;
};

type TtsApiSuccessResponse = {
  audioBase64?: unknown;
  contentType?: unknown;
  alignment?: unknown;
  metadata?: unknown;
};

const STATUS_TIMEOUT_MS = 6_000;
const AUDIO_REQUEST_TIMEOUT_MS = 20_000;
const knownFailureCodes = new Set<string>([
  "bad_request",
  "missing_api_key",
  "missing_voice_id",
  "not_configured",
  "rate_limited",
  "request_failed",
  "upstream_account_restricted",
  "upstream_failed",
  "upstream_model_error",
  "upstream_quota_or_rate_limit",
  "upstream_timeout",
  "upstream_unauthorized",
  "upstream_voice_not_found",
]);

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

      return { index, text, start, end };
    })
    .filter((item): item is TtsWordTiming => Boolean(item));

  return timings.length > 0 ? timings : undefined;
}

function normalizeMetadata(
  metadata: unknown,
  fallback: Pick<TtsAudioMetadata, "audioBytes" | "transport" | "transportBytes">,
): TtsAudioMetadata {
  const item =
    metadata && typeof metadata === "object"
      ? (metadata as Partial<TtsAudioMetadata>)
      : {};

  return {
    audioBytes: Number.isFinite(Number(item.audioBytes))
      ? Number(item.audioBytes)
      : fallback.audioBytes,
    hasAlignment: Boolean(item.hasAlignment),
    modelId: typeof item.modelId === "string" ? item.modelId : "",
    transport:
      item.transport === "base64-json" || item.transport === "binary"
        ? item.transport
        : fallback.transport,
    transportBytes: Number.isFinite(Number(item.transportBytes))
      ? Number(item.transportBytes)
      : fallback.transportBytes,
    voiceId: typeof item.voiceId === "string" ? item.voiceId : "",
  };
}

function normalizeErrorCode(code: unknown): TtsFailureCode {
  if (code === "missing_api_key" || code === "missing_voice_id") {
    return "not_configured";
  }

  if (typeof code === "string" && knownFailureCodes.has(code)) {
    return code as TtsFailureCode;
  }

  return "request_failed";
}

async function readApiError(response: Response): Promise<TtsClientResult> {
  const error = (await response
    .json()
    .catch(() => ({}))) as TtsApiErrorResponse;

  return {
    ok: false,
    code: normalizeErrorCode(error.code),
    reason: error.reason,
    message:
      error.message || "Ses oluşturulamadı. Lütfen biraz sonra tekrar dene.",
  };
}

export async function requestTtsAudio(
  text: string,
  {
    includeAlignment = false,
    signal,
  }: { includeAlignment?: boolean; signal?: AbortSignal } = {},
): Promise<TtsClientResult> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return {
      ok: false,
      code: "offline",
      message: "Çevrimdışısın. Bağlantı kurulduğunda tekrar dene.",
    };
  }

  const controller = new AbortController();
  let timedOut = false;
  const handleAbort = () => controller.abort();
  signal?.addEventListener("abort", handleAbort, { once: true });
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, AUDIO_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        Accept: includeAlignment ? "application/json" : "audio/mpeg",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ includeAlignment, text }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return readApiError(response);
    }

    const responseContentType = response.headers.get("content-type") ?? "";

    if (responseContentType.startsWith("audio/mpeg")) {
      const audio = await response.blob();

      if (audio.size === 0) {
        return {
          ok: false,
          code: "request_failed",
          message: "Ses yanıtı boş geldi. Lütfen tekrar dene.",
        };
      }

      return {
        ok: true,
        audio,
        contentType: "audio/mpeg",
        metadata: normalizeMetadata(undefined, {
          audioBytes: audio.size,
          transport: "binary",
          transportBytes: audio.size,
        }),
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

    const audio = base64ToBlob(data.audioBase64, data.contentType);

    if (audio.size === 0) {
      return {
        ok: false,
        code: "request_failed",
        message: "Ses yanıtı boş geldi. Lütfen tekrar dene.",
      };
    }

    return {
      ok: true,
      audio,
      contentType: data.contentType,
      alignment: normalizeWordTimings(data.alignment),
      metadata: normalizeMetadata(data.metadata, {
        audioBytes: audio.size,
        transport: "base64-json",
        transportBytes: data.audioBase64.length,
      }),
    };
  } catch {
    if (controller.signal.aborted) {
      if (timedOut) {
        return {
          ok: false,
          code: "timeout",
          message: "Ses isteği zaman aşımına uğradı. Tekrar deneyebilirsin.",
        };
      }

      return {
        ok: false,
        code: "aborted",
        message: "Ses isteği durduruldu.",
      };
    }

    return {
      ok: false,
      code: "request_failed",
      message: "Ses oluşturulamadı. Bağlantını kontrol edip tekrar dene.",
    };
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener("abort", handleAbort);
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
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return { configured: false, reason: "server_route_error" };
    }

    const status = (await response.json()) as TtsServiceStatus;

    return {
      configured: Boolean(status.configured),
      modelId: typeof status.modelId === "string" ? status.modelId : undefined,
      reason: status.reason,
      voiceId: typeof status.voiceId === "string" ? status.voiceId : undefined,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { configured: false, reason: "loading_timeout" };
    }

    return { configured: false, reason: "request_failed" };
  } finally {
    window.clearTimeout(timeout);
  }
}
