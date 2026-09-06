"use client";

import { useEffect, useState } from "react";
import { useActiveDay } from "@/components/active-day";
import {
  ButtonLink,
  Card,
  PageHeader,
  StatusPill,
} from "@/components/ui";
import {
  dailyTasks,
  hasJournalNotes,
  isTrackedTaskComplete,
} from "@/lib/daily-tasks";
import {
  getDayProgress,
  PRACTICE_PROGRESS_UPDATED_EVENT,
  type DayProgress,
} from "@/lib/practice-storage";

export default function PracticePage() {
  const { activeDay } = useActiveDay();
  const [progress, setProgress] = useState<DayProgress | null>(null);

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
        eyebrow="Pratik"
        title="Günlük çalışma alanları"
        description={`Gün ${activeDay}: Listen, Words, Speak, Review ve Journal arasından istediğin göreve geç.`}
      />

      <div className="grid gap-2 sm:grid-cols-2">
        {dailyTasks.map((area) => {
          const isComplete = area.completionKey
            ? isTrackedTaskComplete(dayProgress.completedTasks, area)
            : hasJournalNotes(dayProgress);
          const statusLabel = area.completionKey
            ? isComplete
              ? "Tamam"
              : "Açık"
            : isComplete
              ? "Not var"
              : "İsteğe bağlı";

          return (
            <Card
              key={area.href}
              className="flex flex-col gap-3 !rounded-[1.35rem] !p-4 sm:!p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold leading-tight sm:text-xl">
                      {area.label}
                    </h2>
                    <StatusPill status={isComplete ? "done" : "pending"}>
                      {statusLabel}
                    </StatusPill>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-text-secondary">
                    {area.description}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-clay">
                    yaklaşık {area.time}
                  </p>
                </div>
              </div>
              <ButtonLink
                href={area.href}
                variant={isComplete ? "secondary" : "soft"}
                className="w-full"
              >
                {area.label} bölümünü aç
              </ButtonLink>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
