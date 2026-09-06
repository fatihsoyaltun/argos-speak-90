import type { CompletedTask, DayProgress } from "@/lib/practice-storage";

export type DayProgressSummary = {
  dayNumber: number;
  trackedCompleted: number;
  trackedTotal: number;
  hasJournal: boolean;
};

const TRACKED_TASKS: CompletedTask[] = ["listen", "words", "speak", "review"];
const DEFAULT_RECENT_WINDOW = 7;

function countTracked(completedTasks: CompletedTask[] | undefined) {
  const set = new Set(completedTasks ?? []);
  return TRACKED_TASKS.filter((task) => set.has(task)).length;
}

function journalPresent(
  progress: Pick<DayProgress, "dailyNote" | "difficultPart" | "nextReviewNote">,
) {
  return Boolean(
    progress.dailyNote.trim() ||
      progress.difficultPart.trim() ||
      progress.nextReviewNote.trim(),
  );
}

function emptyDayFields(dayNumber: number): Pick<
  DayProgress,
  | "dayNumber"
  | "completedTasks"
  | "dailyNote"
  | "difficultPart"
  | "nextReviewNote"
> {
  return {
    dayNumber,
    completedTasks: [],
    dailyNote: "",
    difficultPart: "",
    nextReviewNote: "",
  };
}

/** Last N program days ending at activeDay (clamped to 1..90). */
export function getRecentDaySummaries(
  activeDay: number,
  days: Record<
    string,
    Pick<
      DayProgress,
      | "completedTasks"
      | "dailyNote"
      | "difficultPart"
      | "nextReviewNote"
    >
  >,
  windowSize = DEFAULT_RECENT_WINDOW,
): DayProgressSummary[] {
  const end = Math.min(90, Math.max(1, Math.round(activeDay)));
  const size = Math.min(
    DEFAULT_RECENT_WINDOW,
    Math.max(1, Math.round(windowSize)),
  );
  const start = Math.max(1, end - size + 1);
  const trackedTotal = TRACKED_TASKS.length;
  const summaries: DayProgressSummary[] = [];

  for (let dayNumber = start; dayNumber <= end; dayNumber += 1) {
    const day = days[String(dayNumber)] ?? emptyDayFields(dayNumber);
    summaries.push({
      dayNumber,
      trackedCompleted: countTracked(day.completedTasks),
      trackedTotal,
      hasJournal: journalPresent(day),
    });
  }

  return summaries;
}

export function countCompletedDeviceLabModules(
  modules: Record<string, { completedAt?: string | null }>,
) {
  return Object.values(modules).filter(
    (module) =>
      typeof module?.completedAt === "string" &&
      module.completedAt.trim().length > 0,
  ).length;
}

export function summarizeActiveDayProgress(
  progress: Pick<
    DayProgress,
    "completedTasks" | "dailyNote" | "difficultPart" | "nextReviewNote"
  >,
) {
  return {
    trackedCompleted: countTracked(progress.completedTasks),
    trackedTotal: TRACKED_TASKS.length,
    hasJournal: journalPresent(progress),
  };
}
