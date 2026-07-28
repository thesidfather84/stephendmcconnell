"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { clearDropboxConnection } from "./token-store";

export async function disconnectDropboxAction() {
  const profile = await requireAdmin();

  await clearDropboxConnection();

  const supabase = createAdminSupabaseClient();
  await supabase.from("audit_log").insert({
    admin_user_id: profile.id,
    action: "dropbox_disconnected",
    entity_type: "dropbox_connection",
    entity_id: null,
    details: {},
  });

  redirect("/library-admin/dropbox?disconnected=1");
}
