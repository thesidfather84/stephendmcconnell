import { GitHubPublishError, getRepoFile, putRepoFile } from "@/lib/github";
import {
  PODCAST_EPISODES_REPO_PATH,
  upsertEpisode,
  type PublicPodcastEpisode,
} from "@/data/podcast-episodes";
import { getRecordingLink } from "./daily";
import { getEpisode, updateEpisode } from "./episodes";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { PodcastEpisodeRow } from "@/lib/supabase/types";
import {
  getSourceSize,
  isYoutubeReady,
  startUploadSession,
  uploadNextChunk,
  YoutubeError,
} from "./youtube";

const LOCK_MS = 90 * 1000; // one upload piece takes seconds; a claim older than this is a crashed request

/** Adds (or replaces) the episode's public entry on the /media page's data file, via a real commit. */
async function writeWebsiteEntry(entry: PublicPodcastEpisode): Promise<void> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const file = await getRepoFile(PODCAST_EPISODES_REPO_PATH);
    const current: unknown = file ? JSON.parse(file.content) : [];
    // Never overwrite a file we don't understand.
    if (!Array.isArray(current)) {
      throw new GitHubPublishError("The website's podcast list looks damaged, so nothing was changed.");
    }
    try {
      await putRepoFile({
        path: PODCAST_EPISODES_REPO_PATH,
        content: JSON.stringify(upsertEpisode(current as PublicPodcastEpisode[], entry), null, 2) + "\n",
        message: `Publish podcast episode: ${entry.title}`,
        sha: file?.sha,
      });
      return;
    } catch (err) {
      // A simultaneous change (or a stale file version) makes GitHub refuse the write. Re-read and try once more.
      if (attempt === 1) throw err;
    }
  }
}

export type PublishOutcome = {
  episode: PodcastEpisodeRow;
  /** Plain-English result, safe to show to the studio user. */
  message: string;
  ok: boolean;
  /** True when a YouTube copy should now be sent (the browser calls the "youtube" step until this is false). */
  continueUpload?: boolean;
};

/**
 * Publish to Website. The episode is marked Published only after the website entry is
 * really saved. Drafts stay private until this succeeds.
 */
export async function publishEpisode(episodeId: string): Promise<PublishOutcome> {
  let episode = await getEpisode(episodeId);

  if (episode.status === "published") {
    return { episode, ok: true, message: "This episode is already published." };
  }
  if (episode.status !== "draft" || !episode.recording_id) {
    return { episode, ok: false, message: "Stop the recording and wait for it to finish saving before publishing." };
  }
  if (!episode.title.trim()) {
    return { episode, ok: false, message: "Please type an episode title first." };
  }

  // The saved recording must really be retrievable, because the public page plays it from there.
  try {
    await getRecordingLink(episode.recording_id);
  } catch {
    return { episode, ok: false, message: "Your episode couldn't be published right now. Your recording is safe. Please try again in a moment." };
  }

  try {
    await writeWebsiteEntry({
      id: episode.id,
      title: episode.title.trim(),
      description: episode.description.trim(),
      date: episode.episode_date,
      publishedAt: new Date().toISOString(),
    });
  } catch (err) {
    // Technical detail is saved for the site owner; the studio user gets plain words.
    const detail = err instanceof GitHubPublishError ? err.message : "The website entry couldn't be saved.";
    episode = await updateEpisode(episode.id, { website_status: "failed", website_error: detail });
    return {
      episode,
      ok: false,
      message: "Your episode couldn't be published right now. Your recording is safe. Please press Publish Episode again.",
    };
  }

  episode = await updateEpisode(episode.id, {
    website_status: "published",
    website_error: null,
    status: "published",
    published_at: new Date().toISOString(),
  });
  return {
    episode,
    ok: true,
    message: "Your episode is published.",
    continueUpload: await isYoutubeReady(),
  };
}

async function claimUploadLock(id: string): Promise<boolean> {
  const now = new Date();
  const { data } = await createAdminSupabaseClient()
    .from("podcast_episodes")
    .update({ youtube_upload_lock: now.toISOString() })
    .eq("id", id)
    .or(`youtube_upload_lock.is.null,youtube_upload_lock.lt.${new Date(now.getTime() - LOCK_MS).toISOString()}`)
    .select("id");
  return Boolean(data?.length);
}

async function releaseUploadLock(id: string): Promise<void> {
  await createAdminSupabaseClient().from("podcast_episodes").update({ youtube_upload_lock: null }).eq("id", id);
}

export type YoutubeCopyOutcome = {
  ok: boolean;
  /** True while pieces remain: call again right away. */
  continueUpload: boolean;
  /** For the site owner's page only. */
  message: string;
};

/**
 * Sends ONE piece of a PUBLISHED episode's recording to the Kidney Total Health channel as Unlisted.
 * The episode is already live on the website, so nothing here can un-publish it. Progress and
 * problems are stored for the site owner; the studio user never sees them.
 */
export async function copyEpisodeToYoutube(episodeId: string): Promise<YoutubeCopyOutcome> {
  let episode = await getEpisode(episodeId);
  if (episode.status !== "published" || !episode.recording_id) {
    return { ok: false, continueUpload: false, message: "Only a published episode can be copied to YouTube." };
  }
  if (episode.youtube_status === "unlisted") return { ok: true, continueUpload: false, message: "Already on YouTube." };
  if (!(await isYoutubeReady())) return { ok: false, continueUpload: false, message: "YouTube isn't connected." };
  if (!(await claimUploadLock(episode.id))) {
    return { ok: false, continueUpload: false, message: "An upload for this episode is already running." };
  }

  try {
    const link = await getRecordingLink(episode.recording_id);
    let uploadUrl = episode.youtube_upload_url;
    let total = episode.youtube_upload_total;
    if (!uploadUrl || !total) {
      total = await getSourceSize(link);
      uploadUrl = await startUploadSession({ title: episode.title, description: episode.description, totalBytes: total });
      episode = await updateEpisode(episode.id, {
        youtube_upload_url: uploadUrl,
        youtube_upload_total: total,
        youtube_upload_bytes: 0,
      });
    }
    episode = await updateEpisode(episode.id, { youtube_status: "uploading", youtube_error: null });

    const result = await uploadNextChunk({ uploadUrl, sourceUrl: link, totalBytes: total });
    if ("expired" in result) {
      // YouTube dropped the paused upload (they last about a week). Begin a fresh one.
      await updateEpisode(episode.id, { youtube_upload_url: null, youtube_upload_total: null, youtube_upload_bytes: 0 });
      return { ok: true, continueUpload: true, message: "Restarting the upload." };
    }
    if (!result.done) {
      await updateEpisode(episode.id, { youtube_upload_bytes: result.bytes });
      return { ok: true, continueUpload: true, message: "Uploading." };
    }
    await updateEpisode(episode.id, {
      youtube_status: "unlisted",
      youtube_video_id: result.videoId,
      youtube_error: null,
      youtube_upload_url: null,
      youtube_upload_bytes: total,
    });
    return { ok: true, continueUpload: false, message: "Uploaded to YouTube (Unlisted)." };
  } catch (err) {
    const message =
      err instanceof YoutubeError ? err.message : "The upload to YouTube didn't finish. Please try again.";
    // The paused upload is kept, so trying again continues where it stopped instead of starting over.
    await updateEpisode(episode.id, { youtube_status: "failed", youtube_error: message });
    return { ok: false, continueUpload: false, message };
  } finally {
    await releaseUploadLock(episode.id);
  }
}
