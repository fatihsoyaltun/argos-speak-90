"use client";

import { useEffect, useState } from "react";
import { useActiveDay } from "@/components/active-day";
import { Card, PageHeader } from "@/components/ui";
import { getTtsServiceStatus } from "@/lib/tts/client";
import { clearAppLocalStorage } from "@/lib/local-storage-keys";

type AudioStatus = "checking" | "configured" | "notConfigured";

export default function SettingsPage() {
  const { activeDay, setActiveDay, clearActiveDayStorage } = useActiveDay();
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function checkAudioStatus() {
      const status = await getTtsServiceStatus().catch(() => ({
        configured: false,
      }));

      if (!isActive) {
        return;
      }

      setAudioStatus(status.configured ? "configured" : "notConfigured");
    }

    checkAudioStatus();

    return () => {
      isActive = false;
    };
  }, []);

  function resetActiveDay() {
    setActiveDay(1);
    setMessage("Aktif gün 1. güne alındı.");
  }

  function clearLocalProgress() {
    try {
      clearAppLocalStorage(window.localStorage);
    } catch {
      // The active day state is still reset in memory below.
    }

    clearActiveDayStorage();
    setMessage("Bu tarayıcıdaki Argos ilerleme verileri temizlendi.");
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Settings"
        title="Local practice settings"
        description="Bu sayfa cihazındaki yerel ilerlemeyi ve ses durumunu kontrol etmek için var."
      />

      <Card className="space-y-4">
        <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Active day
          </p>
          <p className="mt-2 text-2xl font-semibold leading-tight">
            Day {activeDay} / 90
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={resetActiveDay}
            className="min-h-12 rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Reset active day to Day 1
          </button>
          <button
            type="button"
            onClick={clearLocalProgress}
            className="min-h-12 rounded-full border border-foreground/20 bg-surface px-5 py-4 text-sm font-black text-[#17201a] outline-none transition hover:bg-linen active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Clear local progress
          </button>
        </div>

        {message ? (
          <p className="rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            {message}
          </p>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Audio
            </p>
            <p className="mt-2 text-lg font-semibold">
              {audioStatus === "checking"
                ? "Ses durumu kontrol ediliyor"
                : audioStatus === "configured"
                  ? "ElevenLabs ses servisi hazır"
                  : "Ses servisi henüz hazır değil"}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Practice mode
            </p>
            <p className="mt-2 text-lg font-semibold">Local-first</p>
          </div>
          <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Program length
            </p>
            <p className="mt-2 text-lg font-semibold">90 days</p>
          </div>
        </div>

        <p className="rounded-[1.4rem] bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
          Bu sürüm ilerlemeyi bu cihazdaki tarayıcıda saklar. Cihaz değişirse
          veya tarayıcı verisi silinirse ilerleme kaybolabilir.
        </p>
        <p className="text-sm font-medium leading-6 text-muted">
          Şu anda login, hesap senkronizasyonu veya bulut hafızası yok. Bulut
          senkronizasyonu daha sonra ayrı bir faz olarak eklenebilir.
        </p>
      </Card>
    </div>
  );
}
