import Link from "next/link";
import type {
  BlockedClaim,
  ClaimControlLevel,
  DeviceLabModule,
  ReleaseStatus,
  SourceReference,
  SourceStrength,
} from "@/lib/device-lab";

type ControlValue = ClaimControlLevel | ReleaseStatus | SourceStrength;

const controlStyles: Record<ControlValue, string> = {
  safe: "border-moss/30 bg-sage text-moss",
  cautious: "border-clay/30 bg-linen text-[#6f3d2c]",
  blocked: "border-clay/30 bg-[#f5e4de] text-[#6f2f23]",
  not_enough_source_data:
    "border-foreground/15 bg-background text-muted",
  conflict_follow_up_needed:
    "border-clay/30 bg-[#f5e4de] text-[#6f2f23]",
  learner_ready: "border-moss/30 bg-sage text-moss",
  draft_controlled: "border-clay/30 bg-linen text-[#6f3d2c]",
  deferred: "border-foreground/15 bg-background text-muted",
  strong: "border-moss/30 bg-sage text-moss",
  moderate: "border-clay/30 bg-linen text-[#6f3d2c]",
  limited: "border-foreground/15 bg-background text-muted",
};

export function ControlLabel({ value }: { value: ControlValue }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-black leading-4 break-words ${controlStyles[value]}`}
    >
      {value}
    </span>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center rounded-full border border-foreground/15 bg-surface px-4 py-2 text-sm font-black text-foreground outline-none transition hover:bg-linen active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <span aria-hidden="true" className="mr-2">
        &larr;
      </span>
      {children}
    </Link>
  );
}

export function ModuleLinkCard({
  deviceSlug,
  module,
}: {
  deviceSlug: string;
  module: DeviceLabModule;
}) {
  return (
    <Link
      href={`/device-lab/${deviceSlug}/${module.id}`}
      className="block rounded-[1.25rem] border border-foreground/10 bg-background/80 p-4 outline-none transition hover:-translate-y-0.5 hover:border-moss/40 active:scale-[0.995] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
            {module.kind} · {module.learnerLevel}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-tight">
            {module.titleTr}
          </h3>
          <p className="mt-1 text-sm font-semibold leading-5 text-muted">
            {module.titleEn}
          </p>
        </div>
        <ControlLabel value={module.releaseStatus} />
      </div>
      <p className="mt-3 text-sm font-medium leading-6 text-muted">
        {module.moduleGoalTr}
      </p>
      <p className="mt-3 text-sm font-black text-moss">Modülü aç →</p>
    </Link>
  );
}

export function SourceReferenceList({
  references,
}: {
  references: readonly SourceReference[];
}) {
  return (
    <div className="grid gap-3">
      {references.map((reference, index) => (
        <article
          key={`${reference.sourceFile}-${reference.section}-${reference.slideOrPage}-${index}`}
          className="min-w-0 rounded-[1.15rem] border border-foreground/10 bg-background/80 p-3.5"
        >
          <p className="text-xs font-black leading-5 break-words text-moss">
            {reference.sourceFile}
          </p>
          <p className="mt-1 text-sm font-semibold leading-5 text-foreground">
            {reference.section} · {reference.slideOrPage}
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-muted">
            {reference.note}
          </p>
        </article>
      ))}
    </div>
  );
}

export function BlockedClaimsSection({
  claims,
}: {
  claims: readonly BlockedClaim[];
}) {
  if (claims.length === 0) {
    return null;
  }

  return (
    <details className="group rounded-[1.45rem] border border-clay/25 bg-[#fff8f4] p-4 sm:p-5">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-xs font-bold uppercase tracking-[0.14em] text-clay">
            Claim control
          </span>
          <span className="mt-1 block text-lg font-semibold leading-tight">
            Kullanılmaması gereken / kaynak bekleyen iddialar
          </span>
          <span className="mt-1 block text-sm font-semibold leading-6 text-muted">
            Bunlar öğrenme hedefi değildir; yalnızca neden kullanılmadıklarını
            göstermek için kapalı tutulur.
          </span>
        </span>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5e4de] text-lg font-black text-[#6f2f23] transition group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 grid gap-3 border-t border-clay/15 pt-4">
        {claims.map((claim) => (
          <article
            key={claim.id}
            className="rounded-[1.15rem] border border-clay/15 bg-surface p-3.5"
          >
            <ControlLabel value="blocked" />
            <h3 className="mt-2 text-sm font-semibold leading-6 text-foreground">
              {claim.text}
            </h3>
            <p className="mt-2 text-sm font-medium leading-6 text-muted">
              {claim.reason}
            </p>
          </article>
        ))}
      </div>
    </details>
  );
}

const claimControlLegend: readonly {
  value: ClaimControlLevel;
  description: string;
}[] = [
  { value: "safe", description: "Kaynak kapsamı içinde kullanılabilir." },
  {
    value: "cautious",
    description: "Atıf, sınır veya dikkatli ifade gerektirir.",
  },
  { value: "blocked", description: "Öğrenme hedefi olarak kullanılamaz." },
  {
    value: "not_enough_source_data",
    description: "Yeterli kaynak belgesi henüz yoktur.",
  },
  {
    value: "conflict_follow_up_needed",
    description: "Kaynak çelişkisi takip edilmelidir.",
  },
];

const releaseLegend: readonly {
  value: ReleaseStatus;
  description: string;
}[] = [
  { value: "learner_ready", description: "Öğrenen görünümüne hazırdır." },
  {
    value: "draft_controlled",
    description: "Kontrollü prototip içeriğidir; sınırlar görünür kalır.",
  },
  { value: "deferred", description: "Modül içeriği sonraya bırakılmıştır." },
  { value: "blocked", description: "Yayınlanamaz veya ders olamaz." },
];

export function ControlLegend() {
  return (
    <details className="group rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:p-5">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-xs font-bold uppercase tracking-[0.14em] text-clay">
            Etiket anahtarı
          </span>
          <span className="mt-1 block text-lg font-semibold leading-tight">
            Claim-control ve yayın durumları
          </span>
          <span className="mt-1 block text-sm font-semibold leading-6 text-muted">
            Etiketlerin kısa açıklamasını aç.
          </span>
        </span>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linen text-lg font-black text-[#17201a] transition group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 grid gap-5 border-t border-foreground/10 pt-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-black">Claim-control</h3>
          <ul className="mt-3 space-y-3">
            {claimControlLegend.map((item) => (
              <li key={item.value} className="flex flex-col items-start gap-1.5">
                <ControlLabel value={item.value} />
                <span className="text-sm font-medium leading-5 text-muted">
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-black">Yayın durumu</h3>
          <ul className="mt-3 space-y-3">
            {releaseLegend.map((item) => (
              <li key={item.value} className="flex flex-col items-start gap-1.5">
                <ControlLabel value={item.value} />
                <span className="text-sm font-medium leading-5 text-muted">
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
