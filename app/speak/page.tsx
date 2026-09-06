"use client";

import { DayNavigator, useActiveDay } from "@/components/active-day";
import { PageHeader } from "@/components/ui";
import { SpeakingPracticeView } from "@/components/speaking-practice";
import { speakingPractices } from "@/lib/speaking-content";

export default function SpeakPage() {
  const { activeDay } = useActiveDay();
  const practice = speakingPractices[activeDay - 1] ?? speakingPractices[0];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={`Speak · Day ${activeDay}`}
        title={practice.title}
        description="Prompt → dinle → cevap/kayıt → gözden geçir → tamamla. Bir anda tek ana görev alanı."
      />
      <DayNavigator />
      <SpeakingPracticeView key={activeDay} practice={practice} />
    </div>
  );
}
