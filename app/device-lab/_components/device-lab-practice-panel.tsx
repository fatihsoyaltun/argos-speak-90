"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui";
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
  noteInstruction: string;
};

type SaveState = "loading" | "idle" | "saved" | "unavailable" | "reset";

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

export function DeviceLabPracticePanel({
  deviceSlug,
  moduleId,
  moduleTitle,
  noteInstruction,
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
    const result = saveDeviceLabPractice(deviceSlug, moduleId, patch);
    setPractice(result.practice);
    setSaveState(result.saved ? "saved" : "unavailable");
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
            ? "Yerel kayıt kullanılamıyor. Notun bu oturumda görünür, ancak yenilemede korunmayabilir."
            : updatedTime
              ? `Kaydedildi · ${updatedTime}`
              : "İsteğe bağlı not alanı boş.";

  return (
    <section
      aria-labelledby={`${fieldId}-title`}
      className="rounded-[1.45rem] border border-moss/20 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
    >
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
          Yerel pratik
        </p>
        <h2
          id={`${fieldId}-title`}
          className="text-xl font-semibold leading-tight text-foreground"
        >
          Kısa not ve tamamlanma
        </h2>
        <p className="text-sm font-semibold leading-6 text-muted">
          {moduleTitle} için istersen tek bir not bırak ve modülü tamamla.
        </p>
      </div>

      <p className="mt-4 rounded-[1.15rem] border border-clay/20 bg-linen p-3 text-sm font-bold leading-6 text-[#2d261d]">
        Bu kayıt sadece bu tarayıcıda tutulur; buluta gönderilmez ve puanlanmaz.
      </p>

      <div className="mt-4 rounded-[1.15rem] border border-foreground/10 bg-background/80 p-3">
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

      <label
        htmlFor={`${fieldId}-practice-note`}
        className="mt-4 block rounded-[1.2rem] bg-background/80 p-3.5"
      >
        <span className="text-sm font-black leading-5 text-foreground">
          İsteğe bağlı pratik notu
        </span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-muted">
          {noteInstruction}
        </span>
        <textarea
          id={`${fieldId}-practice-note`}
          value={practice.practiceNote}
          onChange={(event) => persist({ practiceNote: event.target.value })}
          disabled={isLoading}
          rows={5}
          placeholder="Hatırlamak istediğin kısa notu yaz."
          className="mt-3 w-full resize-y rounded-[1.1rem] border border-foreground/15 bg-surface p-3.5 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/65 focus:border-clay focus:ring-2 focus:ring-clay/30 disabled:cursor-wait disabled:opacity-60"
        />
      </label>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          onClick={markCompleted}
          disabled={isLoading || Boolean(practice.completedAt)}
        >
          {practice.completedAt ? "Yerel tamamlandı" : "Modülü tamamla"}
        </Button>
        {isResetConfirming ? (
          <>
            <Button variant="danger" onClick={resetModule}>
              Evet, bu modülü sıfırla
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsResetConfirming(false)}
            >
              Vazgeç
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setIsResetConfirming(true)}
            disabled={isLoading}
          >
            Bu modülü sıfırla
          </Button>
        )}
      </div>

      {isResetConfirming ? (
        <p className="mt-3 rounded-[1.15rem] border border-danger/25 bg-danger-soft p-3 text-sm font-bold leading-5 text-danger">
          Yalnızca bu modülün yerel notu ve tamamlanma işareti silinecek.
        </p>
      ) : null}

      <p
        aria-live="polite"
        className={`mt-4 text-sm font-semibold leading-6 ${
          saveState === "unavailable" ? "text-danger" : "text-muted"
        }`}
      >
        {statusMessage}
      </p>
    </section>
  );
}
