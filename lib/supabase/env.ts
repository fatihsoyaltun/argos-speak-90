export type SupabaseEnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY";

export type SupabaseConfigStatus = {
  configured: boolean;
  missing: SupabaseEnvKey[];
};

export type SupabasePublicConfig = {
  anonKey: string;
  url: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const missing: SupabaseEnvKey[] = [];

  if (!SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return {
    configured: missing.length === 0,
    missing,
  };
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  if (!getSupabaseConfigStatus().configured) {
    return null;
  }

  return {
    anonKey: SUPABASE_ANON_KEY,
    url: SUPABASE_URL,
  };
}
