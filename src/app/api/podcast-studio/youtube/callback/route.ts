import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { hasStudioSession } from "@/lib/podcast/auth";
import { completeConnection } from "@/lib/podcast/youtube";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "podcast_youtube_state";

function sameState(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** Google sends the site owner back here after they approve (or refuse) access. */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const back = (flag: string) => {
    const res = NextResponse.redirect(`${origin}/podcast-studio/youtube?result=${flag}`);
    res.cookies.delete({ name: STATE_COOKIE, path: "/api/podcast-studio/youtube" });
    return res;
  };

  if (!(await hasStudioSession())) return back("signin");

  const params = request.nextUrl.searchParams;
  if (params.get("error")) return back("denied");

  const code = params.get("code");
  const state = params.get("state");
  const expected = request.cookies.get(STATE_COOKIE)?.value;
  if (!code || !state || !expected || !sameState(state, expected)) return back("failed");

  try {
    await completeConnection(code);
    return back("connected");
  } catch (err) {
    return back(err instanceof Error && err.message.includes("not Kidney Total Health") ? "wrong-channel" : "failed");
  }
}
