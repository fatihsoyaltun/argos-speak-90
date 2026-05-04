import Link from "next/link";
import type { FlowStep } from "@/lib/phase-one-content";

export type CompactStatus =
  | "active"
  | "atRisk"
  | "done"
  | "noSync"
  | "pending"
  | "synced"
  | "warning";

type CompactProgressItem = {
  label: string;
  status: CompactStatus;
};

type CompactStepItem = CompactProgressItem & {
  href?: string;
};

const statusStyles: Record<CompactStatus, string> = {
  active: "border-moss bg-sage text-[#17201a]",
  atRisk: "border-clay/40 bg-linen text-[#2d261d]",
  done: "border-moss bg-[#17201a] text-white",
  noSync: "border-foreground/15 bg-background/85 text-[#3f493f]",
  pending: "border-foreground/15 bg-surface text-[#3f493f]",
  synced: "border-moss/30 bg-sage text-moss",
  warning: "border-clay/35 bg-linen text-[#2d261d]",
};

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

export function StatusPill({
  children,
  className = "",
  href,
  status,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  status: CompactStatus;
}) {
  const classes = `inline-flex min-h-8 items-center justify-center rounded-full border px-3 py-1.5 text-xs font-black leading-none outline-none transition focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${statusStyles[status]} ${href ? "hover:brightness-95 active:scale-[0.98]" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}

export function CompactSection({
  action,
  children,
  className = "",
  description,
  eyebrow,
  title,
}: {
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section
      className={`rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold leading-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

export function ExpandableCard({
  children,
  className = "",
  defaultOpen = false,
  description,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  description?: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <details
      className={`group rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5 ${className}`}
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          {eyebrow ? (
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-clay">
              {eyebrow}
            </span>
          ) : null}
          <span className="mt-1 block text-lg font-semibold leading-tight text-foreground">
            {title}
          </span>
          {description ? (
            <span className="mt-1 block text-sm font-semibold leading-6 text-muted">
              {description}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linen text-lg font-black leading-none text-[#17201a] transition group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 border-t border-foreground/10 pt-4">{children}</div>
    </details>
  );
}

export function ProgressStrip({
  className = "",
  items,
}: {
  className?: string;
  items: CompactProgressItem[];
}) {
  return (
    <div
      aria-label="Progress"
      className={`flex gap-2 overflow-x-auto rounded-[1.25rem] border border-foreground/10 bg-surface p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {items.map((item) => (
        <StatusPill
          key={`${item.label}-${item.status}`}
          status={item.status}
          className="min-w-fit whitespace-nowrap"
        >
          {item.label}
        </StatusPill>
      ))}
    </div>
  );
}

export function TaskStepper({
  className = "",
  steps,
}: {
  className?: string;
  steps: CompactStepItem[];
}) {
  return (
    <ol
      aria-label="Task steps"
      className={`grid gap-2 rounded-[1.25rem] border border-foreground/10 bg-surface p-2 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] ${className}`}
    >
      {steps.map((step, index) => {
        const content = (
          <>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/70 text-xs font-black text-[#17201a]">
              {index + 1}
            </span>
            <span className="min-w-0 truncate">{step.label}</span>
          </>
        );
        const classes = `flex min-h-10 items-center gap-2 rounded-[1rem] border px-3 py-2 text-sm font-black leading-none outline-none transition focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${statusStyles[step.status]} ${step.href ? "hover:brightness-95 active:scale-[0.98]" : ""}`;

        return (
          <li key={`${step.label}-${index}`} className="min-w-0">
            {step.href ? (
              <Link href={step.href} className={classes}>
                {content}
              </Link>
            ) : (
              <span className={classes}>{content}</span>
            )}
          </li>
        );
      })}
    </ol>
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
          ? "bg-white !text-[#17201a] shadow-sm hover:bg-[#efe5d6] hover:!text-[#17201a] active:bg-[#e6dac8] active:!text-[#17201a] focus-visible:ring-offset-moss [&>span]:!text-[#17201a]"
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
