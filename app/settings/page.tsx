"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useActiveDay } from "@/components/active-day";
import { Card, PageHeader } from "@/components/ui";
import { getTtsServiceStatus } from "@/lib/tts/client";
import {
  clearAllArgosProgress,
  exportPracticeProgressAsJson,
  importPracticeProgressFromJson,
} from "@/lib/practice-storage";

type AudioStatus = "checking" | "configured" | "notConfigured";

export default function SettingsPage() {
  const { activeDay, setActiveDay, clearActiveDayStorage } = useActiveDay();
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("checking");
  const [message, setMessage] = useState("");
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");

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
    clearAllArgosProgress();
    clearActiveDayStorage();
    setMessage("Bu tarayıcıdaki Argos ilerleme verileri temizlendi.");
    setExportText("");
    setImportMessage("");
  }

  async function copyExportJson() {
    const json = exportPracticeProgressAsJson();
    setExportText(json);

    try {
      await navigator.clipboard.writeText(json);
      setMessage("İlerleme JSON olarak panoya kopyalandı.");
    } catch {
      setMessage("JSON hazırlandı. Panoya kopyalanamadı; metni elle kopyalayabilirsin.");
    }
  }

  function downloadExportJson() {
    const json = exportPracticeProgressAsJson();
    setExportText(json);

    try {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "argos-speak-90-progress.json";
      link.click();
      URL.revokeObjectURL(url);
      setMessage("İlerleme JSON dosyası indirildi.");
    } catch {
      setMessage("JSON hazırlandı. Dosya indirilemedi; metni elle kopyalayabilirsin.");
    }
  }

  function importProgress() {
    const result = importPracticeProgressFromJson(importText);

    if (result.ok) {
      setImportMessage(`${result.importedDays} günlük ilerleme içe aktarıldı.`);
      setExportText(exportPracticeProgressAsJson());
      return;
    }

    setImportMessage(result.message);
  }

  async function loadImportFile(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      setImportText(await file.text());
      setImportMessage("Dosya yüklendi. İçe aktarmak için butona bas.");
    } catch {
      setImportMessage("Dosya okunamadı. JSON metnini yapıştırmayı deneyebilirsin.");
    }
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

        <Link
          href="/journal"
          className="flex min-h-12 items-center justify-center rounded-full border border-foreground/20 bg-linen px-5 py-4 text-center text-sm font-black text-[#17201a] outline-none transition hover:bg-sage active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
        >
          Practice Journal aç
        </Link>

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

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Export / Import
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Yerel ilerlemeyi taşı
          </h2>
          <p className="mt-2 text-sm font-medium leading-6 text-muted">
            Dışa aktarma yalnızca bu uygulamanın yerel pratik cevaplarını içerir.
            API anahtarı veya gizli ses ayarı içermez.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              void copyExportJson();
            }}
            className="min-h-12 rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Export JSON kopyala
          </button>
          <button
            type="button"
            onClick={downloadExportJson}
            className="min-h-12 rounded-full border border-foreground/20 bg-surface px-5 py-4 text-sm font-black text-[#17201a] outline-none transition hover:bg-linen active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            JSON indir
          </button>
        </div>

        {exportText ? (
          <textarea
            readOnly
            value={exportText}
            rows={5}
            aria-label="Exported progress JSON"
            className="w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-background/85 p-4 font-mono text-xs leading-5 text-foreground outline-none"
          />
        ) : null}

        <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
          <label
            htmlFor="import-progress-json"
            className="text-xs font-bold uppercase tracking-[0.16em] text-clay"
          >
            Import JSON
          </label>
          <p className="mt-2 text-sm font-medium leading-6 text-muted">
            Daha önce aldığın Argos ilerleme JSON metnini yapıştır veya dosya
            seç. Hatalı JSON uygulamayı bozmaz; sadece içe aktarılmaz.
          </p>
          <textarea
            id="import-progress-json"
            value={importText}
            onChange={(event) => {
              setImportText(event.target.value);
              setImportMessage("");
            }}
            rows={6}
            placeholder='{"version":1,"days":{...}}'
            className="mt-4 w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-surface p-4 font-mono text-xs leading-5 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
          />
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              void loadImportFile(event.target.files?.[0]);
            }}
            className="mt-3 block w-full text-sm font-semibold text-muted file:mr-3 file:min-h-10 file:rounded-full file:border-0 file:bg-linen file:px-4 file:text-sm file:font-black file:text-[#17201a]"
          />
          <button
            type="button"
            onClick={importProgress}
            disabled={importText.trim().length === 0}
            className="mt-4 min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
          >
            Import progress
          </button>
          {importMessage ? (
            <p className="mt-4 rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
              {importMessage}
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
