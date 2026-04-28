import { requestTtsAudio } from "./client";
import type { TtsClientResult, TtsWordTiming } from "./types";

export type CachedTtsAudio = {
  alignment?: TtsWordTiming[];
  audio: Blob;
  cacheKey: string;
  modelId: string;
  objectUrl: string;
  voiceId: string;
};

type AudioCacheEntry = CachedTtsAudio & {
  lastUsed: number;
};

const audioCache = new Map<string, AudioCacheEntry>();
const inFlightRequests = new Map<string, Promise<TtsClientResult>>();

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
  modelId = "unknown-model",
  text,
  voiceId = "unknown-voice",
}: {
  day: number;
  modelId?: string;
  text: string;
  voiceId?: string;
}) {
  const normalizedText = normalizeTranscript(text).toLowerCase();

  return [
    `day:${day}`,
    `voice:${voiceId || "unknown-voice"}`,
    `model:${modelId || "unknown-model"}`,
    `text:${hashText(normalizedText)}`,
  ].join("|");
}

function cacheAudio(cacheKey: string, result: TtsClientResult) {
  if (!result.ok) {
    return result;
  }

  const existing = audioCache.get(cacheKey);

  if (existing) {
    existing.lastUsed = Date.now();
    return existing;
  }

  const entry: AudioCacheEntry = {
    alignment: result.alignment,
    audio: result.audio,
    cacheKey,
    lastUsed: Date.now(),
    modelId: result.metadata?.modelId || "unknown-model",
    objectUrl: window.URL.createObjectURL(result.audio),
    voiceId: result.metadata?.voiceId || "unknown-voice",
  };

  audioCache.set(cacheKey, entry);
  return entry;
}

export function getCachedTtsAudio(cacheKey: string) {
  const entry = audioCache.get(cacheKey);

  if (entry) {
    entry.lastUsed = Date.now();
  }

  return entry;
}

export async function getOrRequestTtsAudio({
  cacheKey,
  signal,
  text,
}: {
  cacheKey: string;
  signal?: AbortSignal;
  text: string;
}): Promise<TtsClientResult | CachedTtsAudio> {
  const cached = getCachedTtsAudio(cacheKey);

  if (cached) {
    return cached;
  }

  const inFlight = inFlightRequests.get(cacheKey);

  if (inFlight) {
    return cacheAudio(cacheKey, await inFlight);
  }

  const request = requestTtsAudio(text, signal);
  inFlightRequests.set(cacheKey, request);

  try {
    const result = await request;
    return cacheAudio(cacheKey, result);
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}

export function clearTtsAudioCache() {
  audioCache.forEach((entry) => {
    window.URL.revokeObjectURL(entry.objectUrl);
  });
  audioCache.clear();
  inFlightRequests.clear();
}

export function revokeCachedTtsAudio(cacheKey: string) {
  const entry = audioCache.get(cacheKey);

  if (!entry) {
    return;
  }

  window.URL.revokeObjectURL(entry.objectUrl);
  audioCache.delete(cacheKey);
}
