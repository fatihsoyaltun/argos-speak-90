"use client";

import { DayNavigator, useActiveDay } from "@/components/active-day";
import { PageHeader } from "@/components/ui";
import { WordsPractice } from "@/components/words-practice";
import { dayWords } from "@/lib/words-content";

export default function WordsPage() {
  const { activeDay } = useActiveDay();
  const dayContent = dayWords[activeDay - 1] ?? dayWords[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Words · Day ${activeDay}`}
        title={dayContent.title}
        description="10 kelimeyi 5+5 kademeli sun; dinle, anlamı kontrol et ve kendi cümleni yaz."
      />
      <DayNavigator />
      <WordsPractice key={activeDay} day={activeDay} words={dayContent.words} />
    </div>
  );
}
