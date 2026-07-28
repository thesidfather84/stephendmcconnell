export type MediaType = "video" | "podcast" | "interview";

export type MediaItem = {
  slug: string;
  type: MediaType;
  title: string;
  description: string;
  date: string;
  source: string;
  youtubeId?: string;
  externalUrl: string;
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
    externalUrl: "https://www.youtube.com/@KidneyTotalHealth",
  },
  {
    slug: "niacin-sodium-bicarbonate-explained",
    type: "video",
    title: "Niacin and Sodium Bicarbonate, Explained",
    description:
      "Stephen McConnell walks through the reasoning behind niacin and sodium bicarbonate protocols for kidney health.",
    date: "2024-03-02",
    source: "Kidney Total Health (YouTube)",
    externalUrl: "https://www.youtube.com/@KidneyTotalHealth",
  },
  {
    slug: "lipidology-interview",
    type: "interview",
    title: "A Conversation on Lipidology and Kidney Disease",
    description:
      "An interview covering Stephen McConnell's background in lipidemiology and how it informs his kidney research.",
    date: "2023-11-10",
    source: "Podcast Interview",
    externalUrl: "https://www.youtube.com/@KidneyTotalHealth",
  },
];

export function getMediaByType(type: MediaType): MediaItem[] {
  return mediaItems.filter((item) => item.type === type);
}
