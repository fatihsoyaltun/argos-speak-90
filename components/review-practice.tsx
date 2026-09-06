"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  ExpandableCard,
  Feedback,
  ProgressStrip,
  StatusPill,
  TaskStepper,
} from "@/components/ui";
import {
  TtsAudioAction,
  TtsAudioScope,
  TtsAudioStatus,
} from "@/components/tts-audio-scope";
import type { ReviewDrill } from "@/lib/review-content";
import {
  getDayProgress,
  saveDayProgress,
  type CompletedTask,
  type ReviewAnswerProgress,
} from "@/lib/practice-storage";

type CheckResult = "correct" | "needsReview";
type ReviewStep = "prompt" | "answer" | "review" | "complete";

const reviewTypeLabels = {
  recall: "Recall",
  fillBlank: "Fill blank",
  shortAnswer: "Short answer",
};

const productionSelfCheckItems = [
  "Kendi detayımı ekledim mi?",
  "Bir sebep, örnek veya next step verdim mi?",
  "Hedef çizgiyi aynen kopyalamaktan kaçındım mı?",
  "Fikri tamamladım mı?",
];

const textareaClassName =
  "mt-2 w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30";

function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ");
}

function isCorrect(userAnswer: string, expectedAnswer: string) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedExpectedAnswer = normalizeAnswer(expectedAnswer);

  return (
    normalizedUserAnswer === normalizedExpectedAnswer ||
    normalizedUserAnswer.includes(normalizedExpectedAnswer)
  );
}

function withCompletedTask(
  completedTasks: CompletedTask[],
  task: CompletedTask,
) {
  return completedTasks.includes(task)
    ? completedTasks
    : [...completedTasks, task];
}

function firstOpenIndex(
  itemCount: number,
  results: Record<number, CheckResult>,
) {
  for (let index = 0; index < itemCount; index += 1) {
    if (!results[index]) {
      return index;
    }
  }
  return Math.max(0, itemCount - 1);
}

export function ReviewPractice({ drill }: { drill: ReviewDrill }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, CheckResult>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState<ReviewStep>("prompt");

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const progress = getDayProgress(drill.day);
      const nextAnswers: Record<number, string> = {};
      const nextResults: Record<number, CheckResult> = {};

      Object.entries(progress.reviewAnswers).forEach(([key, value]) => {
        const index = Number(key);

        if (!Number.isFinite(index)) {
          return;
        }

        nextAnswers[index] = value.answer;

        if (value.checked && value.result) {
          nextResults[index] = value.result;
        }
      });

      setAnswers(nextAnswers);
      setResults(nextResults);

      const allChecked =
        drill.reviewItems.length > 0 &&
        drill.reviewItems.every((_, index) => Boolean(nextResults[index]));

      if (allChecked) {
        setActiveIndex(0);
        setStep("complete");
        return;
      }

      const openIndex = firstOpenIndex(drill.reviewItems.length, nextResults);
      setActiveIndex(openIndex);
      setStep(nextAnswers[openIndex]?.trim() ? "answer" : "prompt");
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [drill.day, drill.reviewItems]);

  const checkedCount = Object.keys(results).length;
  const correctCount = useMemo(
    () => Object.values(results).filter((result) => result === "correct").length,
    [results],
  );
  const item = drill.reviewItems[activeIndex];
  const answer = answers[activeIndex] ?? "";
  const result = results[activeIndex];
  const isAnswerEmpty = answer.trim().length === 0;
  const isChecked = Boolean(result);
  const allChecked =
    drill.reviewItems.length > 0 &&
    checkedCount === drill.reviewItems.length;

  function updateAnswer(value: string) {
    const index = activeIndex;
    setAnswers((current) => ({ ...current, [index]: value }));
    setResults((current) => {
      const next = { ...current };
      delete next[index];
      return next;
    });

    const progress = getDayProgress(drill.day);
    const nextReviewAnswers: Record<string, ReviewAnswerProgress> = {
      ...progress.reviewAnswers,
      [String(index)]: {
        answer: value,
        checked: false,
        expectedAnswer: progress.reviewAnswers[String(index)]?.expectedAnswer,
      },
    };

    saveDayProgress(drill.day, {
      reviewAnswers: nextReviewAnswers,
      completedTasks: progress.completedTasks.filter(
        (task) => task !== "review",
      ),
    });
  }

  function checkAnswer() {
    if (!item) {
      return;
    }

    const index = activeIndex;
    const currentAnswer = answers[index] ?? "";
    const nextResult = isCorrect(currentAnswer, item.expectedAnswer)
      ? "correct"
      : "needsReview";

    setResults((current) => ({
      ...current,
      [index]: nextResult,
    }));

    const progress = getDayProgress(drill.day);
    const nextReviewAnswers: Record<string, ReviewAnswerProgress> = {
      ...progress.reviewAnswers,
      [String(index)]: {
        answer: currentAnswer,
        checked: true,
        result: nextResult,
        expectedAnswer: item.expectedAnswer,
      },
    };
    const checkedReviewCount = drill.reviewItems.filter((_, itemIndex) => {
      return nextReviewAnswers[String(itemIndex)]?.checked;
    }).length;
    const completedTasks =
      checkedReviewCount === drill.reviewItems.length
        ? withCompletedTask(progress.completedTasks, "review")
        : progress.completedTasks;

    saveDayProgress(drill.day, {
      reviewAnswers: nextReviewAnswers,
      completedTasks,
    });
    setStep("review");
  }

  function goToItem(index: number) {
    setActiveIndex(index);
    if (results[index]) {
      setStep("review");
      return;
    }
    setStep(answers[index]?.trim() ? "answer" : "prompt");
  }

  function goNextAfterReview() {
    const merged: Record<number, CheckResult> = { ...results };
    if (result) {
      merged[activeIndex] = result;
    }

    const remaining = drill.reviewItems.findIndex(
      (_, index) => !merged[index],
    );

    if (remaining === -1) {
      setStep("complete");
      return;
    }

    goToItem(remaining);
  }

  if (!item) {
    return null;
  }

  const flowStepStatuses = [
    {
      label: "Prompt",
      status:
        step === "prompt"
          ? ("active" as const)
          : step === "complete" || isChecked || step === "answer" || step === "review"
            ? ("done" as const)
            : ("pending" as const),
    },
    {
      label: "Cevap",
      status:
        step === "answer"
          ? ("active" as const)
          : isChecked || step === "review" || step === "complete"
            ? ("done" as const)
            : ("pending" as const),
    },
    {
      label: "Kontrol",
      status:
        step === "review"
          ? ("active" as const)
          : isChecked || step === "complete"
            ? ("done" as const)
            : ("pending" as const),
    },
    {
      label: "Tamamla",
      status:
        step === "complete" || allChecked
          ? ("done" as const)
          : ("pending" as const),
    },
  ];

  return (
    <TtsAudioScope day={drill.day} scope="learning-content">
      <div className="space-y-4" data-review-flow={step}>
        <Card className="space-y-3 border-moss/25 !bg-moss !text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage sm:text-sm">
                Review · Day {drill.day}
              </p>
              <h2 className="text-2xl font-semibold leading-tight text-balance text-white">
                {drill.title}
              </h2>
              <p className="text-sm leading-6 text-sage/95">{drill.shortIntroTr}</p>
            </div>
            <StatusPill
              status={allChecked ? "done" : "active"}
              className="shrink-0 border-surface/30 bg-surface/15 text-white"
            >
              {checkedCount}/{drill.reviewItems.length}
            </StatusPill>
          </div>
        </Card>

        <ProgressStrip
          items={[
            {
              label: `${checkedCount}/${drill.reviewItems.length} checked`,
              status: allChecked ? "done" : "active",
            },
            {
              label: `${correctCount} correct`,
              status: correctCount > 0 ? "synced" : "pending",
            },
            {
              label: `${drill.reviewItems.length - checkedCount} left`,
              status: allChecked ? "done" : "pending",
            },
          ]}
        />

        <TaskStepper steps={flowStepStatuses} />
        <TtsAudioStatus />

        {step !== "complete" ? (
          <section
            aria-label={`Review task ${activeIndex + 1}`}
            className="space-y-4 rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
            data-review-primary={step}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                  Task {activeIndex + 1} / {drill.reviewItems.length}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold leading-7">
                  {item.prompt}
                </h3>
              </div>
              <StatusPill status="active">
                {reviewTypeLabels[item.type]}
              </StatusPill>
            </div>

            {(step === "prompt" || step === "answer" || step === "review") && (
              <TtsAudioAction
                id={`review-prompt-${drill.day}-${activeIndex}`}
                text={item.prompt}
                idleAriaLabel={`Review görevi ${activeIndex + 1} promptunu dinle`}
                idleLabel="Dinle"
                className="min-h-12 w-full text-base sm:w-auto sm:min-w-[12rem]"
              />
            )}

            {step === "prompt" ? (
              <Button
                type="button"
                onClick={() => setStep("answer")}
                className="w-full sm:w-auto"
              >
                Cevaba geç
              </Button>
            ) : null}

            {step === "answer" ? (
              <>
                <label
                  htmlFor={`review-answer-${activeIndex}`}
                  className="block text-xs font-bold uppercase tracking-[0.16em] text-muted"
                >
                  Cevabın
                </label>
                <textarea
                  id={`review-answer-${activeIndex}`}
                  value={answer}
                  onChange={(event) => updateAnswer(event.target.value)}
                  rows={4}
                  placeholder="Write your answer in English."
                  className={textareaClassName}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep("prompt")}
                    className="w-full sm:w-auto"
                  >
                    Prompta dön
                  </Button>
                  <Button
                    type="button"
                    onClick={checkAnswer}
                    disabled={isAnswerEmpty}
                    className="w-full sm:w-auto"
                  >
                    Kontrol et
                  </Button>
                </div>
              </>
            ) : null}

            {step === "review" ? (
              <>
                <div className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-4 text-sm font-semibold leading-6 text-foreground">
                  Senin cevabın: {answer || "—"}
                </div>
                {result === "correct" ? (
                  <Feedback tone="success">
                    Doğru. Bu cümleyi bir kez daha sesli tekrar et. AI skor yok.
                  </Feedback>
                ) : null}
                {result === "needsReview" ? (
                  <div className="rounded-[1.15rem] border border-clay/25 bg-linen/70 p-3 text-sm leading-6 text-foreground">
                    {item.type === "shortAnswer" ? (
                      <>
                        <p className="font-bold">Kendi kontrolün:</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 font-semibold">
                          {productionSelfCheckItems.map((checkItem) => (
                            <li key={checkItem}>{checkItem}</li>
                          ))}
                        </ul>
                        <p className="mt-3 text-sm font-semibold text-muted">
                          Model cevap veya AI puanı yok. İstersen cevabı
                          düzenleyip yeniden kontrol edebilirsin.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold">Tekrar bak (hedef ifade):</p>
                        <p className="mt-1 font-semibold">{item.expectedAnswer}</p>
                        <TtsAudioAction
                          id={`review-answer-${drill.day}-${activeIndex}`}
                          text={item.expectedAnswer}
                          idleAriaLabel={`Review görevi ${activeIndex + 1} hedef ifadeyi dinle`}
                          variant="ghost"
                          className="mt-2 px-3.5 py-2 text-xs"
                        />
                      </>
                    )}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep("answer")}
                    className="w-full sm:w-auto"
                  >
                    Cevabı düzenle
                  </Button>
                  <Button
                    type="button"
                    onClick={goNextAfterReview}
                    className="w-full sm:w-auto"
                  >
                    {allChecked ||
                    checkedCount + (isChecked ? 0 : 1) >=
                      drill.reviewItems.length
                      ? "Tamamla"
                      : "Sonraki görev"}
                  </Button>
                </div>
              </>
            ) : null}
          </section>
        ) : (
          <section
            aria-label="Review complete"
            className="space-y-4 rounded-[1.55rem] border border-moss/15 bg-moss p-5 text-white shadow-soft sm:rounded-[1.75rem] sm:p-6"
            data-review-primary="complete"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-linen sm:text-sm">
              Review summary
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-[1.15rem] bg-white/10 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-linen">
                  Checked
                </p>
                <p className="mt-1 text-3xl font-semibold">{checkedCount}</p>
              </div>
              <div className="rounded-[1.15rem] bg-white/10 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-linen">
                  Correct
                </p>
                <p className="mt-1 text-3xl font-semibold">{correctCount}</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium leading-6 text-white/90">
              Yanlış çıkan cümleyi kısa tut ve bir kez daha yüksek sesle söyle.
              AI skor veya model cevap yok.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => goToItem(0)}
              className="mt-2 w-full border-surface/30 bg-surface/15 text-white hover:bg-surface/25 focus-visible:ring-offset-moss sm:w-auto"
            >
              İlk göreve dön
            </Button>
          </section>
        )}

        <ExpandableCard
          eyebrow="Production self-check"
          title="Açık cevapları nasıl kontrol edeceksin?"
          description="Otomatik AI puanı yok. Kısa dürüst kontrol listesi."
        >
          <div className="grid gap-2">
            {productionSelfCheckItems.map((checkItem) => (
              <p
                key={checkItem}
                className="rounded-[1rem] bg-linen px-3 py-2 text-sm font-semibold leading-5 text-[#2d261d]"
              >
                {checkItem}
              </p>
            ))}
          </div>
        </ExpandableCard>
      </div>
    </TtsAudioScope>
  );
}
