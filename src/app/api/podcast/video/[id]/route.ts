import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getRecordingLink } from "@/lib/podcast/daily";

const TWELVE_HOURS = 12 * 60 * 60;

/**
 * Plays a PUBLISHED podcast episode on the website. Drafts, discarded episodes and anything
 * unpublished answer 404 here, so unpublished recordings can never be reached. The recording
 * itself stays private at the recording service; visitors are sent to a fresh expiring link.
 */
async function serve(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Not found", { status: 404 });

  let episode: { recording_id: string | null; status: string } | null;
  try {
    const { data, error } = await createAdminSupabaseClient()
      .from("podcast_episodes")
      .select("recording_id, status")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    episode = data;
  } catch {
    // Studio not set up yet, or the database is unreachable: never a server crash, never any details.
    return new NextResponse("Not found", { status: 404 });
  }
  if (!episode || episode.status !== "published" || !episode.recording_id) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const link = await getRecordingLink(episode.recording_id, TWELVE_HOURS);
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: link,
        // Every cached redirect still has 11+ hours left on its link.
        "Cache-Control": "public, max-age=0, s-maxage=3600",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return new NextResponse("Temporarily unavailable", { status: 503 });
  }
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return serve((await ctx.params).id);
}
export async function HEAD(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return serve((await ctx.params).id);
}
