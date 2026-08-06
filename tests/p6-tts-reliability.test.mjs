import assert from "node:assert/strict";
import test from "node:test";
import {
  isTtsCacheEntryExpired,
  selectTtsCacheEvictions,
} from "../lib/tts/cache-policy.ts";
import { createTtsRequestGuard } from "../lib/tts/request-guard.ts";

test("cache policy expires stale entries and evicts the least recently used item", () => {
  const entries = [
    { byteSize: 20, cacheKey: "expired", lastUsed: 0 },
    { byteSize: 20, cacheKey: "oldest", lastUsed: 900 },
    { byteSize: 20, cacheKey: "newest", lastUsed: 950 },
  ];

  assert.equal(isTtsCacheEntryExpired(entries[0], 1_000, 500), true);
  assert.deepEqual(
    selectTtsCacheEvictions({
      entries,
      incomingBytes: 30,
      limits: { maxBytes: 60, maxEntries: 3, ttlMs: 500 },
      now: 1_000,
    }),
    ["expired", "oldest"],
  );
});

test("cache policy enforces entry count independently of byte size", () => {
  assert.deepEqual(
    selectTtsCacheEvictions({
      entries: [
        { byteSize: 1, cacheKey: "a", lastUsed: 1 },
        { byteSize: 1, cacheKey: "b", lastUsed: 2 },
      ],
      incomingBytes: 1,
      limits: { maxBytes: 100, maxEntries: 2, ttlMs: 10_000 },
      now: 3,
    }),
    ["a"],
  );
});

test("request guard applies request and character budgets per client", () => {
  let now = 1_000;
  const guard = createTtsRequestGuard({
    characterLimit: 10,
    clock: () => now,
    requestLimit: 2,
    windowMs: 1_000,
  });

  assert.deepEqual(guard.check("client-a", 4), { ok: true });
  assert.deepEqual(guard.check("client-a", 4), { ok: true });
  assert.deepEqual(guard.check("client-a", 1), {
    ok: false,
    retryAfterSeconds: 1,
  });
  assert.deepEqual(guard.check("client-b", 10), { ok: true });

  now = 2_001;
  assert.deepEqual(guard.check("client-a", 10), { ok: true });
});

test("base64 transport is larger than binary for the same audio bytes", () => {
  const audio = Buffer.from("Argos audio measurement");
  const base64 = audio.toString("base64");

  assert.ok(Buffer.byteLength(base64) > audio.byteLength);
  assert.equal(Buffer.from(base64, "base64").byteLength, audio.byteLength);
});
