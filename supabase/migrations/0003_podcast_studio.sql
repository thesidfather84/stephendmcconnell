-- Stephen's Podcast Studio (private recording studio + publish-to-website workflow)
--
-- Run this in the Supabase SQL Editor the same way as 0001 and 0002. Safe to re-run.
--
-- Every table here has Row Level Security enabled and NO policies for the
-- anon/authenticated roles, so nothing is readable from the browser. Only
-- server code using the service role key can touch these tables.

create table if not exists public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  episode_date date not null default current_date,

  -- setup      = room prepared, not recording
  -- recording  = recording in progress
  -- processing = recording stopped, provider is still preparing the file
  -- draft      = recording ready, private, not published
  -- published  = on the website's Media page
  -- discarded  = Start Over was used
  -- error      = something failed (see error_message)
  status text not null default 'setup'
    check (status in ('setup','recording','processing','draft','published','discarded','error')),
  error_message text,

  -- Recording provider (Daily). Raw recordings stay private at the provider;
  -- the app only ever hands out short-lived download links to the signed-in host.
  room_name text,
  room_url text,
  recording_id text,
  duration_seconds integer,
  video_location text,
  audio_location text,

  -- The optional copy on the Kidney Total Health YouTube channel (site-owner side only;
  -- never shown to the studio user). It never blocks publishing to the website.
  youtube_status text not null default 'none'
    check (youtube_status in ('none','uploading','unlisted','failed')),
  youtube_video_id text,
  youtube_error text,
  -- Resumable upload state. The upload runs in small pieces (one server request each)
  -- so a long episode never depends on one long request and can resume after an interruption.
  -- The upload URL is private to the server and is never sent to the browser.
  youtube_upload_url text,
  youtube_upload_bytes bigint not null default 0,
  youtube_upload_total bigint,
  -- Short-lived claim so two browser tabs can't upload the same piece at once.
  youtube_upload_lock timestamptz,

  website_status text not null default 'none'
    check (website_status in ('none','published','failed')),
  website_error text,

  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.podcast_episodes enable row level security;

create table if not exists public.podcast_guest_invites (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.podcast_episodes (id) on delete cascade,
  -- Only a SHA-256 hash of the link token is stored, never the token itself.
  token_hash text not null unique,
  -- Set on first join. Hash of a secret cookie value, so the same device can
  -- reopen the link after a refresh but nobody else can reuse it.
  claim_hash text,
  guest_name text,
  expires_at timestamptz not null,
  claimed_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists podcast_guest_invites_episode_idx
  on public.podcast_guest_invites (episode_id);

alter table public.podcast_guest_invites enable row level security;

-- One row: the encrypted YouTube refresh token (same encryption as Dropbox).
create table if not exists public.youtube_connection (
  id int primary key default 1,
  encrypted_refresh_token text,
  token_iv text,
  token_auth_tag text,
  channel_id text,
  channel_title text,
  connected_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint youtube_connection_singleton check (id = 1)
);

alter table public.youtube_connection enable row level security;

-- Failed-passcode tracking, keyed by a hash of the visitor's IP address.
create table if not exists public.podcast_login_attempts (
  ip_hash text primary key,
  failed_count integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.podcast_login_attempts enable row level security;

-- Counts one sign-in attempt atomically (before the code is compared, so a burst of
-- parallel guesses can't slip through). Returns true when this key is locked out.
create or replace function public.podcast_login_hit(
  p_key text,
  p_max integer,
  p_window_seconds integer,
  p_lock_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.podcast_login_attempts;
  n integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_key));
  select * into r from public.podcast_login_attempts where ip_hash = p_key;

  if found and r.locked_until is not null and r.locked_until > now() then
    return true;
  end if;

  if not found or r.updated_at < now() - make_interval(secs => p_window_seconds) then
    n := 1;
  else
    n := r.failed_count + 1;
  end if;

  insert into public.podcast_login_attempts (ip_hash, failed_count, locked_until, updated_at)
  values (p_key, n, case when n > p_max then now() + make_interval(secs => p_lock_seconds) end, now())
  on conflict (ip_hash) do update
    set failed_count = excluded.failed_count,
        locked_until = excluded.locked_until,
        updated_at = excluded.updated_at;

  return n > p_max;
end;
$$;

revoke all on function public.podcast_login_hit(text, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.podcast_login_hit(text, integer, integer, integer) to service_role;
