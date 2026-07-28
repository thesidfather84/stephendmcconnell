import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentProfile } from "@/lib/supabase/auth";
import { buildAuthorizeUrl } from "@/lib/dropbox/oauth";

export const STATE_COOKIE = "dropbox_oauth_state";

export async function GET(request: NextRequest) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.redirect(new URL("/library-admin/login", request.url));
  }

  let authorizeUrl: string;
  const state = crypto.randomBytes(16).toString("hex");

  try {
    authorizeUrl = await buildAuthorizeUrl(state);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Dropbox isn't configured yet.";
    return NextResponse.redirect(
      new URL(`/library-admin/dropbox?error=${encodeURIComponent(message)}`, request.url)
    );
  }

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes — just long enough to approve on Dropbox's site
    path: "/",
  });

  return response;
}
