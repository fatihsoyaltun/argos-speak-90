"use client";

import { useEffect, useRef, useState } from "react";
import { useActiveDay } from "@/components/active-day";
import { PRACTICE_PROGRESS_UPDATED_EVENT } from "@/lib/practice-storage";
import {
  getCloudSyncStatus,
  pullCloudProgressToLocal,
  pushLocalProgressToCloud,
  syncCurrentUserProgress,
  type CloudSyncStatus,
} from "@/lib/supabase/progress-sync";

const statusLabels: Record<CloudSyncStatus, string> = {
  error: "Hata",
  needsAttention: "Sync gerekli",
  notSignedIn: "Giriş yok",
  ready: "Hazır",
  synced: "Senkronize",
  syncing: "Senkronize ediliyor",
  authExpired: "Oturum yenilenemedi",
  connectionError: "Geçici bağlantı hatası",
};

function formatSyncTime(value: string) {
  if (!value) {
    return "Henüz sync yapılmadı";
  }

  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Sync zamanı okunamadı";
  }
}

export function CloudSyncPanel() {
  const { activeDay, setActiveDay } = useActiveDay();
  const didLoadStatusRef = useRef(false);
  const [status, setStatus] = useState<CloudSyncStatus>("ready");
  const [message, setMessage] = useState("");
  const [technicalMessage, setTechnicalMessage] = useState("");
  const [lastSyncAt, setLastSyncAt] = useState("");

  useEffect(() => {
    if (didLoadStatusRef.current) {
      return;
    }

    didLoadStatusRef.current = true;
    let isActive = true;

    async function loadStatus() {
      const syncStatus = await getCloudSyncStatus().catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Cloud sync durumu okunamadı.";

        return {
          errorMessage:
            "Geçici bağlantı hatası. Local ilerleme korunuyor; lütfen tekrar deneyin.",
          lastSyncAt: "",
          status: "connectionError" as CloudSyncStatus,
          technicalMessage:
            process.env.NODE_ENV === "development"
              ? `Teknik detay: ${message}`
              : "",
        };
      });

      if (!isActive) {
        return;
      }

      setStatus(syncStatus.status);
      setLastSyncAt(syncStatus.lastSyncAt);

      if (syncStatus.errorMessage) {
        setMessage(syncStatus.errorMessage);
      }

      if ("technicalMessage" in syncStatus && syncStatus.technicalMessage) {
        setTechnicalMessage(syncStatus.technicalMessage);
      }
    }

    void loadStatus();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    function markNeedsSync() {
      setStatus((currentStatus) =>
        currentStatus === "synced" ? "needsAttention" : currentStatus,
      );
    }

    window.addEventListener(PRACTICE_PROGRESS_UPDATED_EVENT, markNeedsSync);

    return () => {
      window.removeEventListener(
        PRACTICE_PROGRESS_UPDATED_EVENT,
        markNeedsSync,
      );
    };
  }, []);

  async function runSyncAction(
    action: "push" | "pull" | "sync",
  ) {
    setStatus("syncing");
    setMessage("");
    setTechnicalMessage("");

    try {
      const result =
        action === "push"
          ? await pushLocalProgressToCloud(activeDay)
          : action === "pull"
            ? await pullCloudProgressToLocal()
            : await syncCurrentUserProgress(activeDay);

      if (!result.ok) {
        setStatus(result.status);
        setMessage(result.errorMessage ?? "Cloud sync tamamlanamadı.");
        setTechnicalMessage(result.technicalMessage ?? "");
        return;
      }

      if (result.activeDay) {
        setActiveDay(result.activeDay);
      }

      setStatus("synced");
      setLastSyncAt(result.lastSyncAt ?? "");
      setMessage(
        `Tamamlandı. Cloud'a ${result.pushedDays} gün yedeklendi, ${result.pulledDays} gün geri yüklendi.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Cloud sync tamamlanamadı.";
      setStatus("connectionError");
      setMessage(
        "Geçici bağlantı hatası. Local ilerleme korunuyor; lütfen tekrar deneyin.",
      );
      setTechnicalMessage(
        process.env.NODE_ENV === "development"
          ? `Teknik detay: ${message}`
          : "",
      );
    }
  }

  const isBusy = status === "syncing";
  const isSignedOut = status === "notSignedIn" || status === "authExpired";
  const disableActions = isBusy || isSignedOut;

  return (
    <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:rounded-[2rem] sm:p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Cloud sync
            </p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight">
              Local progress backup
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-sage px-3 py-1.5 text-xs font-black text-moss">
            {statusLabels[status]}
          </span>
        </div>

        <p className="rounded-[1.4rem] bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
          Local kayıtlar bu cihazda kalır. Giriş yaptıysan istersen cloud’a
          yedekleyebilir ve başka cihazda geri yükleyebilirsin.
        </p>

        <p className="text-sm font-semibold leading-6 text-muted">
          Son senkronizasyon: {formatSyncTime(lastSyncAt)}
        </p>

        <p className="rounded-[1.25rem] border border-foreground/10 bg-background/85 p-4 text-sm font-semibold leading-6 text-muted">
          Admin panelde görünmesi için Cloud’a yedekle veya Senkronize et
          kullan.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              void runSyncAction("push");
            }}
            disabled={disableActions}
            className="min-h-12 rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Cloud’a yedekle
          </button>
          <button
            type="button"
            onClick={() => {
              void runSyncAction("pull");
            }}
            disabled={disableActions}
            className="min-h-12 rounded-full border border-foreground/20 bg-surface px-5 py-4 text-sm font-black text-[#17201a] outline-none transition hover:bg-linen active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Cloud’dan geri yükle
          </button>
          <button
            type="button"
            onClick={() => {
              void runSyncAction("sync");
            }}
            disabled={disableActions}
            className="min-h-12 rounded-full border border-foreground/20 bg-surface px-5 py-4 text-sm font-black text-[#17201a] outline-none transition hover:bg-linen active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Senkronize et
          </button>
        </div>

        {isSignedOut ? (
          <p className="rounded-[1.25rem] border border-clay/25 bg-linen/80 p-4 text-sm font-semibold leading-6 text-[#2d261d]">
            Cloud sync için önce giriş yapmalısın.
          </p>
        ) : null}

        {message ? (
          <p className="rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            {message}
          </p>
        ) : null}

        {technicalMessage ? (
          <p className="rounded-[1.25rem] border border-foreground/10 bg-background/85 p-4 text-xs font-semibold leading-5 text-muted">
            {technicalMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}
