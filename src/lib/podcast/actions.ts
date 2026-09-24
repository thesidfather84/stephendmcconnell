"use server";

import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  attemptPasscode,
  endStudioSession,
  requireStudioSession,
  startStudioSession,
} from "./auth";
import { DailyError, getRecordingLink, stopRoomRecording } from "./daily";
import {
  claimInvite,
  createEpisode,
  createInvite,
  discardProviderAssets,
  getEpisode,
  getGuestJoinToken,
  getHostJoinInfo,
  hashToken,
  lookupInvite,
  refreshRecordingStatus,
  revokeAllInvites,
  toView,
  updateEpisode,
} from "./episodes";
import { hasAnythingGoneLive, type EpisodeView } from "./status";

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; message: string };

function fail(err: unknown, fallback: string): { ok: false; message: string } {
  if (err instanceof Error && err.message === "NOT_SIGNED_IN") {
    return { ok: false, message: "Please enter the studio code again." };
  }
  if (err instanceof DailyError) return { ok: false, message: err.message };
  if (err instanceof Error && /^(Couldn't|That episode)/.test(err.message)) {
    return { ok: false, message: err.message };
  }
  return { ok: false, message: fallback };
}

// ---------------------------------------------------------------- sign in

export async function enterStudioAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const code = String(formData.get("code") ?? "").trim();
  const result = await attemptPasscode(code).catch(() => ({
    ok: false as const,
    message: "Something went wrong. Please try again in a moment.",
  }));
  if (!result.ok) return { error: result.message };

  await startStudioSession();
  redirect("/podcast-studio");
}

export async function leaveStudioAction(): Promise<void> {
  await endStudioSession();
  redirect("/podcast-studio");
}

// ------------------------------------------------------------ host actions

export async function saveDetailsAction(
  episodeId: string,
  title: string,
  description: string
): Promise<ActionResult> {
  try {
    await requireStudioSession();
    const episode = await getEpisode(episodeId);
    if (episode.status === "published" || episode.status === "discarded") return { ok: true };
    await updateEpisode(episodeId, {
      title: title.slice(0, 200),
      description: description.slice(0, 5000),
    });
    return { ok: true };
  } catch (err) {
    return fail(err, "Couldn't save the title and description. Please try again.");
  }
}

/** Gets Stephen's credentials to enter the private room. */
export async function getHostRoomAction(
  episodeId: string
): Promise<ActionResult<{ roomUrl: string; token: string }>> {
  try {
    await requireStudioSession();
    const episode = await getEpisode(episodeId);
    if (episode.status !== "setup" && episode.status !== "recording") {
      return { ok: false, message: "This episode already has a recording. Choose Start Over to record again." };
    }
    return { ok: true, ...(await getHostJoinInfo(episode)) };
  } catch (err) {
    return fail(err, "Couldn't open the recording room. Please try again.");
  }
}

export async function recordingStartedAction(episodeId: string): Promise<ActionResult> {
  try {
    await requireStudioSession();
    await updateEpisode(episodeId, { status: "recording", error_message: null });
    return { ok: true };
  } catch (err) {
    return fail(err, "Couldn't save the recording status.");
  }
}

/** Recording has been stopped: close the door on guests and wait for the provider to finish saving. */
export async function recordingStoppedAction(episodeId: string): Promise<ActionResult> {
  try {
    await requireStudioSession();
    const episode = await getEpisode(episodeId);
    if (episode.status !== "recording" && episode.status !== "processing") {
      return { ok: false, message: "This episode isn't recording right now." };
    }
    // Make sure Daily really stops, even if the phone's video window never got the message.
    if (episode.room_name) await stopRoomRecording(episode.room_name);
    await revokeAllInvites(episodeId);
    await updateEpisode(episodeId, { status: "processing" });
    return { ok: true };
  } catch (err) {
    return fail(err, "Couldn't save the recording status.");
  }
}

export async function recordingFailedAction(episodeId: string, message: string): Promise<ActionResult> {
  try {
    await requireStudioSession();
    await updateEpisode(episodeId, { status: "error", error_message: message.slice(0, 300) });
    return { ok: true };
  } catch (err) {
    return fail(err, "Couldn't save the recording status.");
  }
}

/** Asks the provider whether the finished recording is ready yet. */
export async function checkRecordingAction(
  episodeId: string
): Promise<ActionResult<{ episode: EpisodeView }>> {
  try {
    await requireStudioSession();
    const row = await refreshRecordingStatus(await getEpisode(episodeId));
    return { ok: true, episode: await toView(row) };
  } catch (err) {
    return fail(err, "Couldn't check on the recording. Please try again.");
  }
}

/** Short-lived private links so Stephen can preview or download his own draft. */
export async function getDraftLinkAction(episodeId: string): Promise<ActionResult<{ url: string }>> {
  try {
    await requireStudioSession();
    const episode = await getEpisode(episodeId);
    if (!episode.recording_id) return { ok: false, message: "There's no saved recording yet." };
    return { ok: true, url: await getRecordingLink(episode.recording_id) };
  } catch (err) {
    return fail(err, "Couldn't open the recording. Please try again.");
  }
}

async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL ?? "");
}

export async function createGuestLinkAction(
  episodeId: string
): Promise<ActionResult<{ link: string; guestLinksCreated: number }>> {
  try {
    await requireStudioSession();
    const created = await createInvite(episodeId);
    if (!created.ok) return created;
    return {
      ok: true,
      link: `${await siteOrigin()}/podcast-studio/join/${created.token}`,
      guestLinksCreated: created.guestLinksCreated,
    };
  } catch (err) {
    return fail(err, "Couldn't create the guest link. Please try again.");
  }
}

/**
 * Start Over. Discards an unpublished recording after the browser has confirmed.
 * If the episode is already Published, nothing is deleted — a fresh episode simply begins.
 * If anything has already gone live (even partly), this refuses to delete it.
 */
export async function startOverAction(
  episodeId: string
): Promise<ActionResult<{ episode: EpisodeView }>> {
  try {
    await requireStudioSession();
    const episode = await getEpisode(episodeId);
    const view = await toView(episode);

    if (episode.status === "published") {
      return { ok: true, episode: await toView(await createEpisode()) };
    }
    if (hasAnythingGoneLive(view)) {
      return {
        ok: false,
        message:
          "This episode is already partly published, so it can't be thrown away. Use the retry button to finish publishing it.",
      };
    }

    await revokeAllInvites(episodeId);
    await discardProviderAssets(episode);
    await updateEpisode(episodeId, { status: "discarded" });
    return { ok: true, episode: await toView(await createEpisode()) };
  } catch (err) {
    return fail(err, "Couldn't start over. Please try again.");
  }
}

// ----------------------------------------------------------- guest actions

const guestCookieName = (inviteId: string) => `podcast_guest_${inviteId.slice(0, 12)}`;

/**
 * A guest presses Join Episode. Checks the link, remembers this device so a refresh
 * doesn't lock them out, and hands back credentials for the private room.
 */
export async function joinAsGuestAction(
  linkToken: string,
  displayName: string
): Promise<ActionResult<{ roomUrl: string; token: string }>> {
  const name = displayName.replace(/\s+/g, " ").trim().slice(0, 40);
  if (!name) return { ok: false, message: "Please type your name first." };

  try {
    const invite = await lookupInvite(linkToken);
    if (invite.state !== "valid") {
      return { ok: false, message: "This link no longer works. Please ask Stephen for a new one." };
    }

    const store = await cookies();
    const cookie = store.get(guestCookieName(invite.inviteId))?.value;
    if (invite.claimed) {
      const sameDevice =
        cookie && invite.claimHash && hashToken(cookie) === invite.claimHash;
      if (!sameDevice) {
        return { ok: false, message: "This link was already used by someone else. Please ask Stephen for a new one." };
      }
    } else {
      const secret = crypto.randomBytes(24).toString("base64url");
      await claimInvite(invite.inviteId, hashToken(secret), name);
      store.set(guestCookieName(invite.inviteId), secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 12 * 60 * 60,
        path: "/podcast-studio/join",
      });
    }

    const token = await getGuestJoinToken(invite.episode.room_name!, name);
    return { ok: true, roomUrl: invite.episode.room_url!, token };
  } catch (err) {
    return fail(err, "Couldn't join the episode. Please try again.");
  }
}
