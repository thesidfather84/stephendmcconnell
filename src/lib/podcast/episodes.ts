import crypto from "crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { PodcastEpisodeRow } from "@/lib/supabase/types";
import {
  createMeetingToken,
  createRoom,
  deleteRecording,
  deleteRoom,
  getLatestRecording,
  MAX_PARTICIPANTS,
} from "./daily";
import { MAX_GUESTS, todayInEastern, type EpisodeView } from "./status";

const INVITE_TTL_MS = 12 * 60 * 60 * 1000; // guest links stop working after 12 hours
const TOKEN_TTL_SECONDS = 4 * 60 * 60; // a call token is good for 4 hours

const db = () => createAdminSupabaseClient();

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function toView(row: PodcastEpisodeRow): Promise<EpisodeView> {
  const { count } = await db()
    .from("podcast_guest_invites")
    .select("id", { count: "exact", head: true })
    .eq("episode_id", row.id)
    .is("revoked_at", null);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.episode_date,
    status: row.status,
    errorMessage: row.error_message,
    durationSeconds: row.duration_seconds,
    hasRecording: Boolean(row.recording_id),
    guestLinksCreated: count ?? 0,
    websiteStatus: row.website_status,
    websiteError: row.website_error,
  };
}

export async function getEpisode(id: string): Promise<PodcastEpisodeRow> {
  const { data, error } = await db().from("podcast_episodes").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Couldn't load the episode. Please try again.");
  if (!data) throw new Error("That episode couldn't be found.");
  return data;
}

export async function updateEpisode(
  id: string,
  patch: Partial<PodcastEpisodeRow>
): Promise<PodcastEpisodeRow> {
  const { data, error } = await db()
    .from("podcast_episodes")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error("Couldn't save the change. Please try again.");
  return data;
}

export async function createEpisode(): Promise<PodcastEpisodeRow> {
  const { data, error } = await db()
    .from("podcast_episodes")
    .insert({ episode_date: todayInEastern() })
    .select("*")
    .single();
  if (error || !data) throw new Error("Couldn't start a new episode. Please try again.");
  return data;
}

/** The episode Stephen is working on: the newest one that hasn't been discarded. */
export async function getOrCreateCurrentEpisode(): Promise<PodcastEpisodeRow> {
  const { data } = await db()
    .from("podcast_episodes")
    .select("*")
    .neq("status", "discarded")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? (await createEpisode());
}

/** Makes sure the episode has a private video room, creating it the first time it's needed. */
export async function ensureRoom(episode: PodcastEpisodeRow): Promise<PodcastEpisodeRow> {
  if (episode.room_name && episode.room_url) return episode;
  const room = await createRoom();
  return updateEpisode(episode.id, { room_name: room.name, room_url: room.url });
}

export async function revokeAllInvites(episodeId: string): Promise<void> {
  await db()
    .from("podcast_guest_invites")
    .update({ revoked_at: new Date().toISOString() })
    .eq("episode_id", episodeId)
    .is("revoked_at", null);
}

/** Owner (Stephen) call credentials. */
export async function getHostJoinInfo(episode: PodcastEpisodeRow) {
  const ready = await ensureRoom(episode);
  const token = await createMeetingToken({
    roomName: ready.room_name!,
    isOwner: true,
    userName: "Stephen",
    ttlSeconds: TOKEN_TTL_SECONDS,
  });
  return { roomUrl: ready.room_url!, token };
}

export type InviteCreated =
  | { ok: true; token: string; guestLinksCreated: number }
  | { ok: false; message: string };

export async function createInvite(episodeId: string): Promise<InviteCreated> {
  const episode = await getEpisode(episodeId);
  if (episode.status !== "setup" && episode.status !== "recording") {
    return { ok: false, message: "Guests can only be invited before the recording is stopped." };
  }

  const { count } = await db()
    .from("podcast_guest_invites")
    .select("id", { count: "exact", head: true })
    .eq("episode_id", episodeId)
    .is("revoked_at", null);
  if ((count ?? 0) >= MAX_GUESTS) {
    return { ok: false, message: `You already have ${MAX_GUESTS} guest links. The most is ${MAX_PARTICIPANTS} people including you.` };
  }

  await ensureRoom(episode);

  const token = crypto.randomBytes(24).toString("base64url");
  const { error } = await db().from("podcast_guest_invites").insert({
    episode_id: episodeId,
    token_hash: hashToken(token),
    expires_at: new Date(Date.now() + INVITE_TTL_MS).toISOString(),
  });
  if (error) return { ok: false, message: "Couldn't create the guest link. Please try again." };

  return { ok: true, token, guestLinksCreated: (count ?? 0) + 1 };
}

export type InviteLookup =
  | { state: "valid"; inviteId: string; claimed: boolean; claimHash: string | null; episode: PodcastEpisodeRow }
  | { state: "invalid" | "expired" | "ended" };

/** Validates a guest link token. Says nothing about episodes beyond "this link works or it doesn't". */
export async function lookupInvite(token: string): Promise<InviteLookup> {
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(token)) return { state: "invalid" };

  const { data: invite } = await db()
    .from("podcast_guest_invites")
    .select("*")
    .eq("token_hash", hashToken(token))
    .maybeSingle();
  if (!invite) return { state: "invalid" };

  const { data: episode } = await db()
    .from("podcast_episodes")
    .select("*")
    .eq("id", invite.episode_id)
    .maybeSingle();
  if (!episode) return { state: "invalid" };

  if (invite.revoked_at) return { state: "ended" };
  if (episode.status !== "setup" && episode.status !== "recording") return { state: "ended" };
  if (new Date(invite.expires_at).getTime() <= Date.now()) return { state: "expired" };
  if (!episode.room_name) return { state: "invalid" };

  return {
    state: "valid",
    inviteId: invite.id,
    claimed: Boolean(invite.claimed_at),
    claimHash: invite.claim_hash,
    episode,
  };
}

export async function claimInvite(inviteId: string, claimHash: string, guestName: string): Promise<void> {
  await db()
    .from("podcast_guest_invites")
    .update({ claim_hash: claimHash, claimed_at: new Date().toISOString(), guest_name: guestName })
    .eq("id", inviteId);
}

export async function getGuestJoinToken(roomName: string, guestName: string) {
  return createMeetingToken({
    roomName,
    isOwner: false,
    userName: guestName,
    ttlSeconds: TOKEN_TTL_SECONDS,
  });
}

/**
 * Looks at the provider once and moves the episode forward if the recording is ready.
 * Returns the (possibly updated) row.
 */
export async function refreshRecordingStatus(episode: PodcastEpisodeRow): Promise<PodcastEpisodeRow> {
  if (episode.status !== "processing" || !episode.room_name) return episode;

  const recording = await getLatestRecording(episode.room_name);
  if (!recording) return episode; // provider hasn't registered it yet

  if (recording.status === "finished") {
    return updateEpisode(episode.id, {
      status: "draft",
      recording_id: recording.id,
      duration_seconds: recording.duration ? Math.round(recording.duration) : null,
      video_location: `daily-recording:${recording.id}`,
      // The recording provider produces MP4 only, so there is no MP3 file to point at.
      audio_location: null,
      error_message: null,
    });
  }
  if (recording.status === "canceled") {
    return updateEpisode(episode.id, {
      status: "error",
      error_message: "The recording didn't save. Please choose Start Over and record again.",
    });
  }
  return episode; // still in progress / processing
}

/** Deletes provider-side room and recording for an episode that is being thrown away. */
export async function discardProviderAssets(episode: PodcastEpisodeRow): Promise<void> {
  try {
    let recordingId = episode.recording_id;
    if (!recordingId && episode.room_name) {
      recordingId = (await getLatestRecording(episode.room_name))?.id ?? null;
    }
    if (recordingId) await deleteRecording(recordingId);
  } catch {
    // Already gone at the provider; nothing to clean up.
  }
  if (episode.room_name) await deleteRoom(episode.room_name);
}
