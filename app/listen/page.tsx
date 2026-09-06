"use client";

import { DayNavigator, useActiveDay } from "@/components/active-day";
import { ListeningDrillView } from "@/components/listening-drill";
import { PageHeader } from "@/components/ui";
import { listeningDrills } from "@/lib/listening-content";

export default function ListenPage() {
  const { activeDay } = useActiveDay();
  const drill = listeningDrills[activeDay - 1] ?? listeningDrills[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Listen · Day ${activeDay}`}
        title={drill.title}
        description="Tek ana Dinle kontrolüyle dinle, transcripti takip et ve kısa cevabını kaydet."
      />
      <DayNavigator />
      <ListeningDrillView key={activeDay} drill={drill} />
    </div>
  );
}
