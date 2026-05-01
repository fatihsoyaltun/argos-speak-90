import {
  APP_LOCAL_STORAGE_KEYS,
  PRACTICE_PROGRESS_STORAGE_KEY,
} from "@/lib/local-storage-keys";

export type CompletedTask = "listen" | "words" | "speak" | "review";

export type ReviewAnswerProgress = {
  answer: string;
  checked: boolean;
  result?: "correct" | "needsReview";
  expectedAnswer?: string;
};

export type DayProgress = {
  dayNumber: number;
  listenOutput: string;
  wordsOutput: string;
  speakFirstTry: string;
  speakSecondTry: string;
  reviewAnswers: Record<string, ReviewAnswerProgress>;
  completedTasks: CompletedTask[];
  dailyNote: string;
  difficultPart: string;
  nextReviewNote: string;
  updatedAt: string;
};

type PracticeProgressStore = {
  version: 1;
  days: Record<string, DayProgress>;
};

type ImportResult =
  | { ok: true; importedDays: number }
  | { ok: false; message: string };

export const PRACTICE_PROGRESS_UPDATED_EVENT =
  "argos-practice-progress-updated";

const MIN_DAY = 1;
const MAX_DAY = 90;
const VALID_COMPLETED_TASKS: CompletedTask[] = [
  "listen",
  "words",
  "speak",
  "review",
];

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

function clampDay(dayNumber: number) {
  if (!Number.isFinite(dayNumber)) {
    return MIN_DAY;
  }

  return Math.min(MAX_DAY, Math.max(MIN_DAY, Math.round(dayNumber)));
}

function isValidDayNumber(dayNumber: number) {
  return Number.isFinite(dayNumber) && dayNumber >= MIN_DAY && dayNumber <= MAX_DAY;
}

function safeString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function createEmptyDayProgress(dayNumber: number): DayProgress {
  return {
    dayNumber: clampDay(dayNumber),
    listenOutput: "",
    wordsOutput: "",
    speakFirstTry: "",
    speakSecondTry: "",
    reviewAnswers: {},
    completedTasks: [],
    dailyNote: "",
    difficultPart: "",
    nextReviewNote: "",
    updatedAt: "",
  };
}

function sanitizeCompletedTasks(value: unknown): CompletedTask[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value.filter((task): task is CompletedTask =>
        VALID_COMPLETED_TASKS.includes(task as CompletedTask),
      ),
    ),
  );
}

function sanitizeReviewAnswers(
  value: unknown,
): Record<string, ReviewAnswerProgress> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, ReviewAnswerProgress>>(
    (answers, [key, rawAnswer]) => {
      if (!isRecord(rawAnswer)) {
        return answers;
      }

      answers[key] = {
        answer: safeString(rawAnswer.answer),
        checked: rawAnswer.checked === true,
        result:
          rawAnswer.result === "correct" || rawAnswer.result === "needsReview"
            ? rawAnswer.result
            : undefined,
        expectedAnswer: safeString(rawAnswer.expectedAnswer) || undefined,
      };

      return answers;
    },
    {},
  );
}

function sanitizeDayProgress(value: unknown, fallbackDay: number): DayProgress {
  const rawDay = isRecord(value) ? value : {};
  const dayNumber = clampDay(
    typeof rawDay.dayNumber === "number" ? rawDay.dayNumber : fallbackDay,
  );

  return {
    dayNumber,
    listenOutput: safeString(rawDay.listenOutput),
    wordsOutput: safeString(rawDay.wordsOutput),
    speakFirstTry: safeString(rawDay.speakFirstTry),
    speakSecondTry: safeString(rawDay.speakSecondTry),
    reviewAnswers: sanitizeReviewAnswers(rawDay.reviewAnswers),
    completedTasks: sanitizeCompletedTasks(rawDay.completedTasks),
    dailyNote: safeString(rawDay.dailyNote),
    difficultPart: safeString(rawDay.difficultPart),
    nextReviewNote: safeString(rawDay.nextReviewNote),
    updatedAt: safeString(rawDay.updatedAt),
  };
}

function readStore(): PracticeProgressStore {
  const storage = getStorage();

  if (!storage) {
    return { version: 1, days: {} };
  }

  try {
    const rawValue = storage.getItem(PRACTICE_PROGRESS_STORAGE_KEY);

    if (!rawValue) {
      return { version: 1, days: {} };
    }

    const parsed = JSON.parse(rawValue) as unknown;
    const rawDays =
      isRecord(parsed) && isRecord(parsed.days) ? parsed.days : {};
    const days = Object.entries(rawDays).reduce<Record<string, DayProgress>>(
      (currentDays, [key, value]) => {
      const parsedDay = Number(key);

      if (!isValidDayNumber(parsedDay)) {
        return currentDays;
      }

      const dayNumber = Math.round(parsedDay);
      currentDays[String(dayNumber)] = sanitizeDayProgress(value, dayNumber);
        return currentDays;
      },
      {},
    );

    return { version: 1, days };
  } catch {
    return { version: 1, days: {} };
  }
}

function writeStore(store: PracticeProgressStore) {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(store));
    notifyPracticeProgressChanged();
    return true;
  } catch {
    return false;
  }
}

export function notifyPracticeProgressChanged() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.dispatchEvent(new Event(PRACTICE_PROGRESS_UPDATED_EVENT));
  } catch {
    // Storage should remain usable even if event dispatch is unavailable.
  }
}

export function getDayProgress(dayNumber: number): DayProgress {
  const day = clampDay(dayNumber);
  const store = readStore();

  return store.days[String(day)] ?? createEmptyDayProgress(day);
}

export function getAllDayProgress() {
  return readStore().days;
}

export function mergeDayProgressToLocal(
  days: Record<string, DayProgress>,
) {
  const store = readStore();
  const sanitizedDays = Object.entries(days).reduce<
    Record<string, DayProgress>
  >((currentDays, [key, value]) => {
    const dayNumber = Number(key);

    if (!isValidDayNumber(dayNumber)) {
      return currentDays;
    }

    const day = Math.round(dayNumber);
    currentDays[String(day)] = sanitizeDayProgress(value, day);
    return currentDays;
  }, {});

  writeStore({
    version: 1,
    days: {
      ...store.days,
      ...sanitizedDays,
    },
  });
}

export function saveDayProgress(
  dayNumber: number,
  patch: Partial<Omit<DayProgress, "dayNumber" | "updatedAt">>,
) {
  const day = clampDay(dayNumber);
  const store = readStore();
  const current = store.days[String(day)] ?? createEmptyDayProgress(day);
  const nextCompletedTasks = patch.completedTasks
    ? sanitizeCompletedTasks(patch.completedTasks)
    : current.completedTasks;

  const nextProgress: DayProgress = {
    ...current,
    ...patch,
    dayNumber: day,
    reviewAnswers: patch.reviewAnswers ?? current.reviewAnswers,
    completedTasks: nextCompletedTasks,
    updatedAt: new Date().toISOString(),
  };

  const nextStore = {
    ...store,
    days: {
      ...store.days,
      [String(day)]: nextProgress,
    },
  };

  writeStore(nextStore);
  return nextProgress;
}

export function markDayTaskCompleted(dayNumber: number, task: CompletedTask) {
  const progress = getDayProgress(dayNumber);

  if (progress.completedTasks.includes(task)) {
    return progress;
  }

  return saveDayProgress(dayNumber, {
    completedTasks: [...progress.completedTasks, task],
  });
}

export function clearDayProgress(dayNumber: number) {
  const day = clampDay(dayNumber);
  const store = readStore();
  const nextDays = { ...store.days };

  delete nextDays[String(day)];
  writeStore({ version: 1, days: nextDays });
}

export function clearAllPracticeProgress() {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(PRACTICE_PROGRESS_STORAGE_KEY);
    notifyPracticeProgressChanged();
    return true;
  } catch {
    return false;
  }
}

export function clearAllArgosProgress() {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    APP_LOCAL_STORAGE_KEYS.forEach((key) => {
      storage.removeItem(key);
    });
    notifyPracticeProgressChanged();
    return true;
  } catch {
    return false;
  }
}

export function exportPracticeProgressAsJson() {
  const store = readStore();

  return JSON.stringify(
    {
      version: store.version,
      exportedAt: new Date().toISOString(),
      days: store.days,
    },
    null,
    2,
  );
}

export function importPracticeProgressFromJson(jsonText: string): ImportResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, message: "JSON okunamadı. Lütfen metni kontrol et." };
  }

  const rawDays =
    isRecord(parsed) && isRecord(parsed.days)
      ? parsed.days
      : isRecord(parsed)
        ? parsed
        : null;

  if (!rawDays) {
    return { ok: false, message: "İçe aktarılacak gün verisi bulunamadı." };
  }

  const days = Object.entries(rawDays).reduce<Record<string, DayProgress>>(
    (currentDays, [key, value]) => {
      const fallbackDay = Number(key);
      const candidateDay =
        isRecord(value) && typeof value.dayNumber === "number"
          ? value.dayNumber
          : fallbackDay;

      if (!isValidDayNumber(candidateDay)) {
        return currentDays;
      }

      const dayNumber = Math.round(candidateDay);
      currentDays[String(dayNumber)] = sanitizeDayProgress(value, dayNumber);
      return currentDays;
    },
    {},
  );
  const importedDays = Object.keys(days).length;

  if (importedDays === 0) {
    return { ok: false, message: "Geçerli Day 1-90 ilerleme verisi bulunamadı." };
  }

  const didWrite = writeStore({ version: 1, days });

  if (!didWrite) {
    return {
      ok: false,
      message: "İlerleme kaydedilemedi. Tarayıcı depolaması kapalı olabilir.",
    };
  }

  return { ok: true, importedDays };
}
