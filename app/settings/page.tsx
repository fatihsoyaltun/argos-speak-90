"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useActiveDay } from "@/components/active-day";
import {
  CompactSection,
  ExpandableCard,
  PageHeader,
  ProgressStrip,
  StatusPill,
} from "@/components/ui";
import {
  exportLocalBackupAsJson,
  importLocalBackupFromJson,
} from "@/lib/local-storage-keys";
import { getTtsServiceStatus } from "@/lib/tts/client";
import {
  clearAllArgosProgress,
  notifyPracticeProgressChanged,
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
    let json: string;

    try {
      json = exportLocalBackupAsJson(window.localStorage);
      setExportText(json);
    } catch {
      setMessage("Yerel yedek hazırlanamadı. Tarayıcı depolaması kapalı olabilir.");
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(json);
      setMessage("Tam yerel yedek JSON olarak panoya kopyalandı.");
    } catch {
      setMessage(
        "Panoya kopyalama engellendi. JSON dosyası indirmeyi kullanabilirsin.",
      );
    }
  }

  function downloadExportJson() {
    let json: string;

    try {
      json = exportLocalBackupAsJson(window.localStorage);
      setExportText(json);
    } catch {
      setMessage("Yerel yedek hazırlanamadı. Tarayıcı depolaması kapalı olabilir.");
      return;
    }

    try {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "argos-speak-90-local-backup.json";
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Tam yerel yedek JSON dosyası indirildi.");
    } catch {
      setMessage("JSON hazırlandı. Dosya indirilemedi; metni elle kopyalayabilirsin.");
    }
  }

  function importProgress() {
    let result;

    try {
      result = importLocalBackupFromJson(importText, window.localStorage);
    } catch {
      setImportMessage(
        "Yedek içe aktarılamadı. Tarayıcı depolaması kapalı olabilir.",
      );
      return;
    }

    if (result.ok) {
      if (result.activeDay) {
        setActiveDay(result.activeDay);
      }

      notifyPracticeProgressChanged();
      setImportMessage(
        result.format === "complete"
          ? `${result.importedDays} günlük ilerleme, aktif gün ve ${result.importedDeviceModules} Device Lab kaydı içe aktarıldı.`
          : `${result.importedDays} günlük eski ilerleme yedeği içe aktarıldı; aktif gün ve Device Lab kayıtları değiştirilmedi.`,
      );
      setExportText(exportLocalBackupAsJson(window.localStorage));
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
    <div className="space-y-5">
      <PageHeader
        eyebrow="Settings"
        title="Local practice settings"
        description="Bu sayfa cihazındaki yerel ilerlemeyi ve ses durumunu kontrol etmek için var."
      />

      <CompactSection
        eyebrow="Professional English"
        title="Professional English / Device Lab"
        description="Kaynak kontrollü cihaz iletişimi pratiği."
        action={<StatusPill status="pending">Read-only</StatusPill>}
      >
        <Link
          href="/device-lab"
          className="flex min-h-11 items-center justify-center rounded-full border border-foreground/20 bg-linen px-4 py-3 text-center text-sm font-black text-[#17201a] outline-none transition visited:text-[#17201a] hover:bg-sage hover:text-[#17201a] active:scale-[0.98] active:text-[#17201a] focus-visible:text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface [&_*]:text-[#17201a]"
        >
          Device Lab’i aç
        </Link>
      </CompactSection>

      <CompactSection
        eyebrow="Local device"
        title={`Day ${activeDay} / 90`}
        description="Aktif günü ve bu cihazdaki yerel ilerlemeyi yönet."
        action={<StatusPill status="active">Local-first</StatusPill>}
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={resetActiveDay}
            className="min-h-11 rounded-full bg-[#17201a] px-4 py-3 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Reset Day 1
          </button>
          <button
            type="button"
            onClick={clearLocalProgress}
            className="min-h-11 rounded-full border border-foreground/20 bg-surface px-4 py-3 text-sm font-black text-[#17201a] outline-none transition hover:bg-linen active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Clear local progress
          </button>
          <Link
            href="/journal"
            className="flex min-h-11 items-center justify-center rounded-full border border-foreground/20 bg-linen px-4 py-3 text-center text-sm font-black text-[#17201a] outline-none transition hover:bg-sage active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Journal aç
          </Link>
        </div>
        {message ? (
          <p className="mt-3 rounded-[1.25rem] border border-moss/20 bg-sage p-3 text-sm font-semibold leading-6 text-foreground">
            {message}
          </p>
        ) : null}
      </CompactSection>

      <CompactSection
        eyebrow="System status"
        title="Ses ve program"
        description="Kısa durum özeti. Teknik kontroller aynı şekilde çalışmaya devam eder."
      >
        <ProgressStrip
          items={[
            {
              label:
                audioStatus === "checking"
                  ? "Audio checking"
                  : audioStatus === "configured"
                    ? "Audio ready"
                    : "Audio not ready",
              status:
                audioStatus === "configured"
                  ? "synced"
                  : audioStatus === "checking"
                    ? "pending"
                    : "warning",
            },
            {
              label: "90 days",
              status: "active",
            },
          ]}
        />
        <p className="mt-3 rounded-[1.25rem] bg-linen p-3 text-sm font-semibold leading-6 text-[#2d261d]">
          Bu sürüm ilerlemeyi bu cihazdaki tarayıcıda saklar. Cihaz değişirse
          veya tarayıcı verisi silinirse ilerleme kaybolabilir.
        </p>
      </CompactSection>

      <CompactSection
        eyebrow="Guide"
        title="Yerel kullanım rehberi"
        description="Günlük çalışma ve bu cihazdaki ilerlemeyi koruma adımları."
      >
        <Link
          href="/pilot"
          className="flex min-h-11 items-center justify-center rounded-full border border-foreground/20 bg-linen px-4 py-3 text-center text-sm font-black text-[#17201a] outline-none transition visited:text-[#17201a] hover:bg-sage hover:text-[#17201a] active:scale-[0.98] active:text-[#17201a] focus-visible:text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface [&_*]:text-[#17201a]"
        >
          Yerel kullanım rehberi
        </Link>
      </CompactSection>

      <ExpandableCard
        eyebrow="Advanced"
        title="Advanced local data"
        description="Aktif gün, pratik ilerlemesi ve Device Lab kayıtlarını tek JSON yedeğinde taşı."
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold leading-tight">
              Yerel ilerlemeyi taşı
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-muted">
              Dışa aktarma aktif günü, yerel pratik cevaplarını ve Device Lab
              kayıtlarını içerir. API anahtarı veya gizli ses ayarı içermez.
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
              seç. Eski yalnız-pratik yedekleri de desteklenir. Hatalı JSON
              uygulamayı bozmaz; hiçbir yerel anahtar değiştirilmez.
            </p>
            <textarea
              id="import-progress-json"
              value={importText}
              onChange={(event) => {
                setImportText(event.target.value);
                setImportMessage("");
              }}
              rows={6}
              placeholder='{"version":2,"product":"argos-speak-90",...}'
              className="mt-4 w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-surface p-4 font-mono text-xs leading-5 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
            />
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => {
                void loadImportFile(event.target.files?.[0]);
              }}
              className="mt-3 block w-full text-sm font-semibold text-muted file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-linen file:px-4 file:text-sm file:font-black file:text-[#17201a]"
            />
            <button
              type="button"
              onClick={importProgress}
              disabled={importText.trim().length === 0}
              className="mt-4 min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
            >
              Yerel yedeği içe aktar
            </button>
            {importMessage ? (
              <p className="mt-4 rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
                {importMessage}
              </p>
            ) : null}
          </div>
        </div>
      </ExpandableCard>
    </div>
  );
}
