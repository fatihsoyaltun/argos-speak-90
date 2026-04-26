import Link from "next/link";
import type { FlowStep } from "@/lib/phase-one-content";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-3.5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
        {eyebrow}
      </p>
      <h1 className="max-w-2xl text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      <p className="max-w-xl text-[1.03rem] font-medium leading-7 text-muted">
        {description}
      </p>
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:rounded-[2rem] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function ArrowButton({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-4 text-sm font-bold outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 sm:w-auto ${
        variant === "light"
          ? "bg-white text-[#17201a] shadow-sm hover:bg-[#efe5d6] focus-visible:ring-offset-moss"
          : "bg-[#17201a] text-white shadow-soft hover:bg-[#33493a] focus-visible:ring-offset-background"
      }`}
    >
      <span>{children}</span>
      <span aria-hidden="true" className="ml-2">
        -&gt;
      </span>
    </Link>
  );
}

export function StepList({ steps }: { steps: FlowStep[] }) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
            Today’s flow
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Five clear actions
          </h2>
        </div>
        <p className="shrink-0 rounded-full bg-sage px-3 py-1.5 text-sm font-black text-moss">
          0/5
        </p>
      </div>

      <div className="grid gap-3">
        {steps.map((step) => (
          <Link
            key={`${step.order}-${step.label}`}
            href={step.href}
            className="rounded-[1.6rem] border border-foreground/10 bg-surface p-4 shadow-soft outline-none transition hover:-translate-y-0.5 hover:border-moss/40 active:scale-[0.995] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:rounded-3xl"
          >
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage text-sm font-black text-moss">
                {step.order}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-w-0 text-lg font-semibold leading-tight">
                    {step.label}
                  </h3>
                  <span className="shrink-0 rounded-full bg-linen px-3 py-1.5 text-xs font-black text-moss">
                    {step.time}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium leading-6 text-muted">
                  {step.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
