/** Shared, browser-safe types and helpers for the studio. No server-only imports here. */

export type EpisodeStatus =
  | "setup"
  | "recording"
  | "processing"
  | "draft"
  | "published"
  | "discarded"
  | "error";

export type WebsiteStatus = "none" | "published" | "failed";

/** What the browser is allowed to know about an episode. */
export type EpisodeView = {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  status: EpisodeStatus;
  errorMessage: string | null;
  durationSeconds: number | null;
  hasRecording: boolean;
  guestLinksCreated: number;
  websiteStatus: WebsiteStatus;
  websiteError: string | null;
};

export const MAX_GUESTS = 4;
export const MAX_PEOPLE = MAX_GUESTS + 1;

export type StatusLabel =
  | "Ready"
  | "Testing"
  | "Recording"
  | "Stopped"
  | "Uploading"
  | "Published"
  | "Error";

/** The one status word shown at the top of the host screen. */
export function statusLabel(episode: EpisodeView, testing: boolean): StatusLabel {
  if (episode.status === "error" || episode.websiteStatus === "failed") return "Error";
  if (episode.status === "published") return "Published";
  if (episode.status === "processing") return "Uploading";
  if (episode.status === "recording") return "Recording";
  if (episode.status === "draft") return "Stopped";
  return testing ? "Testing" : "Ready";
}

export function formatDuration(totalSeconds: number | null): string {
  if (!totalSeconds || totalSeconds < 0) return "";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
}

/** Start Over must never touch anything that already went live on the website. */
export function hasAnythingGoneLive(e: Pick<EpisodeView, "status" | "websiteStatus">): boolean {
  return e.status === "published" || e.websiteStatus === "published";
}

/** Today's date in Stephen's timezone, as YYYY-MM-DD. */
export function todayInEastern(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
