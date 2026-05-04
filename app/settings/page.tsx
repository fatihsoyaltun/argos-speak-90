"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useActiveDay } from "@/components/active-day";
import { CloudSyncPanel } from "@/components/cloud-sync-panel";
import {
  CompactSection,
  ExpandableCard,
  PageHeader,
  ProgressStrip,
  StatusPill,
} from "@/components/ui";
import { getClientAuthState, signOutClientUser } from "@/lib/auth/client";
import { getTtsServiceStatus } from "@/lib/tts/client";
import {
  clearAllArgosProgress,
  exportPracticeProgressAsJson,
  importPracticeProgressFromJson,
} from "@/lib/practice-storage";
import { getSupabaseConfigStatus } from "@/lib/supabase/env";

type AudioStatus = "checking" | "configured" | "notConfigured";
type CloudAccountStatus =
  | "checking"
  | "notConfigured"
  | "signedIn"
  | "signedOut";

export default function SettingsPage() {
  const { activeDay, setActiveDay, clearActiveDayStorage } = useActiveDay();
  const supabaseStatus = getSupabaseConfigStatus();
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("checking");
  const [cloudAccountStatus, setCloudAccountStatus] =
    useState<CloudAccountStatus>(
      supabaseStatus.configured ? "checking" : "notConfigured",
    );
  const [cloudAccountEmail, setCloudAccountEmail] = useState("");
  const [cloudAccountRole, setCloudAccountRole] = useState("");
  const [cloudAccountMessage, setCloudAccountMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
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

  useEffect(() => {
    if (!supabaseStatus.configured) {
      return;
    }

    let isActive = true;

    async function checkCloudAccount() {
      const authState = await getClientAuthState().catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Oturum kontrolü tamamlanamadı.";

        return {
          profile: null,
          profileMessage:
            "Oturum kontrolü geçici olarak başarısız oldu. Lütfen tekrar deneyin.",
          session: null,
          technicalMessage: message,
          user: null,
        };
      });

      if (!isActive) {
        return;
      }

      if (authState.user) {
        setCloudAccountStatus("signedIn");
        setCloudAccountEmail(authState.user.email ?? "");
        setCloudAccountRole(authState.profile?.role ?? "member");
        return;
      }

      setCloudAccountStatus("signedOut");
      setCloudAccountEmail("");
      setCloudAccountRole("");
      setCloudAccountMessage(authState.profileMessage);
    }

    checkCloudAccount();

    return () => {
      isActive = false;
    };
  }, [supabaseStatus.configured]);

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
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(json);
      setMessage("İlerleme JSON olarak panoya kopyalandı.");
    } catch {
      setMessage(
        "Panoya kopyalama engellendi. JSON dosyası indirmeyi kullanabilirsin.",
      );
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

  async function signOutFromSettings() {
    setIsSigningOut(true);
    setCloudAccountMessage("");

    const errorMessage = await signOutClientUser();

    setIsSigningOut(false);

    if (errorMessage) {
      setCloudAccountMessage(errorMessage);
      return;
    }

    setCloudAccountStatus("signedOut");
    setCloudAccountEmail("");
    setCloudAccountRole("");
    setCloudAccountMessage("Çıkış yapıldı. Yerel ilerleme korunuyor.");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Settings"
        title="Local practice settings"
        description="Bu sayfa cihazındaki yerel ilerlemeyi ve ses durumunu kontrol etmek için var."
      />

      <CompactSection
        eyebrow="Cloud account"
        title={
          cloudAccountStatus === "checking"
            ? "Hesap kontrol ediliyor"
            : cloudAccountStatus === "signedIn"
              ? "Cloud hesabın bağlı"
              : "Cloud hesabı bağlı değil"
        }
        description={
          cloudAccountEmail
            ? cloudAccountEmail
            : "Cloud sync isteğe bağlıdır; yerel çalışma bu cihazda kalır."
        }
        action={
          <StatusPill
            status={
              cloudAccountStatus === "signedIn"
                ? "synced"
                : cloudAccountStatus === "checking"
                  ? "pending"
                  : "noSync"
            }
          >
            {cloudAccountStatus === "signedIn"
              ? "Signed in"
              : cloudAccountStatus === "checking"
                ? "Checking"
                : "Not signed in"}
          </StatusPill>
        }
      >
        <div className="flex flex-wrap gap-2">
          {cloudAccountRole === "admin" && cloudAccountStatus === "signedIn" ? (
            <Link
              href="/admin"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-linen px-4 py-2 text-sm font-black !text-[#17201a] outline-none transition visited:!text-[#17201a] hover:bg-sage hover:!text-[#17201a] active:scale-[0.98] active:!text-[#17201a] focus-visible:!text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface [&_*]:!text-[#17201a]"
            >
              Admin paneli
            </Link>
          ) : null}
          <Link
            href={cloudAccountStatus === "signedIn" ? "/account" : "/login"}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-foreground/20 bg-linen px-4 py-2 text-sm font-black text-[#17201a] outline-none transition hover:bg-sage active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            {cloudAccountStatus === "signedIn"
              ? "Cloud account aç"
              : "Login sayfasına git"}
          </Link>
          {cloudAccountStatus === "signedIn" ? (
            <button
              type="button"
              onClick={() => {
                void signOutFromSettings();
              }}
              disabled={isSigningOut}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-foreground/20 bg-surface px-4 py-2 text-sm font-black text-[#17201a] outline-none transition hover:bg-linen active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
            >
              {isSigningOut ? "Çıkış yapılıyor" : "Çıkış yap"}
            </button>
          ) : null}
        </div>
        {cloudAccountMessage ? (
          <p className="mt-3 text-sm font-semibold leading-5 text-muted">
            {cloudAccountMessage}
          </p>
        ) : null}
      </CompactSection>

      <CloudSyncPanel />

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
        title="Ses, cloud ve program"
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
              label: supabaseStatus.configured
                ? "Supabase ready"
                : "Cloud not connected",
              status: supabaseStatus.configured ? "synced" : "noSync",
            },
            {
              label: "90 days",
              status: "active",
            },
          ]}
        />
        {supabaseStatus.invalidMessage ? (
          <p className="mt-3 text-sm font-semibold leading-5 text-muted">
            {supabaseStatus.invalidMessage}
          </p>
        ) : null}
        <p className="mt-3 rounded-[1.25rem] bg-linen p-3 text-sm font-semibold leading-6 text-[#2d261d]">
          Bu sürüm ilerlemeyi bu cihazdaki tarayıcıda saklar. Cihaz değişirse
          veya tarayıcı verisi silinirse ilerleme kaybolabilir.
        </p>
      </CompactSection>

      <CompactSection
        eyebrow="Pilot"
        title="Pilot kullanım rehberi"
        description="Kayıt, günlük çalışma, cloud sync ve admin görünürlüğü için kısa ekip rehberi."
      >
        <Link
          href="/pilot"
          className="flex min-h-11 items-center justify-center rounded-full border border-foreground/20 bg-linen px-4 py-3 text-center text-sm font-black !text-[#17201a] outline-none transition visited:!text-[#17201a] hover:bg-sage hover:!text-[#17201a] active:scale-[0.98] active:!text-[#17201a] focus-visible:!text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface [&_*]:!text-[#17201a]"
        >
          Pilot kullanım rehberi
        </Link>
      </CompactSection>

      <ExpandableCard
        eyebrow="Ekip kullanımı"
        title="Gizlilik ve admin görünürlüğü"
        description="Cloud sync kullanırsan hangi ilerleme bilgilerinin admin tarafından görülebileceğini açıklar."
      >
        <div className="space-y-3 text-sm font-semibold leading-6 text-muted">
          <p>
            Bu uygulama İngilizce pratik ilerlemesini takip etmek için
            kullanılır.
          </p>
          <p>
            Giriş yapıp cloud sync kullandığında aktif günün, tamamladığın
            modüller, review durumu, yazılı pratik cevapların ve journal notların
            ekip yöneticisi tarafından görülebilir.
          </p>
          <p>
            Ses kayıtları tutulmaz. ElevenLabs API anahtarı kullanıcı
            ilerlemesine kaydedilmez.
          </p>
          <p>
            Yerel ilerleme, cloud’a yedeklemediğin sürece bu cihazdaki
            tarayıcıda kalır. Cloud sync isteğe bağlıdır; ancak farklı cihazdan
            geri yükleme ve admin panelde görünmek için cloud’a yedekleme
            gerekir.
          </p>
        </div>
      </ExpandableCard>

      <ExpandableCard
        eyebrow="Advanced"
        title="Advanced local data"
        description="Yerel ilerlemeyi JSON olarak dışa/içe aktar. Veri formatı aynı kalır."
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold leading-tight">
              Yerel ilerlemeyi taşı
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-muted">
              Dışa aktarma yalnızca bu uygulamanın yerel pratik cevaplarını
              içerir. API anahtarı veya gizli ses ayarı içermez.
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
        </div>
      </ExpandableCard>
    </div>
  );
}
