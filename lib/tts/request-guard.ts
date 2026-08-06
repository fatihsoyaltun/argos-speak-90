export type TtsRequestGuardResult =
  | { ok: true }
  | {
      ok: false;
      retryAfterSeconds: number;
    };

type TtsRequestRecord = {
  characterCount: number;
  timestamp: number;
};

export function createTtsRequestGuard({
  characterLimit = 8_000,
  clock = Date.now,
  requestLimit = 20,
  windowMs = 5 * 60 * 1_000,
}: {
  characterLimit?: number;
  clock?: () => number;
  requestLimit?: number;
  windowMs?: number;
} = {}) {
  const requestsByClient = new Map<string, TtsRequestRecord[]>();

  function check(clientKey: string, characterCount: number): TtsRequestGuardResult {
    const now = clock();
    const windowStart = now - windowMs;
    const recent = (requestsByClient.get(clientKey) ?? []).filter(
      (record) => record.timestamp > windowStart,
    );
    const usedCharacters = recent.reduce(
      (total, record) => total + record.characterCount,
      0,
    );

    if (
      recent.length >= requestLimit ||
      usedCharacters + characterCount > characterLimit
    ) {
      const oldestTimestamp = recent[0]?.timestamp ?? now;
      return {
        ok: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((oldestTimestamp + windowMs - now) / 1_000),
        ),
      };
    }

    recent.push({ characterCount, timestamp: now });
    requestsByClient.set(clientKey, recent);
    return { ok: true };
  }

  function reset() {
    requestsByClient.clear();
  }

  return { check, reset };
}
