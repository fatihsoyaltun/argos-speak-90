import { ArrowButton, Card, PageHeader } from "@/components/ui";

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  focusItems,
  nextHref,
  nextLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  focusItems: string[];
  nextHref: string;
  nextLabel: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <Card className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
          Phase 1 placeholder
        </p>
        <div className="grid gap-3">
          {focusItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-foreground/10 bg-background/80 px-4 py-3.5 text-sm font-semibold leading-5 text-foreground"
            >
              {item}
            </div>
          ))}
        </div>
        <ArrowButton href={nextHref}>{nextLabel}</ArrowButton>
      </Card>
    </div>
  );
}
