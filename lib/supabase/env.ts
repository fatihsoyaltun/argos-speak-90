export type SupabaseEnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY";

export type SupabaseConfigStatus = {
  configured: boolean;
  diagnostics: SupabaseConfigDiagnostics;
  invalidMessage: string;
  missing: SupabaseEnvKey[];
};

export type SupabasePublicConfig = {
  anonKey: string;
  url: string;
};

export type SupabaseConfigDiagnostics = {
  dashboardUrl: boolean;
  hasPublishableKey: boolean;
  hasUrl: boolean;
  urlEndsWithSupabaseCo: boolean;
  urlHasExtraPath: boolean;
  urlStartsWithHttps: boolean;
};

const SUPABASE_URL_RAW = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
let didLogSupabaseDiagnostics = false;

function getParsedSupabaseUrl() {
  try {
    return new URL(SUPABASE_URL_RAW);
  } catch {
    return null;
  }
}

function normalizeSupabaseUrl() {
  const parsedUrl = getParsedSupabaseUrl();

  if (!parsedUrl) {
    return "";
  }

  return parsedUrl.origin.replace(/\/$/, "");
}

export function getSupabaseConfigDiagnostics(): SupabaseConfigDiagnostics {
  const parsedUrl = getParsedSupabaseUrl();
  const pathname = parsedUrl?.pathname ?? "";

  return {
    dashboardUrl: SUPABASE_URL_RAW.includes("supabase.com/dashboard"),
    hasPublishableKey: Boolean(SUPABASE_ANON_KEY),
    hasUrl: Boolean(SUPABASE_URL_RAW),
    urlEndsWithSupabaseCo:
      parsedUrl?.hostname.endsWith(".supabase.co") ?? false,
    urlHasExtraPath: Boolean(parsedUrl && pathname !== "" && pathname !== "/"),
    urlStartsWithHttps: SUPABASE_URL_RAW.startsWith("https://"),
  };
}

export function getSupabaseInvalidMessage() {
  const diagnostics = getSupabaseConfigDiagnostics();

  if (!diagnostics.hasUrl || !diagnostics.hasPublishableKey) {
    return "";
  }

  if (
    diagnostics.dashboardUrl ||
    !diagnostics.urlStartsWithHttps ||
    !diagnostics.urlEndsWithSupabaseCo ||
    diagnostics.urlHasExtraPath
  ) {
    return "Supabase URL hatalı. Project URL https://...supabase.co formatında olmalı.";
  }

  return "";
}

export function logSupabaseConfigDiagnostics() {
  if (process.env.NODE_ENV !== "development" || didLogSupabaseDiagnostics) {
    return;
  }

  didLogSupabaseDiagnostics = true;

  const diagnostics = getSupabaseConfigDiagnostics();

  console.info("[argos:supabase-config]", {
    hasPublishableKey: diagnostics.hasPublishableKey ? "yes" : "no",
    hasUrl: diagnostics.hasUrl ? "yes" : "no",
    urlEndsWithSupabaseCo: diagnostics.urlEndsWithSupabaseCo ? "yes" : "no",
    urlHasExtraPath: diagnostics.urlHasExtraPath ? "yes" : "no",
    urlStartsWithHttps: diagnostics.urlStartsWithHttps ? "yes" : "no",
  });
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const missing: SupabaseEnvKey[] = [];
  const diagnostics = getSupabaseConfigDiagnostics();
  const invalidMessage = getSupabaseInvalidMessage();

  if (!SUPABASE_URL_RAW) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return {
    configured: missing.length === 0 && !invalidMessage,
    diagnostics,
    invalidMessage,
    missing,
  };
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  if (!getSupabaseConfigStatus().configured) {
    return null;
  }

  return {
    anonKey: SUPABASE_ANON_KEY,
    url: normalizeSupabaseUrl(),
  };
}
