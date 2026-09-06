"use client";

import { useEffect, useMemo, useState } from "react";
import { DayNavigator, useActiveDay } from "@/components/active-day";
import {
  Button,
  ExpandableCard,
  Feedback,
  PageHeader,
  ProgressStrip,
  StatusPill,
} from "@/components/ui";
import { hasJournalNotes } from "@/lib/daily-tasks";
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

const textareaClassName =
  "mt-2 w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30";

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
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [confirmed, setConfirmed] = useState(false);
  const dayIndex = activeDay - 1;
  const listening = listeningDrills[dayIndex] ?? listeningDrills[0];
  const words = dayWords[dayIndex] ?? dayWords[0];
  const speaking = speakingPractices[dayIndex] ?? speakingPractices[0];
  const review = reviewDrills[dayIndex] ?? reviewDrills[0];

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const next = getDayProgress(activeDay);
      setProgress(next);
      setSaveState(hasJournalNotes(next) ? "saved" : "idle");
      setConfirmed(false);
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
    setSaveState("saving");
    setConfirmed(false);
    const nextProgress = saveDayProgress(activeDay, { [field]: value });
    setProgress(nextProgress);
    setSaveState("saved");
  }

  function confirmComplete() {
    if (!progress) {
      return;
    }
    const nextProgress = saveDayProgress(activeDay, {
      dailyNote: progress.dailyNote,
      difficultPart: progress.difficultPart,
      nextReviewNote: progress.nextReviewNote,
    });
    setProgress(nextProgress);
    setSaveState("saved");
    setConfirmed(true);
  }

  const completedTasks = progress?.completedTasks ?? [];
  const primaryNote = progress?.dailyNote ?? "";
  const hasNotes = progress ? hasJournalNotes(progress) : false;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={`Journal · Day ${activeDay}`}
        title="Kısa günlük notu"
        description="Tek prompt, tek kısa not, autosave. Önceki kayıtlar isteğe bağlı özet olarak açılır."
      />

      <DayNavigator />

      <section
        aria-label="Journal primary note"
        className="space-y-4 rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
        data-journal-primary="note"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Bugünün notu
            </p>
            <h2 className="text-xl font-semibold leading-tight">
              Bugün ne iyi gitti?
            </h2>
            <p className="text-sm font-semibold leading-6 text-muted">
              Son kayıt: {formatUpdatedAt(progress?.updatedAt ?? "")}
            </p>
          </div>
          <StatusPill status={hasNotes ? "done" : "active"}>
            {saveState === "saving"
              ? "Kaydediliyor"
              : saveState === "saved"
                ? "Autosave"
                : "Hazır"}
          </StatusPill>
        </div>

        <ProgressStrip
          items={taskOrder.map((task) => ({
            label: taskLabels[task],
            status: completedTasks.includes(task) ? "done" : "pending",
          }))}
        />

        <label className="block" htmlFor="journal-daily-note">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Kısa not
          </span>
          <textarea
            id="journal-daily-note"
            value={primaryNote}
            onChange={(event) =>
              updateJournalField("dailyNote", event.target.value)
            }
            rows={4}
            placeholder="Bugün ne iyi gitti?"
            className={textareaClassName}
          />
        </label>

        <Button
          type="button"
          onClick={confirmComplete}
          disabled={!primaryNote.trim()}
          className="w-full sm:w-auto"
        >
          Tamamla
        </Button>

        {confirmed ? (
          <Feedback tone="success">
            Notun bu cihazda kaydedildi. Journal tamamlandı sayılır (yerel not;
            completedTasks anahtarı değişmez).
          </Feedback>
        ) : saveState === "saved" && hasNotes ? (
          <Feedback tone="info">Autosave açık — yazdığın metin korunuyor.</Feedback>
        ) : null}
      </section>

      <ExpandableCard
        eyebrow="Ek notlar"
        title="Zorlandığım ve yarın tekrar"
        description="Ana not tek alanda kalır; ek alanlar isteğe bağlıdır. Eski metinler korunur."
      >
        <div className="grid gap-3">
          <label className="block" htmlFor="journal-difficult">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Bugün zorlandığım şey
            </span>
            <textarea
              id="journal-difficult"
              value={progress?.difficultPart ?? ""}
              onChange={(event) =>
                updateJournalField("difficultPart", event.target.value)
              }
              rows={3}
              placeholder="Örneğin: geçmiş zaman cümlesini kurmak zor geldi."
              className={textareaClassName}
            />
          </label>

          <label className="block" htmlFor="journal-next">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Yarın tekrar etmem gereken şey
            </span>
            <textarea
              id="journal-next"
              value={progress?.nextReviewNote ?? ""}
              onChange={(event) =>
                updateJournalField("nextReviewNote", event.target.value)
              }
              rows={3}
              placeholder="Örneğin: hedef cümleleri bir kez daha sesli tekrar et."
              className={textareaClassName}
            />
          </label>
        </div>
      </ExpandableCard>

      <ExpandableCard
        eyebrow="Önceki kayıtlar"
        title="Bugünkü yazılı pratik özeti"
        description="Listen, Words, Speak ve Review cevaplarını arşiv olarak aç."
      >
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
          {checkedReviewAnswers.length > 0 ? (
            checkedReviewAnswers.map(([index, answer]) => {
              const reviewItem = review.reviewItems[Number(index)];

              return (
                <div
                  key={index}
                  className="rounded-[1.3rem] border border-foreground/10 bg-background/85 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
                    Review · Task {Number(index) + 1}
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
                        : answer.expectedAnswer
                          ? `Tekrar: ${answer.expectedAnswer}`
                          : "Tekrar bak"}
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
      </ExpandableCard>
    </div>
  );
}
