import { requestTtsAudio } from "./client";
import {
  selectTtsCacheEvictions,
  TTS_AUDIO_CACHE_LIMITS,
} from "./cache-policy";
import type {
  TtsAudioFormat,
  TtsAudioMetadata,
  TtsClientResult,
  TtsWordTiming,
} from "./types";

export type CachedTtsAudio = {
  alignment?: TtsWordTiming[];
  audio: Blob;
  cacheKey: string;
  contentType: TtsAudioFormat;
  metadata?: TtsAudioMetadata;
  objectUrl: string;
};

type AudioCacheEntry = CachedTtsAudio & {
  byteSize: number;
  lastUsed: number;
};

type InFlightTtsRequest = {
  controller: AbortController;
  promise: Promise<TtsClientResult | CachedTtsAudio>;
  subscribers: number;
};

const audioCache = new Map<string, AudioCacheEntry>();
const inFlightRequests = new Map<string, InFlightTtsRequest>();

function normalizeTranscript(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function hashText(text: string) {
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) | 0;
  }

  return Math.abs(hash).toString(36);
}

export function createTtsCacheKey({
  day,
  includeAlignment = false,
  modelId = "unknown-model",
  scope = "transcript",
  text,
  voiceId = "unknown-voice",
}: {
  day: number;
  includeAlignment?: boolean;
  modelId?: string;
  scope?: string;
  text: string;
  voiceId?: string;
}) {
  const normalizedText = normalizeTranscript(text).toLowerCase();

  return [
    `day:${day}`,
    `scope:${scope}`,
    `timing:${includeAlignment ? "words" : "none"}`,
    `voice:${voiceId || "unknown-voice"}`,
    `model:${modelId || "unknown-model"}`,
    `text:${hashText(normalizedText)}`,
  ].join("|");
}

function revokeEntry(entry: AudioCacheEntry) {
  window.URL.revokeObjectURL(entry.objectUrl);
  audioCache.delete(entry.cacheKey);
}

function evictForIncomingAudio(incomingBytes: number, reserveEntry = true) {
  const now = Date.now();
  const evictions = selectTtsCacheEvictions({
    entries: Array.from(audioCache.values()).map((entry) => ({
      byteSize: entry.byteSize,
      cacheKey: entry.cacheKey,
      lastUsed: entry.lastUsed,
    })),
    incomingBytes,
    limits: {
      ...TTS_AUDIO_CACHE_LIMITS,
      maxEntries:
        TTS_AUDIO_CACHE_LIMITS.maxEntries + (reserveEntry ? 0 : 1),
    },
    now,
  });

  evictions.forEach((cacheKey) => {
    const entry = audioCache.get(cacheKey);

    if (entry) {
      revokeEntry(entry);
    }
  });
}

function cacheAudio(cacheKey: string, result: TtsClientResult) {
  if (!result.ok) {
    return result;
  }

  const existing = getCachedTtsAudio(cacheKey);

  if (existing) {
    return existing;
  }

  evictForIncomingAudio(result.audio.size);

  const entry: AudioCacheEntry = {
    alignment: result.alignment,
    audio: result.audio,
    byteSize: result.audio.size,
    cacheKey,
    contentType: result.contentType,
    lastUsed: Date.now(),
    metadata: result.metadata,
    objectUrl: window.URL.createObjectURL(result.audio),
  };

  audioCache.set(cacheKey, entry);
  return entry;
}

export function getCachedTtsAudio(cacheKey: string) {
  evictForIncomingAudio(0, false);
  const entry = audioCache.get(cacheKey);

  if (entry) {
    entry.lastUsed = Date.now();
    audioCache.delete(cacheKey);
    audioCache.set(cacheKey, entry);
  }

  return entry;
}

function waitForRequest(
  request: InFlightTtsRequest,
  signal?: AbortSignal,
): Promise<TtsClientResult | CachedTtsAudio> {
  if (!signal) {
    return request.promise;
  }

  if (signal.aborted) {
    return Promise.resolve({
      ok: false,
      code: "aborted",
      message: "Ses isteği durduruldu.",
    });
  }

  return new Promise((resolve) => {
    const handleAbort = () => {
      resolve({
        ok: false,
        code: "aborted",
        message: "Ses isteği durduruldu.",
      });
    };

    signal.addEventListener("abort", handleAbort, { once: true });
    request.promise.then(resolve).finally(() => {
      signal.removeEventListener("abort", handleAbort);
    });
  });
}

export async function getOrRequestTtsAudio({
  cacheKey,
  includeAlignment = false,
  signal,
  text,
}: {
  cacheKey: string;
  includeAlignment?: boolean;
  signal?: AbortSignal;
  text: string;
}): Promise<TtsClientResult | CachedTtsAudio> {
  const cached = getCachedTtsAudio(cacheKey);

  if (cached) {
    return cached;
  }

  let inFlight = inFlightRequests.get(cacheKey);

  if (!inFlight) {
    const controller = new AbortController();
    const request: InFlightTtsRequest = {
      controller,
      promise: Promise.resolve({
        ok: false,
        code: "request_failed",
        message: "Ses isteği başlatılamadı.",
      }),
      subscribers: 0,
    };

    request.promise = requestTtsAudio(text, {
      includeAlignment,
      signal: controller.signal,
    })
      .then((result) => cacheAudio(cacheKey, result))
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });
    inFlightRequests.set(cacheKey, request);
    inFlight = request;
  }

  inFlight.subscribers += 1;

  try {
    return await waitForRequest(inFlight, signal);
  } finally {
    inFlight.subscribers -= 1;

    if (inFlight.subscribers === 0 && inFlightRequests.has(cacheKey)) {
      inFlight.controller.abort();
    }
  }
}

export function clearTtsAudioCache() {
  audioCache.forEach((entry) => {
    window.URL.revokeObjectURL(entry.objectUrl);
  });
  audioCache.clear();
  inFlightRequests.forEach((request) => request.controller.abort());
  inFlightRequests.clear();
}

export function getTtsAudioCacheStats() {
  evictForIncomingAudio(0, false);
  return {
    bytes: Array.from(audioCache.values()).reduce(
      (total, entry) => total + entry.byteSize,
      0,
    ),
    entries: audioCache.size,
    inFlight: inFlightRequests.size,
    limits: TTS_AUDIO_CACHE_LIMITS,
  };
}

export function revokeCachedTtsAudio(cacheKey: string) {
  const entry = audioCache.get(cacheKey);

  if (entry) {
    revokeEntry(entry);
  }
}
