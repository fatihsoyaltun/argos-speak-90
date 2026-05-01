import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type UserStatusRow = Database["public"]["Tables"]["user_status"]["Row"];
type DayProgressRow = Database["public"]["Tables"]["day_progress"]["Row"];
type PracticeEntryRow =
  Database["public"]["Tables"]["practice_entries"]["Row"];
type ReviewAnswerRow =
  Database["public"]["Tables"]["review_answers"]["Row"];

export type AdminAccessState =
  | { status: "notConfigured" }
  | { status: "signedOut" }
  | { profile: ProfileRow; status: "forbidden" }
  | { profile: ProfileRow; status: "noTeam" }
  | {
      profile: ProfileRow;
      supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
      status: "allowed";
      teamId: string;
    };

export type AdminTeamMember = {
  activeDay: number | null;
  attentionReasons: string[];
  averageCompletionPercent: number;
  completedDays: number;
  email: string;
  fullName: string;
  id: string;
  lastSeenAt: string | null;
  progressRows: number;
  role: string;
  teamStatus: string;
  totalCompletedDays: number;
};

export type AdminOverview = {
  activeLastSevenDays: number;
  averageActiveDay: number;
  members: AdminTeamMember[];
  totalMembers: number;
  usersNeedingAttention: number;
};

export type AdminUserDetail = {
  dayProgress: DayProgressRow[];
  member: AdminTeamMember;
  practiceEntries: PracticeEntryRow[];
  profile: ProfileRow;
  reviewAnswers: ReviewAnswerRow[];
  status: UserStatusRow | null;
};

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getTime(value: string | null | undefined) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function isRecent(value: string | null | undefined, windowMs: number) {
  const time = getTime(value);

  if (!time) {
    return false;
  }

  return Date.now() - time <= windowMs;
}

function getAdminErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("team_id") ||
    lowerMessage.includes("does not exist") ||
    lowerMessage.includes("column")
  ) {
    return "Admin takım kurulumu eksik. profiles.team_id ve takım RLS ayarlarını kontrol et.";
  }

  if (
    lowerMessage.includes("row-level security") ||
    lowerMessage.includes("permission denied") ||
    lowerMessage.includes("violates row-level security")
  ) {
    return "Admin verileri okunamadı. Supabase RLS, yöneticinin kendi takımındaki kullanıcıları okumasına izin vermeli.";
  }

  return "Admin verileri alınamadı. Supabase bağlantısını ve RLS ayarlarını kontrol et.";
}

export function formatAdminDate(value: string | null | undefined) {
  if (!value) {
    return "Henüz yok";
  }

  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Okunamadı";
  }
}

export function getAdminTechnicalDetail(message: string) {
  if (process.env.NODE_ENV !== "development" || !message) {
    return "";
  }

  return `Teknik detay: ${message}`;
}

export async function getAdminAccess(): Promise<AdminAccessState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { status: "notConfigured" };
  }

  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;

  if (!user) {
    return { status: "signedOut" };
  }

  const profileResult = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileResult.data;

  if (!profile || profile.role !== "admin") {
    return {
      profile:
        profile ??
        {
          created_at: null,
          email: user.email ?? "",
          full_name: null,
          id: user.id,
          role: "member",
          team_id: null,
          team_status: null,
          updated_at: null,
        },
      status: "forbidden",
    };
  }

  if (!profile.team_id) {
    return { profile, status: "noTeam" };
  }

  return {
    profile,
    status: "allowed",
    supabase,
    teamId: profile.team_id,
  };
}

function createMember({
  dayProgress,
  profile,
  status,
}: {
  dayProgress: DayProgressRow[];
  profile: ProfileRow;
  status: UserStatusRow | null;
}): AdminTeamMember {
  const completedDays = dayProgress.filter(
    (day) => (day.completion_percent ?? 0) >= 100,
  ).length;
  const averageCompletionPercent =
    dayProgress.length > 0
      ? Math.round(
          dayProgress.reduce(
            (total, day) => total + (day.completion_percent ?? 0),
            0,
          ) / dayProgress.length,
        )
      : 0;
  const attentionReasons = [];

  if (!status?.last_seen_at) {
    attentionReasons.push("Henüz sync yok");
  } else if (!isRecent(status.last_seen_at, THREE_DAYS_MS)) {
    attentionReasons.push("3+ gündür aktivite yok");
  }

  if (status && !isRecent(status.updated_at, THREE_DAYS_MS)) {
    attentionReasons.push("Son sync eski");
  }

  return {
    activeDay: status?.active_day ?? null,
    attentionReasons,
    averageCompletionPercent,
    completedDays: status?.total_completed_days ?? completedDays,
    email: profile.email ?? "",
    fullName: profile.full_name ?? "",
    id: profile.id,
    lastSeenAt: status?.last_seen_at ?? null,
    progressRows: dayProgress.length,
    role: profile.role ?? "member",
    teamStatus: profile.team_status ?? "",
    totalCompletedDays: status?.total_completed_days ?? completedDays,
  };
}

export async function getAdminOverview(): Promise<
  | { access: Exclude<AdminAccessState, { status: "allowed" }>; ok: false }
  | {
      access: Extract<AdminAccessState, { status: "allowed" }>;
      data: AdminOverview;
      ok: true;
    }
  | { errorMessage: string; ok: false; technicalMessage: string }
> {
  const access = await getAdminAccess();

  if (access.status !== "allowed") {
    return { access, ok: false };
  }

  const profilesResult = await access.supabase
    .from("profiles")
    .select("*")
    .eq("team_id", access.teamId)
    .order("full_name", { ascending: true });

  if (profilesResult.error) {
    return {
      errorMessage: getAdminErrorMessage(profilesResult.error.message),
      ok: false,
      technicalMessage: getAdminTechnicalDetail(profilesResult.error.message),
    };
  }

  const profiles = profilesResult.data ?? [];
  const userIds = profiles.map((profile) => profile.id);
  const [statusResult, dayProgressResult] =
    userIds.length > 0
      ? await Promise.all([
          access.supabase.from("user_status").select("*").in("user_id", userIds),
          access.supabase.from("day_progress").select("*").in("user_id", userIds),
        ])
      : [
          { data: [], error: null },
          { data: [], error: null },
        ];

  const error = statusResult.error ?? dayProgressResult.error;

  if (error) {
    return {
      errorMessage: getAdminErrorMessage(error.message),
      ok: false,
      technicalMessage: getAdminTechnicalDetail(error.message),
    };
  }

  const statuses = new Map(
    (statusResult.data ?? []).map((status) => [status.user_id, status]),
  );
  const dayProgressByUser = new Map<string, DayProgressRow[]>();

  (dayProgressResult.data ?? []).forEach((row) => {
    const rows = dayProgressByUser.get(row.user_id) ?? [];
    rows.push(row);
    dayProgressByUser.set(row.user_id, rows);
  });

  const members = profiles.map((profile) =>
    createMember({
      dayProgress: dayProgressByUser.get(profile.id) ?? [],
      profile,
      status: statuses.get(profile.id) ?? null,
    }),
  );
  const usersWithActiveDay = members.filter((member) => member.activeDay);
  const averageActiveDay =
    usersWithActiveDay.length > 0
      ? Math.round(
          usersWithActiveDay.reduce(
            (total, member) => total + (member.activeDay ?? 0),
            0,
          ) / usersWithActiveDay.length,
        )
      : 0;

  return {
    access,
    data: {
      activeLastSevenDays: members.filter((member) =>
        isRecent(member.lastSeenAt, SEVEN_DAYS_MS),
      ).length,
      averageActiveDay,
      members,
      totalMembers: members.length,
      usersNeedingAttention: members.filter(
        (member) => member.attentionReasons.length > 0,
      ).length,
    },
    ok: true,
  };
}

export async function getAdminUserDetail(
  userId: string,
): Promise<
  | { access: Exclude<AdminAccessState, { status: "allowed" }>; ok: false }
  | {
      access: Extract<AdminAccessState, { status: "allowed" }>;
      data: AdminUserDetail;
      ok: true;
    }
  | { errorMessage: string; ok: false; technicalMessage: string }
> {
  const access = await getAdminAccess();

  if (access.status !== "allowed") {
    return { access, ok: false };
  }

  const profileResult = await access.supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .eq("team_id", access.teamId)
    .maybeSingle();

  if (profileResult.error) {
    return {
      errorMessage: getAdminErrorMessage(profileResult.error.message),
      ok: false,
      technicalMessage: getAdminTechnicalDetail(profileResult.error.message),
    };
  }

  if (!profileResult.data) {
    return {
      errorMessage: "Bu kullanıcı bulunamadı veya admin ile aynı takımda değil.",
      ok: false,
      technicalMessage: "",
    };
  }

  const [statusResult, dayProgressResult, practiceResult, reviewResult] =
    await Promise.all([
      access.supabase
        .from("user_status")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
      access.supabase
        .from("day_progress")
        .select("*")
        .eq("user_id", userId)
        .order("day_number", { ascending: true }),
      access.supabase
        .from("practice_entries")
        .select("*")
        .eq("user_id", userId)
        .order("day_number", { ascending: false })
        .limit(12),
      access.supabase
        .from("review_answers")
        .select("*")
        .eq("user_id", userId)
        .order("day_number", { ascending: false })
        .limit(80),
    ]);

  const error =
    (statusResult.error?.code === "PGRST116" ? null : statusResult.error) ??
    dayProgressResult.error ??
    practiceResult.error ??
    reviewResult.error;

  if (error) {
    return {
      errorMessage: getAdminErrorMessage(error.message),
      ok: false,
      technicalMessage: getAdminTechnicalDetail(error.message),
    };
  }

  const dayProgress = dayProgressResult.data ?? [];
  const status = statusResult.data ?? null;

  return {
    access,
    data: {
      dayProgress,
      member: createMember({
        dayProgress,
        profile: profileResult.data,
        status,
      }),
      practiceEntries: practiceResult.data ?? [],
      profile: profileResult.data,
      reviewAnswers: reviewResult.data ?? [],
      status,
    },
    ok: true,
  };
}
