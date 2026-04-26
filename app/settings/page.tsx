import { Card, PageHeader } from "@/components/ui";

const settings = [
  "Daily practice reminders",
  "Audio and speaking preferences",
  "Local progress utilities",
];

export default function SettingsPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Settings"
        title="Utilities will live here."
        description="This placeholder keeps settings visible while avoiding auth, backend, or storage work in Phase 1."
      />

      <Card className="space-y-3">
        {settings.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-foreground/10 bg-background/80 px-4 py-3.5 text-sm font-semibold leading-5"
          >
            {item}
          </div>
        ))}
      </Card>
    </div>
  );
}
