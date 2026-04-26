"use client";

import { DayNavigator, useActiveDay } from "@/components/active-day";
import { ListeningDrillView } from "@/components/listening-drill";
import { PageHeader } from "@/components/ui";
import { listeningDrills } from "@/lib/listening-content";

export default function ListenPage() {
  const { activeDay } = useActiveDay();
  const drill = listeningDrills[activeDay - 1] ?? listeningDrills[0];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={`Listen · Day ${activeDay}`}
        title={drill.title}
        description="Dinle, transcripti takip et, önemli cümleleri yakala ve kısa bir cevap yaz."
      />
      <DayNavigator />
      <ListeningDrillView key={activeDay} drill={drill} />
    </div>
  );
}
