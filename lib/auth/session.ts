"use client";

import type { Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  getSupabaseAuthStorageKey,
  getSupabaseConfigStatus,
} from "@/lib/supabase/env";

export type SafeAuthStatus =
  | "ready"
  | "notConfigured"
  | "notSignedIn"
  | "authExpired"
  | "connectionError"
  | "error";

export type SafeAuthState = {
  errorMessage: string;
  session: Session | null;
  status: SafeAuthStatus;
  technicalMessage: string;
  user: User | null;
};

let currentSessionPromise: Promise<SafeAuthState> | null = null;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "";
}

function getTechnicalMessage(message: string) {
  if (process.env.NODE_ENV !== "development" || !message) {
    return "";
  }

  return `Teknik detay: ${message}`;
}

export function isStaleRefreshTokenError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("invalid refresh token") ||
    message.includes("refresh token not found") ||
    message.includes("refresh_token_not_found")
  );
}

export function isAuthLockError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("lock broken") ||
    message.includes("lock was released") ||
    message.includes("was not released") ||
    message.includes("stole it") ||
    message.includes("another request stole")
  );
}

export function isAuthFetchError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("failed to fetch") ||
    message.includes("authretryablefetcherror") ||
    message.includes("networkerror") ||
    message.includes("network request failed")
  );
}

function removeStorageItems(storage: Storage | null, authStorageKey: string) {
  if (!storage || !authStorageKey) {
    return;
  }

  try {
    const keys = Array.from({ length: storage.length }, (_, index) =>
      storage.key(index),
    ).filter((key): key is string => Boolean(key));

    keys.forEach((key) => {
      if (
        key === authStorageKey ||
        key.startsWith(`${authStorageKey}.`) ||
        key.startsWith(`${authStorageKey}-`)
      ) {
        storage.removeItem(key);
      }
    });
  } catch {
    // Manual auth cleanup should not break local-first app behavior.
  }
}

function removeAuthCookies(authStorageKey: string) {
  if (typeof document === "undefined" || !authStorageKey) {
    return;
  }

  try {
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0]?.trim();

      if (
        cookieName &&
        (cookieName === authStorageKey ||
          cookieName.startsWith(`${authStorageKey}.`) ||
          cookieName.startsWith(`${authStorageKey}-`))
      ) {
        document.cookie = `${cookieName}=; Max-Age=0; path=/; SameSite=Lax`;
      }
    });
  } catch {
    // Cookie cleanup can fail in restricted contexts; storage cleanup is enough.
  }
}

export async function clearStaleSupabaseSession() {
  const authStorageKey = getSupabaseAuthStorageKey();
  const supabase = createSupabaseBrowserClient();

  if (supabase) {
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // A broken auth lock can also block signOut, so manual cleanup follows.
    }
  }

  currentSessionPromise = null;

  if (typeof window !== "undefined") {
    removeStorageItems(window.localStorage, authStorageKey);
    removeStorageItems(window.sessionStorage, authStorageKey);
  }

  removeAuthCookies(authStorageKey);
}

async function createAuthErrorState(error: unknown): Promise<SafeAuthState> {
  const message = getErrorMessage(error);

  if (isStaleRefreshTokenError(error) || isAuthLockError(error)) {
    await clearStaleSupabaseSession();

    return {
      errorMessage:
        "Oturum süresi dolmuş veya bozulmuş. Lütfen tekrar giriş yap.",
      session: null,
      status: "authExpired",
      technicalMessage: getTechnicalMessage(message),
      user: null,
    };
  }

  if (isAuthFetchError(error)) {
    return {
      errorMessage:
        "Oturum kontrolü geçici olarak başarısız oldu. Lütfen tekrar deneyin.",
      session: null,
      status: "connectionError",
      technicalMessage: getTechnicalMessage(message),
      user: null,
    };
  }

  return {
    errorMessage: "Oturum kontrolü tamamlanamadı. Lütfen tekrar deneyin.",
    session: null,
    status: "error",
    technicalMessage: getTechnicalMessage(message),
    user: null,
  };
}

function getNotConfiguredState(): SafeAuthState {
  const status = getSupabaseConfigStatus();

  return {
    errorMessage:
      status.invalidMessage || "Supabase bağlantısı yapılandırılmadı.",
    session: null,
    status: "notConfigured",
    technicalMessage: "",
    user: null,
  };
}

async function readCurrentSessionSafe(): Promise<SafeAuthState> {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return getNotConfiguredState();
  }

  try {
    const result = await supabase.auth.getSession();

    if (result.error) {
      return createAuthErrorState(result.error);
    }

    const session = result.data.session;

    if (!session) {
      return {
        errorMessage: "",
        session: null,
        status: "notSignedIn",
        technicalMessage: "",
        user: null,
      };
    }

    return {
      errorMessage: "",
      session,
      status: "ready",
      technicalMessage: "",
      user: session.user,
    };
  } catch (error) {
    return createAuthErrorState(error);
  }
}

export async function getCurrentSessionSafe() {
  if (!currentSessionPromise) {
    currentSessionPromise = readCurrentSessionSafe().finally(() => {
      currentSessionPromise = null;
    });
  }

  return currentSessionPromise;
}

export async function getCurrentUserSafe() {
  return getCurrentSessionSafe();
}

export function resetSafeAuthRequest() {
  currentSessionPromise = null;
}
