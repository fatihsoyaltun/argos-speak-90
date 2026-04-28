"use client";

import { useEffect, useMemo, useState } from "react";
import { DayNavigator, useActiveDay } from "@/components/active-day";
import { Card, PageHeader } from "@/components/ui";
import { listeningDrills } from "@/lib/listening-content";
import {
  getDayProgress,
  saveDayProgress,
  type CompletedTask,
  type DayProgress,
} from "@/lib/practice-storage";
import { reviewDrills } from "@/lib/review-content";
import { speakingPractices } from "@/lib/speaking-content";
import { dayWords } from "@/lib/words-content";

const taskLabels: Record<CompletedTask, string> = {
  listen: "Listen",
  words: "Words",
  speak: "Speak",
  review: "Review",
};

const taskOrder: CompletedTask[] = ["listen", "words", "speak", "review"];

function formatUpdatedAt(value: string) {
  if (!value) {
    return "Henüz kayıt yok";
  }

  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Kayıt zamanı okunamadı";
  }
}

function SavedTextBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.3rem] border border-foreground/10 bg-background/85 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-foreground">
        {value.trim() || "Henüz yazılmadı."}
      </p>
    </div>
  );
}

export default function JournalPage() {
  const { activeDay } = useActiveDay();
  const [progress, setProgress] = useState<DayProgress | null>(null);
  const dayIndex = activeDay - 1;
  const listening = listeningDrills[dayIndex] ?? listeningDrills[0];
  const words = dayWords[dayIndex] ?? dayWords[0];
  const speaking = speakingPractices[dayIndex] ?? speakingPractices[0];
  const review = reviewDrills[dayIndex] ?? reviewDrills[0];

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setProgress(getDayProgress(activeDay));
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [activeDay]);

  const checkedReviewAnswers = useMemo(() => {
    if (!progress) {
      return [];
    }

    return Object.entries(progress.reviewAnswers)
      .sort(([firstIndex], [secondIndex]) => Number(firstIndex) - Number(secondIndex))
      .filter(([, answer]) => answer.answer.trim().length > 0);
  }, [progress]);

  function updateJournalField(
    field: "dailyNote" | "difficultPart" | "nextReviewNote",
    value: string,
  ) {
    const nextProgress = saveDayProgress(activeDay, { [field]: value });
    setProgress(nextProgress);
  }

  const completedTasks = progress?.completedTasks ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={`Journal · Day ${activeDay}`}
        title="Practice journal"
        description="Bu sayfa aynı cihazdaki yazılı pratiklerini, kontrol cevaplarını ve günlük notlarını toplar."
      />

      <DayNavigator />

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Current day
            </p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight">
              Day {activeDay} saved work
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-sage px-3 py-1.5 text-xs font-black text-moss">
            {completedTasks.length}/4
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          {taskOrder.map((task) => {
            const isComplete = completedTasks.includes(task);

            return (
              <span
                key={task}
                className={`rounded-full px-3 py-2 text-center text-xs font-black ${
                  isComplete
                    ? "bg-moss text-white"
                    : "bg-linen text-[#4c453b]"
                }`}
              >
                {taskLabels[task]}
              </span>
            );
          })}
        </div>

        <p className="text-sm font-semibold leading-6 text-muted">
          Son kayıt: {formatUpdatedAt(progress?.updatedAt ?? "")}
        </p>
      </Card>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
            Saved answers
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Bugünkü yazılı pratik
          </h2>
        </div>

        <div className="grid gap-3">
          <SavedTextBlock
            label={listening.title}
            value={progress?.listenOutput ?? ""}
          />
          <SavedTextBlock
            label={`Words · ${words.title}`}
            value={progress?.wordsOutput ?? ""}
          />
          <SavedTextBlock
            label={`Speak first try · ${speaking.title}`}
            value={progress?.speakFirstTry ?? ""}
          />
          <SavedTextBlock
            label="Speak second try"
            value={progress?.speakSecondTry ?? ""}
          />
        </div>
      </section>

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Review answers
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Kontrol ettiğin cevaplar
          </h2>
        </div>

        <div className="grid gap-3">
          {checkedReviewAnswers.length > 0 ? (
            checkedReviewAnswers.map(([index, answer]) => {
              const reviewItem = review.reviewItems[Number(index)];

              return (
                <div
                  key={index}
                  className="rounded-[1.3rem] border border-foreground/10 bg-background/85 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
                    Task {Number(index) + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                    {reviewItem?.prompt ?? "Review prompt"}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm font-semibold leading-6 text-foreground">
                    {answer.answer}
                  </p>
                  {answer.checked ? (
                    <p
                      className={`mt-3 rounded-full px-3 py-2 text-xs font-black ${
                        answer.result === "correct"
                          ? "bg-sage text-moss"
                          : "bg-linen text-[#4c2d1d]"
                      }`}
                    >
                      {answer.result === "correct"
                        ? "Doğru"
                        : `Tekrar: ${answer.expectedAnswer ?? ""}`}
                    </p>
                  ) : null}
                </div>
              );
            })
          ) : (
            <p className="rounded-[1.3rem] bg-background/85 p-4 text-sm font-semibold leading-6 text-muted">
              Bu gün için henüz review cevabı kaydedilmedi.
            </p>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Daily notes
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Yarın için küçük notlar
          </h2>
        </div>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Bugünün kısa notu
          </span>
          <textarea
            value={progress?.dailyNote ?? ""}
            onChange={(event) =>
              updateJournalField("dailyNote", event.target.value)
            }
            rows={3}
            placeholder="Bugün ne iyi gitti?"
            className="mt-2 w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Bugün zorlandığım şey
          </span>
          <textarea
            value={progress?.difficultPart ?? ""}
            onChange={(event) =>
              updateJournalField("difficultPart", event.target.value)
            }
            rows={3}
            placeholder="Örneğin: geçmiş zaman cümlesini kurmak zor geldi."
            className="mt-2 w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Yarın tekrar etmem gereken şey
          </span>
          <textarea
            value={progress?.nextReviewNote ?? ""}
            onChange={(event) =>
              updateJournalField("nextReviewNote", event.target.value)
            }
            rows={3}
            placeholder="Örneğin: hedef cümleleri bir kez daha sesli tekrar et."
            className="mt-2 w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
          />
        </label>
      </Card>
    </div>
  );
}
