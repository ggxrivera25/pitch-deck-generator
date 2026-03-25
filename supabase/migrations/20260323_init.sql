-- PitchDeck Generator — initial schema
-- Run this in Supabase SQL Editor or via `supabase db push`

-- ── Pitch Sessions ────────────────────────────────────────────────────────────

create table public.pitch_sessions (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        references auth.users(id) on delete cascade not null,
  mode         text        not null default 'solo',
  company_name text,
  answers      jsonb       not null default '{}'::jsonb,
  branding     jsonb       not null default '{}'::jsonb,
  generated    jsonb,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

-- Keep updated_at current on any update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_pitch_sessions_updated_at
  before update on public.pitch_sessions
  for each row execute function public.set_updated_at();

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table public.pitch_sessions enable row level security;

-- Owners can insert/update/delete their own rows
create policy "Owners can manage their sessions"
  on public.pitch_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Anyone with the UUID can read a session (enables public share links)
create policy "Anyone can view a session by id"
  on public.pitch_sessions
  for select
  using (true);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index pitch_sessions_user_id_idx on public.pitch_sessions(user_id);
create index pitch_sessions_created_at_idx on public.pitch_sessions(created_at desc);
