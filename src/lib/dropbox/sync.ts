import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { listAllDropboxFiles, type DropboxFileEntry } from "./inventory";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff", "heic", "webp"];
const SUPPORTED_EXTENSIONS = ["pdf", "docx", ...IMAGE_EXTENSIONS];

export function classifyDocumentType(extension: string): string {
  const ext = extension.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (ext === "docx" || ext === "doc") return "word";
  if (ext === "pptx" || ext === "ppt") return "powerpoint";
  return "other";
}

function getExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export type SyncSummary = {
  totalListed: number;
  added: number;
  updated: number;
  unchanged: number;
  unsupported: number;
  missing: number;
};

/**
 * Lists everything under rootPath in Dropbox and reconciles it against the
 * `documents` table: new files are inserted as processing_status='pending',
 * changed files (different content_hash) are reset to 'pending' for
 * reprocessing, unchanged files are left alone entirely. Read-only against
 * Dropbox — this only ever writes to our own database.
 */
export async function syncDropboxInventory(rootPath = ""): Promise<SyncSummary> {
  const entries = await listAllDropboxFiles(rootPath);
  const supabase = createAdminSupabaseClient();

  const { data: existingRows, error: fetchError } = await supabase
    .from("documents")
    .select("id, dropbox_file_id, content_hash");

  if (fetchError) {
    throw new Error(`Failed to read existing documents: ${fetchError.message}`);
  }

  const existingByFileId = new Map(
    (existingRows ?? []).map((row) => [row.dropbox_file_id, row])
  );
  const seenFileIds = new Set<string>();

  const summary: SyncSummary = {
    totalListed: entries.length,
    added: 0,
    updated: 0,
    unchanged: 0,
    unsupported: 0,
    missing: 0,
  };

  for (const entry of entries) {
    seenFileIds.add(entry.dropboxFileId);
    const extension = getExtension(entry.filename);
    const isSupported = SUPPORTED_EXTENSIONS.includes(extension);
    const documentType = classifyDocumentType(extension);
    const existing = existingByFileId.get(entry.dropboxFileId);

    if (!existing) {
      const { error } = await supabase.from("documents").insert({
        dropbox_file_id: entry.dropboxFileId,
        dropbox_path: entry.path,
        dropbox_revision: entry.rev,
        content_hash: entry.contentHash,
        filename: entry.filename,
        display_title: entry.filename,
        file_extension: extension,
        document_type: documentType,
        file_size: entry.size,
        modified_at_dropbox: entry.serverModified,
        processing_status: isSupported ? "pending" : "failed",
        processing_error: isSupported ? null : `Unsupported file type: .${extension}`,
        is_public: false,
      });
      if (error) throw new Error(`Failed to insert document ${entry.path}: ${error.message}`);
      if (!isSupported) summary.unsupported += 1;
      summary.added += 1;
      continue;
    }

    if (existing.content_hash !== entry.contentHash) {
      const { error } = await supabase
        .from("documents")
        .update({
          dropbox_path: entry.path,
          dropbox_revision: entry.rev,
          content_hash: entry.contentHash,
          filename: entry.filename,
          file_size: entry.size,
          modified_at_dropbox: entry.serverModified,
          processing_status: isSupported ? "pending" : "failed",
          processing_error: isSupported ? null : `Unsupported file type: .${extension}`,
        })
        .eq("id", existing.id);
      if (error) throw new Error(`Failed to update document ${entry.path}: ${error.message}`);
      summary.updated += 1;
      continue;
    }

    summary.unchanged += 1;
  }

  // Files that used to exist but weren't seen in this listing: flag for
  // human review, never delete automatically. (Scoped to files previously
  // seen under the same rootPath sync — if you sync different subfolders
  // separately, only run this reconciliation against a consistent root.)
  const missingFileIds = [...existingByFileId.keys()].filter(
    (fileId): fileId is string => !!fileId && !seenFileIds.has(fileId)
  );

  if (missingFileIds.length > 0) {
    const missingIds = missingFileIds
      .map((fileId) => existingByFileId.get(fileId)?.id)
      .filter((id): id is string => !!id);

    const { data: currentlyFlagged } = await supabase
      .from("documents")
      .select("id, processing_error")
      .in("id", missingIds);

    const idsToFlag = (currentlyFlagged ?? [])
      .filter((row) => !row.processing_error?.startsWith("Missing from Dropbox"))
      .map((row) => row.id);

    if (idsToFlag.length > 0) {
      const { error } = await supabase
        .from("documents")
        .update({
          processing_status: "needs_review",
          processing_error: `Missing from Dropbox as of ${new Date().toISOString()} — file may have been moved, renamed outside this sync's scope, or deleted. Not removed automatically.`,
        })
        .in("id", idsToFlag);
      if (error) throw new Error(`Failed to flag missing documents: ${error.message}`);
    }

    summary.missing = missingFileIds.length;
  }

  return summary;
}

export type { DropboxFileEntry };
