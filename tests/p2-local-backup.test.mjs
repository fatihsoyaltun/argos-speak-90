import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTIVE_DAY_STORAGE_KEY,
  CLOUD_SYNC_LAST_SYNC_STORAGE_KEY,
  DEVICE_LAB_PRACTICE_STORAGE_KEY,
  PRACTICE_PROGRESS_STORAGE_KEY,
  exportLocalBackupAsJson,
  importLocalBackupFromJson,
} from "../lib/local-storage-keys.ts";

class MemoryStorage {
  #values = new Map();

  get length() {
    return this.#values.size;
  }

  clear() {
    this.#values.clear();
  }

  getItem(key) {
    return this.#values.get(String(key)) ?? null;
  }

  key(index) {
    return Array.from(this.#values.keys())[index] ?? null;
  }

  removeItem(key) {
    this.#values.delete(String(key));
  }

  setItem(key, value) {
    this.#values.set(String(key), String(value));
  }
}

function readJson(storage, key) {
  const value = storage.getItem(key);
  return value ? JSON.parse(value) : null;
}

const practiceFixture = {
  version: 1,
  days: {
    12: {
      dayNumber: 12,
      listenOutput: "A short listening note",
      wordsOutput: "filter, surface",
      speakFirstTry: "First answer",
      speakSecondTry: "Second answer",
      reviewAnswers: {
        0: { answer: "lens", checked: true, result: "correct" },
      },
      completedTasks: ["listen", "words", "speak"],
      dailyNote: "Keep the pace calm.",
      difficultPart: "Pronunciation",
      nextReviewNote: "Repeat tomorrow",
      updatedAt: "2026-08-04T08:00:00.000Z",
    },
    90: {
      dayNumber: 90,
      completedTasks: ["listen", "words", "speak", "review"],
      updatedAt: "2026-08-04T09:00:00.000Z",
    },
  },
};

const deviceLabFixture = {
  version: 1,
  modules: {
    "8k:8k-intro": {
      deviceSlug: "8k",
      moduleId: "8k-intro",
      reviewedAt: "2026-08-04T08:30:00.000Z",
      firstTryAnswer: "The device uses several light groups.",
      secondTryAnswer: "",
      reviewAnswer: "",
      journalNote: "Review filter vocabulary.",
      completedAt: "2026-08-04T08:45:00.000Z",
      updatedAt: "2026-08-04T08:45:00.000Z",
    },
  },
};

test("complete backup round-trips active day, task state, and Device Lab state", () => {
  const source = new MemoryStorage();
  source.setItem(ACTIVE_DAY_STORAGE_KEY, "12");
  source.setItem(
    PRACTICE_PROGRESS_STORAGE_KEY,
    JSON.stringify(practiceFixture),
  );
  source.setItem(
    DEVICE_LAB_PRACTICE_STORAGE_KEY,
    JSON.stringify(deviceLabFixture),
  );
  source.setItem(CLOUD_SYNC_LAST_SYNC_STORAGE_KEY, "not-user-progress");
  source.setItem("sb-example-auth-token", "must-not-be-exported");

  const json = exportLocalBackupAsJson(source);
  const exported = JSON.parse(json);

  assert.equal(exported.version, 2);
  assert.equal(exported.product, "argos-speak-90");
  assert.equal(exported.activeDay, 12);
  assert.equal(json.includes("must-not-be-exported"), false);
  assert.equal(json.includes("not-user-progress"), false);

  const cleanProfile = new MemoryStorage();
  const result = importLocalBackupFromJson(json, cleanProfile);

  assert.deepEqual(result, {
    ok: true,
    activeDay: 12,
    format: "complete",
    importedDays: 2,
    importedDeviceModules: 1,
  });
  assert.equal(cleanProfile.getItem(ACTIVE_DAY_STORAGE_KEY), "12");
  assert.deepEqual(
    readJson(cleanProfile, PRACTICE_PROGRESS_STORAGE_KEY).days["12"]
      .completedTasks,
    ["listen", "words", "speak"],
  );
  assert.equal(
    readJson(cleanProfile, DEVICE_LAB_PRACTICE_STORAGE_KEY).modules[
      "8k:8k-intro"
    ].completedAt,
    "2026-08-04T08:45:00.000Z",
  );
});

test("legacy practice-only exports remain importable without changing other keys", () => {
  const target = new MemoryStorage();
  target.setItem(ACTIVE_DAY_STORAGE_KEY, "7");
  target.setItem(
    DEVICE_LAB_PRACTICE_STORAGE_KEY,
    JSON.stringify(deviceLabFixture),
  );

  const result = importLocalBackupFromJson(
    JSON.stringify(practiceFixture),
    target,
  );

  assert.deepEqual(result, {
    ok: true,
    format: "legacy-practice",
    importedDays: 2,
    importedDeviceModules: 0,
  });
  assert.equal(target.getItem(ACTIVE_DAY_STORAGE_KEY), "7");
  assert.deepEqual(
    readJson(target, DEVICE_LAB_PRACTICE_STORAGE_KEY),
    deviceLabFixture,
  );
  assert.deepEqual(
    readJson(target, PRACTICE_PROGRESS_STORAGE_KEY).days["90"]
      .completedTasks,
    ["listen", "words", "speak", "review"],
  );
});

test("invalid complete backups do not modify existing local progress", () => {
  const target = new MemoryStorage();
  target.setItem(ACTIVE_DAY_STORAGE_KEY, "22");
  target.setItem(PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(practiceFixture));
  const before = target.getItem(PRACTICE_PROGRESS_STORAGE_KEY);

  const result = importLocalBackupFromJson(
    JSON.stringify({
      version: 2,
      product: "argos-speak-90",
      activeDay: 91,
      practiceProgress: practiceFixture,
      deviceLabPractice: deviceLabFixture,
    }),
    target,
  );

  assert.equal(result.ok, false);
  assert.equal(target.getItem(ACTIVE_DAY_STORAGE_KEY), "22");
  assert.equal(target.getItem(PRACTICE_PROGRESS_STORAGE_KEY), before);
});
