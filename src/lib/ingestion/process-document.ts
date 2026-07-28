import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getDropboxClient } from "@/lib/dropbox/oauth";
import { extractText } from "./extract-text";
import type { DocumentRow } from "@/lib/supabase/types";

type DropboxFileDownloadResult =
  | { fileBinary: ArrayBuffer | Buffer; fileBlob?: never }
  | { fileBinary?: never; fileBlob: Blob };

async function toBuffer(result: DropboxFileDownloadResult): Promise<Buffer> {
  if (result.fileBinary) {
    return Buffer.isBuffer(result.fileBinary) ? result.fileBinary : Buffer.from(result.fileBinary);
  }
  const arrayBuffer = await result.fileBlob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Downloads one file from Dropbox (read-only), extracts its text, stores
 * page-level text in document_pages, and updates the document's
 * processing_status. The downloaded bytes are only ever held in memory —
 * nothing is written to disk, and the Dropbox original is never touched.
 */
export async function processDocument(document: Pick<DocumentRow, "id" | "dropbox_path" | "file_extension">): Promise<void> {
  const supabase = createAdminSupabaseClient();

  await supabase
    .from("documents")
    .update({ processing_status: "processing", processing_error: null })
    .eq("id", document.id);

  try {
    const dbx = await getDropboxClient();
    if (!dbx) throw new Error("Dropbox is not connected.");

    const response = await dbx.filesDownload({ path: document.dropbox_path });
    const result = response.result as unknown as DropboxFileDownloadResult;
    const buffer = await toBuffer(result);

    const extraction = await extractText(buffer, document.file_extension ?? "");

    // Replace any previously stored pages for this document (re-processing case).
    await supabase.from("document_pages").delete().eq("document_id", document.id);

    if (extraction.status === "processed") {
      const pageRows = extraction.pages.map((page) => ({
        document_id: document.id,
        page_number: page.pageNumber,
        extracted_text: page.text,
      }));

      if (pageRows.length > 0) {
        const { error: pagesError } = await supabase.from("document_pages").insert(pageRows);
        if (pagesError) throw new Error(`Failed to store pages: ${pagesError.message}`);
      }

      await supabase
        .from("documents")
        .update({ processing_status: "processed", processing_error: null })
        .eq("id", document.id);
      return;
    }

    // needs_review (e.g. image/scanned PDF awaiting OCR) or failed.
    await supabase
      .from("documents")
      .update({ processing_status: extraction.status, processing_error: extraction.reason })
      .eq("id", document.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown processing error.";
    await supabase
      .from("documents")
      .update({ processing_status: "failed", processing_error: message })
      .eq("id", document.id);
  }
}
