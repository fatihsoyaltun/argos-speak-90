"use client";

import type { User } from "@supabase/supabase-js";
import {
  getCurrentUserSafe,
  isAuthFetchError,
  isAuthLockError,
  isStaleRefreshTokenError,
} from "@/lib/auth/session";
import {
  ACTIVE_DAY_STORAGE_KEY,
  CLOUD_SYNC_LAST_SYNC_STORAGE_KEY,
} from "@/lib/local-storage-keys";
import {
  getAllDayProgress,
  mergeDayProgressToLocal,
  type CompletedTask,
  type DayProgress,
  type ReviewAnswerProgress,
} from "@/lib/practice-storage";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfigStatus } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

type DayProgressRow = Database["public"]["Tables"]["day_progress"]["Row"];
type PracticeEntryRow =
  Database["public"]["Tables"]["practice_entries"]["Row"];
type ReviewAnswerRow =
  Database["public"]["Tables"]["review_answers"]["Row"];
type UserStatusRow = Database["public"]["Tables"]["user_status"]["Row"];

export type CloudSyncStatus =
  | "notSignedIn"
  | "ready"
  | "syncing"
  | "synced"
  | "needsAttention"
  | "authExpired"
  | "connectionError"
  | "error";

export type CloudProgress = {
  activeDay: number | null;
  days: Record<string, DayProgress>;
  statusUpdatedAt: string;
};

export type CloudSyncResult = {
  activeDay?: number;
  errorMessage?: string;
  lastSyncAt?: string;
  ok: boolean;
  pulledDays: number;
  pushedDays: number;
  status: CloudSyncStatus;
  technicalMessage?: string;
};

const COMPLETED_TASKS: CompletedTask[] = [
  "listen",
  "words",
  "speak",
  "review",
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "";
}

function getLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getLastSyncAt() {
  try {
    return getLocalStorage()?.getItem(CLOUD_SYNC_LAST_SYNC_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function setLastSyncAt(value: string) {
  try {
    getLocalStorage()?.setItem(CLOUD_SYNC_LAST_SYNC_STORAGE_KEY, value);
  } catch {
    // Sync should still complete if local status metadata cannot be saved.
  }
}

function setLocalActiveDay(day: number | null) {
  if (!day) {
    return;
  }

  try {
    getLocalStorage()?.setItem(ACTIVE_DAY_STORAGE_KEY, String(day));
  } catch {
    // The caller still receives the restored day and can update React state.
  }
}

function getIsoTime(value: string | null | undefined) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getNewerIso(first: string, second: string) {
  return getIsoTime(first) >= getIsoTime(second) ? first : second;
}

function getLatestLocalUpdatedAt(days: Record<string, DayProgress>) {
  return Object.values(days).reduce(
    (latest, day) => getNewerIso(latest, day.updatedAt),
    "",
  );
}

function getProgressUpdatedAt(day: DayProgress) {
  return day.updatedAt || new Date().toISOString();
}

function countCompletedDays(days: Record<string, DayProgress>) {
  return Object.values(days).filter((day) =>
    COMPLETED_TASKS.every((task) => day.completedTasks.includes(task)),
  ).length;
}

function getCompletionPercent(completedTasks: CompletedTask[]) {
  const completedCount = COMPLETED_TASKS.filter((task) =>
    completedTasks.includes(task),
  ).length;

  return Math.round((completedCount / COMPLETED_TASKS.length) * 100);
}

function formatSyncError(message: string) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("oturum süresi") ||
    lowerMessage.includes("oturum yenilenemedi")
  ) {
    return "Oturum yenilenemedi, lütfen tekrar giriş yap.";
  }

  if (lowerMessage.includes("oturum kontrolü geçici")) {
    return "Oturum kontrolü geçici olarak başarısız oldu. Lütfen tekrar deneyin.";
  }

  if (isStaleRefreshTokenError(message) || isAuthLockError(message)) {
    return "Oturum yenilenemedi, lütfen tekrar giriş yap.";
  }

  if (isAuthFetchError(message)) {
    return "Geçici bağlantı hatası. Local ilerleme korunuyor; lütfen tekrar deneyin.";
  }

  if (
    lowerMessage.includes("row-level security") ||
    lowerMessage.includes("permission denied") ||
    lowerMessage.includes("violates row-level security")
  ) {
    return "Cloud sync için Supabase RLS izinleri eksik. Kullanıcılar yalnızca kendi user_id verilerini okuyup yazabilmeli.";
  }

  if (lowerMessage.includes("invalid path specified")) {
    return "Supabase URL hatalı. Project URL https://...supabase.co formatında olmalı.";
  }

  return "Cloud sync tamamlanamadı. Supabase bağlantısını ve RLS izinlerini kontrol et.";
}

function getSyncErrorStatus(message: string): CloudSyncStatus {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("oturum süresi") ||
    lowerMessage.includes("oturum yenilenemedi")
  ) {
    return "authExpired";
  }

  if (lowerMessage.includes("oturum kontrolü geçici")) {
    return "connectionError";
  }

  if (isStaleRefreshTokenError(message) || isAuthLockError(message)) {
    return "authExpired";
  }

  if (isAuthFetchError(message)) {
    return "connectionError";
  }

  return "error";
}

function technicalDetail(message: string) {
  if (process.env.NODE_ENV !== "development" || !message) {
    return "";
  }

  return `Teknik detay: ${message}`;
}

function createErrorResult(message: string): CloudSyncResult {
  return {
    errorMessage: formatSyncError(message),
    ok: false,
    pulledDays: 0,
    pushedDays: 0,
    status: getSyncErrorStatus(message),
    technicalMessage: technicalDetail(message),
  };
}

async function getSignedInContext() {
  const status = getSupabaseConfigStatus();

  if (!status.configured) {
    return {
      errorMessage:
        status.invalidMessage || "Supabase bağlantısı yapılandırılmadı.",
      status: "error" as CloudSyncStatus,
      supabase: null,
      user: null,
    };
  }

  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return {
      errorMessage: "Supabase bağlantısı yapılandırılmadı.",
      status: "error" as CloudSyncStatus,
      supabase: null,
      user: null,
    };
  }

  const authState = await getCurrentUserSafe();

  if (authState.status === "notSignedIn") {
    return {
      errorMessage: "not-signed-in",
      status: "notSignedIn" as CloudSyncStatus,
      supabase: null,
      user: null,
    };
  }

  if (authState.status !== "ready" || !authState.user) {
    return {
      errorMessage:
        authState.errorMessage ||
        "Oturum kontrolü geçici olarak başarısız oldu. Lütfen tekrar deneyin.",
      status:
        authState.status === "authExpired"
          ? ("authExpired" as CloudSyncStatus)
          : authState.status === "connectionError"
            ? ("connectionError" as CloudSyncStatus)
            : ("error" as CloudSyncStatus),
      supabase: null,
      user: null,
    };
  }

  return {
    errorMessage: "",
    status: "ready" as CloudSyncStatus,
    supabase,
    user: authState.user,
  };
}

function createEmptyCloudDay(dayNumber: number): DayProgress {
  return {
    completedTasks: [],
    dailyNote: "",
    dayNumber,
    difficultPart: "",
    listenOutput: "",
    nextReviewNote: "",
    reviewAnswers: {},
    speakFirstTry: "",
    speakSecondTry: "",
    updatedAt: "",
    wordsOutput: "",
  };
}

function addCompletedTask(tasks: CompletedTask[], task: CompletedTask) {
  return tasks.includes(task) ? tasks : [...tasks, task];
}

function mergeDayProgressRow(
  days: Record<string, DayProgress>,
  row: DayProgressRow,
) {
  const key = String(row.day_number);
  const current = days[key] ?? createEmptyCloudDay(row.day_number);
  let completedTasks = current.completedTasks;

  if (row.listen_done) {
    completedTasks = addCompletedTask(completedTasks, "listen");
  }

  if (row.words_done) {
    completedTasks = addCompletedTask(completedTasks, "words");
  }

  if (row.speak_done) {
    completedTasks = addCompletedTask(completedTasks, "speak");
  }

  if (row.review_done) {
    completedTasks = addCompletedTask(completedTasks, "review");
  }

  days[key] = {
    ...current,
    completedTasks,
    updatedAt: getNewerIso(current.updatedAt, row.updated_at ?? ""),
  };
}

function mergePracticeEntryRow(
  days: Record<string, DayProgress>,
  row: PracticeEntryRow,
) {
  const key = String(row.day_number);
  const current = days[key] ?? createEmptyCloudDay(row.day_number);

  days[key] = {
    ...current,
    dailyNote: row.daily_note ?? "",
    difficultPart: row.difficult_part ?? "",
    listenOutput: row.listen_output ?? "",
    nextReviewNote: row.next_review_note ?? "",
    speakFirstTry: row.speak_first_try ?? "",
    speakSecondTry: row.speak_second_try ?? "",
    updatedAt: getNewerIso(current.updatedAt, row.updated_at ?? ""),
    wordsOutput: row.words_output ?? "",
  };
}

function mergeReviewAnswerRow(
  days: Record<string, DayProgress>,
  row: ReviewAnswerRow,
) {
  const key = String(row.day_number);
  const current = days[key] ?? createEmptyCloudDay(row.day_number);
  const checked = Boolean(row.checked_at);
  const answer: ReviewAnswerProgress = {
    answer: row.answer ?? "",
    checked,
    result: checked
      ? row.is_correct
        ? "correct"
        : "needsReview"
      : undefined,
  };

  days[key] = {
    ...current,
    reviewAnswers: {
      ...current.reviewAnswers,
      [String(row.item_index)]: answer,
    },
    updatedAt: getNewerIso(current.updatedAt, row.updated_at ?? ""),
  };
}

function toDayProgressRow(userId: string, day: DayProgress) {
  const updatedAt = getProgressUpdatedAt(day);

  return {
    completion_percent: getCompletionPercent(day.completedTasks),
    day_number: day.dayNumber,
    listen_done: day.completedTasks.includes("listen"),
    review_done: day.completedTasks.includes("review"),
    speak_done: day.completedTasks.includes("speak"),
    updated_at: updatedAt,
    user_id: userId,
    words_done: day.completedTasks.includes("words"),
  };
}

function toPracticeEntryRow(userId: string, day: DayProgress) {
  const updatedAt = getProgressUpdatedAt(day);

  return {
    daily_note: day.dailyNote,
    day_number: day.dayNumber,
    difficult_part: day.difficultPart,
    listen_output: day.listenOutput,
    next_review_note: day.nextReviewNote,
    speak_first_try: day.speakFirstTry,
    speak_second_try: day.speakSecondTry,
    updated_at: updatedAt,
    user_id: userId,
    words_output: day.wordsOutput,
  };
}

function toReviewAnswerRows(userId: string, day: DayProgress) {
  const updatedAt = getProgressUpdatedAt(day);

  return Object.entries(day.reviewAnswers)
    .map(([itemIndex, answer]) => ({
      answer,
      itemIndex: Number(itemIndex),
    }))
    .filter(({ itemIndex }) => Number.isFinite(itemIndex))
    .map(({ answer, itemIndex }) => ({
      answer: answer.answer,
      checked_at: answer.checked ? updatedAt : null,
      day_number: day.dayNumber,
      is_correct: answer.result ? answer.result === "correct" : null,
      item_index: itemIndex,
      updated_at: updatedAt,
      user_id: userId,
    }));
}

async function upsertUserStatus({
  activeDay,
  days,
  user,
}: {
  activeDay: number;
  days: Record<string, DayProgress>;
  user: User;
}) {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return "Supabase bağlantısı yapılandırılmadı.";
  }

  const now = new Date().toISOString();

  try {
    const result = await supabase.from("user_status").upsert(
      {
        active_day: activeDay,
        last_seen_at: now,
        total_completed_days: countCompletedDays(days),
        updated_at: now,
        user_id: user.id,
      },
      { onConflict: "user_id" },
    );

    return result.error?.message ?? "";
  } catch (error) {
    return getErrorMessage(error);
  }
}

async function pushDaysToCloud({
  activeDay,
  days,
  user,
}: {
  activeDay: number;
  days: Record<string, DayProgress>;
  user: User;
}) {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return "Supabase bağlantısı yapılandırılmadı.";
  }

  const dayList = Object.values(days);
  const dayProgressRows = dayList.map((day) =>
    toDayProgressRow(user.id, day),
  );
  const practiceRows = dayList.map((day) => toPracticeEntryRow(user.id, day));
  const reviewRows = dayList.flatMap((day) => toReviewAnswerRows(user.id, day));

  try {
    if (dayProgressRows.length > 0) {
      const result = await supabase
        .from("day_progress")
        .upsert(dayProgressRows, { onConflict: "user_id,day_number" });

      if (result.error) {
        return result.error.message;
      }
    }

    if (practiceRows.length > 0) {
      const result = await supabase
        .from("practice_entries")
        .upsert(practiceRows, { onConflict: "user_id,day_number" });

      if (result.error) {
        return result.error.message;
      }
    }

    if (reviewRows.length > 0) {
      const result = await supabase
        .from("review_answers")
        .upsert(reviewRows, {
          onConflict: "user_id,day_number,item_index",
        });

      if (result.error) {
        return result.error.message;
      }
    }
  } catch (error) {
    return getErrorMessage(error);
  }

  return upsertUserStatus({ activeDay, days: getAllDayProgress(), user });
}

export async function getCloudProgress(): Promise<
  | { ok: true; progress: CloudProgress }
  | { errorMessage: string; ok: false; status: CloudSyncStatus }
> {
  const context = await getSignedInContext();

  if (context.status === "notSignedIn") {
    return { errorMessage: "Giriş yapılmadı.", ok: false, status: "notSignedIn" };
  }

  if (!context.supabase || !context.user) {
    return {
      errorMessage: formatSyncError(context.errorMessage),
      ok: false,
      status: context.status,
    };
  }

  try {
    const [statusResult, dayResult, entryResult, reviewResult] =
      await Promise.all([
        context.supabase
          .from("user_status")
          .select("*")
          .eq("user_id", context.user.id)
          .maybeSingle(),
        context.supabase
          .from("day_progress")
          .select("*")
          .eq("user_id", context.user.id),
        context.supabase
          .from("practice_entries")
          .select("*")
          .eq("user_id", context.user.id),
        context.supabase
          .from("review_answers")
          .select("*")
          .eq("user_id", context.user.id),
      ]);

    const errors = [
      statusResult.error && statusResult.error.code !== "PGRST116"
        ? statusResult.error.message
        : "",
      dayResult.error?.message ?? "",
      entryResult.error?.message ?? "",
      reviewResult.error?.message ?? "",
    ].filter(Boolean);

    if (errors.length > 0) {
      return {
        errorMessage: formatSyncError(errors[0]),
        ok: false,
        status: getSyncErrorStatus(errors[0]),
      };
    }

    const days: Record<string, DayProgress> = {};

    (dayResult.data ?? []).forEach((row) => {
      mergeDayProgressRow(days, row);
    });
    (entryResult.data ?? []).forEach((row) => {
      mergePracticeEntryRow(days, row);
    });
    (reviewResult.data ?? []).forEach((row) => {
      mergeReviewAnswerRow(days, row);
    });

    const userStatus = statusResult.data as UserStatusRow | null;

    return {
      ok: true,
      progress: {
        activeDay: userStatus?.active_day ?? null,
        days,
        statusUpdatedAt: userStatus?.updated_at ?? "",
      },
    };
  } catch (error) {
    const message = getErrorMessage(error);

    return {
      errorMessage: formatSyncError(message),
      ok: false,
      status: getSyncErrorStatus(message),
    };
  }
}

export async function pushLocalProgressToCloud(
  activeDay: number,
): Promise<CloudSyncResult> {
  const context = await getSignedInContext();

  if (context.status === "notSignedIn") {
    return {
      errorMessage: "Cloud sync için giriş yapmalısın.",
      ok: false,
      pulledDays: 0,
      pushedDays: 0,
      status: "notSignedIn" as const,
    };
  }

  if (!context.user) {
    return createErrorResult(context.errorMessage);
  }

  const localDays = getAllDayProgress();
  const errorMessage = await pushDaysToCloud({
    activeDay,
    days: localDays,
    user: context.user,
  });

  if (errorMessage) {
    return createErrorResult(errorMessage);
  }

  const lastSyncAt = new Date().toISOString();
  setLastSyncAt(lastSyncAt);

  return {
    lastSyncAt,
    ok: true,
    pulledDays: 0,
    pushedDays: Object.keys(localDays).length,
    status: "synced" as const,
  };
}

export async function pullCloudProgressToLocal(): Promise<CloudSyncResult> {
  const cloudProgress = await getCloudProgress();

  if (!cloudProgress.ok) {
    return {
      errorMessage: cloudProgress.errorMessage,
      ok: false,
      pulledDays: 0,
      pushedDays: 0,
      status: cloudProgress.status,
    };
  }

  mergeDayProgressToLocal(cloudProgress.progress.days);
  setLocalActiveDay(cloudProgress.progress.activeDay);

  const lastSyncAt = new Date().toISOString();
  setLastSyncAt(lastSyncAt);

  return {
    activeDay: cloudProgress.progress.activeDay ?? undefined,
    lastSyncAt,
    ok: true,
    pulledDays: Object.keys(cloudProgress.progress.days).length,
    pushedDays: 0,
    status: "synced" as const,
  };
}

export async function syncCurrentUserProgress(
  activeDay: number,
): Promise<CloudSyncResult> {
  const context = await getSignedInContext();

  if (context.status === "notSignedIn") {
    return {
      errorMessage: "Cloud sync için giriş yapmalısın.",
      ok: false,
      pulledDays: 0,
      pushedDays: 0,
      status: "notSignedIn" as const,
    };
  }

  if (!context.user) {
    return createErrorResult(context.errorMessage);
  }

  const cloudProgress = await getCloudProgress();

  if (!cloudProgress.ok) {
    return {
      errorMessage: cloudProgress.errorMessage,
      ok: false,
      pulledDays: 0,
      pushedDays: 0,
      status: cloudProgress.status,
    };
  }

  const localDays = getAllDayProgress();
  const localLatestUpdatedAt = getLatestLocalUpdatedAt(localDays);
  const daysToPush: Record<string, DayProgress> = {};
  const daysToPull: Record<string, DayProgress> = {};
  const mergedDays: Record<string, DayProgress> = { ...localDays };
  const allDayKeys = new Set([
    ...Object.keys(localDays),
    ...Object.keys(cloudProgress.progress.days),
  ]);

  allDayKeys.forEach((key) => {
    const localDay = localDays[key];
    const cloudDay = cloudProgress.progress.days[key];

    if (localDay && !cloudDay) {
      daysToPush[key] = localDay;
      mergedDays[key] = localDay;
      return;
    }

    if (!localDay && cloudDay) {
      daysToPull[key] = cloudDay;
      mergedDays[key] = cloudDay;
      return;
    }

    if (!localDay || !cloudDay) {
      return;
    }

    if (getIsoTime(localDay.updatedAt) >= getIsoTime(cloudDay.updatedAt)) {
      daysToPush[key] = localDay;
      mergedDays[key] = localDay;
    } else {
      daysToPull[key] = cloudDay;
      mergedDays[key] = cloudDay;
    }
  });

  if (Object.keys(daysToPull).length > 0) {
    mergeDayProgressToLocal(daysToPull);
  }

  let restoredActiveDay: number | undefined;
  const cloudStatusIsNewer =
    cloudProgress.progress.activeDay &&
    getIsoTime(cloudProgress.progress.statusUpdatedAt) >
      getIsoTime(localLatestUpdatedAt);
  const syncActiveDay = cloudStatusIsNewer
    ? cloudProgress.progress.activeDay
    : activeDay;

  if (cloudStatusIsNewer) {
    restoredActiveDay = cloudProgress.progress.activeDay ?? undefined;
    setLocalActiveDay(restoredActiveDay ?? null);
  }

  const errorMessage = await pushDaysToCloud({
    activeDay: syncActiveDay ?? activeDay,
    days: daysToPush,
    user: context.user,
  });

  if (errorMessage) {
    return createErrorResult(errorMessage);
  }

  const statusError = await upsertUserStatus({
    activeDay: syncActiveDay ?? activeDay,
    days: mergedDays,
    user: context.user,
  });

  if (statusError) {
    return createErrorResult(statusError);
  }

  const lastSyncAt = new Date().toISOString();
  setLastSyncAt(lastSyncAt);

  return {
    activeDay: restoredActiveDay,
    lastSyncAt,
    ok: true,
    pulledDays: Object.keys(daysToPull).length,
    pushedDays: Object.keys(daysToPush).length,
    status: "synced" as const,
  };
}

export async function getCloudSyncStatus() {
  const context = await getSignedInContext();

  if (context.status === "notSignedIn") {
    return {
      lastSyncAt: getLastSyncAt(),
      status: "notSignedIn" as CloudSyncStatus,
    };
  }

  if (!context.user) {
    return {
      errorMessage: formatSyncError(context.errorMessage),
      lastSyncAt: getLastSyncAt(),
      status: context.status,
    };
  }

  return {
    lastSyncAt: getLastSyncAt(),
    status: getLastSyncAt() ? ("synced" as const) : ("ready" as const),
  };
}
