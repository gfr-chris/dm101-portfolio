import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function isOwner(user: User | null | undefined): boolean {
  return user?.app_metadata?.role === "owner";
}

/**
 * Server-side authorization for every admin page and action.
 * (Hiding links is not security — this verifies the session with Supabase on the server.)
 */
export async function requireOwner() {
  if (!isSupabaseConfigured()) redirect("/admin/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isOwner(user)) redirect("/admin/login");
  return { supabase, user };
}
