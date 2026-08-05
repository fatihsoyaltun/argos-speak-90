"use client";

import { useEffect, useId, useState } from "react";
import type { DeviceSlug } from "@/lib/device-lab";
import {
  createEmptyDeviceLabPractice,
  getDeviceLabPractice,
  resetDeviceLabPractice,
  saveDeviceLabPractice,
  type DeviceLabLocalPractice,
  type DeviceLabPracticePatch,
} from "@/lib/device-lab/local-practice";

type DeviceLabPracticePanelProps = {
  deviceSlug: DeviceSlug;
  moduleId: string;
  moduleTitle: string;
  firstTryInstruction: string;
  secondTryInstruction: string;
  reviewInstruction: string;
  journalInstruction: string;
};

type SaveState = "loading" | "idle" | "saved" | "unavailable" | "reset";

type PracticeTextField =
  | "firstTryAnswer"
  | "secondTryAnswer"
  | "reviewAnswer"
  | "journalNote";

function formatLocalTime(value?: string) {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return null;
  }
}

function PracticeField({
  description,
  disabled,
  id,
  label,
  onChange,
  placeholder,
  value,
}: {
  description: string;
  disabled: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label htmlFor={id} className="block rounded-[1.2rem] bg-background/80 p-3.5">
      <span className="text-sm font-black leading-5 text-foreground">{label}</span>
      <span className="mt-1 block text-xs font-semibold leading-5 text-muted">
        {description}
      </span>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        rows={4}
        placeholder={placeholder}
        className="mt-3 w-full resize-y rounded-[1.1rem] border border-foreground/15 bg-surface p-3.5 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/65 focus:border-clay focus:ring-2 focus:ring-clay/30 disabled:cursor-wait disabled:opacity-60"
      />
    </label>
  );
}

export function DeviceLabPracticePanel({
  deviceSlug,
  moduleId,
  moduleTitle,
  firstTryInstruction,
  secondTryInstruction,
  reviewInstruction,
  journalInstruction,
}: DeviceLabPracticePanelProps) {
  const fieldId = useId();
  const [practice, setPractice] = useState<DeviceLabLocalPractice>(() =>
    createEmptyDeviceLabPractice(deviceSlug, moduleId),
  );
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const result = getDeviceLabPractice(deviceSlug, moduleId);
      setPractice(result.practice);
      setSaveState(result.storageAvailable ? "idle" : "unavailable");
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [deviceSlug, moduleId]);

  function persist(patch: DeviceLabPracticePatch) {
    const result = saveDeviceLabPractice(deviceSlug, moduleId, {
      firstTryAnswer: practice.firstTryAnswer,
      secondTryAnswer: practice.secondTryAnswer,
      reviewAnswer: practice.reviewAnswer,
      journalNote: practice.journalNote,
      reviewedAt: practice.reviewedAt,
      completedAt: practice.completedAt,
      ...patch,
    });
    setPractice(result.practice);
    setSaveState(result.saved ? "saved" : "unavailable");
  }

  function updateTextField(field: PracticeTextField, value: string) {
    persist({ [field]: value });
  }

  function markReviewed() {
    persist({ reviewedAt: new Date().toISOString() });
  }

  function markCompleted() {
    persist({ completedAt: new Date().toISOString() });
  }

  function resetModule() {
    const didReset = resetDeviceLabPractice(deviceSlug, moduleId);
    setPractice(createEmptyDeviceLabPractice(deviceSlug, moduleId));
    setSaveState(didReset ? "reset" : "unavailable");
    setIsResetConfirming(false);
  }

  const isLoading = saveState === "loading";
  const reviewedTime = formatLocalTime(practice.reviewedAt);
  const completedTime = formatLocalTime(practice.completedAt);
  const updatedTime = formatLocalTime(practice.updatedAt);
  const statusMessage =
    saveState === "loading"
      ? "Yerel kayıt yükleniyor…"
      : saveState === "saved"
        ? "Yerel kayıt güncellendi."
        : saveState === "reset"
          ? "Bu modülün yerel kaydı sıfırlandı."
          : saveState === "unavailable"
            ? "Yerel kayıt kullanılamıyor. Yazdıkların bu oturumda görünür, ancak yenilemede korunmayabilir."
            : updatedTime
              ? `Kaydedildi · ${updatedTime}`
              : "Henüz yerel kayıt yok.";

  return (
    <section
      aria-labelledby={`${fieldId}-title`}
      className="rounded-[1.45rem] border border-moss/20 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
    >
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
          Local practice
        </p>
        <h2
          id={`${fieldId}-title`}
          className="text-xl font-semibold leading-tight text-foreground"
        >
          Yerel pratik alanı
        </h2>
        <p className="text-sm font-semibold leading-6 text-muted">
          {moduleTitle} için cevaplarını yargılama veya puanlama olmadan sakla.
        </p>
      </div>

      <p className="mt-4 rounded-[1.15rem] border border-clay/20 bg-linen p-3 text-sm font-bold leading-6 text-[#2d261d]">
        Bu kayıt sadece bu tarayıcıda tutulur.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-foreground/10 bg-background/80 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Okuma / dinleme metni
          </p>
          <p className="mt-1 text-sm font-black text-foreground">
            {reviewedTime ? "Gözden geçirildi" : "Henüz işaretlenmedi"}
          </p>
          {reviewedTime ? (
            <p className="mt-1 text-xs font-semibold text-muted">{reviewedTime}</p>
          ) : null}
        </div>
        <div className="rounded-[1.15rem] border border-foreground/10 bg-background/80 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Modül durumu
          </p>
          <p className="mt-1 text-sm font-black text-foreground">
            {completedTime ? "Yerel tamamlandı" : "Devam ediyor"}
          </p>
          {completedTime ? (
            <p className="mt-1 text-xs font-semibold text-muted">{completedTime}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={markReviewed}
          disabled={isLoading || Boolean(practice.reviewedAt)}
          className="min-h-11 rounded-full border border-moss/30 bg-sage px-4 py-3 text-sm font-black text-moss outline-none transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
        >
          {practice.reviewedAt ? "Metin gözden geçirildi" : "Metni gözden geçirdim"}
        </button>
        <button
          type="button"
          onClick={markCompleted}
          disabled={isLoading || Boolean(practice.completedAt)}
          className="min-h-11 rounded-full bg-[#17201a] px-4 py-3 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
        >
          {practice.completedAt ? "Yerel tamamlandı" : "Modülü tamamlandı olarak işaretle"}
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <PracticeField
          disabled={isLoading}
          id={`${fieldId}-first-try`}
          label="İlk deneme cevabı"
          description={firstTryInstruction}
          placeholder="İlk denemenden kısa notlar yaz."
          value={practice.firstTryAnswer}
          onChange={(value) => updateTextField("firstTryAnswer", value)}
        />
        <PracticeField
          disabled={isLoading}
          id={`${fieldId}-second-try`}
          label="İkinci deneme cevabı"
          description={secondTryInstruction}
          placeholder="İkinci denemendeki değişiklikleri yaz."
          value={practice.secondTryAnswer}
          onChange={(value) => updateTextField("secondTryAnswer", value)}
        />
        <PracticeField
          disabled={isLoading}
          id={`${fieldId}-review`}
          label="Tekrar cevabı"
          description={reviewInstruction}
          placeholder="Tekrar görevine verdiğin cevabı yaz."
          value={practice.reviewAnswer}
          onChange={(value) => updateTextField("reviewAnswer", value)}
        />
        <PracticeField
          disabled={isLoading}
          id={`${fieldId}-journal`}
          label="Journal notu"
          description={journalInstruction}
          placeholder="Bu modülden sonra hatırlamak istediğin notu yaz."
          value={practice.journalNote}
          onChange={(value) => updateTextField("journalNote", value)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-foreground/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          aria-live="polite"
          className={`text-sm font-semibold leading-6 ${
            saveState === "unavailable" ? "text-[#6f2f23]" : "text-muted"
          }`}
        >
          {statusMessage}
        </p>
        {isResetConfirming ? (
          <div className="rounded-[1.15rem] border border-clay/25 bg-[#fff8f4] p-3 sm:max-w-sm">
            <p className="text-sm font-bold leading-5 text-[#6f2f23]">
              Yalnızca bu modülün yerel cevapları ve durum işaretleri silinsin mi?
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={resetModule}
                className="min-h-11 rounded-full bg-[#6f2f23] px-4 py-3 text-sm font-black text-white outline-none transition hover:brightness-95 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
              >
                Evet, bu modülü sıfırla
              </button>
              <button
                type="button"
                onClick={() => setIsResetConfirming(false)}
                className="min-h-11 rounded-full border border-foreground/15 bg-surface px-4 py-3 text-sm font-black text-foreground outline-none transition hover:bg-linen active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
              >
                Vazgeç
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsResetConfirming(true)}
            disabled={isLoading}
            className="min-h-11 rounded-full border border-clay/30 bg-[#fff8f4] px-4 py-3 text-sm font-black text-[#6f2f23] outline-none transition hover:bg-[#f5e4de] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Bu modülü sıfırla
          </button>
        )}
      </div>
    </section>
  );
}
