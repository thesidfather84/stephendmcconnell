import episodesRaw from "./podcast-episodes.json";

/**
 * Public podcast entries shown on /media. This file's JSON holds ONLY
 * published episodes and only public-safe fields — never guest names or
 * emails, invite links, room links, or recording URLs. The video itself is played through
 * /api/podcast/video/<id>, which only serves episodes that are published.
 */
export type PublicPodcastEpisode = {
  id: string;
  title: string;
  description: string;
  /** ISO calendar date (YYYY-MM-DD) the episode was recorded. */
  date: string;
  /** ISO timestamp of when it went live on the site; breaks ties between same-day episodes. */
  publishedAt: string;
};

export const PODCAST_EPISODES_REPO_PATH = "src/data/podcast-episodes.json";

/** Newest first by episode date; same-day episodes newest-published first. */
export function sortEpisodesNewestFirst(list: PublicPodcastEpisode[]): PublicPodcastEpisode[] {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
    return 0;
  });
}

export function getPodcastEpisodes(): PublicPodcastEpisode[] {
  return sortEpisodesNewestFirst(episodesRaw as PublicPodcastEpisode[]);
}

/** Adds an episode, or replaces the entry with the same id (so retries never duplicate). */
export function upsertEpisode(
  list: PublicPodcastEpisode[],
  episode: PublicPodcastEpisode
): PublicPodcastEpisode[] {
  return sortEpisodesNewestFirst([...list.filter((e) => e.id !== episode.id), episode]);
}
