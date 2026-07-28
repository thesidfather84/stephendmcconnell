export type GeneratedContentKind =
  | "research-article"
  | "youtube-video"
  | "podcast"
  | "pdf"
  | "word-document"
  | "powerpoint";

export type GeneratedStatus = "draft" | "published";

export type GeneratedItem = {
  id: string;
  kind: GeneratedContentKind;
  title: string;
  status: GeneratedStatus;
  createdAt: string;
  updatedAt: string;
  summary?: string;
  citation?: string;
  tags?: string[];
  /** Dropbox link, publication URL, or podcast URL, depending on kind. */
  sourceUrl?: string;
  doi?: string;
  /** Path to a file committed into public/uploads/ by the admin panel. */
  fileUrl?: string;
  youtubeUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
};

export const GENERATED_CONTENT_REPO_PATH = "src/data/generated-content.json";

export const KIND_LABELS: Record<GeneratedContentKind, string> = {
  "research-article": "Research Article",
  "youtube-video": "YouTube Video",
  podcast: "Podcast",
  pdf: "PDF",
  "word-document": "Word Document",
  powerpoint: "PowerPoint",
};
