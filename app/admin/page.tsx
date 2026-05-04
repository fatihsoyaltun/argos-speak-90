import Link from "next/link";
import {
  Card,
  CompactSection,
  type CompactStatus,
  PageHeader,
  ProgressStrip,
  StatusPill,
} from "@/components/ui";
import {
  formatAdminDate,
  getAdminOverview,
  type AdminAccessState,
  type AdminTeamMember,
} from "@/lib/admin/server";

export const dynamic = "force-dynamic";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * ONE_DAY_MS;

type AccountabilityTag = {
  label: string;
  status: CompactStatus;
};

function isWithinWindow(value: string | null, windowMs: number) {
  const time = Date.parse(value || "");

  if (!Number.isFinite(time)) {
    return false;
  }

  return Date.now() - time <= windowMs;
}

function AccessMessage({ access }: { access: AdminAccessState }) {
  if (access.status === "notConfigured") {
    return (
      <Card className="space-y-4">
        <p className="text-sm font-semibold leading-6 text-muted">
          Supabase bağlantısı yapılandırılmadı.
        </p>
        <Link
          href="/settings"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#17201a] px-4 py-3 text-sm font-black !text-white outline-none transition visited:!text-white hover:bg-[#33493a] hover:!text-white active:!text-white focus-visible:!text-white focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface [&_*]:!text-white"
        >
          Settings’e dön
        </Link>
      </Card>
    );
  }

  if (access.status === "signedOut") {
    return (
      <Card className="space-y-4">
        <p className="text-sm font-semibold leading-6 text-muted">
          Admin panelini görmek için giriş yapmalısın.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#17201a] px-4 py-3 text-sm font-black !text-white outline-none transition visited:!text-white hover:bg-[#33493a] hover:!text-white active:!text-white focus-visible:!text-white focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface [&_*]:!text-white"
        >
          Login sayfasına git
        </Link>
      </Card>
    );
  }

  if (access.status === "forbidden") {
    return (
      <Card>
        <p className="rounded-[1.4rem] border border-clay/25 bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
          Bu sayfa yalnızca ekip yöneticileri içindir.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <p className="rounded-[1.4rem] border border-clay/25 bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
        Admin kullanıcısı bir takıma bağlı değil.
      </p>
      <p className="text-sm font-semibold leading-6 text-muted">
        Supabase takım kurulumunu docs/ADMIN_SETUP.md içinde kontrol et.
      </p>
    </Card>
  );
}

function StatCard({
  label,
  value,
  status = "active",
}: {
  label: string;
  status?: CompactStatus;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.25rem] border border-foreground/10 bg-background/85 p-3.5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold leading-tight">{value}</p>
        <StatusPill status={status}>{label}</StatusPill>
      </div>
    </div>
  );
}

function getMemberAccountabilityTags(member: AdminTeamMember) {
  const tags: AccountabilityTag[] = [];
  const syncedRecently = isWithinWindow(member.lastSeenAt, ONE_DAY_MS);
  const noRecentSync = !isWithinWindow(member.lastSeenAt, THREE_DAYS_MS);

  if (syncedRecently) {
    tags.push({ label: "Synced 24h", status: "synced" });
  } else if (noRecentSync) {
    tags.push({ label: "No recent sync", status: "atRisk" });
  }

  if (member.currentDayHasProgress && member.currentDaySpeakDone === false) {
    tags.push({ label: "Speak missing", status: "warning" });
  }

  if (member.currentDayHasProgress && member.currentDayReviewDone === false) {
    tags.push({ label: "Review missing", status: "warning" });
  }

  if (
    member.attentionReasons.length > 0 &&
    !tags.some((tag) => tag.label === "No recent sync")
  ) {
    tags.push({ label: "Needs attention", status: "atRisk" });
  }

  if (tags.length === 0) {
    tags.push({ label: "On track", status: "done" });
  }

  return tags.slice(0, 4);
}

function MemberCard({ member }: { member: AdminTeamMember }) {
  const displayName = member.fullName || member.email || "İsimsiz kullanıcı";
  const completionSummary =
    member.progressRows > 0
      ? `${member.totalCompletedDays}/90 gün, ort. ${member.averageCompletionPercent}%`
      : "Henüz cloud progress yok";
  const needsAttention = member.attentionReasons.length > 0;
  const accountabilityTags = getMemberAccountabilityTags(member);

  return (
    <article className="rounded-[1.35rem] border border-foreground/10 bg-background/85 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-semibold leading-tight">
            {displayName}
          </h2>
          {member.fullName && member.email ? (
            <p className="mt-1 break-words text-sm font-semibold leading-5 text-muted">
              {member.email}
            </p>
          ) : null}
        </div>
        <StatusPill status={member.role === "admin" ? "active" : "pending"}>
          {member.role}
        </StatusPill>
      </div>

      <div className="mt-3 grid gap-2">
        <ProgressStrip
          items={[
            {
              label: `Day ${member.activeDay ?? "-"}`,
              status: member.activeDay ? "active" : "pending",
            },
            {
              label: `${member.totalCompletedDays}/90 days`,
              status: member.totalCompletedDays > 0 ? "done" : "pending",
            },
            {
              label: needsAttention ? "Needs attention" : "Synced",
              status: needsAttention ? "atRisk" : "synced",
            },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          {accountabilityTags.map((tag) => (
            <StatusPill key={`${member.id}-${tag.label}`} status={tag.status}>
              {tag.label}
            </StatusPill>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <p className="rounded-[1.1rem] bg-surface p-3 text-sm font-semibold leading-6 text-muted">
            Last seen:{" "}
            <span className="text-foreground">
              {formatAdminDate(member.lastSeenAt)}
            </span>
          </p>
          <p className="rounded-[1.1rem] bg-surface p-3 text-sm font-semibold leading-6 text-muted">
            Completed:{" "}
            <span className="text-foreground">{completionSummary}</span>
          </p>
          <p className="rounded-[1.1rem] bg-surface p-3 text-sm font-semibold leading-6 text-muted sm:col-span-2">
            Team status:{" "}
            <span className="text-foreground">
              {member.teamStatus || "Not set"}
            </span>
          </p>
        </div>
      </div>

      {needsAttention ? (
        <p className="mt-3 rounded-[1.1rem] border border-clay/25 bg-linen p-3 text-sm font-semibold leading-5 text-[#2d261d]">
          Dikkat: {member.attentionReasons.join(", ")}
        </p>
      ) : null}

      <Link
        href={`/admin/users/${member.id}`}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#17201a] px-4 py-3 text-center text-sm font-black !text-white outline-none transition visited:!text-white hover:bg-[#33493a] hover:!text-white active:scale-[0.98] active:!text-white focus-visible:!text-white focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto [&_*]:!text-white"
      >
        Detayları gör
      </Link>
    </article>
  );
}

export default async function AdminPage() {
  const result = await getAdminOverview();
  const needsAttention = result.ok
    ? result.data.members.filter((member) => member.attentionReasons.length > 0)
    : [];
  const syncedRecentlyCount = result.ok
    ? result.data.members.filter((member) =>
        isWithinWindow(member.lastSeenAt, ONE_DAY_MS),
      ).length
    : 0;
  const needsSyncCount = result.ok
    ? result.data.members.filter(
        (member) => !isWithinWindow(member.lastSeenAt, THREE_DAYS_MS),
      ).length
    : 0;
  const speakMissingCount = result.ok
    ? result.data.members.filter(
        (member) =>
          member.currentDayHasProgress && member.currentDaySpeakDone === false,
      ).length
    : 0;
  const reviewMissingCount = result.ok
    ? result.data.members.filter(
        (member) =>
          member.currentDayHasProgress && member.currentDayReviewDone === false,
      ).length
    : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Team progress"
        description="Ekip üyelerinin cloud’a yedeklediği öğrenme ilerlemesini takip et."
      />

      {!result.ok && "access" in result ? (
        <AccessMessage access={result.access} />
      ) : null}

      {!result.ok && !("access" in result) ? (
        <Card className="space-y-3">
          <p className="rounded-[1.4rem] border border-clay/25 bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
            {result.errorMessage}
          </p>
          {result.technicalMessage ? (
            <p className="text-xs font-semibold leading-5 text-muted">
              {result.technicalMessage}
            </p>
          ) : null}
        </Card>
      ) : null}

      {result.ok ? (
        <>
          <CompactSection
            eyebrow="Overview"
            title="Team snapshot"
            description="Cloud’a yedeklenen mevcut takım verisinden türetilen hızlı durum."
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total members"
                status="done"
                value={result.data.totalMembers}
              />
              <StatCard
                label="Active 7 days"
                status={
                  result.data.activeLastSevenDays > 0 ? "active" : "pending"
                }
                value={result.data.activeLastSevenDays}
              />
              <StatCard
                label="Average day"
                status={result.data.averageActiveDay > 0 ? "active" : "pending"}
                value={result.data.averageActiveDay || "-"}
              />
              <StatCard
                label="Needs attention"
                status={
                  result.data.usersNeedingAttention > 0 ? "atRisk" : "done"
                }
                value={result.data.usersNeedingAttention}
              />
            </div>
          </CompactSection>

          <Card>
            <p className="rounded-[1.4rem] bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
              Bu panel yalnızca eğitim ilerlemesini takip etmek içindir.
              Kullanıcıların çalışma cevapları ve ilerleme bilgileri ekip
              yöneticisi tarafından görülebilir.
            </p>
          </Card>

          <CompactSection
            eyebrow="Accountability"
            title="Coaching signals"
            description="Mevcut sync ve day_progress verisinden türetilen destek sinyalleri."
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Synced 24h"
                status={syncedRecentlyCount > 0 ? "synced" : "pending"}
                value={syncedRecentlyCount}
              />
              <StatCard
                label="Needs sync"
                status={needsSyncCount > 0 ? "atRisk" : "done"}
                value={needsSyncCount}
              />
              <StatCard
                label="Speak missing"
                status={speakMissingCount > 0 ? "warning" : "done"}
                value={speakMissingCount}
              />
              <StatCard
                label="Review missing"
                status={reviewMissingCount > 0 ? "warning" : "done"}
                value={reviewMissingCount}
              />
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-muted">
              Journal weak point metriği overview verisinden güvenilir şekilde
              türetilemiyor; kullanıcı detayında mevcut practice entry kayıtları
              üzerinden gösterilir.
            </p>
          </CompactSection>

          {needsAttention.length > 0 ? (
            <CompactSection
              eyebrow="Needs attention"
              title="Önce bu üyeleri kontrol et"
              description="Mevcut veriye göre sync eksik veya son aktivite eski görünüyor."
              action={<StatusPill status="atRisk">{needsAttention.length}</StatusPill>}
            >
              <div className="grid gap-2">
                {needsAttention.map((member) => (
                  <Link
                    key={member.id}
                    href={`/admin/users/${member.id}`}
                    className="flex min-h-12 items-center justify-between gap-3 rounded-[1.15rem] border border-clay/25 bg-linen px-3 py-2 text-sm font-black !text-[#2d261d] outline-none transition visited:!text-[#2d261d] hover:bg-sage hover:!text-[#17201a] active:scale-[0.99] focus-visible:!text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                  >
                    <span className="min-w-0 truncate">
                      {member.fullName || member.email || "İsimsiz kullanıcı"}
                    </span>
                    <span className="shrink-0 text-xs">
                      {member.attentionReasons.join(", ")}
                    </span>
                  </Link>
                ))}
              </div>
            </CompactSection>
          ) : null}

          <CompactSection
            eyebrow="Team members"
            title="Learner overview"
            description="Üyeleri hızlıca tara; detay için ilgili karta gir."
          >
            <div className="grid gap-3">
              {result.data.members.length > 0 ? (
                result.data.members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))
              ) : (
                <div className="rounded-[1.25rem] bg-background/85 p-4">
                  <p className="text-sm font-semibold leading-6 text-muted">
                    Bu takıma bağlı kullanıcı görünmüyor. Takım atamalarını ve
                    RLS politikalarını kontrol et.
                  </p>
                </div>
              )}
            </div>
          </CompactSection>
        </>
      ) : null}
    </div>
  );
}
