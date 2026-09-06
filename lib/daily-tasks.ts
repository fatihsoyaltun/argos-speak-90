import type { CompletedTask, DayProgress } from "@/lib/practice-storage";

export type DailyTaskId = CompletedTask | "journal";

export type DailyTaskDefinition = {
  id: DailyTaskId;
  label: string;
  href: string;
  time: string;
  description: string;
  /** Existing completedTasks key; journal is not part of that array. */
  completionKey: CompletedTask | null;
};

/** Canonical daily order for Today CTA + compact checklist + Practice hub. */
export const dailyTasks: DailyTaskDefinition[] = [
  {
    id: "listen",
    label: "Listen",
    href: "/listen",
    time: "3 dk",
    description: "Günün İngilizce metnini dinle.",
    completionKey: "listen",
  },
  {
    id: "words",
    label: "Words",
    href: "/words",
    time: "2 dk",
    description: "Kelimeleri örnekleriyle çalış.",
    completionKey: "words",
  },
  {
    id: "speak",
    label: "Speak",
    href: "/speak",
    time: "3 dk",
    description: "Kısa konuşma denemeleri yap.",
    completionKey: "speak",
  },
  {
    id: "review",
    label: "Review",
    href: "/review",
    time: "1 dk",
    description: "Günün içeriğini kısa kontrol et.",
    completionKey: "review",
  },
  {
    id: "journal",
    label: "Journal",
    href: "/journal",
    time: "1 dk",
    description: "Kısa not bırak ve kayıtları gör.",
    completionKey: null,
  },
];

export const trackedDailyTasks = dailyTasks.filter(
  (task): task is DailyTaskDefinition & { completionKey: CompletedTask } =>
    task.completionKey !== null,
);

export function isTrackedTaskComplete(
  completedTasks: CompletedTask[],
  task: DailyTaskDefinition,
) {
  if (!task.completionKey) {
    return false;
  }

  return completedTasks.includes(task.completionKey);
}

/** Journal is UI-only “has notes”; it is not a completedTasks key. */
export function hasJournalNotes(progress: Pick<
  DayProgress,
  "dailyNote" | "difficultPart" | "nextReviewNote"
>) {
  return Boolean(
    progress.dailyNote.trim() ||
      progress.difficultPart.trim() ||
      progress.nextReviewNote.trim(),
  );
}

export function getNextDailyTask(completedTasks: CompletedTask[]) {
  return (
    trackedDailyTasks.find(
      (task) => !completedTasks.includes(task.completionKey),
    ) ?? null
  );
}

export function countTrackedCompletions(completedTasks: CompletedTask[]) {
  return trackedDailyTasks.filter((task) =>
    completedTasks.includes(task.completionKey),
  ).length;
}
