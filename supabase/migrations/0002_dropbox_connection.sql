-- Stephen McConnell Research Library — Dropbox Connection (Version 1.10, Phase 3)
--
-- Run this in the Supabase SQL Editor the same way as 0001. Safe to re-run.
--
-- Stores exactly one row: the encrypted Dropbox refresh token that lets the
-- server reconnect to Dropbox in the background without anyone re-approving
-- access every few hours. The token is encrypted with TOKEN_ENCRYPTION_KEY
-- (an app-level secret, not known to Postgres) before it ever reaches this
-- table, so a database leak alone would not expose a usable Dropbox token.
--
-- No public policy exists on this table at all — only server code using the
-- service role key (which bypasses RLS) can read or write it.

create table if not exists public.dropbox_connection (
  id int primary key default 1,
  encrypted_refresh_token text,
  token_iv text,
  token_auth_tag text,
  dropbox_account_id text,
  dropbox_email text,
  connected_by uuid references public.profiles (id),
  connected_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint dropbox_connection_singleton check (id = 1)
);

alter table public.dropbox_connection enable row level security;

-- Intentionally no select/insert/update policies for anon or authenticated
-- roles — this table is only ever touched via the service role client.
