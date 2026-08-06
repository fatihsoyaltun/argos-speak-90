import type { DeviceSlug } from "./types";
import { DEVICE_LAB_PRACTICE_STORAGE_KEY } from "@/lib/local-storage-keys";

export { DEVICE_LAB_PRACTICE_STORAGE_KEY } from "@/lib/local-storage-keys";

export type DeviceLabLocalPractice = {
  deviceSlug: DeviceSlug;
  moduleId: string;
  reviewedAt?: string;
  firstTryAnswer: string;
  secondTryAnswer: string;
  reviewAnswer: string;
  journalNote: string;
  practiceNote: string;
  completedAt?: string;
  updatedAt: string;
};

type DeviceLabPracticeStore = {
  version: 1;
  modules: Record<string, DeviceLabLocalPractice>;
};

type PracticeTextField =
  | "firstTryAnswer"
  | "secondTryAnswer"
  | "reviewAnswer"
  | "journalNote"
  | "practiceNote";

export type DeviceLabPracticePatch = Partial<
  Pick<
    DeviceLabLocalPractice,
    PracticeTextField | "reviewedAt" | "completedAt"
  >
>;

export type DeviceLabPracticeReadResult = {
  practice: DeviceLabLocalPractice;
  storageAvailable: boolean;
};

export type DeviceLabPracticeWriteResult = {
  practice: DeviceLabLocalPractice;
  saved: boolean;
};

const EMPTY_STORE: DeviceLabPracticeStore = {
  version: 1,
  modules: {},
};

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function safeIsoString(value: unknown) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return undefined;
  }

  return value;
}

function getModuleKey(deviceSlug: DeviceSlug, moduleId: string) {
  return `${deviceSlug}:${moduleId}`;
}

export function createEmptyDeviceLabPractice(
  deviceSlug: DeviceSlug,
  moduleId: string,
): DeviceLabLocalPractice {
  return {
    deviceSlug,
    moduleId,
    firstTryAnswer: "",
    secondTryAnswer: "",
    reviewAnswer: "",
    journalNote: "",
    practiceNote: "",
    updatedAt: "",
  };
}

function getLegacyPracticeNote(rawPractice: Record<string, unknown>) {
  const legacySections = [
    ["İlk deneme", safeString(rawPractice.firstTryAnswer)],
    ["İkinci deneme", safeString(rawPractice.secondTryAnswer)],
    ["Tekrar", safeString(rawPractice.reviewAnswer)],
    ["Journal", safeString(rawPractice.journalNote)],
  ].filter(([, value]) => value.trim());

  return legacySections
    .map(([label, value]) => `${label}:\n${value}`)
    .join("\n\n");
}

function sanitizePractice(
  value: unknown,
  deviceSlug: DeviceSlug,
  moduleId: string,
): DeviceLabLocalPractice {
  const rawPractice = isRecord(value) ? value : {};
  const hasPracticeNote = Object.prototype.hasOwnProperty.call(
    rawPractice,
    "practiceNote",
  );

  return {
    deviceSlug,
    moduleId,
    reviewedAt: safeIsoString(rawPractice.reviewedAt),
    firstTryAnswer: safeString(rawPractice.firstTryAnswer),
    secondTryAnswer: safeString(rawPractice.secondTryAnswer),
    reviewAnswer: safeString(rawPractice.reviewAnswer),
    journalNote: safeString(rawPractice.journalNote),
    practiceNote: hasPracticeNote
      ? safeString(rawPractice.practiceNote)
      : getLegacyPracticeNote(rawPractice),
    completedAt: safeIsoString(rawPractice.completedAt),
    updatedAt: safeIsoString(rawPractice.updatedAt) ?? "",
  };
}

function readStore(): {
  store: DeviceLabPracticeStore;
  storageAvailable: boolean;
} {
  const storage = getStorage();

  if (!storage) {
    return { store: EMPTY_STORE, storageAvailable: false };
  }

  try {
    const rawValue = storage.getItem(DEVICE_LAB_PRACTICE_STORAGE_KEY);

    if (!rawValue) {
      return { store: EMPTY_STORE, storageAvailable: true };
    }

    const parsed = JSON.parse(rawValue) as unknown;
    const rawModules =
      isRecord(parsed) && isRecord(parsed.modules) ? parsed.modules : {};

    return {
      store: {
        version: 1,
        modules: rawModules as Record<string, DeviceLabLocalPractice>,
      },
      storageAvailable: true,
    };
  } catch {
    return { store: EMPTY_STORE, storageAvailable: true };
  }
}

function writeStore(store: DeviceLabPracticeStore) {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(DEVICE_LAB_PRACTICE_STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function getDeviceLabPractice(
  deviceSlug: DeviceSlug,
  moduleId: string,
): DeviceLabPracticeReadResult {
  const { store, storageAvailable } = readStore();
  const moduleKey = getModuleKey(deviceSlug, moduleId);
  const storedPractice = store.modules[moduleKey];

  return {
    practice: storedPractice
      ? sanitizePractice(storedPractice, deviceSlug, moduleId)
      : createEmptyDeviceLabPractice(deviceSlug, moduleId),
    storageAvailable,
  };
}

export function saveDeviceLabPractice(
  deviceSlug: DeviceSlug,
  moduleId: string,
  patch: DeviceLabPracticePatch,
): DeviceLabPracticeWriteResult {
  const { store } = readStore();
  const moduleKey = getModuleKey(deviceSlug, moduleId);
  const currentPractice = store.modules[moduleKey]
    ? sanitizePractice(store.modules[moduleKey], deviceSlug, moduleId)
    : createEmptyDeviceLabPractice(deviceSlug, moduleId);
  const nextPractice = sanitizePractice(
    {
      ...currentPractice,
      ...patch,
      updatedAt: new Date().toISOString(),
    },
    deviceSlug,
    moduleId,
  );
  const saved = writeStore({
    version: 1,
    modules: {
      ...store.modules,
      [moduleKey]: nextPractice,
    },
  });

  return { practice: nextPractice, saved };
}

export function resetDeviceLabPractice(
  deviceSlug: DeviceSlug,
  moduleId: string,
) {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  const { store } = readStore();
  const nextModules = { ...store.modules };

  delete nextModules[getModuleKey(deviceSlug, moduleId)];

  try {
    if (Object.keys(nextModules).length === 0) {
      storage.removeItem(DEVICE_LAB_PRACTICE_STORAGE_KEY);
    } else {
      storage.setItem(
        DEVICE_LAB_PRACTICE_STORAGE_KEY,
        JSON.stringify({ version: 1, modules: nextModules }),
      );
    }

    return true;
  } catch {
    return false;
  }
}
