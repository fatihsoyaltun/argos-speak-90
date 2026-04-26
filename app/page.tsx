import Link from "next/link";
import { ArrowButton, Card, PageHeader } from "@/components/ui";
import { dailyFlow } from "@/lib/phase-one-content";

export default function Home() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Argos Speak 90"
        title="Practice speaking every day without confusion."
        description="A calm 90-day training system for listening, repeating, using words, speaking, and reviewing."
      />

      <Card className="space-y-5 !bg-foreground text-white">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-linen sm:text-sm">
            Start here
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-balance">
            Today gives you one clear path.
          </h2>
          <p className="text-sm font-medium leading-6 text-white/90">
            Open the command center, follow the flow, and finish a short
            speaking-first session.
          </p>
        </div>
        <ArrowButton href="/today" variant="light">
          Go to Today
        </ArrowButton>
      </Card>

      <section className="grid gap-3">
        {dailyFlow.map((step) => (
          <Link
            key={`${step.order}-${step.label}`}
            href={step.href}
            className="rounded-[1.6rem] border border-foreground/10 bg-surface p-4 shadow-soft outline-none transition hover:-translate-y-0.5 hover:border-moss/40 active:scale-[0.995] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:rounded-3xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
                  {step.time}
                </p>
                <h3 className="mt-1 truncate text-lg font-semibold">
                  {step.label}
                </h3>
              </div>
              <span className="shrink-0 rounded-full bg-sage px-3 py-1.5 text-sm font-black text-moss">
                {step.order}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
