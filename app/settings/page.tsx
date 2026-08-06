"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AudioAction } from "@/components/audio-action";
import { useActiveDay } from "@/components/active-day";
import {
  CompactSection,
  Button,
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
  clearTtsAudioCache,
  createTtsCacheKey,
  getTtsAudioCacheStats,
} from "@/lib/tts/audio-cache";
import { useAudioController } from "@/lib/tts/use-audio-controller";
import {
  clearAllArgosProgress,
  notifyPracticeProgressChanged,
} from "@/lib/practice-storage";

type AudioStatus = "checking" | "configured" | "notConfigured";

export default function SettingsPage() {
  const { activeDay, setActiveDay, clearActiveDayStorage } = useActiveDay();
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("checking");
  const [audioModelId, setAudioModelId] = useState("");
  const [audioVoiceId, setAudioVoiceId] = useState("");
  const [cacheMessage, setCacheMessage] = useState("");
  const audio = useAudioController();
  const [message, setMessage] = useState("");
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");

  const checkAudioStatus = useCallback(async () => {
    setAudioStatus("checking");
    const status = await getTtsServiceStatus().catch(() => ({
      configured: false,
      modelId: "",
      voiceId: "",
    }));
    setAudioModelId(status.modelId ?? "");
    setAudioVoiceId(status.voiceId ?? "");
    setAudioStatus(status.configured ? "configured" : "notConfigured");
    return status.configured;
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadAudioStatus() {
      if (isActive) {
        await checkAudioStatus();
      }
    }

    void loadAudioStatus();

    return () => {
      isActive = false;
    };
  }, [checkAudioStatus]);

  const audioHealthText = "Your audio is ready for today's English practice.";
  const audioHealthId = "settings-audio-health";
  const audioHealthRequest = useMemo(
    () => ({
      cacheKey: createTtsCacheKey({
        day: activeDay,
        includeAlignment: false,
        modelId: audioModelId,
        scope: "settings-health",
        text: audioHealthText,
        voiceId: audioVoiceId,
      }),
      id: audioHealthId,
      includeAlignment: false,
      text: audioHealthText,
    }),
    [activeDay, audioModelId, audioVoiceId],
  );

  const audioBytes = audio.metadata?.audioBytes ?? 0;
  const audioTransport =
    audio.metadata?.transport === "binary" ? "binary" : "JSON";
  const audioHealthMessage =
    audio.activeId === audioHealthId && audio.duration > 0
      ? `Ses testi geçti: ${audio.contentType}, ${audio.duration.toFixed(1)} sn, ${audioBytes} bayt, ${audioTransport} taşıma.`
      : "";

  async function runAudioHealthTest() {
    if (audio.activeId === audioHealthId && audio.state === "error") {
      await audio.retry();
      return;
    }

    if (
      audio.activeId === audioHealthId &&
      (audio.state === "loading" || audio.state === "playing")
    ) {
      audio.cancel();
      return;
    }

    await audio.play(audioHealthRequest);
  }

  function resetAudioCache() {
    audio.stop();
    clearTtsAudioCache();
    const stats = getTtsAudioCacheStats();
    setCacheMessage(
      `Ses önbelleği temizlendi: ${stats.entries} kayıt, ${stats.bytes} bayt.`,
    );
  }

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
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <AudioAction
            active={audio.activeId === audioHealthId}
            state={audio.state}
            onAction={() => {
              void runAudioHealthTest();
            }}
            disabled={audioStatus !== "configured"}
            idleAriaLabel="Ses katmanını gerçek oynatmayla test et"
            labels={{ idle: "Sesi test et", retry: "Tekrar dene" }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              void checkAudioStatus();
            }}
            disabled={audioStatus === "checking"}
          >
            Durumu yenile
          </Button>
          <Button type="button" variant="ghost" onClick={resetAudioCache}>
            Ses cache’ini temizle
          </Button>
        </div>
        {audioStatus === "notConfigured" ? (
          <p className="mt-3 rounded-[1.15rem] border border-foreground/10 bg-linen/70 p-3 text-sm font-semibold leading-6 text-foreground">
            Ses servisi yapılandırılmadı. Sunucudaki ElevenLabs anahtarı ve ses
            ayarları eklendiğinde gerçek oynatma testi kullanılabilir.
          </p>
        ) : null}
        {audio.error ? (
          <p
            role="alert"
            className="mt-3 rounded-[1.15rem] border border-clay/30 bg-linen p-3 text-sm font-semibold leading-6 text-foreground"
          >
            {audio.error.message}
          </p>
        ) : null}
        {audioHealthMessage ? (
          <p
            role="status"
            className="mt-3 rounded-[1.15rem] border border-moss/20 bg-sage p-3 text-sm font-semibold leading-6 text-foreground"
          >
            {audioHealthMessage}
          </p>
        ) : null}
        {cacheMessage ? (
          <p className="mt-3 text-sm font-semibold leading-6 text-muted">
            {cacheMessage}
          </p>
        ) : null}
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
