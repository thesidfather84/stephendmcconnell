-- Stephen McConnell Research Library — Initial Schema (Version 1.10, Phase 2)
--
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query),
-- paste the whole file, and click "Run". Safe to re-run: every statement is
-- idempotent (IF NOT EXISTS / OR REPLACE).
--
-- This schema stores metadata, extracted text, embeddings, and admin/review
-- state ONLY. The original files always remain in Dropbox — nothing here is
-- a copy of the source archive itself except cached extracted text.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists vector;     -- pgvector, for semantic search

-- ---------------------------------------------------------------------------
-- profiles — links Supabase Auth users to an admin/viewer role.
-- Not part of the spec's 12 tables, but required to support "role-based
-- administrator checks" under SECURITY. One row per authenticated user.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used throughout RLS policies below.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  dropbox_file_id text unique,
  dropbox_path text not null,
  dropbox_revision text,
  content_hash text,
  filename text not null,
  display_title text,
  file_extension text,
  mime_type text,
  file_size bigint,
  modified_at_dropbox timestamptz,
  document_type text,
  processing_status text not null default 'pending'
    check (processing_status in ('pending', 'processing', 'processed', 'failed', 'needs_review')),
  processing_error text,
  is_public boolean not null default false,
  original_source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- document_pages
-- ---------------------------------------------------------------------------
create table if not exists public.document_pages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  page_number int not null,
  extracted_text text,
  ocr_confidence numeric,
  page_image_url text,
  created_at timestamptz not null default now(),
  unique (document_id, page_number)
);

-- ---------------------------------------------------------------------------
-- document_chunks
-- ---------------------------------------------------------------------------
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  page_start int,
  page_end int,
  chunk_index int,
  chunk_text text,
  embedding vector(1536),
  search_vector tsvector,
  created_at timestamptz not null default now()
);

create index if not exists document_chunks_search_vector_idx
  on public.document_chunks using gin (search_vector);

-- ---------------------------------------------------------------------------
-- study_metadata
-- ---------------------------------------------------------------------------
create table if not exists public.study_metadata (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null unique references public.documents (id) on delete cascade,
  title text,
  authors text,
  journal text,
  publication_year int,
  country text,
  doi text,
  pmid text,
  study_type text,
  human_animal_lab text check (human_animal_lab in ('human', 'animal', 'laboratory')),
  sample_size int,
  population text,
  ckd_stage text,
  treatment text,
  formulation text,
  dose text,
  duration text,
  comparison_group text,
  primary_outcomes text,
  secondary_outcomes text,
  authors_conclusion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- reported_findings
-- ---------------------------------------------------------------------------
create table if not exists public.reported_findings (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  finding_text text,
  plain_language_finding text,
  outcome_name text,
  baseline_value text,
  ending_value text,
  absolute_change text,
  percentage_change text,
  unit text,
  statistical_value text,
  direction text check (direction in ('increase', 'decrease', 'no_change', 'unclear')),
  page_number int,
  table_reference text,
  figure_reference text,
  source_excerpt text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'verified', 'needs_review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_type text,
  description text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- document_categories
-- ---------------------------------------------------------------------------
create table if not exists public.document_categories (
  document_id uuid not null references public.documents (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (document_id, category_id)
);

-- ---------------------------------------------------------------------------
-- ai_explanations
-- ---------------------------------------------------------------------------
create table if not exists public.ai_explanations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  explanation_type text,
  model text,
  prompt_version text,
  content text,
  source_page_start int,
  source_page_end int,
  review_status text not null default 'pending'
    check (review_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- collections
-- ---------------------------------------------------------------------------
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_public boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- collection_documents
-- ---------------------------------------------------------------------------
create table if not exists public.collection_documents (
  collection_id uuid not null references public.collections (id) on delete cascade,
  document_id uuid not null references public.documents (id) on delete cascade,
  sort_order int,
  notes text,
  primary key (collection_id, document_id)
);

-- ---------------------------------------------------------------------------
-- share_links
-- ---------------------------------------------------------------------------
create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents (id) on delete set null,
  collection_id uuid references public.collections (id) on delete set null,
  token text not null unique,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.profiles (id),
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Rule of thumb applied everywhere below:
--   - Admins (profiles.role = 'admin') can do everything.
--   - The public (anon + logged-in non-admins) can only ever SELECT rows
--     that trace back to a document/collection explicitly marked is_public.
--   - Nothing is ever publicly insertable/updatable/deletable from this app —
--     all writes happen through server-side code using the service role key,
--     which bypasses RLS entirely and is never exposed to the browser.
--   - share_links and audit_log have NO public access at all; share-link
--     resolution happens through a server route, not a direct table read.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.document_pages enable row level security;
alter table public.document_chunks enable row level security;
alter table public.study_metadata enable row level security;
alter table public.reported_findings enable row level security;
alter table public.categories enable row level security;
alter table public.document_categories enable row level security;
alter table public.ai_explanations enable row level security;
alter table public.collections enable row level security;
alter table public.collection_documents enable row level security;
alter table public.share_links enable row level security;
alter table public.audit_log enable row level security;

-- profiles: a user can read their own row; admins can read all.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- documents: public can read only is_public rows; admins read/write all.
drop policy if exists "documents_public_select" on public.documents;
create policy "documents_public_select"
  on public.documents for select
  using (is_public = true or public.is_admin());

drop policy if exists "documents_admin_write" on public.documents;
create policy "documents_admin_write"
  on public.documents for all
  using (public.is_admin())
  with check (public.is_admin());

-- document_pages: readable only if the parent document is public.
drop policy if exists "document_pages_public_select" on public.document_pages;
create policy "document_pages_public_select"
  on public.document_pages for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.documents d
      where d.id = document_pages.document_id and d.is_public = true
    )
  );

drop policy if exists "document_pages_admin_write" on public.document_pages;
create policy "document_pages_admin_write"
  on public.document_pages for all
  using (public.is_admin())
  with check (public.is_admin());

-- document_chunks: same pattern as document_pages.
drop policy if exists "document_chunks_public_select" on public.document_chunks;
create policy "document_chunks_public_select"
  on public.document_chunks for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.documents d
      where d.id = document_chunks.document_id and d.is_public = true
    )
  );

drop policy if exists "document_chunks_admin_write" on public.document_chunks;
create policy "document_chunks_admin_write"
  on public.document_chunks for all
  using (public.is_admin())
  with check (public.is_admin());

-- study_metadata: same pattern.
drop policy if exists "study_metadata_public_select" on public.study_metadata;
create policy "study_metadata_public_select"
  on public.study_metadata for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.documents d
      where d.id = study_metadata.document_id and d.is_public = true
    )
  );

drop policy if exists "study_metadata_admin_write" on public.study_metadata;
create policy "study_metadata_admin_write"
  on public.study_metadata for all
  using (public.is_admin())
  with check (public.is_admin());

-- reported_findings: same pattern.
drop policy if exists "reported_findings_public_select" on public.reported_findings;
create policy "reported_findings_public_select"
  on public.reported_findings for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.documents d
      where d.id = reported_findings.document_id and d.is_public = true
    )
  );

drop policy if exists "reported_findings_admin_write" on public.reported_findings;
create policy "reported_findings_admin_write"
  on public.reported_findings for all
  using (public.is_admin())
  with check (public.is_admin());

-- categories: not sensitive — publicly readable; admin-managed.
drop policy if exists "categories_public_select" on public.categories;
create policy "categories_public_select"
  on public.categories for select
  using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- document_categories: readable if the linked document is public.
drop policy if exists "document_categories_public_select" on public.document_categories;
create policy "document_categories_public_select"
  on public.document_categories for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.documents d
      where d.id = document_categories.document_id and d.is_public = true
    )
  );

drop policy if exists "document_categories_admin_write" on public.document_categories;
create policy "document_categories_admin_write"
  on public.document_categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ai_explanations: only approved explanations on public documents are
-- publicly readable — admins see everything regardless of review_status.
drop policy if exists "ai_explanations_public_select" on public.ai_explanations;
create policy "ai_explanations_public_select"
  on public.ai_explanations for select
  using (
    public.is_admin()
    or (
      review_status = 'approved'
      and exists (
        select 1 from public.documents d
        where d.id = ai_explanations.document_id and d.is_public = true
      )
    )
  );

drop policy if exists "ai_explanations_admin_write" on public.ai_explanations;
create policy "ai_explanations_admin_write"
  on public.ai_explanations for all
  using (public.is_admin())
  with check (public.is_admin());

-- collections: public can read only is_public collections.
drop policy if exists "collections_public_select" on public.collections;
create policy "collections_public_select"
  on public.collections for select
  using (is_public = true or public.is_admin());

drop policy if exists "collections_admin_write" on public.collections;
create policy "collections_admin_write"
  on public.collections for all
  using (public.is_admin())
  with check (public.is_admin());

-- collection_documents: readable if the parent collection is public.
drop policy if exists "collection_documents_public_select" on public.collection_documents;
create policy "collection_documents_public_select"
  on public.collection_documents for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.collections c
      where c.id = collection_documents.collection_id and c.is_public = true
    )
  );

drop policy if exists "collection_documents_admin_write" on public.collection_documents;
create policy "collection_documents_admin_write"
  on public.collection_documents for all
  using (public.is_admin())
  with check (public.is_admin());

-- share_links: NO public access. Share-link resolution must go through a
-- server route using the service role key, never a direct client query —
-- this table is never selected from the browser.
drop policy if exists "share_links_admin_only" on public.share_links;
create policy "share_links_admin_only"
  on public.share_links for all
  using (public.is_admin())
  with check (public.is_admin());

-- audit_log: admin read-only via the API; writes happen server-side with
-- the service role key (which bypasses RLS), so there is no public policy
-- for insert at all.
drop policy if exists "audit_log_admin_select" on public.audit_log;
create policy "audit_log_admin_select"
  on public.audit_log for select
  using (public.is_admin());
