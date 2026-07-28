import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Privileged Supabase client using the service role key — bypasses Row
 * Level Security entirely. Only ever import this from server-only code
 * (Server Actions, Route Handlers, background jobs): the ingestion
 * pipeline, admin write operations, audit log writes, share-link
 * resolution. NEVER import this from a Client Component or anything that
 * ships to the browser.
 */
export function createAdminSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createAdminSupabaseClient() was called in the browser. The service role key must never be exposed to client code."
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
