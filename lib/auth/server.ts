import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type ServerAuthState = {
  profile: ProfileRow | null;
  userEmail: string;
  userId: string;
};

export async function getServerAuthState(): Promise<ServerAuthState | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;

  if (!user) {
    return null;
  }

  const profileResult = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    profile: profileResult.data ?? null,
    userEmail: user.email ?? "",
    userId: user.id,
  };
}
