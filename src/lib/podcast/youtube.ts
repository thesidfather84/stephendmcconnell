import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { decryptSecret, encryptSecret } from "@/lib/dropbox/crypto";

/**
 * YouTube Data API v3 integration using Google's official OAuth 2.0 web-server flow.
 * The site owner connects a Google account once. Every secret lives in server environment
 * variables and the database; none of it is ever sent to the browser.
 */

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly", // only used to show which channel is connected
];

/** The channel episodes are meant to go to. Connecting any other channel is refused. */
export const TARGET_CHANNEL_HANDLE = "@kidneytotalhealth";

/** Pieces are a multiple of 256 KiB (YouTube's rule) and small enough for one short server request. */
export const UPLOAD_CHUNK_BYTES = 32 * 1024 * 1024;

export class YoutubeError extends Error {
  /** True when trying the same step again is likely to work (a network hiccup). */
  retryable: boolean;
  constructor(message: string, retryable = false) {
    super(message);
    this.retryable = retryable;
  }
}

export function getYoutubeConfigProblems(): string[] {
  const missing: string[] = [];
  if (!process.env.GOOGLE_YOUTUBE_CLIENT_ID) missing.push("GOOGLE_YOUTUBE_CLIENT_ID");
  if (!process.env.GOOGLE_YOUTUBE_CLIENT_SECRET) missing.push("GOOGLE_YOUTUBE_CLIENT_SECRET");
  if (!process.env.GOOGLE_YOUTUBE_REDIRECT_URI) missing.push("GOOGLE_YOUTUBE_REDIRECT_URI");
  return missing;
}

function config() {
  if (getYoutubeConfigProblems().length > 0) {
    throw new YoutubeError("YouTube isn't set up yet.");
  }
  return {
    clientId: process.env.GOOGLE_YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_YOUTUBE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_YOUTUBE_REDIRECT_URI!,
  };
}

export function buildAuthUrl(state: string): string {
  const { clientId, redirectUri } = config();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent select_account", // forces a refresh token and lets the right channel be chosen
    include_granted_scopes: "true",
    state,
  });
  return `${AUTH_URL}?${params}`;
}

async function tokenRequest(body: Record<string, string>) {
  const { clientId, clientSecret } = config();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, ...body }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };
  if (!res.ok || !data.access_token) {
    if (data.error === "invalid_grant") {
      throw new YoutubeError("The YouTube connection has expired. The site owner needs to reconnect YouTube.");
    }
    throw new YoutubeError("Google didn't accept the YouTube sign-in. Please try connecting again.");
  }
  return data as { access_token: string; refresh_token?: string };
}

/** Finishes the OAuth flow: swaps the one-time code for tokens and stores the refresh token encrypted. */
export async function completeConnection(code: string): Promise<{ channelTitle: string }> {
  const { redirectUri } = config();
  const tokens = await tokenRequest({ code, grant_type: "authorization_code", redirect_uri: redirectUri });
  if (!tokens.refresh_token) {
    throw new YoutubeError(
      "Google didn't return a long-lived permission. Remove this app at myaccount.google.com/permissions and connect again."
    );
  }

  const channelRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    { headers: { Authorization: `Bearer ${tokens.access_token}` }, cache: "no-store" }
  );
  const channelData = (await channelRes.json().catch(() => ({}))) as {
    items?: { id: string; snippet: { title: string; customUrl?: string } }[];
  };
  const channel = channelData.items?.[0];
  if (!channelRes.ok || !channel) {
    throw new YoutubeError(
      "That Google account has no YouTube channel. Pick the account or brand account that owns the Kidney Total Health channel."
    );
  }
  // Refuse to attach the wrong channel, so episodes can only ever go to Kidney Total Health.
  if ((channel.snippet.customUrl ?? "").toLowerCase() !== TARGET_CHANNEL_HANDLE) {
    throw new YoutubeError(
      `That is the channel "${channel.snippet.title}", not Kidney Total Health (${TARGET_CHANNEL_HANDLE}). Nothing was connected.`
    );
  }

  const { ciphertext, iv, authTag } = encryptSecret(tokens.refresh_token);
  const { error } = await createAdminSupabaseClient().from("youtube_connection").upsert({
    id: 1,
    encrypted_refresh_token: ciphertext,
    token_iv: iv,
    token_auth_tag: authTag,
    channel_id: channel.id,
    channel_title: channel.snippet.title,
    connected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new YoutubeError("Couldn't save the YouTube connection. Please try again.");
  return { channelTitle: channel.snippet.title };
}

export type YoutubeConnection = { connected: boolean; channelTitle: string | null };

export async function getYoutubeConnection(): Promise<YoutubeConnection> {
  const { data } = await createAdminSupabaseClient()
    .from("youtube_connection")
    .select("encrypted_refresh_token, channel_title")
    .eq("id", 1)
    .maybeSingle();
  return { connected: Boolean(data?.encrypted_refresh_token), channelTitle: data?.channel_title ?? null };
}

/** True only when Google is configured on the server AND the owner has connected the channel. */
export async function isYoutubeReady(): Promise<boolean> {
  if (getYoutubeConfigProblems().length > 0) return false;
  try {
    return (await getYoutubeConnection()).connected;
  } catch {
    return false;
  }
}

async function getAccessToken(): Promise<string> {
  const { data } = await createAdminSupabaseClient()
    .from("youtube_connection")
    .select("encrypted_refresh_token, token_iv, token_auth_tag")
    .eq("id", 1)
    .maybeSingle();
  if (!data?.encrypted_refresh_token || !data.token_iv || !data.token_auth_tag) {
    throw new YoutubeError("YouTube isn't connected yet.");
  }
  const refreshToken = decryptSecret({
    ciphertext: data.encrypted_refresh_token,
    iv: data.token_iv,
    authTag: data.token_auth_tag,
  });
  return (await tokenRequest({ refresh_token: refreshToken, grant_type: "refresh_token" })).access_token;
}

/** YouTube rejects < and > in titles/descriptions and caps their length. */
export function cleanForYoutube(text: string, max: number): string {
  return text.replace(/[<>]/g, "").trim().slice(0, max);
}

/** Size of the saved recording, read without downloading it. Requires the file host to support byte ranges. */
export async function getSourceSize(sourceUrl: string): Promise<number> {
  let res: Response;
  try {
    res = await fetch(sourceUrl, { headers: { Range: "bytes=0-0" }, cache: "no-store" });
  } catch {
    throw new YoutubeError("Couldn't read the saved recording. Please try again.", true);
  }
  await res.body?.cancel().catch(() => {});
  const total = Number(/\/(\d+)$/.exec(res.headers.get("content-range") ?? "")?.[1]);
  if (res.status !== 206 || !Number.isFinite(total) || total <= 0) {
    throw new YoutubeError("Couldn't read the size of the saved recording, so it can't be uploaded in pieces.");
  }
  return total;
}

/** Opens a resumable YouTube upload session (UNLISTED) and returns its private URL. */
export async function startUploadSession(opts: {
  title: string;
  description: string;
  totalBytes: number;
}): Promise<string> {
  const accessToken = await getAccessToken();
  let start: Response;
  try {
    start = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Length": String(opts.totalBytes),
          "X-Upload-Content-Type": "video/mp4",
        },
        body: JSON.stringify({
          snippet: {
            title: cleanForYoutube(opts.title, 100),
            description: cleanForYoutube(opts.description, 5000),
            categoryId: "27", // Education
          },
          status: { privacyStatus: "unlisted", selfDeclaredMadeForKids: false },
        }),
        cache: "no-store",
      }
    );
  } catch {
    throw new YoutubeError("Couldn't reach YouTube. Please try again.", true);
  }
  if (!start.ok) throw new YoutubeError(await explainYoutubeFailure(start), start.status >= 500);
  const uploadUrl = start.headers.get("location");
  if (!uploadUrl) throw new YoutubeError("YouTube didn't accept the upload. Please try again.", true);
  return uploadUrl;
}

export type ChunkResult =
  | { done: true; videoId: string; bytes: number }
  | { done: false; bytes: number }
  | { expired: true };

function confirmedBytes(res: Response): number {
  const m = /bytes=0-(\d+)/.exec(res.headers.get("range") ?? "");
  return m ? Number(m[1]) + 1 : 0;
}

async function readFinished(res: Response, total: number): Promise<ChunkResult> {
  const video = (await res.json().catch(() => ({}))) as { id?: string };
  if (!video.id) throw new YoutubeError("YouTube didn't confirm the upload. Please try again.", true);
  return { done: true, videoId: video.id, bytes: total };
}

/**
 * Sends the next piece of the recording to YouTube. It first asks YouTube how much it really has,
 * so an interrupted earlier request can never cause a gap or a duplicate. Safe to call repeatedly.
 */
export async function uploadNextChunk(opts: {
  uploadUrl: string;
  sourceUrl: string;
  totalBytes: number;
}): Promise<ChunkResult> {
  const { uploadUrl, sourceUrl, totalBytes } = opts;
  const accessToken = await getAccessToken();
  const auth = { Authorization: `Bearer ${accessToken}` };

  // 1. Where does YouTube say we are?
  let status: Response;
  try {
    status = await fetch(uploadUrl, {
      method: "PUT",
      headers: { ...auth, "Content-Range": `bytes */${totalBytes}`, "Content-Length": "0" },
      cache: "no-store",
    });
  } catch {
    throw new YoutubeError("Couldn't reach YouTube. Please try again.", true);
  }
  if (status.status === 404 || status.status === 410) return { expired: true };
  if (status.status === 200 || status.status === 201) return readFinished(status, totalBytes);
  if (status.status !== 308) throw new YoutubeError(await explainYoutubeFailure(status), status.status >= 500);
  const offset = confirmedBytes(status);

  // 2. Read exactly the next piece of the recording.
  const end = Math.min(offset + UPLOAD_CHUNK_BYTES, totalBytes) - 1;
  let piece: Response;
  try {
    piece = await fetch(sourceUrl, { headers: { Range: `bytes=${offset}-${end}` }, cache: "no-store" });
  } catch {
    throw new YoutubeError("Couldn't read the saved recording. Please try again.", true);
  }
  if (piece.status !== 206) {
    throw new YoutubeError("Couldn't read the saved recording. Please try again.", piece.status >= 500 || piece.status === 403);
  }
  const data = Buffer.from(await piece.arrayBuffer());
  if (data.length !== end - offset + 1) {
    throw new YoutubeError("The saved recording was cut short while reading. Please try again.", true);
  }

  // 3. Send it.
  let up: Response;
  try {
    up = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        ...auth,
        "Content-Type": "video/mp4",
        "Content-Length": String(data.length),
        "Content-Range": `bytes ${offset}-${end}/${totalBytes}`,
      },
      body: data,
      cache: "no-store",
    });
  } catch {
    throw new YoutubeError("The connection to YouTube was interrupted. Please try again.", true);
  }
  if (up.status === 200 || up.status === 201) return readFinished(up, totalBytes);
  if (up.status === 308) return { done: false, bytes: confirmedBytes(up) };
  if (up.status === 404 || up.status === 410) return { expired: true };
  throw new YoutubeError(await explainYoutubeFailure(up), up.status >= 500);
}

async function explainYoutubeFailure(res: Response): Promise<string> {
  const body = (await res.json().catch(() => ({}))) as {
    error?: { errors?: { reason?: string }[] };
  };
  const reason = body.error?.errors?.[0]?.reason ?? "";
  if (reason === "quotaExceeded" || reason === "uploadLimitExceeded") {
    return "YouTube's daily upload limit has been reached. Please try again tomorrow.";
  }
  if (res.status === 401) return "The YouTube connection has expired. The site owner needs to reconnect YouTube.";
  return `YouTube didn't accept the upload (error ${res.status}). Please try again.`;
}
