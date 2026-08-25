import { YOUTUBE_CHANNEL_URL } from "@/lib/site";
import generatedContentRaw from "./generated-content.json";
import type { GeneratedItem } from "./generated-content";

const generatedContent = generatedContentRaw as GeneratedItem[];

export type MediaType = "video" | "podcast" | "interview";

/** Which curated video-library shelf an item is grouped under on /media. */
export type VideoCategory =
  | "interviews"
  | "niacin-ckd-webinars"
  | "testimonials"
  | "shorts";

export const VIDEO_CATEGORY_LABELS: Record<VideoCategory, string> = {
  interviews: "Interviews & Podcasts",
  "niacin-ckd-webinars": "Niacin Protocol & CKD Reversal Webinars",
  testimonials: "Patient & Physician Testimonials",
  shorts: "Shorts",
};

export const VIDEO_CATEGORY_DESCRIPTIONS: Record<VideoCategory, string> = {
  interviews:
    "Long-form guest appearances and podcast conversations with Stephen.",
  "niacin-ckd-webinars":
    "Webinars and explainers on the niacin and sodium bicarbonate research behind Stephen's approach.",
  testimonials:
    "Patient and physician accounts of using the protocols Stephen researches. These are individual experiences, not typical results.",
  shorts: "Short, vertical-format clips.",
};

/**
 * Whether Stephen D. McConnell's on-screen appearance in a video has been
 * independently confirmed. "unconfirmed" must never be displayed as "yes" —
 * see CONTENT-REVIEW-CHECKLIST.md and the Video Library Intake review.
 */
export type AppearanceStatus = "confirmed" | "unconfirmed" | "not-present";

export type MediaItem = {
  slug: string;
  type: MediaType;
  title: string;
  description: string;
  /** ISO date, only set when an exact publish date was independently confirmed. */
  date?: string;
  /** Human-readable date to show instead of `date` when only an approximate date is known. */
  dateLabel?: string;
  source: string;
  youtubeId?: string;
  externalUrl: string;
  channel?: string;
  durationLabel?: string;
  category?: VideoCategory;
  ckdTopic?: string;
  appearance?: AppearanceStatus;
  featured?: boolean;
  seriesLabel?: string;
  /** True when no real title was set by the uploader and `title` is a neutral, content-derived label rather than the video's own title. */
  titleIsDescriptive?: boolean;
  /** Short caution/context note shown on the card (compliance, duplicate-submission, title-correction, etc). */
  note?: string;
  /** false = held back from public display pending further verification. Defaults to true. */
  published?: boolean;
  heldReason?: string;
};

export const mediaItems: MediaItem[] = [
  {
    slug: "kidney-total-health-channel-intro",
    type: "video",
    title: "Welcome to Kidney Total Health",
    description:
      "An introduction to the Kidney Total Health YouTube channel and Stephen McConnell's approach to kidney research and education.",
    date: "2024-01-15",
    source: "Kidney Total Health (YouTube)",
    externalUrl: YOUTUBE_CHANNEL_URL,
  },
  {
    slug: "niacin-sodium-bicarbonate-explained",
    type: "video",
    title: "Niacin and Sodium Bicarbonate, Explained",
    description:
      "Stephen McConnell walks through the reasoning behind niacin and sodium bicarbonate protocols for kidney health.",
    date: "2024-03-02",
    source: "Kidney Total Health (YouTube)",
    externalUrl: YOUTUBE_CHANNEL_URL,
  },
  {
    slug: "lipidology-interview",
    type: "interview",
    title: "A Conversation on Lipidology and Kidney Disease",
    description:
      "An interview covering Stephen McConnell's background in lipidemiology and how it informs his kidney research.",
    date: "2023-11-10",
    source: "Podcast Interview",
    externalUrl: YOUTUBE_CHANNEL_URL,
  },
];

/**
 * The 21 videos Stephen submitted for the Video Library (Aug 2026 intake).
 * TEADeHq1pVI and Tizvh1DBdZU were each submitted twice and appear once here.
 * Every field below reflects what the intake research could independently
 * verify — see the Video Library Intake deliverable for full sourcing notes.
 * Three items are `published: false` pending Stephen's confirmation; they
 * are excluded from every public listing but kept here for the record.
 */
export const videoLibraryItems: MediaItem[] = [
  // ---- Featured (appearance confirmed, on-topic, no open verification gaps) ----
  {
    slug: "video-Tizvh1DBdZU",
    type: "video",
    title: "Reversing Kidney Disease (First Case Study!) — Stephen McConnell",
    description:
      "Host Robert Galarowicz, a 20-year kidney transplant patient, interviews Stephen about how he entered the kidney-health field and his first documented CKD reversal case study.",
    dateLabel: "~2025 (exact date unavailable)",
    source: "HealthyKidney Inc (YouTube)",
    youtubeId: "Tizvh1DBdZU",
    externalUrl: "https://www.youtube.com/watch?v=Tizvh1DBdZU",
    channel: "HealthyKidney Inc",
    durationLabel: "Not confirmed (long-form; pre-roll ads interrupted timing checks)",
    category: "interviews",
    ckdTopic: "Origin story and first documented CKD reversal case study",
    appearance: "confirmed",
    featured: true,
    note: "Submitted twice by Stephen — listed once here. Highest view count (12K) of all 21 submitted videos.",
  },
  {
    slug: "video-YGfEtd1-gz0",
    type: "video",
    title: "Dr. Stephen McConnell Kidney Health: Avoiding Kidney Disease and Reversing Kidney Disease",
    description:
      "Livestream interview and Q&A on preventing and reversing kidney disease.",
    dateLabel: "~November 2025 (exact date unavailable)",
    source: "Journey Life TV (YouTube)",
    youtubeId: "YGfEtd1-gz0",
    externalUrl: "https://www.youtube.com/watch?v=YGfEtd1-gz0",
    channel: "Journey Life TV",
    durationLabel: "37:19",
    category: "interviews",
    ckdTopic: "General CKD prevention and reversal overview",
    appearance: "confirmed",
    featured: true,
  },
  {
    slug: "video-jSWsJvj5T2M",
    type: "video",
    title: "Kidney Disease with Dr. Stephen McConnell",
    description:
      "Vertical-format YouTube Short clipped from the same Journey Life TV session as the full interview above.",
    dateLabel: "~November 2025 (exact date unavailable)",
    source: "Journey Life TV (YouTube)",
    youtubeId: "jSWsJvj5T2M",
    externalUrl: "https://www.youtube.com/shorts/jSWsJvj5T2M",
    channel: "Journey Life TV",
    durationLabel: "~0:50 (approx. — exact runtime not confirmed)",
    category: "shorts",
    ckdTopic: "General kidney disease (companion clip to the interview above)",
    appearance: "confirmed",
    featured: true,
    seriesLabel: "Companion Short to the full Journey Life TV interview",
  },
  {
    slug: "video-vF6Gwmy2Sx0",
    type: "video",
    title: "Niacin Uncensored: Busting Myths and Revealing Benefits with Expert Stephen McConnell",
    description:
      "Full podcast episode addressing common niacin myths — including cardiovascular-risk claims — and presenting counter-evidence and benefits.",
    dateLabel: "~2024 (exact date unavailable)",
    source: "Midlife Wellness NP (YouTube)",
    youtubeId: "vF6Gwmy2Sx0",
    externalUrl: "https://www.youtube.com/watch?v=vF6Gwmy2Sx0",
    channel: "Midlife Wellness NP",
    durationLabel: "1:45:26",
    category: "niacin-ckd-webinars",
    ckdTopic: "Niacin myths, evidence, and cardiovascular risk",
    appearance: "confirmed",
    featured: true,
    note: "A web search surfaced a specific date (May 18, 2024) that could not be independently confirmed on the YouTube page itself — treat as unverified.",
  },

  // ---- Interviews & Podcasts ----
  {
    slug: "video-ZRwhoPv-1dM",
    type: "video",
    title: "PT1: Kidney Disease, Niacin, Hypertension & Diabetes | Stephen McConnell MSc.",
    description:
      "Part 1 of a two-part discussion connecting kidney disease with niacin, hypertension, and diabetes, and the lab tests standard care may miss.",
    dateLabel: "~December 2025 (exact date unavailable)",
    source: "Chemaines Model Health (YouTube)",
    youtubeId: "ZRwhoPv-1dM",
    externalUrl: "https://www.youtube.com/watch?v=ZRwhoPv-1dM",
    channel: "Chemaines Model Health",
    durationLabel: "1:29:13",
    category: "interviews",
    ckdTopic: "Niacin, hypertension, and diabetes connections",
    appearance: "confirmed",
    seriesLabel: "Part 1 of 2 — paired with 9wXlhI9RwnE",
  },
  {
    slug: "video-9wXlhI9RwnE",
    type: "video",
    title: "PT2: Causes of Kidney Disease, the Thyroid Connection, Alcohol & Gout with Stephen McConnell MSc.",
    description:
      "Part 2 follow-up: the thyroid–kidney connection, and how alcohol and elevated uric acid (gout) quietly drive kidney damage.",
    dateLabel: "~January 2026 (exact date unavailable)",
    source: "Chemaines Model Health (YouTube)",
    youtubeId: "9wXlhI9RwnE",
    externalUrl: "https://www.youtube.com/watch?v=9wXlhI9RwnE",
    channel: "Chemaines Model Health",
    durationLabel: "45:09",
    category: "interviews",
    ckdTopic: "Thyroid connection, alcohol, and gout/uric acid",
    appearance: "confirmed",
    seriesLabel: "Part 2 of 2 — paired with ZRwhoPv-1dM",
  },
  {
    slug: "video-cizzemy_KAo",
    type: "video",
    title: "Reversing Chronic Kidney Disease, Is It Possible? (2025) — with Stephen McConnell",
    description:
      "Long-form podcast interview on whether CKD reversal is possible, drawing on Stephen's clinical and preventive-care background.",
    dateLabel: "~2025 (exact date unavailable)",
    source: "Stephanie MoDavis (YouTube)",
    youtubeId: "cizzemy_KAo",
    externalUrl: "https://www.youtube.com/watch?v=cizzemy_KAo",
    channel: "Stephanie MoDavis",
    durationLabel: "1:23:39",
    category: "interviews",
    ckdTopic: "General CKD reversal and clinical background",
    appearance: "confirmed",
    note: "The uploaded title misspells his name as \"Steven\" — corrected here to \"Stephen.\"",
  },
  {
    slug: "video-fjENZFwZ_fI",
    type: "video",
    title: "The Real Story Behind Chronic Kidney Disease & How to Tackle It Holistically",
    description:
      "\"Wellness at the Speed of Light\" podcast episode: holistic CKD management, plus a discussion of ApoB testing as a cardiovascular-risk marker.",
    date: "2024-11-06",
    source: "Stefano Sinicropi MD (YouTube)",
    youtubeId: "fjENZFwZ_fI",
    externalUrl: "https://www.youtube.com/watch?v=fjENZFwZ_fI",
    channel: "Stefano Sinicropi MD",
    durationLabel: "1:58:22",
    category: "interviews",
    ckdTopic: "Holistic CKD management; ApoB vs. LDL testing",
    appearance: "confirmed",
    note: "One of only two videos in the batch with a confirmed exact publish date.",
  },

  // ---- Niacin Protocol & CKD Reversal Webinars ----
  {
    slug: "video-fHDJ9Ln0DeA",
    type: "video",
    title: "Dr. Sampathkumar Webinar: CKD Reversal — Is It Possible?",
    description:
      "Dr. Sampathkumar presents the science behind the niacin protocol and its role in CKD healing and reversal.",
    dateLabel: "~August 2025 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "fHDJ9Ln0DeA",
    externalUrl: "https://www.youtube.com/watch?v=fHDJ9Ln0DeA",
    channel: "Health Defender",
    durationLabel: "45:56",
    category: "niacin-ckd-webinars",
    ckdTopic: "CKD reversal via the niacin protocol",
    appearance: "unconfirmed",
    note: "Uploaded title read \"Ist It Possible?\" (typo), shown here corrected. Stephen's on-screen role in this Health Defender webinar has not been independently confirmed.",
  },
  {
    slug: "video-lUIb7d9kFzE",
    type: "video",
    title: "Nutrition for Kidney Health: Hydration Strategies Webinar",
    description:
      "Webinar presented by Michelle Zenisek and Dr. Alise Jones-Bailey covering hydration strategies for kidney health. (On-screen slide read \"Nutrition for Kidney Health.\")",
    dateLabel: "~February 2026 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "lUIb7d9kFzE",
    externalUrl: "https://www.youtube.com/watch?v=lUIb7d9kFzE",
    channel: "Health Defender",
    durationLabel: "38:22",
    category: "niacin-ckd-webinars",
    ckdTopic: "Kidney nutrition and hydration strategy",
    appearance: "unconfirmed",
    titleIsDescriptive: true,
    note: "No title was set by the uploader — the label above is a neutral description drawn directly from the on-screen slide and presenters, not an invented title. Stephen was not visible in the sampled frame; his role is unconfirmed.",
  },
  {
    slug: "video-Gl75AeE4sgs",
    type: "video",
    title: "Kidney Support Supplement Reverses Kidney Disease: 25 Case Studies of CKD Kidney Support Supplements",
    description:
      "Third-party explainer summarizing a protocol (niacin, sodium bicarbonate, calcium carbonate, low-dose thyroid support, and L-methylfolate) credited to Stephen's research, framed around 25 documented CKD case studies.",
    dateLabel: "~2022 (exact date unavailable)",
    source: "HealthyKidney Inc (YouTube)",
    youtubeId: "Gl75AeE4sgs",
    externalUrl: "https://www.youtube.com/watch?v=Gl75AeE4sgs",
    channel: "HealthyKidney Inc",
    durationLabel: "4:26",
    category: "niacin-ckd-webinars",
    ckdTopic: "Niacin + sodium bicarbonate protocol, 25 case studies",
    appearance: "unconfirmed",
    note: "Third-party production — the channel's own host narrates this, not Stephen; his on-screen appearance is unconfirmed. Title and outcome claims (\"reverses,\" \"25 case studies\") are the third-party creator's own and are not independently verified or endorsed as medical outcomes by this site. Third-highest view count (10K) in the batch.",
  },

  // ---- Patient & Physician Testimonials ----
  {
    slug: "video-TEADeHq1pVI",
    type: "video",
    title: "Can a Simple Nutritional Approach Help Support Healthy Blood Pressure Levels?",
    description:
      "Testimonial interview: Valerie describes her experience with hypertension after following the niacin protocol Stephen researches.",
    dateLabel: "~June 2026 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "TEADeHq1pVI",
    externalUrl: "https://www.youtube.com/watch?v=TEADeHq1pVI",
    channel: "Health Defender",
    durationLabel: "36:58",
    category: "testimonials",
    ckdTopic: "Blood pressure (not CKD-specific); same niacin protocol used for CKD elsewhere",
    appearance: "confirmed",
    note: "Submitted twice — once with timestamp 2:39, which is ordinary split-screen interview footage, not a distinct clip. Patient-reported outcome; individual results are not independently verified.",
  },
  {
    slug: "video-eJFFzGIl6hg",
    type: "video",
    title: "Dr. Alise Jones-Bailey on the Niacin Protocol for Kidney Patients",
    description:
      "Dr. Alise Jones-Bailey (CEO, Buckhead Functional Medicine) discusses the niacin protocol and its benefits for kidney patients in her practice.",
    dateLabel: "~August 2025 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "eJFFzGIl6hg",
    externalUrl: "https://www.youtube.com/watch?v=eJFFzGIl6hg",
    channel: "Health Defender",
    durationLabel: "1:54",
    category: "testimonials",
    ckdTopic: "Niacin protocol outcomes for kidney patients",
    appearance: "unconfirmed",
    titleIsDescriptive: true,
    note: "No title was set by the uploader — the label above is a neutral description of the confirmed speaker and subject, not an invented title. Physician-reported experience; individual results are not independently verified.",
  },
  {
    slug: "video-6AoWJ9gN5PU",
    type: "video",
    title: "Dr. Babino on Niacin Protocol Outcomes for Kidney Disease Patients",
    description:
      "Dr. Babino describes clinical outcomes using the niacin protocol with kidney-disease patients at varying stages.",
    dateLabel: "~August 2025 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "6AoWJ9gN5PU",
    externalUrl: "https://www.youtube.com/watch?v=6AoWJ9gN5PU",
    channel: "Health Defender",
    durationLabel: "1:19",
    category: "testimonials",
    ckdTopic: "Niacin protocol outcomes across CKD stages",
    appearance: "unconfirmed",
    titleIsDescriptive: true,
    note: "No title was set by the uploader — the label above is a neutral description of the confirmed speaker and subject, not an invented title. Physician-reported experience; individual results are not independently verified.",
  },
  {
    slug: "video-6kiEIRF6QZ0",
    type: "video",
    title: "Sven Testimonial",
    description:
      "Patient Sven H. describes going from CKD Stage 3 to normalized kidney numbers within two months.",
    dateLabel: "~2025 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "6kiEIRF6QZ0",
    externalUrl: "https://www.youtube.com/watch?v=6kiEIRF6QZ0",
    channel: "Health Defender",
    durationLabel: "2:05",
    category: "testimonials",
    ckdTopic: "Patient outcome testimonial, CKD Stage 3",
    appearance: "unconfirmed",
    note: "Patient-reported outcome; individual results are not independently verified. See the medical disclaimer.",
  },
  {
    slug: "video-YDMpCrqHs4k",
    type: "video",
    title: "Dr Ellie Campbell Kidney Defender 04 22 25",
    description:
      "Short webinar clip: Dr. Ellie Campbell (double board-certified physician) on kidney health.",
    dateLabel: "April 22, 2025 (date shown in the uploader's own title, not confirmed via YouTube metadata directly)",
    source: "Health Defender (YouTube)",
    youtubeId: "YDMpCrqHs4k",
    externalUrl: "https://www.youtube.com/watch?v=YDMpCrqHs4k",
    channel: "Health Defender",
    durationLabel: "2:27",
    category: "testimonials",
    ckdTopic: "Kidney health webinar clip",
    appearance: "unconfirmed",
    note: "Title shown verbatim as uploaded. \"Kidney Defender\" does not otherwise appear on this site — that naming question is intentionally left unresolved pending Stephen's confirmation, not adopted as a site product name.",
  },
  {
    slug: "video-wk6x489JA-Y",
    type: "video",
    title: "\"Haunted by Hypertension?\" Webinar Featuring Dr. Ellie Campbell",
    description:
      "Dr. Ellie Campbell, author of \"The Blood Pressure Blueprint,\" presents a natural hypertension-reduction protocol and explains the mouth–heart–kidney connection.",
    dateLabel: "~October 2025 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "wk6x489JA-Y",
    externalUrl: "https://www.youtube.com/watch?v=wk6x489JA-Y",
    channel: "Health Defender",
    durationLabel: "46:31",
    category: "testimonials",
    ckdTopic: "Hypertension and kidney interdependence",
    appearance: "unconfirmed",
  },

  // ---- Shorts ----
  {
    slug: "video-6RlXdj4xXeU",
    type: "video",
    title: "Kidney Defender Short 1",
    description: "Brief promotional explainer on supporting kidney health at most CKD stages.",
    dateLabel: "~2025 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "6RlXdj4xXeU",
    externalUrl: "https://www.youtube.com/watch?v=6RlXdj4xXeU",
    channel: "Health Defender",
    durationLabel: "0:54",
    category: "shorts",
    ckdTopic: "General CKD support (promotional)",
    appearance: "unconfirmed",
    note: "Title shown verbatim as uploaded. \"Kidney Defender\" does not otherwise appear on this site — that naming question is intentionally left unresolved pending Stephen's confirmation, not adopted as a site product name.",
  },

  // ---- Held back: not sufficiently verified, excluded from public pages ----
  {
    slug: "video-NRDd9Ziia8M",
    type: "video",
    title: "Untitled Health Defender clip",
    description: "No creator-provided description or confirmed title exists for this video.",
    dateLabel: "~April 2026 (exact date unavailable)",
    source: "Health Defender (YouTube)",
    youtubeId: "NRDd9Ziia8M",
    externalUrl: "https://www.youtube.com/watch?v=NRDd9Ziia8M",
    channel: "Health Defender",
    durationLabel: "1:58",
    appearance: "unconfirmed",
    published: false,
    heldReason:
      "No title, no description, and Stephen's presence could not be verified — only Dr. Ellie Campbell is visible in the sampled frame. Too thin to place responsibly without Stephen supplying context.",
  },
  {
    slug: "video-leSB1EobKxI",
    type: "video",
    title: "The Cardio/Kidney — Reclaiming Cellular Wisdom",
    description:
      "2.5-hour livestream replay on cardiovascular-kidney health; full speaker roster and content could not be confirmed.",
    dateLabel: "~October 2025 (exact date unavailable)",
    source: "Soul, Light And Body (YouTube)",
    youtubeId: "leSB1EobKxI",
    externalUrl: "https://www.youtube.com/watch?v=leSB1EobKxI",
    channel: "Soul, Light And Body",
    durationLabel: "2:31:11",
    appearance: "unconfirmed",
    published: false,
    heldReason:
      "Longest video in the batch with the least verifiable content — low view count, and the visible description snippet does not name Stephen or confirm the subject.",
  },
  {
    slug: "video-72dvr5e77yQ",
    type: "video",
    title: "Kidney Disease and Thyroid Gland! (How to Check It)",
    description:
      "Educational video on checking thyroid function in relation to kidney disease, hosted by HealthyKidney Inc's own founder.",
    dateLabel: "~2025 (exact date unavailable)",
    source: "HealthyKidney Inc (YouTube)",
    youtubeId: "72dvr5e77yQ",
    externalUrl: "https://www.youtube.com/watch?v=72dvr5e77yQ",
    channel: "HealthyKidney Inc",
    durationLabel: "8:03",
    appearance: "not-present",
    published: false,
    heldReason:
      "Confirmed to not feature Stephen — hosted and narrated entirely by Robert Galarowicz, with no mention of Stephen anywhere in the description. Not this site's content to feature.",
  },
];

function toMediaItem(item: GeneratedItem): MediaItem {
  return {
    slug: item.id,
    type: item.kind === "podcast" ? "podcast" : "video",
    title: item.title,
    description: item.summary ?? "",
    date: item.createdAt,
    source: item.kind === "podcast" ? "Podcast" : "Kidney Total Health (YouTube)",
    youtubeId: item.youtubeId,
    externalUrl: item.youtubeUrl ?? item.sourceUrl ?? YOUTUBE_CHANNEL_URL,
  };
}

/** Curated media plus anything published through the admin panel. Excludes held-back video-library items. */
export function getAllMediaItems(): MediaItem[] {
  const generated = generatedContent
    .filter((item) => item.status === "published" && (item.kind === "youtube-video" || item.kind === "podcast"))
    .map(toMediaItem);
  const publishedVideoLibrary = videoLibraryItems.filter((item) => item.published !== false);
  return [...publishedVideoLibrary, ...mediaItems, ...generated];
}

export function getMediaByType(type: MediaType): MediaItem[] {
  return getAllMediaItems().filter((item) => item.type === type);
}

/** The 4 strongest, appearance-confirmed videos for the /media featured strip. */
export function getFeaturedVideos(): MediaItem[] {
  return videoLibraryItems.filter((item) => item.published !== false && item.featured);
}

/** Non-featured published videos in a given category, for the /media category shelves. */
export function getVideosByCategory(category: VideoCategory): MediaItem[] {
  return videoLibraryItems.filter(
    (item) => item.published !== false && !item.featured && item.category === category
  );
}

/** Held-back items, for internal reporting only — never rendered on a public page. */
export function getHeldBackVideos(): MediaItem[] {
  return videoLibraryItems.filter((item) => item.published === false);
}
