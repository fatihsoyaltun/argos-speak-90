import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ACTIVE_DAY_STORAGE_KEY,
  CLOUD_SYNC_LAST_SYNC_STORAGE_KEY,
  DEVICE_LAB_PRACTICE_STORAGE_KEY,
  LOCAL_USER_DATA_STORAGE_KEYS,
  PRACTICE_PROGRESS_STORAGE_KEY,
  clearLocalUserData,
  exportLocalBackupAsJson,
  importLocalBackupFromJson,
} from "../lib/local-storage-keys.ts";
import {
  countCompletedDeviceLabModules,
  getRecentDaySummaries,
  summarizeActiveDayProgress,
} from "../lib/progress-summary.ts";
import { isVoiceRecordingSupported } from "../lib/voice-recording.ts";

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

const practiceFixture = {
  version: 1,
  days: {
    10: {
      dayNumber: 10,
      listenOutput: "note",
      wordsOutput: "",
      speakFirstTry: "",
      speakSecondTry: "",
      reviewAnswers: {},
      completedTasks: ["listen", "words"],
      dailyNote: "Calm pace",
      difficultPart: "",
      nextReviewNote: "",
      updatedAt: "2026-09-06T01:00:00.000Z",
    },
    12: {
      dayNumber: 12,
      completedTasks: ["listen", "words", "speak", "review"],
      dailyNote: "",
      difficultPart: "",
      nextReviewNote: "",
      updatedAt: "2026-09-06T02:00:00.000Z",
    },
  },
};

const deviceLabFixture = {
  version: 1,
  modules: {
    "8k:8k-intro": {
      deviceSlug: "8k",
      moduleId: "8k-intro",
      completedAt: "2026-09-06T02:00:00.000Z",
      updatedAt: "2026-09-06T02:00:00.000Z",
      firstTryAnswer: "",
      secondTryAnswer: "",
      reviewAnswer: "",
      journalNote: "",
      practiceNote: "",
    },
    "8k:open": {
      deviceSlug: "8k",
      moduleId: "open",
      updatedAt: "2026-09-06T02:00:00.000Z",
      firstTryAnswer: "draft",
      secondTryAnswer: "",
      reviewAnswer: "",
      journalNote: "",
      practiceNote: "",
    },
  },
};

test("P10D export/import round-trip preserves active day, practice, and Device Lab", () => {
  const source = new MemoryStorage();
  source.setItem(ACTIVE_DAY_STORAGE_KEY, "12");
  source.setItem(PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(practiceFixture));
  source.setItem(
    DEVICE_LAB_PRACTICE_STORAGE_KEY,
    JSON.stringify(deviceLabFixture),
  );
  source.setItem("unrelated-browser-key", "keep-me");

  const json = exportLocalBackupAsJson(source);
  const target = new MemoryStorage();
  target.setItem("unrelated-browser-key", "keep-me");
  const result = importLocalBackupFromJson(json, target);

  assert.equal(result.ok, true);
  assert.equal(result.activeDay, 12);
  assert.equal(result.importedDays, 2);
  assert.equal(result.importedDeviceModules, 2);
  assert.equal(target.getItem(ACTIVE_DAY_STORAGE_KEY), "12");
  assert.equal(target.getItem("unrelated-browser-key"), "keep-me");
  assert.deepEqual(
    JSON.parse(target.getItem(PRACTICE_PROGRESS_STORAGE_KEY)).days["12"]
      .completedTasks,
    ["listen", "words", "speak", "review"],
  );
});

test("P10D reset clears only targeted local user data keys", () => {
  const storage = new MemoryStorage();
  storage.setItem(ACTIVE_DAY_STORAGE_KEY, "12");
  storage.setItem(PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(practiceFixture));
  storage.setItem(
    DEVICE_LAB_PRACTICE_STORAGE_KEY,
    JSON.stringify(deviceLabFixture),
  );
  storage.setItem(CLOUD_SYNC_LAST_SYNC_STORAGE_KEY, "legacy");
  storage.setItem("sb-example-auth-token", "must-remain");
  storage.setItem("unrelated-browser-key", "keep-me");

  const result = clearLocalUserData(storage);

  assert.deepEqual(result.targetedKeys, [...LOCAL_USER_DATA_STORAGE_KEYS]);
  for (const key of LOCAL_USER_DATA_STORAGE_KEYS) {
    assert.equal(storage.getItem(key), null);
  }
  assert.equal(storage.getItem("sb-example-auth-token"), "must-remain");
  assert.equal(storage.getItem("unrelated-browser-key"), "keep-me");
  assert.ok(result.clearedKeys.includes(PRACTICE_PROGRESS_STORAGE_KEY));
  assert.ok(result.clearedKeys.includes(DEVICE_LAB_PRACTICE_STORAGE_KEY));
});

test("P10D progress summary helpers cover active day, recent days, Device Lab", () => {
  const summary = summarizeActiveDayProgress(practiceFixture.days["10"]);
  assert.equal(summary.trackedCompleted, 2);
  assert.equal(summary.trackedTotal, 4);
  assert.equal(summary.hasJournal, true);

  const recent = getRecentDaySummaries(12, practiceFixture.days, 7);
  assert.equal(recent.length, 7);
  assert.equal(recent[0].dayNumber, 6);
  assert.equal(recent.at(-1).dayNumber, 12);
  const day12 = recent.find((day) => day.dayNumber === 12);
  assert.equal(day12?.trackedCompleted, 4);

  assert.equal(countCompletedDeviceLabModules(deviceLabFixture.modules), 1);
});

test("P10D voice recording support detect does not request permission", () => {
  assert.equal(
    isVoiceRecordingSupported({
      navigator: {},
      MediaRecorder: undefined,
    }),
    false,
  );
  assert.equal(
    isVoiceRecordingSupported({
      navigator: {
        mediaDevices: {
          getUserMedia: async () => {
            throw new Error("should not be called");
          },
        },
      },
      MediaRecorder: function MediaRecorder() {},
    }),
    true,
  );
});

test("P10D Progress and Settings surfaces match single-user local model", async () => {
  const statsSource = await readFile("app/stats/page.tsx", "utf8");
  const settingsSource = await readFile("app/settings/page.tsx", "utf8");

  assert.match(statsSource, /data-progress-page="p10d"/);
  assert.match(statsSource, /Aktif gün/);
  assert.match(statsSource, /Bugünkü görevler|Görev özeti/);
  assert.match(statsSource, /Bu cihazda saklanıyor/);
  assert.match(statsSource, /Son yedi gün/);
  assert.match(statsSource, /Yedeği dışa aktar/);
  assert.match(statsSource, /exportLocalBackupAsJson/);
  assert.doesNotMatch(statsSource, /login|sign in|Supabase|cloud sync|admin/i);

  assert.match(settingsSource, /data-settings-page="p10d"/);
  assert.match(settingsSource, /data-settings-section="program"/);
  assert.match(settingsSource, /data-settings-section="backup"/);
  assert.match(settingsSource, /data-settings-section="audio"/);
  assert.match(settingsSource, /data-settings-section="microphone"/);
  assert.match(settingsSource, /data-settings-reset-arm/);
  assert.match(settingsSource, /data-settings-reset-confirm/);
  assert.match(settingsSource, /RESET_CONFIRM_PHRASE|SİL/);
  assert.match(settingsSource, /clearLocalUserData|LOCAL_USER_DATA_STORAGE_KEYS|clearAllArgosProgress/);
  assert.match(settingsSource, /isVoiceRecordingSupported/);
  assert.match(settingsSource, /oturum belleği/);
  assert.doesNotMatch(settingsSource, /\/pilot|CloudSync|sign in|Supabase|team|admin panel|login/i);
  assert.doesNotMatch(settingsSource, /Professional English \/ Device Lab/);
  assert.doesNotMatch(settingsSource, /eyebrow=\"Settings\"|Local practice settings/);
});
