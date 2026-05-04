import Link from "next/link";
import {
  Card,
  CompactSection,
  ExpandableCard,
  PageHeader,
  ProgressStrip,
  StatusPill,
} from "@/components/ui";
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
    <div className="rounded-[1.2rem] border border-foreground/10 bg-background/85 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
        {label}
      </p>
      <p className="mt-2 break-words text-lg font-semibold leading-tight">
        {value}
      </p>
    </div>
  );
}

function truncateText(value: string | null, maxLength = 150) {
  const text = value?.trim() ?? "";

  if (!text) {
    return "";
  }

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
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
  const data = result.ok ? result.data : null;
  const learnerName =
    data?.profile.full_name || data?.profile.email || "İsimsiz kullanıcı";
  const recentDayProgress = data?.dayProgress.slice(-7).reverse() ?? [];
  const recentProgressDetails = data?.dayProgress.slice(-10).reverse() ?? [];
  const practiceEntriesWithText =
    data?.practiceEntries.filter(hasPracticeText) ?? [];
  const checkedReviewCount =
    data?.reviewAnswers.filter((answer) => answer.checked_at).length ?? 0;
  const correctReviewCount =
    data?.reviewAnswers.filter((answer) => answer.is_correct === true).length ??
    0;
  const needsReviewCount =
    data?.reviewAnswers.filter((answer) => answer.is_correct === false).length ??
    0;
  const moduleCounts = recentDayProgress.reduce(
    (counts, row) => ({
      listen: counts.listen + (row.listen_done ? 1 : 0),
      review: counts.review + (row.review_done ? 1 : 0),
      speak: counts.speak + (row.speak_done ? 1 : 0),
      words: counts.words + (row.words_done ? 1 : 0),
    }),
    { listen: 0, review: 0, speak: 0, words: 0 },
  );

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <Link
          href="/admin"
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-foreground/20 bg-surface px-4 py-2 text-sm font-black !text-[#17201a] outline-none transition visited:!text-[#17201a] hover:bg-linen hover:!text-[#17201a] active:scale-[0.98] active:!text-[#17201a] focus-visible:!text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface [&_*]:!text-[#17201a]"
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

      {data ? (
        <>
          <CompactSection
            eyebrow="Learner"
            title={learnerName}
            description={
              data.profile.full_name && data.profile.email
                ? data.profile.email
                : "Cloud’a yedeklenen öğrenme ilerlemesi."
            }
          >
            <div className="flex flex-wrap gap-2">
              <StatusPill status={data.member.role === "admin" ? "active" : "pending"}>
                {data.member.role}
              </StatusPill>
              <StatusPill status={data.member.lastSeenAt ? "synced" : "noSync"}>
                {data.member.lastSeenAt ? "Synced" : "No sync"}
              </StatusPill>
              <StatusPill status={data.member.activeDay ? "active" : "pending"}>
                Day {data.member.activeDay ?? "-"}
              </StatusPill>
              {data.member.attentionReasons.length > 0 ? (
                <StatusPill status="atRisk">Needs attention</StatusPill>
              ) : null}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <DetailStat
                label="Last seen"
                value={formatAdminDate(data.member.lastSeenAt)}
              />
              <DetailStat
                label="Completed days"
                value={`${data.member.totalCompletedDays}/90`}
              />
            </div>

            {data.member.attentionReasons.length > 0 ? (
              <p className="mt-3 rounded-[1.1rem] border border-clay/25 bg-linen p-3 text-sm font-semibold leading-6 text-[#2d261d]">
                Dikkat: {data.member.attentionReasons.join(", ")}
              </p>
            ) : null}
          </CompactSection>

          <CompactSection
            eyebrow="Last 7 synced days"
            title="Recent module activity"
            description="Mevcut day_progress kayıtlarından türetilen son gün özeti."
          >
            <ProgressStrip
              items={[
                { label: `${recentDayProgress.length} days`, status: "active" },
                { label: `Listen ${moduleCounts.listen}`, status: moduleCounts.listen ? "done" : "pending" },
                { label: `Words ${moduleCounts.words}`, status: moduleCounts.words ? "done" : "pending" },
                { label: `Speak ${moduleCounts.speak}`, status: moduleCounts.speak ? "done" : "pending" },
                { label: `Review ${moduleCounts.review}`, status: moduleCounts.review ? "done" : "pending" },
              ]}
            />

            <div className="mt-3 grid gap-2">
              {recentDayProgress.length > 0 ? (
                recentDayProgress.map((row) => (
                  <div
                    key={row.day_number}
                    className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black">Day {row.day_number}</p>
                      <StatusPill
                        status={(row.completion_percent ?? 0) >= 100 ? "done" : "active"}
                      >
                        {row.completion_percent ?? 0}%
                      </StatusPill>
                    </div>
                    <ProgressStrip
                      className="mt-2 bg-transparent"
                      items={[
                        { label: "L", status: row.listen_done ? "done" : "pending" },
                        { label: "W", status: row.words_done ? "done" : "pending" },
                        { label: "S", status: row.speak_done ? "done" : "pending" },
                        { label: "R", status: row.review_done ? "done" : "pending" },
                      ]}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold leading-6 text-muted">
                  Henüz day_progress kaydı yok.
                </p>
              )}
            </div>
          </CompactSection>

          <CompactSection
            eyebrow="Practice preview"
            title="Recent written practice"
            description="Uzun cevaplar burada kısaltılır; tam metin aşağıdaki ayrıntılarda."
          >
            <div className="grid gap-2">
              {practiceEntriesWithText.slice(0, 3).map((entry) => (
                <article
                  key={entry.day_number}
                  className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-3"
                >
                  <p className="text-sm font-black">Day {entry.day_number}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                    {truncateText(
                      entry.speak_second_try ||
                        entry.speak_first_try ||
                        entry.listen_output ||
                        entry.words_output ||
                        entry.daily_note ||
                        entry.difficult_part ||
                        entry.next_review_note,
                    ) || "Kayıt var, metin önizlenemedi."}
                  </p>
                </article>
              ))}
              {practiceEntriesWithText.length === 0 ? (
                <p className="text-sm font-semibold leading-6 text-muted">
                  Henüz practice entry kaydı yok.
                </p>
              ) : null}
            </div>
          </CompactSection>

          <CompactSection
            eyebrow="Review"
            title="Answer summary"
            description="Review cevaplarının mevcut cloud özetidir."
          >
            <div className="grid gap-2 sm:grid-cols-3">
              <DetailStat label="Checked" value={checkedReviewCount} />
              <DetailStat label="Correct" value={correctReviewCount} />
              <DetailStat label="Needs review" value={needsReviewCount} />
            </div>
          </CompactSection>

          <ExpandableCard
            eyebrow="Full 90 days"
            title="Day 1-90 progress grid"
            description="Tüm günleri kompakt grid olarak aç."
          >
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {Array.from({ length: 90 }, (_, index) => {
                const dayNumber = index + 1;
                const row = data.dayProgress.find(
                  (progress) => progress.day_number === dayNumber,
                );
                const percent = row?.completion_percent ?? 0;
                const isComplete = percent >= 100;
                const hasProgress = Boolean(row);

                return (
                  <div
                    key={dayNumber}
                    className={`flex h-11 items-center justify-center rounded-2xl text-xs font-black ${
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
          </ExpandableCard>

          <ExpandableCard
            eyebrow="Recent progress"
            title="Day progress details"
            description="Son 10 day_progress kaydının modül ayrıntıları."
          >
            <div className="grid gap-2">
              {recentProgressDetails.map((row) => (
                <div
                  key={row.day_number}
                  className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold">Day {row.day_number}</p>
                    <StatusPill
                      status={(row.completion_percent ?? 0) >= 100 ? "done" : "active"}
                    >
                      {row.completion_percent ?? 0}%
                    </StatusPill>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                    Listen {row.listen_done ? "done" : "-"} · Words{" "}
                    {row.words_done ? "done" : "-"} · Speak{" "}
                    {row.speak_done ? "done" : "-"} · Review{" "}
                    {row.review_done ? "done" : "-"}
                  </p>
                </div>
              ))}
              {data.dayProgress.length === 0 ? (
                <p className="text-sm font-semibold leading-6 text-muted">
                  Henüz day_progress kaydı yok.
                </p>
              ) : null}
            </div>
          </ExpandableCard>

          <ExpandableCard
            eyebrow="Practice entries"
            title="Full saved answers"
            description="Listen, Words, Speak ve Journal metinlerinin son kayıtları."
          >
            <div className="grid gap-3">
              {practiceEntriesWithText.map((entry) => (
                <article
                  key={entry.day_number}
                  className="space-y-3 rounded-[1.25rem] border border-foreground/10 bg-background/85 p-4"
                >
                  <p className="text-lg font-semibold">Day {entry.day_number}</p>
                  {entry.listen_output ? (
                    <p className="text-sm font-semibold leading-6 text-muted">
                      Listen: <span className="text-foreground">{entry.listen_output}</span>
                    </p>
                  ) : null}
                  {entry.words_output ? (
                    <p className="text-sm font-semibold leading-6 text-muted">
                      Words: <span className="text-foreground">{entry.words_output}</span>
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
              {practiceEntriesWithText.length === 0 ? (
                <p className="text-sm font-semibold leading-6 text-muted">
                  Henüz practice entry kaydı yok.
                </p>
              ) : null}
            </div>
          </ExpandableCard>

          <ExpandableCard
            eyebrow="Review answers"
            title="Full review answer list"
            description={`${data.reviewAnswers.length} review answer row shown by existing RLS.`}
          >
            <div className="grid gap-2">
              {data.reviewAnswers.map((answer) => (
                <article
                  key={`${answer.day_number}-${answer.item_index}`}
                  className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black">
                      Day {answer.day_number} · Item {answer.item_index + 1}
                    </p>
                    <StatusPill
                      status={
                        answer.is_correct === true
                          ? "done"
                          : answer.is_correct === false
                            ? "warning"
                            : "pending"
                      }
                    >
                      {answer.is_correct === true
                        ? "Correct"
                        : answer.is_correct === false
                          ? "Needs review"
                          : "Unchecked"}
                    </StatusPill>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-foreground">
                    {answer.answer || "Boş cevap"}
                  </p>
                </article>
              ))}
              {data.reviewAnswers.length === 0 ? (
                <p className="text-sm font-semibold leading-6 text-muted">
                  Henüz review answer kaydı yok.
                </p>
              ) : null}
            </div>
          </ExpandableCard>
        </>
      ) : null}
    </div>
  );
}
