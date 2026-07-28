import type { files } from "dropbox";
import { getDropboxClient } from "./oauth";

export type DropboxFileEntry = {
  dropboxFileId: string;
  path: string;
  filename: string;
  size: number;
  contentHash: string | null;
  rev: string;
  serverModified: string;
};

function isFileEntry(
  entry: files.ListFolderResult["entries"][number]
): entry is files.FileMetadataReference {
  return entry[".tag"] === "file";
}

/**
 * Recursively lists every file under rootPath in the connected Dropbox
 * account (read-only — this never modifies anything). Handles pagination
 * automatically. rootPath "" means the entire Dropbox.
 */
export async function listAllDropboxFiles(rootPath = ""): Promise<DropboxFileEntry[]> {
  const dbx = await getDropboxClient();
  if (!dbx) {
    throw new Error("Dropbox is not connected.");
  }

  const files: DropboxFileEntry[] = [];

  let response = await dbx.filesListFolder({
    path: rootPath,
    recursive: true,
    include_non_downloadable_files: false,
  });

  while (true) {
    for (const entry of response.result.entries) {
      if (isFileEntry(entry)) {
        files.push({
          dropboxFileId: entry.id,
          path: entry.path_display ?? entry.path_lower ?? entry.name,
          filename: entry.name,
          size: entry.size,
          contentHash: entry.content_hash ?? null,
          rev: entry.rev,
          serverModified: entry.server_modified,
        });
      }
    }

    if (!response.result.has_more) break;
    response = await dbx.filesListFolderContinue({ cursor: response.result.cursor });
  }

  return files;
}
