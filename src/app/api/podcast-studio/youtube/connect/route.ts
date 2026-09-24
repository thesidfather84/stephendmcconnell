import crypto from "crypto";
import { NextResponse } from "next/server";
import { hasStudioSession } from "@/lib/podcast/auth";
import { buildAuthUrl, getYoutubeConfigProblems } from "@/lib/podcast/youtube";

export const dynamic = "force-dynamic";

const YOUTUBE_STATE_COOKIE = "podcast_youtube_state";

/** Site owner only: starts Google's sign-in to connect the Kidney Total Health channel. */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const back = (flag: string) => NextResponse.redirect(`${origin}/podcast-studio/youtube?result=${flag}`);

  if (!(await hasStudioSession())) return back("signin");
  if (getYoutubeConfigProblems().length > 0) return back("not-configured");

  const state = crypto.randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(buildAuthUrl(state));
  response.cookies.set(YOUTUBE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/api/podcast-studio/youtube",
  });
  return response;
}
