"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function retryFailedDocumentsAction() {
  const profile = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("documents")
    .update({ processing_status: "pending", processing_error: null })
    .eq("processing_status", "failed")
    .select("id");

  if (error) {
    throw new Error(`Failed to reset failed documents: ${error.message}`);
  }

  await supabase.from("audit_log").insert({
    admin_user_id: profile.id,
    action: "retry_failed_documents",
    entity_type: "documents",
    entity_id: null,
    details: { count: data?.length ?? 0 },
  });

  revalidatePath("/library-admin/dropbox/inventory");
}
