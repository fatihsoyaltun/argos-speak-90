"use client";

import Link from "next/link";
import { DayNavigator, useActiveDay } from "@/components/active-day";
import { Card, PageHeader, StepList } from "@/components/ui";
import { learningTrackPlan } from "@/lib/content-plan";
import { listeningDrills } from "@/lib/listening-content";
import { dailyFlow } from "@/lib/phase-one-content";

export default function TodayPage() {
  const { activeDay } = useActiveDay();
  const dayIndex = activeDay - 1;
  const plan = learningTrackPlan[dayIndex] ?? learningTrackPlan[0];
  const listening = listeningDrills[dayIndex] ?? listeningDrills[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Day ${activeDay}`}
        title={plan.theme}
        description={plan.speakingGoal}
      />
      <DayNavigator />

      <Card className="space-y-5 !border-moss/20 !bg-moss text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-linen sm:text-sm">
              Next step
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">
              {listening.title}
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-surface px-3 py-1.5 text-xs font-black text-moss shadow-sm">
            12 min session
          </span>
        </div>
        <p className="max-w-xl text-sm font-medium leading-6 text-white/90">
          {listening.focus}
        </p>
        <Link
          href="/listen"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full !bg-white px-5 py-4 text-sm font-black !text-[#17201a] shadow-sm outline-none transition hover:!bg-[#efe5d6] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss sm:w-auto"
        >
          <span className="!text-[#17201a]">Start listening</span>
          <span aria-hidden="true" className="ml-2 !text-[#17201a]">
            -&gt;
          </span>
        </Link>
      </Card>

      <StepList steps={dailyFlow} />
    </div>
  );
}
