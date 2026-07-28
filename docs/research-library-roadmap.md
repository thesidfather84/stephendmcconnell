# Research Library — Phased Build Plan (Phases 4–11)

Status: Phases 1–3 complete (repo audit, Supabase schema, Dropbox OAuth code).
Phase 3 is code-complete but not yet *live* — pending the manual Supabase
migration, env vars, and first "Connect Dropbox" click described in
`docs/dropbox-setup.md`.

This document is the durable reference for what comes next, so scope isn't
re-litigated each session. Each phase below ends the same way every prior
phase has: run the app, lint, typecheck, fix errors, list files touched,
report what needs manual setup, commit.

## How the 10 end-goal requirements map to phases

| # | Requirement | Delivered in |
|---|---|---|
| 1 | Search across all files (PDFs, images, etc.) | Phase 5 (keyword/full-text), Phase 6 (semantic) |
| 2 | AI-assisted plain-English search | Phase 6 (embeddings) + Phase 8 (query understanding) |
| 3 | AI explanations per paper and per page | Phase 8 |
| 4 | Original file beside the AI explanation | Phase 7 (Paper Reader) |
| 5 | Exact traceability to pages/tables/figures/quotes | Phase 4 (page-level storage) + Phase 8 (citation rules) + Phase 7 (jump-to-citation) |
| 6 | Findings / plain-language / limitations / AI interpretation kept separate | Phase 8 (structural template — non-negotiable) |
| 7 | No softening, changing, or exaggerating findings | Phase 8 (prompt rules + `verification_status` field, already in schema) |
| 8 | Share buttons | Phase 9 |
| 9 | Public/private access control | Already scaffolded in Phase 2 RLS; UI in Phase 10 |
| 10 | Rich search result metadata (title, author, date, topic, file type, page, excerpt) | Phase 5–6 |

## Phase 4 — Ingestion Pipeline

**Goal:** get real files out of Dropbox and into searchable text, without ever touching the Dropbox originals.

1. Recursive Dropbox lister (`files/list_folder` + `files/list_folder/continue` for pagination), writing one row per file into `documents` (path, filename, extension, mime type, size, Dropbox revision/content hash, `processing_status: 'pending'`).
2. Change detection: compare `dropbox_revision`/`content_hash` against what's stored — skip re-downloading/re-processing unchanged files.
3. Download-to-temp → extract → delete-temp, per file, never touching the Dropbox original.
4. Text-based PDFs: extract embedded text directly (page-by-page into `document_pages`).
5. Scanned PDFs and images: OCR fallback (only when embedded text is absent/unusable) — this needs an OCR provider decision (options: a hosted API like Google Cloud Vision / AWS Textract, or a self-hosted Tesseract job). I'll bring you a cost/tradeoff comparison before picking one, since it has real per-page cost implications.
6. Batching: process a handful of files per invocation (Vercel functions have execution time limits), tracked via `processing_status`, so a large backlog processes incrementally rather than needing one giant run.
7. **Admin: Dropbox Inventory page** (`/library-admin/dropbox/inventory`) — counts by status, "Synchronize Now" and "Retry Failed Files" buttons, last sync time.

**What I'll need from you:** an OCR provider decision (with cost estimate shown first), and patience — a large archive will take multiple sync runs, not one click.

## Phase 5 — Keyword & Full-Text Search

**Goal:** something you can actually search, fast, before AI enters the picture at all.

1. PostgreSQL full-text search over `document_chunks.search_vector` (already indexed in the Phase 2 schema) plus filename/title/author matching.
2. `/library-admin` (or a public `/library/search` page, scoped by `is_public`) with a search box and results showing title, filename, year, authors, matched excerpt.
3. Filters: study type, human/animal/lab, CKD stage, topic/category — all backed by columns already in `study_metadata` and `categories`.
4. This phase is deliberately "boring" — no AI yet — so search fundamentally works before layering anything smarter on top.

## Phase 6 — Semantic Search (embeddings)

**Goal:** find relevant material by meaning, not just exact words — "Find the Korean niacin kidney study" without those exact words appearing.

1. Chunk each document's extracted text into overlapping passages (`document_chunks.chunk_text`).
2. Generate embeddings per chunk via an AI provider (needs a provider decision — OpenAI, Anthropic, or another embeddings API; I'll bring pricing before we commit) and store in `document_chunks.embedding` (pgvector, already provisioned).
3. Hybrid search: combine full-text rank + vector similarity so exact matches and conceptual matches both surface, ranked together.
4. This is the search Stephen actually types plain questions into.

## Phase 7 — Paper Reader

**Goal:** the split-screen view — original document on one side, everything about it on the other.

1. Left: original PDF/page image rendering, page navigation, zoom, "open original in Dropbox" (permission-gated).
2. Right: title, study metadata card, reported findings, plain-language explanation (once Phase 8 exists), citations, related documents, topic tags, share controls.
3. Clicking any citation scrolls/jumps the left pane to that exact page — this is what makes traceability real rather than just claimed.

## Phase 8 — Evidence-Preserving AI

**Goal:** the highest-stakes phase. Every rule you gave me for this is non-negotiable and gets encoded as literal prompt structure and post-generation validation, not just instructions the model might drift from:

- Every explanation is generated in four labeled sections: **Direct Study Findings** (verbatim numbers/design/outcomes), **Plain-Language Explanation**, **Study Design Context**, **AI Interpretation** (explicitly labeled as such, optional, never presented as the paper's own conclusion).
- Every claim must cite document + page + table/figure where applicable.
- A review workflow: `ai_explanations.review_status` starts `pending`; nothing reaches the public site unless approved (already scaffolded in the Phase 2 RLS — approved + public-document explanations are the only ones publicly readable).
- Numeric findings extracted into `reported_findings` as structured data (baseline/ending/change/unit) specifically so the AI has exact numbers to quote rather than re-deriving or paraphrasing them, which is where "the AI must not change numerical findings" gets enforced structurally instead of just by instruction.
- "Ask This Paper" (scoped to one document's chunks) and "Ask Stephen's Library" (scoped to everything) are the same underlying retrieval-then-generate pipeline at different scopes.
- **This phase needs an AI provider decision from you too**, and I'll show you estimated per-query cost before wiring it up — evidence-preserving prompting with citation verification means longer, more expensive prompts than a casual chatbot.

## Phase 9 — Sharing & Collections

1. Collections (already scaffolded: `collections`, `collection_documents`) — admin-curated groupings.
2. Share buttons: copy link, email, SMS, social, QR code, printable citation — per document, per collection, and (new capability) per specific finding or page.
3. `share_links` table (already scaffolded, admin-only RLS) resolved through a server route — never a direct client-side table read, so tokens can't be enumerated and Dropbox is never exposed through a share link.

## Phase 10 — Public/Private Access Controls (UI)

The RLS rules already exist (Phase 2) — public visitors can only ever see rows tied to a `documents.is_public = true` (or `collections.is_public = true`) row. This phase is the **admin UI** for actually flipping those flags per document/collection, plus making sure every public-facing page (search, paper reader, collections) correctly respects the flag rather than just relying on the database to silently filter.

## Phase 11 — Security, Accessibility, Performance, Production

Final pass before calling this "done, publicly live": accessibility audit (the Paper Reader especially — split-screen layouts are easy to get keyboard-navigation wrong on), responsive/mobile review, rate limiting on the AI query endpoints (real cost exposure if left open), backups, and the full deliverables list from the original spec (README, admin manual, backup/recovery guide, security checklist, testing plan, known limitations, deployment checklist).

## Decisions I'll need from you along the way (not now — flagged so they don't surprise you later)

- **OCR provider** (Phase 4)
- **Embeddings + AI generation provider** (Phase 6, Phase 8) — with real per-document and per-query cost estimates shown before you commit
- Whether the public site gets a search page at launch, or search stays admin-only until enough documents are reviewed and marked public

## What I'm doing right now

Nothing further until Dropbox OAuth is actually connected end-to-end (your three remaining manual steps in `docs/dropbox-setup.md`). Phase 4 is next once that's confirmed working.
