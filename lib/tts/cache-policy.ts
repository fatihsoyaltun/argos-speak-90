export const TTS_AUDIO_CACHE_LIMITS = {
  maxBytes: 12 * 1024 * 1024,
  maxEntries: 16,
  ttlMs: 10 * 60 * 1_000,
} as const;

export type TtsCachePolicyEntry = {
  byteSize: number;
  cacheKey: string;
  lastUsed: number;
};

export function isTtsCacheEntryExpired(
  entry: Pick<TtsCachePolicyEntry, "lastUsed">,
  now: number,
  ttlMs = TTS_AUDIO_CACHE_LIMITS.ttlMs,
) {
  return now - entry.lastUsed >= ttlMs;
}

export function selectTtsCacheEvictions({
  entries,
  incomingBytes,
  limits = TTS_AUDIO_CACHE_LIMITS,
  now,
}: {
  entries: TtsCachePolicyEntry[];
  incomingBytes: number;
  limits?: { maxBytes: number; maxEntries: number; ttlMs: number };
  now: number;
}) {
  const expired = entries.filter((entry) =>
    isTtsCacheEntryExpired(entry, now, limits.ttlMs),
  );
  const expiredKeys = new Set(expired.map((entry) => entry.cacheKey));
  const remaining = entries
    .filter((entry) => !expiredKeys.has(entry.cacheKey))
    .sort((left, right) => left.lastUsed - right.lastUsed);
  let byteSize = remaining.reduce((total, entry) => total + entry.byteSize, 0);
  let entryCount = remaining.length;
  const evictions = expired.map((entry) => entry.cacheKey);

  while (
    remaining.length > 0 &&
    (entryCount + 1 > limits.maxEntries ||
      byteSize + incomingBytes > limits.maxBytes)
  ) {
    const oldest = remaining.shift();

    if (!oldest) {
      break;
    }

    evictions.push(oldest.cacheKey);
    byteSize -= oldest.byteSize;
    entryCount -= 1;
  }

  return evictions;
}
