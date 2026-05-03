"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAuthStorageKey,
  getSupabasePublicConfig,
  logSupabaseConfigDiagnostics,
} from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

let browserClient: SupabaseClient<Database> | null = null;

export function createSupabaseBrowserClient() {
  logSupabaseConfigDiagnostics();

  const config = getSupabasePublicConfig();

  if (!config) {
    return null;
  }

  if (!browserClient) {
    const authStorageKey = getSupabaseAuthStorageKey();

    browserClient = createBrowserClient<Database>(config.url, config.anonKey, {
      ...(authStorageKey
        ? { cookieOptions: { name: authStorageKey } }
        : null),
    });
  }

  return browserClient;
}
