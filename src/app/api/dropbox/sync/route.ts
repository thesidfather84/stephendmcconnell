import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { syncDropboxInventory } from "@/lib/dropbox/sync";
import { processDocument } from "@/lib/ingestion/process-document";

// How many pending documents to process per invocation — kept small so a
// single request stays well under Vercel's serverless execution time limit.
// Repeated syncs (manual clicks, or a future scheduled job) work through a
// large backlog incrementally rather than needing one giant run.
const BATCH_SIZE = 5;

async function isAuthorized(request: NextRequest): Promise<{ ok: boolean; adminUserId: string | null }> {
  const profile = await getCurrentProfile();
  if (profile?.role === "admin") {
    return { ok: true, adminUserId: profile.id };
  }

  // Reserved for a future scheduled job (e.g. Vercel Cron) — not wired to
  // an actual schedule yet, but the route is ready for it.
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return { ok: true, adminUserId: null };
  }

  return { ok: false, adminUserId: null };
}

export async function POST(request: NextRequest) {
  const { ok, adminUserId } = await isAuthorized(request);
  if (!ok) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const rootPath = process.env.DROPBOX_SYNC_ROOT_PATH ?? "";
    const inventorySummary = await syncDropboxInventory(rootPath);

    const supabase = createAdminSupabaseClient();
    const { data: pendingDocs, error: pendingError } = await supabase
      .from("documents")
      .select("id, dropbox_path, file_extension")
      .eq("processing_status", "pending")
      .limit(BATCH_SIZE);

    if (pendingError) {
      throw new Error(`Failed to read pending documents: ${pendingError.message}`);
    }

    for (const doc of pendingDocs ?? []) {
      await processDocument(doc);
    }

    const { count: remainingPending } = await supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("processing_status", "pending");

    await supabase.from("audit_log").insert({
      admin_user_id: adminUserId,
      action: "dropbox_sync",
      entity_type: "documents",
      entity_id: null,
      details: {
        ...inventorySummary,
        processedThisRun: pendingDocs?.length ?? 0,
        remainingPending: remainingPending ?? 0,
      },
    });

    return NextResponse.json({
      ok: true,
      inventory: inventorySummary,
      processedThisRun: pendingDocs?.length ?? 0,
      remainingPending: remainingPending ?? 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed for an unknown reason.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
