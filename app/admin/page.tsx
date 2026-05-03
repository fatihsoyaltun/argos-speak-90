import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import {
  formatAdminDate,
  getAdminOverview,
  type AdminAccessState,
  type AdminTeamMember,
} from "@/lib/admin/server";

export const dynamic = "force-dynamic";

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
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold leading-tight">{value}</p>
    </div>
  );
}

function MemberCard({ member }: { member: AdminTeamMember }) {
  const displayName = member.fullName || member.email || "İsimsiz kullanıcı";
  const completionSummary =
    member.progressRows > 0
      ? `${member.totalCompletedDays}/90 gün, ort. ${member.averageCompletionPercent}%`
      : "Henüz cloud progress yok";

  return (
    <article className="rounded-[1.5rem] border border-foreground/10 bg-background/85 p-4">
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
        <span className="shrink-0 rounded-full bg-sage px-3 py-1.5 text-xs font-black text-moss">
          {member.role}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="text-sm font-semibold leading-6 text-muted">
          Active day:{" "}
          <span className="text-foreground">{member.activeDay ?? "-"}</span>
        </p>
        <p className="text-sm font-semibold leading-6 text-muted">
          Last seen:{" "}
          <span className="text-foreground">
            {formatAdminDate(member.lastSeenAt)}
          </span>
        </p>
        <p className="text-sm font-semibold leading-6 text-muted">
          Completed:{" "}
          <span className="text-foreground">{completionSummary}</span>
        </p>
        <p className="text-sm font-semibold leading-6 text-muted">
          Team status:{" "}
          <span className="text-foreground">
            {member.teamStatus || "Not set"}
          </span>
        </p>
      </div>

      {member.attentionReasons.length > 0 ? (
        <p className="mt-4 rounded-[1.2rem] border border-clay/25 bg-linen p-3 text-sm font-semibold leading-5 text-[#2d261d]">
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

  return (
    <div className="space-y-7">
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
          <Card className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard label="Total members" value={result.data.totalMembers} />
              <StatCard
                label="Active 7 days"
                value={result.data.activeLastSevenDays}
              />
              <StatCard
                label="Average day"
                value={result.data.averageActiveDay || "-"}
              />
              <StatCard
                label="Needs attention"
                value={result.data.usersNeedingAttention}
              />
            </div>
          </Card>

          <Card>
            <p className="rounded-[1.4rem] bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
              Bu panel yalnızca eğitim ilerlemesini takip etmek içindir.
              Kullanıcıların çalışma cevapları ve ilerleme bilgileri ekip
              yöneticisi tarafından görülebilir.
            </p>
          </Card>

          <section className="space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                Team members
              </p>
              <h2 className="mt-1 text-2xl font-semibold leading-tight">
                Learner overview
              </h2>
            </div>
            <div className="grid gap-3">
              {result.data.members.length > 0 ? (
                result.data.members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))
              ) : (
                <Card>
                  <p className="text-sm font-semibold leading-6 text-muted">
                    Bu takıma bağlı kullanıcı görünmüyor. Takım atamalarını ve
                    RLS politikalarını kontrol et.
                  </p>
                </Card>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
