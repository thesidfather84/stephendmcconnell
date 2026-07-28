import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabase/auth";
import { exchangeCodeForConnection } from "@/lib/dropbox/oauth";
import { saveDropboxConnection } from "@/lib/dropbox/token-store";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { STATE_COOKIE } from "../connect/route";

function redirectWithError(request: NextRequest, message: string) {
  const response = NextResponse.redirect(
    new URL(`/library-admin/dropbox?error=${encodeURIComponent(message)}`, request.url)
  );
  response.cookies.delete(STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.redirect(new URL("/library-admin/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const dropboxError = searchParams.get("error_description") || searchParams.get("error");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  if (dropboxError) {
    return redirectWithError(request, dropboxError);
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectWithError(request, "The connection request expired or was invalid. Please try again.");
  }

  try {
    const { refreshToken, dropboxAccountId, dropboxEmail } = await exchangeCodeForConnection(code);

    await saveDropboxConnection({
      refreshToken,
      dropboxAccountId,
      dropboxEmail,
      connectedBy: profile.id,
    });

    const supabase = createAdminSupabaseClient();
    await supabase.from("audit_log").insert({
      admin_user_id: profile.id,
      action: "dropbox_connected",
      entity_type: "dropbox_connection",
      entity_id: null,
      details: { dropbox_email: dropboxEmail },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong connecting Dropbox.";
    return redirectWithError(request, message);
  }

  const response = NextResponse.redirect(new URL("/library-admin/dropbox?connected=1", request.url));
  response.cookies.delete(STATE_COOKIE);
  return response;
}
