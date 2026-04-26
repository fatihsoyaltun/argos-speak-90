"use client";

import { useActiveDay } from "@/components/active-day";
import { Card, PageHeader } from "@/components/ui";

export default function StatsPage() {
  const { activeDay } = useActiveDay();
  const stats = [
    ["Current day", String(activeDay)],
    ["Completed steps", "0/5"],
    ["Practice mode", "Local"],
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Stats"
        title="Progress will stay visible."
        description="This placeholder sets up the future progress view without adding streaks, storage, or database logic yet."
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
