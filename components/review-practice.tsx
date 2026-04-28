"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReviewDrill } from "@/lib/review-content";
import {
  getDayProgress,
  saveDayProgress,
  type CompletedTask,
  type ReviewAnswerProgress,
} from "@/lib/practice-storage";

type CheckResult = "correct" | "needsReview";

const reviewTypeLabels = {
  recall: "Recall",
  fillBlank: "Fill blank",
  shortAnswer: "Short answer",
};

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

export function ReviewPractice({ drill }: { drill: ReviewDrill }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, CheckResult>>({});

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
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [drill.day]);

  const checkedCount = Object.keys(results).length;
  const correctCount = useMemo(
    () => Object.values(results).filter((result) => result === "correct").length,
    [results],
  );

  function updateAnswer(index: number, value: string) {
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

  function checkAnswer(index: number, expectedAnswer: string) {
    const answer = answers[index] ?? "";
    const result = isCorrect(answer, expectedAnswer)
      ? "correct"
      : "needsReview";

    setResults((current) => ({
      ...current,
      [index]: result,
    }));

    const progress = getDayProgress(drill.day);
    const nextReviewAnswers: Record<string, ReviewAnswerProgress> = {
      ...progress.reviewAnswers,
      [String(index)]: {
        answer,
        checked: true,
        result,
        expectedAnswer,
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
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
          Ne yapacaksın?
        </p>
        <p className="mt-3 text-base leading-7 text-muted">
          {drill.shortIntroTr}
        </p>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
            Active recall
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Hatırlayıp yaz
          </h2>
        </div>

        <div className="grid gap-3">
          {drill.reviewItems.map((item, index) => {
            const result = results[index];
            const answer = answers[index] ?? "";
            const isAnswerEmpty = answer.trim().length === 0;

            return (
              <article
                key={`${item.type}-${item.prompt}`}
                className="rounded-[1.6rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                      Task {index + 1}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-7">
                      {item.prompt}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-linen px-3 py-1.5 text-xs font-black text-moss">
                    {reviewTypeLabels[item.type]}
                  </span>
                </div>

                <label
                  htmlFor={`review-answer-${index}`}
                  className="mt-5 block text-xs font-bold uppercase tracking-[0.16em] text-muted"
                >
                  Cevabın
                </label>
                <textarea
                  id={`review-answer-${index}`}
                  value={answer}
                  onChange={(event) => updateAnswer(index, event.target.value)}
                  rows={3}
                  placeholder="Write your answer in English."
                  className="mt-2 w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
                />

                <button
                  type="button"
                  onClick={() => checkAnswer(index, item.expectedAnswer)}
                  disabled={isAnswerEmpty}
                  className="mt-4 min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
                >
                  Kontrol et
                </button>

                {result === "correct" ? (
                  <div className="mt-4 rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
                    Doğru. Bu cümleyi bir kez daha sesli tekrar et.
                  </div>
                ) : null}

                {result === "needsReview" ? (
                  <div className="mt-4 rounded-[1.25rem] border border-clay/25 bg-linen/70 p-4 text-sm leading-6 text-foreground">
                    <p className="font-bold">Tekrar bak:</p>
                    <p className="mt-1 font-semibold">{item.expectedAnswer}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-moss/15 bg-moss p-5 text-white shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-linen sm:text-sm">
          Review summary
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[1.25rem] bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-linen">
              Checked
            </p>
            <p className="mt-1 text-3xl font-semibold">{checkedCount}</p>
          </div>
          <div className="rounded-[1.25rem] bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-linen">
              Correct
            </p>
            <p className="mt-1 text-3xl font-semibold">{correctCount}</p>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium leading-6 text-white/90">
          Yanlış çıkan cümleyi kısa tut ve bir kez daha yüksek sesle söyle.
        </p>
      </section>
    </div>
  );
}
