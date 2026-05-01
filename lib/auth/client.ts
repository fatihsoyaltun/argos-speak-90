"use client";

import type { Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfigStatus } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type AuthProfile = {
  email: string;
  fullName: string;
  id: string;
  role: string;
  teamId: string;
  teamStatus: string;
};

export type ClientAuthState = {
  profile: AuthProfile | null;
  profileMessage: string;
  session: Session | null;
  user: User | null;
};

type AuthResult = {
  authErrorMessage: string;
  errorMessage: string;
  profile: AuthProfile | null;
  profileMessage: string;
  session: Session | null;
  technicalMessage: string;
  user: User | null;
};

const SUPABASE_NOT_CONFIGURED_MESSAGE = "Supabase bağlantısı yapılandırılmadı.";
const PROFILE_RLS_MESSAGE =
  "Profil oluşturulamadı. Supabase RLS, giriş yapan kullanıcının kendi profiles satırını oluşturmasına izin vermiyor olabilir.";

function getConfigErrorMessage() {
  const status = getSupabaseConfigStatus();

  if (status.invalidMessage) {
    return status.invalidMessage;
  }

  if (!status.configured) {
    return SUPABASE_NOT_CONFIGURED_MESSAGE;
  }

  return "";
}

function withTechnicalDetail(message: string) {
  if (process.env.NODE_ENV !== "development" || !message) {
    return "";
  }

  return `Teknik detay: ${message}`;
}

function formatAuthErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("invalid path specified")) {
    return "Supabase URL hatalı. Project URL https://...supabase.co formatında olmalı.";
  }

  if (lowerMessage.includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı.";
  }

  if (lowerMessage.includes("email not confirmed")) {
    return "E-posta doğrulaması gerekiyor. Gelen kutunu kontrol edip tekrar giriş yap.";
  }

  if (lowerMessage.includes("user already registered")) {
    return "Bu e-posta ile hesap zaten var. Giriş yap sekmesini kullan.";
  }

  if (lowerMessage.includes("password")) {
    return "Şifre kabul edilmedi. En az 6 karakterli daha güçlü bir şifre dene.";
  }

  return "Giriş işlemi tamamlanamadı. Bilgileri kontrol edip tekrar dene.";
}

function formatProfileErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("row-level security") ||
    lowerMessage.includes("permission denied") ||
    lowerMessage.includes("violates row-level security")
  ) {
    return `${PROFILE_RLS_MESSAGE} authenticated kullanıcılar yalnızca kendi id değeriyle ve role = 'member' olacak şekilde profil oluşturabilmeli.`;
  }

  if (lowerMessage.includes("invalid path specified")) {
    return "Profil isteği Supabase URL hatası nedeniyle çalışmadı. Project URL https://...supabase.co formatında olmalı.";
  }

  return "Profil kaydı hazırlanamadı. Giriş başarılı olabilir, fakat profil satırı kontrol edilmeli.";
}

function normalizeProfile(profile: ProfileRow | null): AuthProfile | null {
  if (!profile) {
    return null;
  }

  return {
    email: profile.email ?? "",
    fullName: profile.full_name ?? "",
    id: profile.id,
    role: profile.role ?? "member",
    teamId: profile.team_id ?? "",
    teamStatus: profile.team_status ?? "",
  };
}

function getFullNameFromUser(user: User) {
  const fullName = user.user_metadata?.full_name;
  return typeof fullName === "string" ? fullName : "";
}

export async function ensureClientUserProfile(user: User) {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    const configMessage = getConfigErrorMessage();

    return {
      errorMessage: configMessage,
      profile: null,
      technicalMessage: "",
    };
  }

  const existingProfile = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile.data) {
    return {
      errorMessage: "",
      profile: normalizeProfile(existingProfile.data),
      technicalMessage: "",
    };
  }

  if (existingProfile.error && existingProfile.error.code !== "PGRST116") {
    return {
      errorMessage: formatProfileErrorMessage(existingProfile.error.message),
      profile: null,
      technicalMessage: withTechnicalDetail(existingProfile.error.message),
    };
  }

  const createdProfile = await supabase
    .from("profiles")
    .insert({
      email: user.email ?? "",
      full_name: getFullNameFromUser(user),
      id: user.id,
      role: "member",
    })
    .select("*")
    .single();

  if (createdProfile.error) {
    return {
      errorMessage: formatProfileErrorMessage(createdProfile.error.message),
      profile: null,
      technicalMessage: withTechnicalDetail(createdProfile.error.message),
    };
  }

  return {
    errorMessage: "",
    profile: normalizeProfile(createdProfile.data),
    technicalMessage: "",
  };
}

export async function getClientAuthState(): Promise<ClientAuthState> {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    const configMessage = getConfigErrorMessage();

    return {
      profile: null,
      profileMessage: configMessage,
      session: null,
      user: null,
    };
  }

  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  const user = session?.user ?? null;

  if (!user) {
    return {
      profile: null,
      profileMessage: "",
      session,
      user,
    };
  }

  const profileResult = await ensureClientUserProfile(user);

  return {
    profile: profileResult.profile,
    profileMessage: profileResult.errorMessage,
    session,
    user,
  };
}

export async function refreshClientAuthState() {
  return getClientAuthState();
}

export async function signInWithEmailPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    const configMessage = getConfigErrorMessage();

    return {
      authErrorMessage: configMessage,
      errorMessage: configMessage,
      profile: null,
      profileMessage: "",
      session: null,
      technicalMessage: "",
      user: null,
    };
  }

  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (result.error) {
    const authErrorMessage = formatAuthErrorMessage(result.error.message);

    return {
      authErrorMessage,
      errorMessage: authErrorMessage,
      profile: null,
      profileMessage: "",
      session: null,
      technicalMessage: withTechnicalDetail(result.error.message),
      user: null,
    };
  }

  const user = result.data.user;
  const profileResult = user && result.data.session
    ? await ensureClientUserProfile(user)
    : { errorMessage: "", profile: null, technicalMessage: "" };

  return {
    authErrorMessage: "",
    errorMessage: "",
    profile: profileResult.profile,
    profileMessage: profileResult.errorMessage,
    session: result.data.session,
    technicalMessage: profileResult.technicalMessage,
    user,
  };
}

export async function signUpWithEmailPassword({
  email,
  fullName,
  password,
}: {
  email: string;
  fullName: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    const configMessage = getConfigErrorMessage();

    return {
      authErrorMessage: configMessage,
      errorMessage: configMessage,
      profile: null,
      profileMessage: "",
      session: null,
      technicalMessage: "",
      user: null,
    };
  }

  const result = await supabase.auth.signUp({
    email,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
    password,
  });

  if (result.error) {
    const authErrorMessage = formatAuthErrorMessage(result.error.message);

    return {
      authErrorMessage,
      errorMessage: authErrorMessage,
      profile: null,
      profileMessage: "",
      session: null,
      technicalMessage: withTechnicalDetail(result.error.message),
      user: null,
    };
  }

  const user = result.data.user;
  const profileResult = user && result.data.session
    ? await ensureClientUserProfile(user)
    : { errorMessage: "", profile: null, technicalMessage: "" };

  return {
    authErrorMessage: "",
    errorMessage: "",
    profile: profileResult.profile,
    profileMessage: profileResult.errorMessage,
    session: result.data.session,
    technicalMessage: profileResult.technicalMessage,
    user,
  };
}

export async function signOutClientUser() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return getConfigErrorMessage();
  }

  const result = await supabase.auth.signOut();
  return result.error?.message ?? "";
}
