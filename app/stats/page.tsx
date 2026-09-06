"use client";

import { useEffect, useMemo, useState } from "react";
import { useActiveDay } from "@/components/active-day";
import {
  Button,
  ButtonLink,
  Card,
  CompactSection,
  Feedback,
  PageHeader,
  ProgressStrip,
  StatusPill,
} from "@/components/ui";
import { dailyTasks, trackedDailyTasks } from "@/lib/daily-tasks";
import {
  DEVICE_LAB_PRACTICE_STORAGE_KEY,
  exportLocalBackupAsJson,
} from "@/lib/local-storage-keys";
import {
  countCompletedDeviceLabModules,
  getRecentDaySummaries,
  summarizeActiveDayProgress,
} from "@/lib/progress-summary";
import {
  getAllDayProgress,
  getDayProgress,
  PRACTICE_PROGRESS_UPDATED_EVENT,
  type DayProgress,
} from "@/lib/practice-storage";

type DeviceLabStoreShape = {
  modules?: Record<string, { completedAt?: string | null }>;
};

function readDeviceLabModules(): Record<
  string,
  { completedAt?: string | null }
> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(DEVICE_LAB_PRACTICE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as DeviceLabStoreShape;
    return parsed?.modules && typeof parsed.modules === "object"
      ? parsed.modules
      : {};
  } catch {
    return {};
  }
}

export default function StatsPage() {
  const { activeDay } = useActiveDay();
  const [progress, setProgress] = useState<DayProgress | null>(null);
  const [allDays, setAllDays] = useState<Record<string, DayProgress>>({});
  const [deviceModules, setDeviceModules] = useState<
    Record<string, { completedAt?: string | null }>
  >({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    function refreshProgress() {
      setProgress(getDayProgress(activeDay));
      setAllDays(getAllDayProgress());
      setDeviceModules(readDeviceLabModules());
    }

    refreshProgress();
    window.addEventListener(PRACTICE_PROGRESS_UPDATED_EVENT, refreshProgress);
    window.addEventListener("storage", refreshProgress);

    return () => {
      window.removeEventListener(
        PRACTICE_PROGRESS_UPDATED_EVENT,
        refreshProgress,
      );
      window.removeEventListener("storage", refreshProgress);
    };
  }, [activeDay]);

  const dayProgress = progress ?? getDayProgress(activeDay);
  const summary = summarizeActiveDayProgress(dayProgress);
  const recent = useMemo(
    () => getRecentDaySummaries(activeDay, allDays),
    [activeDay, allDays],
  );
  const deviceCompleted = countCompletedDeviceLabModules(deviceModules);
  const daysWithAnyProgress = Object.values(allDays).filter(
    (day) =>
      day.completedTasks.length > 0 ||
      day.dailyNote.trim() ||
      day.difficultPart.trim() ||
      day.nextReviewNote.trim(),
  ).length;

  async function copyExportJson() {
    let json: string;

    try {
      json = exportLocalBackupAsJson(window.localStorage);
    } catch {
      setMessage("Yedek hazırlanamadı. Tarayıcı depolaması kapalı olabilir.");
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(json);
      setMessage("Yerel yedek JSON olarak panoya kopyalandı.");
    } catch {
      try {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "argos-speak-90-local-backup.json";
        link.click();
        URL.revokeObjectURL(url);
        setMessage("Panoya kopyalanamadı; JSON dosyası indirildi.");
      } catch {
        setMessage("Yedek hazırlandı ama panoya veya dosyaya aktarılamadı.");
      }
    }
  }

  return (
    <div className="space-y-5" data-progress-page="p10d">
      <PageHeader
        eyebrow="İlerleme"
        title="Yerel ilerlemen"
        description="Aktif gün, görev özeti ve bu cihazdaki saklama durumu. Hesap veya bulut senkronu yok."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="flex flex-col gap-2" data-progress-stat="active-day">
          <p className="text-sm font-semibold leading-5 text-muted">Aktif gün</p>
          <p className="text-3xl font-semibold tracking-tight">{activeDay}/90</p>
        </Card>
        <Card className="flex flex-col gap-2" data-progress-stat="tasks">
          <p className="text-sm font-semibold leading-5 text-muted">
            Bugünkü görevler
          </p>
          <p className="text-3xl font-semibold tracking-tight">
            {summary.trackedCompleted}/{summary.trackedTotal}
          </p>
          <p className="text-sm font-medium text-muted">
            Journal: {summary.hasJournal ? "not var" : "boş"}
          </p>
        </Card>
        <Card className="flex flex-col gap-2" data-progress-stat="storage">
          <p className="text-sm font-semibold leading-5 text-muted">Saklama</p>
          <p className="text-2xl font-semibold tracking-tight">Bu cihazda</p>
          <p className="text-sm font-medium text-muted">
            {daysWithAnyProgress} gün · {deviceCompleted} Device Lab
          </p>
        </Card>
      </div>

      <CompactSection
        eyebrow="Bugün"
        title="Görev özeti"
        description="Listen, Words, Speak ve Review tamamlanma durumu."
        action={
          <StatusPill status={summary.trackedCompleted === summary.trackedTotal ? "done" : "active"}>
            {summary.trackedCompleted}/{summary.trackedTotal}
          </StatusPill>
        }
      >
        <ProgressStrip
          items={trackedDailyTasks.map((task) => ({
            label: task.label,
            status: dayProgress.completedTasks.includes(task.completionKey)
              ? "done"
              : "pending",
          }))}
        />
        <ul className="mt-4 grid gap-2" data-progress-task-list>
          {dailyTasks.map((task) => {
            const done =
              task.completionKey != null
                ? dayProgress.completedTasks.includes(task.completionKey)
                : summary.hasJournal;

            return (
              <li
                key={task.id}
                className="flex min-h-11 items-center justify-between gap-3 rounded-[1.15rem] border border-foreground/10 bg-background/85 px-4 py-3"
              >
                <span className="text-sm font-semibold text-foreground">
                  {task.label}
                </span>
                <StatusPill status={done ? "done" : "pending"}>
                  {done ? "Tamam" : "Bekliyor"}
                </StatusPill>
              </li>
            );
          })}
        </ul>
      </CompactSection>

      <CompactSection
        eyebrow="Özet"
        title="Son yedi gün"
        description="Aktif güne kadar olan son program günlerinin sade görünümü."
      >
        <div className="grid gap-2" data-progress-recent-days>
          {recent.map((day) => (
            <div
              key={day.dayNumber}
              className="flex min-h-11 items-center justify-between gap-3 rounded-[1.15rem] border border-foreground/10 bg-linen/70 px-4 py-3"
              data-progress-day={day.dayNumber}
            >
              <p className="text-sm font-semibold text-foreground">
                Gün {day.dayNumber}
              </p>
              <p className="text-sm font-medium text-muted">
                {day.trackedCompleted}/{day.trackedTotal}
                {day.hasJournal ? " · Journal" : ""}
              </p>
            </div>
          ))}
        </div>
      </CompactSection>

      <CompactSection
        eyebrow="Device Lab"
        title="Yerel tamamlanma"
        description="Bu tarayıcıda tamamlanan Device Lab modül sayısı."
        action={<StatusPill status="synced">{deviceCompleted}</StatusPill>}
      >
        <p className="text-sm font-medium leading-6 text-muted">
          Device Lab ilerlemesi de aynı cihazdaki yerel depolamada tutulur.
        </p>
      </CompactSection>

      <CompactSection
        eyebrow="Veri"
        title="Bu cihazda saklanıyor"
        description="İlerleme tarayıcı depolamasındadır. Cihaz veya tarayıcı verisi silinirse kaybolabilir."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              void copyExportJson();
            }}
            data-progress-export
          >
            Yedeği dışa aktar
          </Button>
          <ButtonLink href="/settings" variant="secondary">
            Ayarlara git
          </ButtonLink>
        </div>
        {message ? (
          <Feedback className="mt-3" tone="success">
            {message}
          </Feedback>
        ) : null}
      </CompactSection>
    </div>
  );
}
