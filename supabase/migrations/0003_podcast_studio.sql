-- Podcast Studio tables. Run in the Supabase SQL Editor. Safe to re-run.


create table if not exists public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  episode_date date not null default current_date,

  status text not null default 'setup'
    check (status in ('setup','recording','processing','draft','published','discarded','error')),
  error_message text,

  room_name text,
  room_url text,
  recording_id text,
  duration_seconds integer,
  video_location text,
  audio_location text,

  youtube_status text not null default 'none'
    check (youtube_status in ('none','uploading','unlisted','failed')),
  youtube_video_id text,
  youtube_error text,
  youtube_upload_url text,
  youtube_upload_bytes bigint not null default 0,
  youtube_upload_total bigint,
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
  token_hash text not null unique,
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

create table if not exists public.podcast_login_attempts (
  ip_hash text primary key,
  failed_count integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.podcast_login_attempts enable row level security;

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
