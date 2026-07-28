import path from "path";
import { pathToFileURL } from "url";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff", "heic", "webp"];

export type ExtractedPage = { pageNumber: number; text: string };

export type ExtractionResult =
  | { status: "processed"; pages: ExtractedPage[] }
  | { status: "needs_review"; reason: string }
  | { status: "failed"; reason: string };

let workerConfigured = false;

async function extractPdfText(buffer: Buffer): Promise<ExtractionResult> {
  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // pdfjs normally spins up a Worker to parse off the main thread. Its
    // auto-detected worker path doesn't survive Turbopack/webpack bundling,
    // so point it at the real file on disk (process.cwd() reliably points
    // at the project root at runtime, unlike bundler-relative paths).
    if (!workerConfigured) {
      const workerPath = path.join(
        process.cwd(),
        "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
      );
      pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
      workerConfigured = true;
    }

    const doc = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      disableFontFace: true,
    }).promise;

    const pages: ExtractedPage[] = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      pages.push({ pageNumber, text });
    }

    const hasUsableText = pages.some((p) => p.text.length > 20);
    if (!hasUsableText) {
      return {
        status: "needs_review",
        reason: "PDF has no extractable embedded text (likely scanned) — awaiting OCR (not yet configured).",
      };
    }

    return { status: "processed", pages };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown PDF extraction error.";
    return { status: "failed", reason: `Could not read PDF: ${message}` };
  }
}

async function extractDocxText(buffer: Buffer): Promise<ExtractionResult> {
  try {
    const mammoth = (await import("mammoth")).default;
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();

    if (!text) {
      return { status: "failed", reason: "Word document had no readable text." };
    }

    return { status: "processed", pages: [{ pageNumber: 1, text }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Word document extraction error.";
    return { status: "failed", reason: `Could not read Word document: ${message}` };
  }
}

/** Extracts text from a downloaded file's bytes, based on its extension. */
export async function extractText(buffer: Buffer, extension: string): Promise<ExtractionResult> {
  const ext = extension.toLowerCase();

  if (ext === "pdf") return extractPdfText(buffer);
  if (ext === "docx") return extractDocxText(buffer);
  if (IMAGE_EXTENSIONS.includes(ext)) {
    return {
      status: "needs_review",
      reason: "Image file — awaiting OCR (not yet configured).",
    };
  }

  return { status: "failed", reason: `Unsupported file type: .${ext}` };
}
