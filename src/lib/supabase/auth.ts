import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./server";
import type { Profile } from "./types";

/** Returns the signed-in user's profile (with role), or null if signed out. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ?? null;
}

/**
 * Use at the top of an admin Server Component to gate the whole page.
 * Redirects to the given path if the visitor isn't a signed-in admin.
 */
export async function requireAdmin(redirectTo = "/library-admin/login"): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect(redirectTo);
  }

  return profile;
}
