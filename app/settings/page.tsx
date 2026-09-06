"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AudioAction } from "@/components/audio-action";
import { DayNavigator, useActiveDay } from "@/components/active-day";
import {
  Button,
  CompactSection,
  ExpandableCard,
  Feedback,
  PageHeader,
  ProgressStrip,
  StatusPill,
} from "@/components/ui";
import {
  exportLocalBackupAsJson,
  importLocalBackupFromJson,
  LOCAL_USER_DATA_STORAGE_KEYS,
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
import { isVoiceRecordingSupported } from "@/lib/voice-recording";

type AudioStatus = "checking" | "configured" | "notConfigured";

const RESET_CONFIRM_PHRASE = "SİL";

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
  const [resetArmed, setResetArmed] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [recordingSupported, setRecordingSupported] = useState(false);

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setRecordingSupported(isVoiceRecordingSupported());
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

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

  function setProgramDayOne() {
    setActiveDay(1);
    setMessage("Aktif gün 1. güne alındı. Görev verileri silinmedi.");
  }

  function cancelReset() {
    setResetArmed(false);
    setResetConfirmText("");
  }

  function confirmClearLocalProgress() {
    if (resetConfirmText.trim() !== RESET_CONFIRM_PHRASE) {
      setMessage(`Onay için "${RESET_CONFIRM_PHRASE}" yazman gerekir.`);
      return;
    }

    clearAllArgosProgress();
    clearActiveDayStorage();
    setMessage(
      `Yerel kullanıcı verisi silindi: aktif gün, pratik ilerlemesi, Device Lab kayıtları. Hedef anahtarlar: ${LOCAL_USER_DATA_STORAGE_KEYS.join(", ")}.`,
    );
    setExportText("");
    setImportMessage("");
    setImportText("");
    cancelReset();
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
    <div className="space-y-5" data-settings-page="p10d">
      <PageHeader
        eyebrow="Ayarlar"
        title="Yerel program ayarları"
        description="Program, veri yedeği, ses sağlık testi ve mikrofon gizliliği. Hesap, ekip veya bulut senkronu yok."
      />

      {message && !resetArmed ? (
        <div data-settings-status>
          <Feedback tone="success">{message}</Feedback>
        </div>
      ) : null}

      <div data-settings-section="program">
      <CompactSection
        eyebrow="Program"
        title={`Gün ${activeDay} / 90`}
        description="Aktif çalışma gününü bu cihazda seç."
        action={<StatusPill status="active">Yerel</StatusPill>}
      >
        <div className="space-y-3">
          <DayNavigator />
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={setProgramDayOne}>
              Aktif günü 1 yap
            </Button>
          </div>
        </div>
      </CompactSection>
      </div>

      <div data-settings-section="backup">
      <CompactSection
        eyebrow="Veriler"
        title="Yedek ve sıfırlama"
        description="Aktif gün, pratik ilerlemesi ve Device Lab kayıtlarını JSON olarak taşı veya sil."
      >
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                void copyExportJson();
              }}
              data-settings-export-copy
            >
              Yedeği kopyala
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={downloadExportJson}
              data-settings-export-download
            >
              JSON indir
            </Button>
          </div>


          {exportText ? (
            <textarea
              readOnly
              value={exportText}
              rows={5}
              aria-label="Dışa aktarılan ilerleme JSON"
              className="w-full resize-none rounded-[1.25rem] border border-foreground/15 bg-background/85 p-4 font-mono text-xs leading-5 text-foreground outline-none"
            />
          ) : null}

          <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
            <label
              htmlFor="import-progress-json"
              className="text-xs font-bold uppercase tracking-[0.16em] text-clay"
            >
              Yedeği içe aktar
            </label>
            <p className="mt-2 text-sm font-medium leading-6 text-muted">
              Argos ilerleme JSON metnini yapıştır veya dosya seç. Eski
              yalnız-pratik yedekleri de desteklenir. Hatalı JSON mevcut veriyi
              değiştirmez.
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
            <Button
              type="button"
              variant="primary"
              className="mt-4 w-full sm:w-auto"
              onClick={importProgress}
              disabled={importText.trim().length === 0}
              data-settings-import
            >
              Yerel yedeği içe aktar
            </Button>
            {importMessage ? (
              <Feedback className="mt-4" tone="success">
                {importMessage}
              </Feedback>
            ) : null}
          </div>

          <div
            className="rounded-[1.4rem] border border-danger/30 bg-danger-soft/40 p-4"
            data-settings-reset
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Tehlikeli işlem
            </p>
            <h2 className="mt-2 text-lg font-semibold leading-tight">
              Yerel ilerlemeyi sil
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-muted">
              Yalnız şu anahtarlar silinir:{" "}
              <span className="font-mono text-xs text-foreground">
                {LOCAL_USER_DATA_STORAGE_KEYS.join(", ")}
              </span>
              . Diğer tarayıcı verilerine dokunulmaz. Ses kaydı zaten oturum
              belleğindedir ve buradan silinmez.
            </p>

            {!resetArmed ? (
              <Button
                type="button"
                variant="danger"
                className="mt-4"
                onClick={() => {
                  setResetArmed(true);
                  setResetConfirmText("");
                  setMessage("");
                }}
                data-settings-reset-arm
              >
                Silme adımını aç
              </Button>
            ) : (
              <div className="mt-4 space-y-3">
                <Feedback tone="warning">
                  Bu işlem geri alınamaz. Onaylamak için aşağıya{" "}
                  <strong>{RESET_CONFIRM_PHRASE}</strong> yaz.
                </Feedback>
                <label
                  htmlFor="reset-confirm-phrase"
                  className="block text-sm font-semibold text-foreground"
                >
                  Onay metni
                </label>
                <input
                  id="reset-confirm-phrase"
                  value={resetConfirmText}
                  onChange={(event) => setResetConfirmText(event.target.value)}
                  autoComplete="off"
                  className="min-h-11 w-full rounded-full border border-foreground/15 bg-surface px-4 text-sm font-semibold outline-none focus:border-clay focus:ring-2 focus:ring-clay/30"
                  data-settings-reset-confirm-input
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={confirmClearLocalProgress}
                    disabled={resetConfirmText.trim() !== RESET_CONFIRM_PHRASE}
                    data-settings-reset-confirm
                  >
                    Evet, yerel veriyi sil
                  </Button>
                  <Button type="button" variant="ghost" onClick={cancelReset}>
                    Vazgeç
                  </Button>
                </div>
              </div>
            )}
            {message && resetArmed ? (
              <Feedback className="mt-3" tone="info">
                {message}
              </Feedback>
            ) : null}
          </div>
        </div>
      </CompactSection>
      </div>

      <div data-settings-section="audio">
      <CompactSection
        eyebrow="Ses"
        title="Ses sağlık testi"
        description="Kısa bir İngilizce cümleyle gerçek oynatma durumunu kontrol et."
      >
        <ProgressStrip
          items={[
            {
              label:
                audioStatus === "checking"
                  ? "Ses kontrol ediliyor"
                  : audioStatus === "configured"
                    ? "Ses hazır"
                    : "Ses hazır değil",
              status:
                audioStatus === "configured"
                  ? "synced"
                  : audioStatus === "checking"
                    ? "pending"
                    : "warning",
            },
            {
              label: "90 gün program",
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
            Ses önbelleğini temizle
          </Button>
        </div>
        {audioStatus === "notConfigured" ? (
          <Feedback className="mt-3" tone="warning">
            Ses servisi yapılandırılmadı. Sunucudaki ses sağlayıcı ayarları
            eklendiğinde gerçek oynatma testi kullanılabilir.
          </Feedback>
        ) : null}
        {audio.error ? (
          <Feedback className="mt-3" tone="error">
            {audio.error.message}
          </Feedback>
        ) : null}
        {audioHealthMessage ? (
          <Feedback className="mt-3" tone="success">
            {audioHealthMessage}
          </Feedback>
        ) : null}
        {cacheMessage ? (
          <p className="mt-3 text-sm font-semibold leading-6 text-muted">
            {cacheMessage}
          </p>
        ) : null}
      </CompactSection>
      </div>

      <div data-settings-section="microphone">
      <CompactSection
        eyebrow="Gizlilik"
        title="Mikrofon ve kayıt"
        description="Mikrofon izni otomatik istenmez. Kayıt oturum belleğindedir."
        action={
          <StatusPill status={recordingSupported ? "synced" : "warning"}>
            {recordingSupported ? "Destekleniyor" : "Destek yok"}
          </StatusPill>
        }
      >
        <ul className="space-y-2 text-sm font-medium leading-6 text-muted">
          <li>
            Destek:{" "}
            <strong className="text-foreground">
              {recordingSupported
                ? "Bu tarayıcıda kayıt kullanılabilir"
                : "Bu tarayıcıda kayıt yok; metin akışı yeterli"}
            </strong>
          </li>
          <li>
            İzin: Mikrofon yalnızca sen kayıt başlattığında istenir; Ayarlar
            sayfası izin istemez.
          </li>
          <li>
            Saklama: Ses kaydı buluta yüklenmez, puanlanmaz, yazıya dökülmez;
            varsayılan olarak yalnız oturum belleğinde tutulur.
          </li>
          <li>
            Blob: Ses Blob&apos;ları localStorage içine yazılmaz.
          </li>
        </ul>
        <ExpandableCard
          className="mt-4"
          eyebrow="Ayrıntı"
          title="Kayıt gizliliği notu"
          description="Kısa hatırlatma; ana akışı kaplamaz."
        >
          <p className="text-sm font-medium leading-6 text-muted">
            Speak ve Device Lab içindeki kayıt denetimleri progressive
            enhancement&apos;tır. Desteklenmeyen ortamda görev metin tabanlı
            tamamlanabilir kalır. Kalıcı kayıt istenirse ayrı bir fazda
            IndexedDB, süre ve silme politikası tasarlanır.
          </p>
        </ExpandableCard>
      </CompactSection>
      </div>
    </div>
  );
}
