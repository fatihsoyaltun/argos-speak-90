import type { Metadata } from "next";
import { ButtonLink, Card, PageHeader } from "@/components/ui";
import { practiceAreas } from "@/lib/phase-one-content";

export const metadata: Metadata = {
  title: "Pratik",
};

export default function PracticePage() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Pratik"
        title="Günlük çalışma alanları"
        description="Listen, Words, Speak, Review ve Journal görevlerinden kaldığın yere geç."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {practiceAreas.map((area, index) => (
          <Card key={area.href} className="flex flex-col gap-4">
            <div className="flex flex-1 gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-sm font-black text-moss">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold leading-tight">
                  {area.label}
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-text-secondary">
                  {area.description}
                </p>
              </div>
            </div>
            <ButtonLink href={area.href} variant="secondary" className="w-full">
              {area.label} bölümünü aç
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
