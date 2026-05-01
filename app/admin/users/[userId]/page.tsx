import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import {
  formatAdminDate,
  getAdminUserDetail,
  type AdminAccessState,
} from "@/lib/admin/server";

export const dynamic = "force-dynamic";

function AccessMessage({ access }: { access: AdminAccessState }) {
  if (access.status === "notConfigured") {
    return (
      <Card>
        <p className="text-sm font-semibold leading-6 text-muted">
          Supabase bağlantısı yapılandırılmadı.
        </p>
      </Card>
    );
  }

  if (access.status === "signedOut") {
    return (
      <Card className="space-y-4">
        <p className="text-sm font-semibold leading-6 text-muted">
          Admin detayını görmek için giriş yapmalısın.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#17201a] px-4 py-3 text-sm font-black text-white outline-none transition hover:bg-[#33493a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
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
    <Card>
      <p className="rounded-[1.4rem] border border-clay/25 bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
        Admin kullanıcısı bir takıma bağlı değil.
      </p>
    </Card>
  );
}

function DetailStat({
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
      <p className="mt-2 break-words text-lg font-semibold leading-tight">
        {value}
      </p>
    </div>
  );
}

function hasPracticeText(entry: {
  daily_note: string | null;
  difficult_part: string | null;
  listen_output: string | null;
  next_review_note: string | null;
  speak_first_try: string | null;
  speak_second_try: string | null;
  words_output: string | null;
}) {
  return Boolean(
    entry.listen_output ||
      entry.words_output ||
      entry.speak_first_try ||
      entry.speak_second_try ||
      entry.daily_note ||
      entry.difficult_part ||
      entry.next_review_note,
  );
}

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const result = await getAdminUserDetail(userId);

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <Link
          href="/admin"
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-foreground/20 bg-surface px-4 py-2 text-sm font-black text-[#17201a] outline-none transition hover:bg-linen active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
        >
          Admin paneline dön
        </Link>
        <PageHeader
          eyebrow="Admin detail"
          title="Learner progress"
          description="Seçili kullanıcının cloud’a yedeklediği günlük çalışma kayıtları."
        />
      </div>

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
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                Learner
              </p>
              <h1 className="mt-1 break-words text-2xl font-semibold leading-tight">
                {result.data.profile.full_name ||
                  result.data.profile.email ||
                  "İsimsiz kullanıcı"}
              </h1>
              {result.data.profile.full_name && result.data.profile.email ? (
                <p className="mt-1 break-words text-sm font-semibold leading-5 text-muted">
                  {result.data.profile.email}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailStat label="Role" value={result.data.member.role} />
              <DetailStat
                label="Active day"
                value={result.data.member.activeDay ?? "-"}
              />
              <DetailStat
                label="Last seen"
                value={formatAdminDate(result.data.member.lastSeenAt)}
              />
              <DetailStat
                label="Completed days"
                value={`${result.data.member.totalCompletedDays}/90`}
              />
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                Day 1-90
              </p>
              <h2 className="mt-1 text-2xl font-semibold leading-tight">
                Progress overview
              </h2>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {Array.from({ length: 90 }, (_, index) => {
                const dayNumber = index + 1;
                const row = result.data.dayProgress.find(
                  (progress) => progress.day_number === dayNumber,
                );
                const percent = row?.completion_percent ?? 0;
                const isComplete = percent >= 100;
                const hasProgress = Boolean(row);

                return (
                  <div
                    key={dayNumber}
                    className={`flex h-12 items-center justify-center rounded-2xl text-xs font-black ${
                      isComplete
                        ? "bg-[#17201a] text-white"
                        : hasProgress
                          ? "bg-sage text-moss"
                          : "bg-background/85 text-muted"
                    }`}
                    title={`Day ${dayNumber}: ${percent}%`}
                  >
                    {dayNumber}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                Recent progress
              </p>
              <h2 className="mt-1 text-2xl font-semibold leading-tight">
                Day progress rows
              </h2>
            </div>
            <div className="grid gap-3">
              {result.data.dayProgress.slice(-10).reverse().map((row) => (
                <div
                  key={row.day_number}
                  className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold">Day {row.day_number}</p>
                    <span className="rounded-full bg-linen px-3 py-1.5 text-xs font-black text-moss">
                      {row.completion_percent ?? 0}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                    Listen {row.listen_done ? "done" : "-"} · Words{" "}
                    {row.words_done ? "done" : "-"} · Speak{" "}
                    {row.speak_done ? "done" : "-"} · Review{" "}
                    {row.review_done ? "done" : "-"}
                  </p>
                </div>
              ))}
              {result.data.dayProgress.length === 0 ? (
                <p className="text-sm font-semibold leading-6 text-muted">
                  Henüz day_progress kaydı yok.
                </p>
              ) : null}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                Practice entries
              </p>
              <h2 className="mt-1 text-2xl font-semibold leading-tight">
                Recent saved answers
              </h2>
            </div>
            <div className="grid gap-3">
              {result.data.practiceEntries.filter(hasPracticeText).map((entry) => (
                <article
                  key={entry.day_number}
                  className="space-y-3 rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4"
                >
                  <p className="text-lg font-semibold">Day {entry.day_number}</p>
                  {entry.listen_output ? (
                    <p className="text-sm font-semibold leading-6 text-muted">
                      Listen:{" "}
                      <span className="text-foreground">
                        {entry.listen_output}
                      </span>
                    </p>
                  ) : null}
                  {entry.words_output ? (
                    <p className="text-sm font-semibold leading-6 text-muted">
                      Words:{" "}
                      <span className="text-foreground">
                        {entry.words_output}
                      </span>
                    </p>
                  ) : null}
                  {entry.speak_first_try || entry.speak_second_try ? (
                    <p className="text-sm font-semibold leading-6 text-muted">
                      Speak:{" "}
                      <span className="text-foreground">
                        {entry.speak_second_try || entry.speak_first_try}
                      </span>
                    </p>
                  ) : null}
                  {entry.daily_note ||
                  entry.difficult_part ||
                  entry.next_review_note ? (
                    <p className="text-sm font-semibold leading-6 text-muted">
                      Journal:{" "}
                      <span className="text-foreground">
                        {entry.daily_note ||
                          entry.difficult_part ||
                          entry.next_review_note}
                      </span>
                    </p>
                  ) : null}
                </article>
              ))}
              {result.data.practiceEntries.filter(hasPracticeText).length ===
              0 ? (
                <p className="text-sm font-semibold leading-6 text-muted">
                  Henüz practice entry kaydı yok.
                </p>
              ) : null}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                Review
              </p>
              <h2 className="mt-1 text-2xl font-semibold leading-tight">
                Answer summary
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <DetailStat
                label="Checked"
                value={
                  result.data.reviewAnswers.filter((answer) => answer.checked_at)
                    .length
                }
              />
              <DetailStat
                label="Correct"
                value={
                  result.data.reviewAnswers.filter(
                    (answer) => answer.is_correct === true,
                  ).length
                }
              />
              <DetailStat
                label="Needs review"
                value={
                  result.data.reviewAnswers.filter(
                    (answer) => answer.is_correct === false,
                  ).length
                }
              />
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
