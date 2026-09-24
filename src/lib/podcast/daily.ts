/**
 * Thin server-side client for the Daily.co REST API (https://docs.daily.co/reference/rest-api).
 * Daily provides the group video room and cloud recording. Raw recordings stay
 * private at Daily; this app only requests short-lived download links.
 */
const API = "https://api.daily.co/v1";

export class DailyError extends Error {}

export const MAX_PARTICIPANTS = 5; // Stephen + up to 4 guests

export function isDailyConfigured(): boolean {
  return Boolean(process.env.DAILY_API_KEY);
}

async function daily<T>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.DAILY_API_KEY;
  if (!key) throw new DailyError("The recording room isn't ready yet. Please contact Sidney.");

  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new DailyError(
      "Couldn't reach the video room service. Check the internet connection and try again."
    );
  }

  if (!res.ok) {
    throw new DailyError("The recording room isn't available right now. Please try again in a moment.");
  }
  return (await res.json()) as T;
}

export async function createRoom(): Promise<{ name: string; url: string }> {
  const name = `ksm-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const room = await daily<{ name: string; url: string }>("/rooms", {
    method: "POST",
    body: JSON.stringify({
      name,
      privacy: "private", // nobody can enter without a token this app issues
      properties: {
        max_participants: MAX_PARTICIPANTS,
        enable_recording: "cloud",
        enable_prejoin_ui: false,
        enable_chat: false,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        eject_at_room_exp: true,
      },
    }),
  });
  return { name: room.name, url: room.url };
}

export async function createMeetingToken(opts: {
  roomName: string;
  isOwner: boolean;
  userName: string;
  ttlSeconds: number;
}): Promise<string> {
  const res = await daily<{ token: string }>("/meeting-tokens", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        room_name: opts.roomName,
        is_owner: opts.isOwner,
        user_name: opts.userName,
        exp: Math.floor(Date.now() / 1000) + opts.ttlSeconds,
        eject_at_token_exp: true,
      },
    }),
  });
  return res.token;
}

export type DailyRecording = {
  id: string;
  room_name: string;
  start_ts: number;
  status: string; // "finished" | "in-progress" | "canceled" | ...
  duration?: number;
};

/** Newest recording made in a room, if any. */
export async function getLatestRecording(roomName: string): Promise<DailyRecording | null> {
  const res = await daily<{ data: DailyRecording[] }>(
    `/recordings?room_name=${encodeURIComponent(roomName)}&limit=10`
  );
  const sorted = [...(res.data ?? [])].sort((a, b) => b.start_ts - a.start_ts);
  return sorted[0] ?? null;
}

/** Private, expiring download link for a recording (default one hour; Daily allows up to 12 hours). */
export async function getRecordingLink(recordingId: string, validForSecs = 3600): Promise<string> {
  const res = await daily<{ download_link: string }>(
    `/recordings/${encodeURIComponent(recordingId)}/access-link?valid_for_secs=${validForSecs}`
  );
  return res.download_link;
}

export async function deleteRecording(recordingId: string): Promise<void> {
  await daily(`/recordings/${encodeURIComponent(recordingId)}`, { method: "DELETE" });
}

export async function deleteRoom(roomName: string): Promise<void> {
  try {
    await daily(`/rooms/${encodeURIComponent(roomName)}`, { method: "DELETE" });
  } catch {
    // Room may already be gone or expired; nothing further to clean up.
  }
}
