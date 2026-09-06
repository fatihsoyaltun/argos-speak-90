"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  ExpandableCard,
  Feedback,
  StatusPill,
  TaskStepper,
} from "@/components/ui";
import {
  TtsAudioAction,
  TtsAudioScope,
  TtsAudioStatus,
} from "@/components/tts-audio-scope";
import { VoiceRecorder } from "@/components/voice-recorder";
import type { SpeakingPractice } from "@/lib/speaking-content";
import {
  getDayProgress,
  markDayTaskCompleted,
  saveDayProgress,
} from "@/lib/practice-storage";

type SpeakStep = "prompt" | "answer" | "review" | "complete";

const textareaClassName =
  "w-full resize-none rounded-[1.4rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30";

function resolveInitialStep(
  firstTry: string,
  secondTry: string,
  isSpeakCompleted: boolean,
): SpeakStep {
  if (isSpeakCompleted && secondTry.trim()) {
    return "complete";
  }
  if (secondTry.trim()) {
    return "review";
  }
  if (firstTry.trim()) {
    return "review";
  }
  return "prompt";
}

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
  const [step, setStep] = useState<SpeakStep>("prompt");

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const progress = getDayProgress(practice.day);
      const nextFirst = progress.speakFirstTry;
      const nextSecond = progress.speakSecondTry;
      const completed = progress.completedTasks.includes("speak");
      setFirstTry(nextFirst);
      setSecondTry(nextSecond);
      setIsSpeakCompleted(completed);
      setSaveState(completed ? "saved" : "idle");
      setCheckedItems([]);
      setStep(resolveInitialStep(nextFirst, nextSecond, completed));
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

  function saveAndComplete() {
    saveDayProgress(practice.day, {
      speakFirstTry: firstTry,
      speakSecondTry: secondTry,
    });
    markDayTaskCompleted(practice.day, "speak");
    setIsSpeakCompleted(true);
    setSaveState("saved");
    setStep("complete");
  }

  const hasFirstTry = firstTry.trim().length > 0;
  const hasSecondTry = secondTry.trim().length > 0;

  const stepperSteps = [
    {
      label: "Prompt",
      status:
        step === "prompt"
          ? ("active" as const)
          : ("done" as const),
    },
    {
      label: "Cevap",
      status:
        step === "answer"
          ? ("active" as const)
          : hasFirstTry || step === "review" || step === "complete"
            ? ("done" as const)
            : ("pending" as const),
    },
    {
      label: "Gözden geçir",
      status:
        step === "review"
          ? ("active" as const)
          : hasSecondTry || step === "complete"
            ? ("done" as const)
            : ("pending" as const),
    },
    {
      label: "Tamamla",
      status:
        step === "complete" || isSpeakCompleted
          ? ("done" as const)
          : step === "review" && hasSecondTry
            ? ("active" as const)
            : ("pending" as const),
    },
  ];

  return (
    <TtsAudioScope day={practice.day} scope="learning-content">
      <div className="space-y-4" data-speak-flow={step}>
        <Card className="space-y-3 border-moss/25 !bg-moss !text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage sm:text-sm">
                Speak · Day {practice.day}
              </p>
              <h2 className="text-2xl font-semibold leading-tight text-balance text-white">
                {practice.title}
              </h2>
              <p className="text-sm leading-6 text-sage/95">
                {practice.miniGoalTr}
              </p>
            </div>
            <StatusPill
              status={isSpeakCompleted ? "done" : "active"}
              className="shrink-0 border-surface/30 bg-surface/15 text-white"
            >
              {isSpeakCompleted ? "Tamam" : "Aktif"}
            </StatusPill>
          </div>
        </Card>

        <TaskStepper steps={stepperSteps} />

        {step === "prompt" ? (
          <section
            aria-label="Speak prompt"
            className="space-y-4 rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
            data-speak-primary="prompt"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                Prompt
              </p>
              <h3 className="text-xl font-semibold leading-tight">
                Dinle, sonra sesli cevap ver
              </h3>
              <p className="text-sm font-semibold leading-6 text-muted">
                Önce promptu dinle. Bir anda yalnız bu adım açık.
              </p>
            </div>
            <p className="rounded-[1.25rem] bg-background/85 p-4 text-[1.03rem] font-semibold leading-8 text-foreground">
              {practice.prompt}
            </p>
            <TtsAudioAction
              id={`speak-prompt-${practice.day}`}
              text={practice.prompt}
              idleAriaLabel="Konuşma promptunu dinle"
              idleLabel="Dinle"
              className="min-h-12 w-full text-base sm:w-auto sm:min-w-[12rem]"
            />
            <TtsAudioStatus />
            <Button
              type="button"
              onClick={() => setStep("answer")}
              className="w-full sm:w-auto"
            >
              Cevaba geç
            </Button>
          </section>
        ) : null}

        {step === "answer" ? (
          <section
            aria-label="Speak first try"
            className="space-y-4 rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
            data-speak-primary="answer"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                First try
              </p>
              <h3 className="text-xl font-semibold leading-tight">
                Tek cevap / kayıt alanı
              </h3>
              <p className="text-sm font-semibold leading-6 text-muted">
                Sesli söyle, isteğe bağlı kaydet, sonra kısa not yaz. Kayıt
                desteklenmiyorsa metinle devam et.
              </p>
            </div>
            <VoiceRecorder label="First try ses kaydı" />
            <label htmlFor="first-try" className="sr-only">
              First try
            </label>
            <textarea
              id="first-try"
              value={firstTry}
              onChange={(event) => updateFirstTry(event.target.value)}
              rows={5}
              placeholder="Example: I have a busy day. First, I need coffee."
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
                onClick={() => setStep("review")}
                disabled={!hasFirstTry}
                className="w-full sm:w-auto"
              >
                Gözden geçirmeye geç
              </Button>
            </div>
          </section>
        ) : null}

        {step === "review" ? (
          <section
            aria-label="Speak second try"
            className="space-y-4 rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
            data-speak-primary="review"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                Second try
              </p>
              <h3 className="text-xl font-semibold leading-tight">
                Geri dinle ve daha net söyle
              </h3>
              <p className="text-sm font-semibold leading-6 text-muted">
                İkinci deneme ilkinden daha net olmalı. AI skor veya model cevap
                yok.
              </p>
            </div>
            {hasFirstTry ? (
              <div className="rounded-[1.15rem] bg-linen px-3 py-2 text-sm font-semibold leading-6 text-[#2d261d]">
                İlk deneme: {firstTry}
              </div>
            ) : null}
            <VoiceRecorder label="Second try ses kaydı" />
            <label htmlFor="second-try" className="sr-only">
              Second try better
            </label>
            <textarea
              id="second-try"
              value={secondTry}
              onChange={(event) => updateSecondTry(event.target.value)}
              rows={5}
              placeholder="Example: I have a busy day, but I want to start slowly."
              className={textareaClassName}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep("answer")}
                className="w-full sm:w-auto"
              >
                İlk denemeye dön
              </Button>
              <Button
                type="button"
                onClick={saveAndComplete}
                disabled={!hasSecondTry}
                className="w-full sm:w-auto"
              >
                Tamamla
              </Button>
            </div>
          </section>
        ) : null}

        {step === "complete" ? (
          <section
            aria-label="Speak complete"
            className="space-y-4 rounded-[1.45rem] border border-moss/20 bg-sage/40 p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
            data-speak-primary="complete"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                Tamamlandı
              </p>
              <h3 className="text-xl font-semibold leading-tight">
                Konuşma kaydedildi
              </h3>
            </div>
            <Feedback tone="success">
              Denemelerin bu cihazda kaydedildi. Ses kaydı yalnızca bu oturumda
              tutulur; buluta yüklenmez.
            </Feedback>
            {hasSecondTry ? (
              <div className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-4 text-sm font-semibold leading-6 text-foreground">
                {secondTry}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep("review")}
                className="w-full sm:w-auto"
              >
                İkinci denemeyi düzenle
              </Button>
            </div>
          </section>
        ) : null}

        <ExpandableCard
          eyebrow="Yardım"
          title="İpuçları ve hedef çizgiler"
          description="Ana akış tek alanda kalır; detayları ihtiyaç duyunca aç."
        >
          <p className="text-sm font-semibold leading-6 text-muted">
            {practice.speakingTipsTr}
          </p>
          <div className="mt-3 grid gap-2">
            {practice.targetLines.map((line, index) => (
              <div
                key={line}
                className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-sage text-sm font-black text-moss">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="pt-0.5 text-sm font-semibold leading-6 text-foreground">
                      {line}
                    </p>
                    <TtsAudioAction
                      id={`speak-target-${practice.day}-${index}`}
                      text={line}
                      idleAriaLabel={`Hedef cümle ${index + 1} sesini dinle`}
                      variant="ghost"
                      className="mt-2 px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ExpandableCard>

        {(step === "review" || step === "complete") && (
          <ExpandableCard
            eyebrow="Self-check"
            title="Kısa dürüst kontrol"
            description="Puan değil; ikinci denemeyi netleştirmek için işaretler."
          >
            <div className="grid gap-2">
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
        )}

        {saveState === "saved" && step !== "complete" ? (
          <Feedback tone="success">Autosave: metin cevapların korunuyor.</Feedback>
        ) : null}
      </div>
    </TtsAudioScope>
  );
}
