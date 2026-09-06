"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DayNavigator, useActiveDay } from "@/components/active-day";
import {
  ButtonLink,
  Card,
  Feedback,
  PageHeader,
  StatusPill,
  type CompactStatus,
} from "@/components/ui";
import { learningTrackPlan } from "@/lib/content-plan";
import {
  countTrackedCompletions,
  dailyTasks,
  getNextDailyTask,
  hasJournalNotes,
  isTrackedTaskComplete,
  trackedDailyTasks,
} from "@/lib/daily-tasks";
import {
  getDayProgress,
  PRACTICE_PROGRESS_UPDATED_EVENT,
  type DayProgress,
} from "@/lib/practice-storage";

const TOTAL_DAYS = 90;

function taskListStatus(
  progress: DayProgress,
  taskId: (typeof dailyTasks)[number]["id"],
): CompactStatus {
  const task = dailyTasks.find((item) => item.id === taskId);

  if (!task) {
    return "pending";
  }

  if (task.completionKey) {
    return isTrackedTaskComplete(progress.completedTasks, task)
      ? "done"
      : "pending";
  }

  return hasJournalNotes(progress) ? "done" : "pending";
}

export default function TodayPage() {
  const { activeDay } = useActiveDay();
  const [progress, setProgress] = useState<DayProgress | null>(null);
  const dayIndex = activeDay - 1;
  const plan = learningTrackPlan[dayIndex] ?? learningTrackPlan[0];

  useEffect(() => {
    function refreshProgress() {
      setProgress(getDayProgress(activeDay));
    }

    refreshProgress();
    window.addEventListener(PRACTICE_PROGRESS_UPDATED_EVENT, refreshProgress);
    window.addEventListener("storage", refreshProgress);

    return () => {
      window.removeEventListener(
        PRACTICE_PROGRESS_UPDATED_EVENT,
        refreshProgress,
      );
      window.removeEventListener("storage", refreshProgress);
    };
  }, [activeDay]);

  const completedTasks = progress?.completedTasks ?? [];
  const trackedDone = countTrackedCompletions(completedTasks);
  const trackedTotal = trackedDailyTasks.length;
  const nextTask = getNextDailyTask(completedTasks);
  const progressRatio = trackedDone / trackedTotal;
  const dayProgress = progress ?? {
    dayNumber: activeDay,
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

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Gün ${activeDay} / ${TOTAL_DAYS}`}
        title={plan.theme}
        description={plan.speakingGoal}
      />

      <DayNavigator />

      <Card className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
              Günlük ilerleme
            </p>
            <p className="mt-1 text-lg font-semibold leading-tight">
              {trackedDone}/{trackedTotal} görev
            </p>
          </div>
          <StatusPill status={trackedDone === trackedTotal ? "done" : "active"}>
            {Math.round(progressRatio * 100)}%
          </StatusPill>
        </div>
        <div
          aria-hidden="true"
          className="h-2.5 overflow-hidden rounded-full bg-linen"
        >
          <div
            className="h-full rounded-full bg-moss transition-[width] motion-reduce:transition-none"
            style={{
              width: `${Math.max(0, Math.min(100, progressRatio * 100))}%`,
            }}
          />
        </div>
      </Card>

      {nextTask ? (
        <Card className="space-y-4 border-moss/25 bg-accent-soft">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
              Sıradaki
            </p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight">
              {nextTask.label}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-text-secondary">
              {nextTask.description} · yaklaşık {nextTask.time}
            </p>
          </div>
          <ButtonLink
            href={nextTask.href}
            variant="primary"
            className="w-full sm:w-auto"
          >
            {nextTask.label} ile devam et
          </ButtonLink>
        </Card>
      ) : (
        <Feedback tone="success">
          <div className="space-y-3">
            <p className="text-base font-semibold leading-6">
              Bugünün dört görevi tamam. Sakin bir mola verebilir veya Journal /
              İlerleme’ye bakabilirsin.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink
                href="/practice"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Pratik merkezine git
              </ButtonLink>
              <ButtonLink
                href="/stats"
                variant="ghost"
                className="w-full sm:w-auto"
              >
                İlerlemeyi gör
              </ButtonLink>
            </div>
          </div>
        </Feedback>
      )}

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
              Bugünün görevleri
            </p>
            <h2 className="mt-1 text-xl font-semibold leading-tight">
              Kompakt kontrol listesi
            </h2>
          </div>
          <p className="shrink-0 rounded-full bg-sage px-3 py-1.5 text-sm font-black text-moss">
            {trackedDone}/{trackedTotal}
          </p>
        </div>

        <ul className="grid gap-2" aria-label="Günlük görev listesi">
          {dailyTasks.map((task) => {
            const status = taskListStatus(dayProgress, task.id);
            const isNext = nextTask?.id === task.id;
            const statusLabel =
              status === "done"
                ? "Tamam"
                : isNext
                  ? "Sırada"
                  : task.completionKey
                    ? "Bekliyor"
                    : hasJournalNotes(dayProgress)
                      ? "Not var"
                      : "İsteğe bağlı";

            return (
              <li key={task.id}>
                <Link
                  href={task.href}
                  className={`flex min-h-11 items-center gap-3 rounded-[1.25rem] border px-3 py-2.5 outline-none transition focus-visible:ring-[3px] focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                    isNext
                      ? "border-moss bg-accent-soft text-text-primary"
                      : status === "done"
                        ? "border-moss/30 bg-surface text-text-primary"
                        : "border-border-subtle bg-surface text-text-primary hover:border-moss hover:bg-linen"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      status === "done"
                        ? "bg-action-primary text-action-primary-text"
                        : isNext
                          ? "bg-moss text-white"
                          : "bg-linen text-moss"
                    }`}
                  >
                    {status === "done" ? "✓" : task.label.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black leading-none">
                      {task.label}
                    </span>
                    <span className="mt-1 block truncate text-xs font-semibold text-text-secondary">
                      {task.time} · {statusLabel}
                    </span>
                  </span>
                  <span
                    className={`inline-flex min-h-8 shrink-0 items-center justify-center rounded-full border px-3 py-1.5 text-xs font-black leading-none ${
                      status === "done"
                        ? "border-moss bg-[#17201a] text-white"
                        : isNext
                          ? "border-moss bg-sage text-[#17201a]"
                          : "border-foreground/15 bg-surface text-[#3f493f]"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
