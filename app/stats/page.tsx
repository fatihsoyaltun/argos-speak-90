"use client";

import { useEffect, useState } from "react";
import { useActiveDay } from "@/components/active-day";
import { Card, PageHeader } from "@/components/ui";
import {
  getDayProgress,
  PRACTICE_PROGRESS_UPDATED_EVENT,
} from "@/lib/practice-storage";

export default function StatsPage() {
  const { activeDay } = useActiveDay();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    function refreshProgress() {
      setCompletedCount(getDayProgress(activeDay).completedTasks.length);
    }

    refreshProgress();
    window.addEventListener(PRACTICE_PROGRESS_UPDATED_EVENT, refreshProgress);

    return () => {
      window.removeEventListener(
        PRACTICE_PROGRESS_UPDATED_EVENT,
        refreshProgress,
      );
    };
  }, [activeDay]);

  const stats = [
    ["Aktif gün", String(activeDay)],
    ["Tamamlanan görev", `${completedCount}/4`],
    ["Saklama", "Bu cihaz"],
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="İlerleme"
        title="Yerel ilerlemen"
        description="Bu ekranda aynı cihazdaki yerel günlük ilerleme özetini görebilirsin."
      />

      <div className="grid gap-3">
        {stats.map(([label, value]) => (
          <Card
            key={label}
            className="flex items-center justify-between gap-4"
          >
            <p className="min-w-0 text-sm font-semibold leading-5 text-muted">
              {label}
            </p>
            <p className="shrink-0 text-2xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
