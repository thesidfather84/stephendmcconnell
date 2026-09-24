import { NextRequest, NextResponse } from "next/server";
import { hasStudioSession } from "@/lib/podcast/auth";
import { toView } from "@/lib/podcast/episodes";
import { copyEpisodeToYoutube, publishEpisode } from "@/lib/podcast/publish";

// Each "youtube" call sends one ~32 MB piece (seconds). The browser calls repeatedly until done,
// so episode length never depends on one long request.
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  if (!(await hasStudioSession())) {
    return NextResponse.json({ ok: false, message: "Please enter the studio code again." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { episodeId?: string; step?: string };
  if (!body.episodeId) {
    return NextResponse.json({ ok: false, message: "Missing episode." }, { status: 400 });
  }

  try {
    if (body.step === "youtube") {
      // Result details are for the site owner and are deliberately not sent to the studio screen.
      const outcome = await copyEpisodeToYoutube(body.episodeId);
      return NextResponse.json({ ok: outcome.ok, continueUpload: outcome.continueUpload });
    }
    const outcome = await publishEpisode(body.episodeId);
    return NextResponse.json({
      ok: outcome.ok,
      message: outcome.message,
      continueUpload: outcome.continueUpload ?? false,
      episode: await toView(outcome.episode),
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Your episode couldn't be published right now. Your recording is safe. Please try again." },
      { status: 500 }
    );
  }
}
