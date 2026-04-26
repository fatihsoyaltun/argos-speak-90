"use client";

import { DayNavigator, useActiveDay } from "@/components/active-day";
import { ReviewPractice } from "@/components/review-practice";
import { PageHeader } from "@/components/ui";
import { reviewDrills } from "@/lib/review-content";

export default function ReviewPage() {
  const { activeDay } = useActiveDay();
  const drill = reviewDrills[activeDay - 1] ?? reviewDrills[0];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={`Review · Day ${activeDay}`}
        title={drill.title}
        description="Kısa cevaplar yaz, kontrol et ve eksik kalan cümleyi tekrar et."
      />
      <DayNavigator />
      <ReviewPractice key={activeDay} drill={drill} />
    </div>
  );
}
