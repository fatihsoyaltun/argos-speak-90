export const ACTIVE_DAY_STORAGE_KEY = "argos-active-day";
export const CLOUD_SYNC_LAST_SYNC_STORAGE_KEY = "argos-cloud-sync-last-sync";
export const DEVICE_LAB_PRACTICE_STORAGE_KEY =
  "argos-device-lab-practice-v1";
export const PRACTICE_PROGRESS_STORAGE_KEY = "argos-practice-progress";

const LOCAL_BACKUP_PRODUCT = "argos-speak-90";
const LOCAL_BACKUP_VERSION = 2;
const MIN_DAY = 1;
const MAX_DAY = 90;

type StoredRecord = Record<string, unknown>;

type LocalBackup = {
  version: 2;
  product: typeof LOCAL_BACKUP_PRODUCT;
  exportedAt: string;
  activeDay: number;
  practiceProgress: {
    version: 1;
    days: StoredRecord;
  };
  deviceLabPractice: {
    version: 1;
    modules: StoredRecord;
  };
};

export type LocalBackupImportResult =
  | {
      ok: true;
      activeDay?: number;
      format: "complete" | "legacy-practice";
      importedDays: number;
      importedDeviceModules: number;
    }
  | { ok: false; message: string };

export const APP_LOCAL_STORAGE_KEYS = [
  ACTIVE_DAY_STORAGE_KEY,
  CLOUD_SYNC_LAST_SYNC_STORAGE_KEY,
  PRACTICE_PROGRESS_STORAGE_KEY,
] as const;

/** Argos-owned local user data cleared by Settings reset (scoped). */
export const LOCAL_USER_DATA_STORAGE_KEYS = [
  ACTIVE_DAY_STORAGE_KEY,
  PRACTICE_PROGRESS_STORAGE_KEY,
  DEVICE_LAB_PRACTICE_STORAGE_KEY,
  CLOUD_SYNC_LAST_SYNC_STORAGE_KEY,
] as const;

export function clearAppLocalStorage(storage: Storage) {
  APP_LOCAL_STORAGE_KEYS.forEach((key) => {
    storage.removeItem(key);
  });
}

/**
 * Clears only intended local user data keys.
 * Leaves unrelated browser keys (auth tokens, third-party data) untouched.
 */
export function clearLocalUserData(storage: Storage) {
  const clearedKeys: string[] = [];

  LOCAL_USER_DATA_STORAGE_KEYS.forEach((key) => {
    try {
      if (storage.getItem(key) !== null) {
        clearedKeys.push(key);
      }
      storage.removeItem(key);
    } catch {
      // Best-effort; caller still receives the intended key list.
    }
  });

  return {
    clearedKeys,
    targetedKeys: [...LOCAL_USER_DATA_STORAGE_KEYS],
  };
}

function isRecord(value: unknown): value is StoredRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDay(day: number) {
  return Number.isInteger(day) && day >= MIN_DAY && day <= MAX_DAY;
}

function parseStoredJson(storage: Storage, key: string) {
  try {
    const value = storage.getItem(key);
    return value ? (JSON.parse(value) as unknown) : null;
  } catch {
    return null;
  }
}

function normalizePracticeProgress(value: unknown) {
  const rawDays = isRecord(value) && isRecord(value.days) ? value.days : {};
  const days = Object.entries(rawDays).reduce<StoredRecord>(
    (validDays, [key, rawDay]) => {
      if (!isRecord(rawDay)) {
        return validDays;
      }

      const fallbackDay = Number(key);
      const candidateDay =
        typeof rawDay.dayNumber === "number"
          ? Math.round(rawDay.dayNumber)
          : fallbackDay;

      if (!isValidDay(candidateDay)) {
        return validDays;
      }

      validDays[String(candidateDay)] = rawDay;
      return validDays;
    },
    {},
  );

  return { version: 1 as const, days };
}

function normalizeDeviceLabPractice(value: unknown) {
  const rawModules =
    isRecord(value) && isRecord(value.modules) ? value.modules : {};
  const modules = Object.entries(rawModules).reduce<StoredRecord>(
    (validModules, [key, rawModule]) => {
      if (key.trim() && isRecord(rawModule)) {
        validModules[key] = rawModule;
      }

      return validModules;
    },
    {},
  );

  return { version: 1 as const, modules };
}

function readActiveDay(storage: Storage) {
  try {
    const storedDay = Number(storage.getItem(ACTIVE_DAY_STORAGE_KEY));
    return isValidDay(storedDay) ? storedDay : MIN_DAY;
  } catch {
    return MIN_DAY;
  }
}

export function createLocalBackup(
  storage: Storage,
  exportedAt = new Date().toISOString(),
): LocalBackup {
  return {
    version: LOCAL_BACKUP_VERSION,
    product: LOCAL_BACKUP_PRODUCT,
    exportedAt,
    activeDay: readActiveDay(storage),
    practiceProgress: normalizePracticeProgress(
      parseStoredJson(storage, PRACTICE_PROGRESS_STORAGE_KEY),
    ),
    deviceLabPractice: normalizeDeviceLabPractice(
      parseStoredJson(storage, DEVICE_LAB_PRACTICE_STORAGE_KEY),
    ),
  };
}

export function exportLocalBackupAsJson(storage: Storage) {
  return JSON.stringify(createLocalBackup(storage), null, 2);
}

function restorePreviousValues(
  storage: Storage,
  previousValues: Map<string, string | null>,
) {
  previousValues.forEach((value, key) => {
    try {
      if (value === null) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, value);
      }
    } catch {
      // Best-effort rollback; the caller still receives a failed result.
    }
  });
}

function writeAtomically(
  storage: Storage,
  values: Map<string, string | null>,
) {
  const previousValues = new Map<string, string | null>();

  try {
    values.forEach((_value, key) => {
      previousValues.set(key, storage.getItem(key));
    });

    values.forEach((value, key) => {
      if (value === null) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, value);
      }
    });

    return true;
  } catch {
    restorePreviousValues(storage, previousValues);
    return false;
  }
}

function getCompleteBackup(value: unknown): LocalBackup | null {
  if (
    !isRecord(value) ||
    value.version !== LOCAL_BACKUP_VERSION ||
    value.product !== LOCAL_BACKUP_PRODUCT ||
    typeof value.activeDay !== "number" ||
    !isValidDay(value.activeDay) ||
    !isRecord(value.practiceProgress) ||
    !isRecord(value.practiceProgress.days) ||
    !isRecord(value.deviceLabPractice) ||
    !isRecord(value.deviceLabPractice.modules)
  ) {
    return null;
  }

  return {
    version: LOCAL_BACKUP_VERSION,
    product: LOCAL_BACKUP_PRODUCT,
    exportedAt:
      typeof value.exportedAt === "string" ? value.exportedAt : "",
    activeDay: value.activeDay,
    practiceProgress: normalizePracticeProgress(value.practiceProgress),
    deviceLabPractice: normalizeDeviceLabPractice(value.deviceLabPractice),
  };
}

export function importLocalBackupFromJson(
  jsonText: string,
  storage: Storage,
): LocalBackupImportResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, message: "JSON okunamadı. Lütfen metni kontrol et." };
  }

  const completeBackup = getCompleteBackup(parsed);

  if (completeBackup) {
    const values = new Map<string, string | null>([
      [ACTIVE_DAY_STORAGE_KEY, String(completeBackup.activeDay)],
      [
        PRACTICE_PROGRESS_STORAGE_KEY,
        JSON.stringify(completeBackup.practiceProgress),
      ],
      [
        DEVICE_LAB_PRACTICE_STORAGE_KEY,
        Object.keys(completeBackup.deviceLabPractice.modules).length > 0
          ? JSON.stringify(completeBackup.deviceLabPractice)
          : null,
      ],
    ]);

    if (!writeAtomically(storage, values)) {
      return {
        ok: false,
        message: "Yedek kaydedilemedi. Tarayıcı depolaması kapalı olabilir.",
      };
    }

    return {
      ok: true,
      activeDay: completeBackup.activeDay,
      format: "complete",
      importedDays: Object.keys(completeBackup.practiceProgress.days).length,
      importedDeviceModules: Object.keys(
        completeBackup.deviceLabPractice.modules,
      ).length,
    };
  }

  const rawLegacyDays =
    isRecord(parsed) && isRecord(parsed.days)
      ? parsed.days
      : isRecord(parsed)
        ? parsed
        : null;

  if (!rawLegacyDays) {
    return { ok: false, message: "İçe aktarılacak yerel veri bulunamadı." };
  }

  const legacyProgress = normalizePracticeProgress({ days: rawLegacyDays });
  const importedDays = Object.keys(legacyProgress.days).length;

  if (importedDays === 0) {
    return { ok: false, message: "Geçerli Day 1-90 ilerleme verisi bulunamadı." };
  }

  const didWrite = writeAtomically(
    storage,
    new Map([[PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(legacyProgress)]]),
  );

  if (!didWrite) {
    return {
      ok: false,
      message: "İlerleme kaydedilemedi. Tarayıcı depolaması kapalı olabilir.",
    };
  }

  return {
    ok: true,
    format: "legacy-practice",
    importedDays,
    importedDeviceModules: 0,
  };
}
