"use client";

import { useEffect, useState } from "react";
import {
  CompactSection,
  ExpandableCard,
  StatusPill,
  TaskStepper,
} from "@/components/ui";
import type { SpeakingPractice } from "@/lib/speaking-content";
import {
  getDayProgress,
  markDayTaskCompleted,
  saveDayProgress,
} from "@/lib/practice-storage";

const pilotRubricItems = [
  "Kopyalamadım: hedef çizgiyi aynen cevap yapmadım.",
  "Kişiselleştirdim: kendi hayatımdan en az bir detay ekledim.",
  "Geliştirdim: ikinci denemem ilkinden daha net.",
  "Tamamladım: fikrim yarım kalmadı.",
];

export function SpeakingPracticeView({
  practice,
}: {
  practice: SpeakingPractice;
}) {
  const [firstTry, setFirstTry] = useState("");
  const [secondTry, setSecondTry] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [isSpeakCompleted, setIsSpeakCompleted] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const progress = getDayProgress(practice.day);
      setFirstTry(progress.speakFirstTry);
      setSecondTry(progress.speakSecondTry);
      setIsSpeakCompleted(progress.completedTasks.includes("speak"));
      setSaveState("idle");
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [practice.day]);

  function toggleCheck(item: string) {
    setCheckedItems((current) =>
      current.includes(item)
        ? current.filter((currentItem) => currentItem !== item)
        : [...current, item],
    );
  }

  function updateFirstTry(value: string) {
    setFirstTry(value);
    setSaveState("idle");
    saveDayProgress(practice.day, { speakFirstTry: value });
  }

  function updateSecondTry(value: string) {
    setSecondTry(value);
    setSaveState("idle");
    saveDayProgress(practice.day, { speakSecondTry: value });
  }

  function saveSecondTry() {
    saveDayProgress(practice.day, {
      speakFirstTry: firstTry,
      speakSecondTry: secondTry,
    });
    markDayTaskCompleted(practice.day, "speak");
    setIsSpeakCompleted(true);
    setSaveState("saved");
  }

  const hasFirstTry = firstTry.trim().length > 0;
  const hasSecondTry = secondTry.trim().length > 0;
  const firstTryStepStatus = hasFirstTry ? "done" : "active";
  const secondTryStepStatus = hasSecondTry
    ? "done"
    : hasFirstTry
      ? "active"
      : "pending";
  const checkStepStatus = isSpeakCompleted && hasSecondTry
    ? "done"
    : hasSecondTry
      ? "active"
      : "pending";

  return (
    <div className="space-y-4">
      <section className="rounded-[1.55rem] border border-moss/15 bg-moss p-5 text-white shadow-soft sm:rounded-[1.75rem] sm:p-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage sm:text-sm">
            Bugünkü konuşma
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-balance">
            {practice.title}
          </h2>
          <p className="text-sm leading-6 text-sage/95">
            {practice.miniGoalTr}
          </p>
        </div>
      </section>

      <TaskStepper
        steps={[
          { label: "Prompt", status: hasFirstTry ? "done" : "active" },
          { label: "First try", status: firstTryStepStatus },
          { label: "Second try", status: secondTryStepStatus },
          { label: "Check", status: checkStepStatus },
        ]}
      />

      <ExpandableCard
        eyebrow="Ne yapacaksın?"
        title="Kısa konuşma rehberi"
        description="Ana görev görünür kalır; detaylı yönlendirmeyi ihtiyaç duyunca aç."
      >
        <p className="text-sm font-semibold leading-6 text-muted">
          {practice.speakingTipsTr}
        </p>
      </ExpandableCard>

      <CompactSection
        eyebrow="Speaking prompt"
        title="Answer out loud first"
        action={
          <StatusPill status="active">
            Day {practice.day}
          </StatusPill>
        }
      >
        <p className="rounded-[1.25rem] bg-background/85 p-4 text-[1.03rem] font-semibold leading-8 text-foreground">
          {practice.prompt}
        </p>
      </CompactSection>

      <CompactSection
        eyebrow="First try"
        title="İlk cevabını yakala"
        description="Önce sesli cevap ver. Sonra hatırladığın cevabı buraya kısa not olarak yaz."
      >
        <label
          htmlFor="first-try"
          className="sr-only"
        >
          First try
        </label>
        <textarea
          id="first-try"
          value={firstTry}
          onChange={(event) => updateFirstTry(event.target.value)}
          rows={5}
          placeholder="Example: I have a busy day. First, I need coffee."
          className="w-full resize-none rounded-[1.4rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
        />
      </CompactSection>

      <CompactSection
        eyebrow="Second try better"
        title="Daha net ikinci deneme"
        description="İkinci deneme ilkinden daha net olmalı."
      >
        <label
          htmlFor="second-try"
          className="sr-only"
        >
          Second try better
        </label>
        <p className="mb-3 rounded-[1.15rem] bg-linen px-3 py-2 text-sm font-semibold leading-6 text-[#2d261d]">
          Şimdi aynı cevabı daha düzenli yaz. Bir cümle daha net olsun, bir
          hedef çizgiyi kullanmaya çalış.
        </p>
        <textarea
          id="second-try"
          value={secondTry}
          onChange={(event) => updateSecondTry(event.target.value)}
          rows={5}
          placeholder="Example: I have a busy day, but I want to start slowly."
          className="w-full resize-none rounded-[1.4rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
        />
        <button
          type="button"
          onClick={saveSecondTry}
          disabled={secondTry.trim().length === 0}
          className="mt-4 min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
        >
          İkinci denemeyi kaydet
        </button>
        {saveState === "saved" ? (
          <p className="mt-4 rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            Denemelerin bu cihazda kaydedildi.
          </p>
        ) : null}
      </CompactSection>

      <ExpandableCard
        eyebrow="Pilot rubric"
        title="1-3 self-rating"
        description="Dürüst kontrol için kısa pilot rubriği."
      >
        <p className="text-sm font-semibold leading-6 text-muted">
          1 = tekrar dene, 2 = bugün için yeterli, 3 = güçlü cevap. Puan yerine
          dürüst kontrol yap; amaç ikinci denemeyi gerçekten iyileştirmek.
        </p>
        <div className="mt-3 grid gap-2">
          {pilotRubricItems.map((item) => (
            <div
              key={item}
              className="rounded-[1.1rem] border border-foreground/10 bg-background/85 px-3 py-2.5 text-sm font-semibold leading-6 text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard
        eyebrow="Target lines"
        title="Konuşmanda kullanabileceğin çizgiler"
        description="Kopyalama; birini kendi cevabına uyarlamaya çalış."
      >
        <div className="grid gap-2">
          {practice.targetLines.map((line, index) => (
            <div
              key={line}
              className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-3"
            >
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-sage text-sm font-black text-moss">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm font-semibold leading-6 text-foreground">
                  {line}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard
        eyebrow="Self-check"
        title="Konuşmadan sonra kontrol et"
        description="İkinci denemeyi daha net yapmak için kısa işaretler."
      >
        <p className="text-sm font-semibold leading-6 text-muted">
          Konuşmadan sonra hızlıca kontrol et. Bunlar puan değil; daha net ikinci
          deneme için küçük işaretler.
        </p>
        <div className="mt-3 grid gap-2">
          {practice.selfCheckItems.map((item) => {
            const isChecked = checkedItems.includes(item);

            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleCheck(item)}
                aria-pressed={isChecked}
                className={`flex min-h-12 items-start gap-3 rounded-[1.15rem] border p-3 text-left text-sm font-semibold leading-6 outline-none transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface ${
                  isChecked
                    ? "border-moss/30 bg-sage text-foreground"
                    : "border-foreground/10 bg-background/85 text-muted hover:border-moss/25 hover:text-foreground"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
                    isChecked
                      ? "border-moss bg-moss text-white"
                      : "border-muted/40 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </ExpandableCard>
    </div>
  );
}
