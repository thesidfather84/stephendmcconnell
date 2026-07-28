"use server";

import { redirect } from "next/navigation";
import {
  GeneratedContentKind,
  GeneratedItem,
  GeneratedStatus,
  GENERATED_CONTENT_REPO_PATH,
} from "@/data/generated-content";
import { GitHubPublishError, getRepoFile, putRepoFile } from "@/lib/github";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB — see next.config.ts serverActions.bodySizeLimit

export type ActionResult = { error?: string; success?: boolean };

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function friendlyError(err: unknown): string {
  if (err instanceof GitHubPublishError) return err.message;
  return "Something went wrong while publishing. Please try again.";
}

/** Reads the current live list of admin-created content from GitHub. */
export async function readGeneratedContent(): Promise<GeneratedItem[]> {
  const file = await getRepoFile(GENERATED_CONTENT_REPO_PATH);
  if (!file) return [];
  try {
    return JSON.parse(file.content) as GeneratedItem[];
  } catch {
    return [];
  }
}

async function withPublish(
  mutate: (items: GeneratedItem[]) => GeneratedItem[],
  message: string
): Promise<void> {
  const file = await getRepoFile(GENERATED_CONTENT_REPO_PATH);
  const current: GeneratedItem[] = file ? JSON.parse(file.content) : [];
  const next = mutate(current);

  await putRepoFile({
    path: GENERATED_CONTENT_REPO_PATH,
    content: JSON.stringify(next, null, 2) + "\n",
    message,
    sha: file?.sha,
  });
}

async function uploadFile(file: File, folder: string): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new GitHubPublishError(
      "That file is too large to upload here (4MB limit). Try a Dropbox link instead."
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const storedName = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await putRepoFile({
    path: `public/uploads/${folder}/${storedName}`,
    content: buffer,
    message: `Upload ${safeName} via admin panel`,
  });

  return `/uploads/${folder}/${storedName}`;
}

function extractYoutubeId(url: string): string | undefined {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return undefined;
}

async function fetchYoutubeOEmbed(
  url: string
): Promise<{ title: string; thumbnailUrl?: string } | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data.title, thumbnailUrl: data.thumbnail_url };
  } catch {
    return null;
  }
}

function baseItem(): Pick<GeneratedItem, "id" | "createdAt" | "updatedAt"> {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), createdAt: now, updatedAt: now };
}

export async function createArticleAction(formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const authors = String(formData.get("authors") ?? "Stephen D. McConnell, MSc").trim();
  const status = String(formData.get("status") ?? "draft") as GeneratedStatus;
  const dropboxUrl = String(formData.get("dropboxUrl") ?? "").trim();
  const doi = String(formData.get("doi") ?? "").trim();
  const publicationUrl = String(formData.get("publicationUrl") ?? "").trim();
  const tags = parseTags(formData.get("tags"));
  const file = formData.get("file") as File | null;

  if (!title) return { error: "Please enter a title for the article." };

  try {
    let fileUrl: string | undefined;
    if (file && file.size > 0) {
      fileUrl = await uploadFile(file, "articles");
    }

    const sourceUrl = dropboxUrl || publicationUrl || (doi ? `https://doi.org/${doi}` : undefined);

    const item: GeneratedItem = {
      ...baseItem(),
      kind: "research-article",
      title,
      status,
      summary:
        "Summary coming soon — this article was added through the admin panel and has not yet been summarized.",
      citation: `${authors}. ${title}.${doi ? ` https://doi.org/${doi}` : ""}`,
      tags,
      sourceUrl,
      doi: doi || undefined,
      fileUrl,
    };

    await withPublish((items) => [...items, item], `Add research article: ${title}`);
  } catch (err) {
    return { error: friendlyError(err) };
  }

  redirect(status === "published" ? "/admin/published" : "/admin/drafts");
}

export async function createYoutubeVideoAction(formData: FormData): Promise<ActionResult> {
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as GeneratedStatus;
  const notes = String(formData.get("notes") ?? "").trim();
  const tags = parseTags(formData.get("tags"));

  if (!youtubeUrl) return { error: "Please paste a YouTube link." };

  const youtubeId = extractYoutubeId(youtubeUrl);
  if (!youtubeId) return { error: "That doesn't look like a valid YouTube link." };

  try {
    const oembed = await fetchYoutubeOEmbed(youtubeUrl);
    const title = oembed?.title ?? "Untitled YouTube Video";

    const item: GeneratedItem = {
      ...baseItem(),
      kind: "youtube-video",
      title,
      status,
      summary: notes || undefined,
      tags,
      youtubeUrl,
      youtubeId,
      thumbnailUrl: oembed?.thumbnailUrl,
    };

    await withPublish((items) => [...items, item], `Add YouTube video: ${title}`);
  } catch (err) {
    return { error: friendlyError(err) };
  }

  redirect(status === "published" ? "/admin/published" : "/admin/drafts");
}

export async function createPodcastAction(formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const podcastUrl = String(formData.get("podcastUrl") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as GeneratedStatus;
  const notes = String(formData.get("notes") ?? "").trim();
  const tags = parseTags(formData.get("tags"));

  if (!title) return { error: "Please enter a title." };
  if (!podcastUrl) return { error: "Please paste a podcast link." };

  try {
    const item: GeneratedItem = {
      ...baseItem(),
      kind: "podcast",
      title,
      status,
      summary: notes || undefined,
      tags,
      sourceUrl: podcastUrl,
    };

    await withPublish((items) => [...items, item], `Add podcast: ${title}`);
  } catch (err) {
    return { error: friendlyError(err) };
  }

  redirect(status === "published" ? "/admin/published" : "/admin/drafts");
}

export async function createDocumentAction(formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const kind = String(formData.get("kind") ?? "pdf") as GeneratedContentKind;
  const status = String(formData.get("status") ?? "draft") as GeneratedStatus;
  const tags = parseTags(formData.get("tags"));
  const file = formData.get("file") as File | null;

  if (!title) return { error: "Please enter a title." };
  if (!file || file.size === 0) return { error: "Please choose or drop a file to upload." };

  try {
    const fileUrl = await uploadFile(file, "documents");

    const item: GeneratedItem = {
      ...baseItem(),
      kind,
      title,
      status,
      summary: "Summary coming soon — added through the admin panel.",
      tags,
      fileUrl,
    };

    await withPublish((items) => [...items, item], `Upload document: ${title}`);
  } catch (err) {
    return { error: friendlyError(err) };
  }

  redirect(status === "published" ? "/admin/published" : "/admin/drafts");
}

export async function setContentStatusAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const newStatus = String(formData.get("newStatus") ?? "draft") as GeneratedStatus;

  await withPublish(
    (items) => items.map((item) => (item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item)),
    `${newStatus === "published" ? "Publish" : "Unpublish"} content ${id}`
  );

  redirect(newStatus === "published" ? "/admin/published" : "/admin/drafts");
}

export async function deleteContentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "/admin/drafts");

  await withPublish((items) => items.filter((item) => item.id !== id), `Delete content ${id}`);

  redirect(returnTo);
}
