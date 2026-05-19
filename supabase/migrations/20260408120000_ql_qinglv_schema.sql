-- =============================================================================
-- QL轻旅 — Supabase 数据库结构（与前端 journal / 决策演示一致）
-- 导入方式见：supabase/IMPORT.md
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- locations：公开只读 POI（匿名 / 登录用户均可 select）
-- -----------------------------------------------------------------------------
create table if not exists public.locations (
  id text primary key,
  city text not null default '上海',
  name text not null,
  description text not null default '',
  category text[] not null,
  budget text not null,
  duration text[] not null,
  group_size text[] not null,
  pet_friendly boolean not null default false,
  address text,
  metro_station text,
  metro_line text,
  bus_routes text[],
  lat double precision not null,
  lng double precision not null,
  opening_hours text not null default '',
  ticket_price text,
  hidden_gem boolean not null default false,
  sustainable_score int not null default 8,
  crowd_level text not null,
  best_time text,
  tips text[] not null default '{}',
  nearby_food text[] not null default '{}',
  images text[] not null default '{}'
);

create index if not exists locations_city_idx on public.locations (city);

alter table public.locations enable row level security;

drop policy if exists "locations_select_public" on public.locations;
create policy "locations_select_public"
  on public.locations for select
  to anon, authenticated
  using (true);

-- -----------------------------------------------------------------------------
-- trip_history：登录用户仅可读写自己的行程记录
-- -----------------------------------------------------------------------------
create table if not exists public.trip_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null,
  title text not null,
  trip_date timestamptz not null default now(),
  completed boolean,
  rating int,
  feedback text
);

create index if not exists trip_history_user_id_idx on public.trip_history (user_id desc);
create index if not exists trip_history_trip_date_idx on public.trip_history (trip_date desc);

alter table public.trip_history enable row level security;

drop policy if exists "trip_history_select_own" on public.trip_history;
drop policy if exists "trip_history_insert_own" on public.trip_history;
drop policy if exists "trip_history_update_own" on public.trip_history;
drop policy if exists "trip_history_delete_own" on public.trip_history;

create policy "trip_history_select_own"
  on public.trip_history for select
  to authenticated
  using (auth.uid() = user_id);

create policy "trip_history_insert_own"
  on public.trip_history for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "trip_history_update_own"
  on public.trip_history for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "trip_history_delete_own"
  on public.trip_history for delete
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- user_settings：登录用户偏好
-- -----------------------------------------------------------------------------
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  default_budget text,
  favorite_areas text[],
  disliked_types text[],
  default_city text,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

drop policy if exists "user_settings_select_own" on public.user_settings;
drop policy if exists "user_settings_insert_own" on public.user_settings;
drop policy if exists "user_settings_update_own" on public.user_settings;

create policy "user_settings_select_own"
  on public.user_settings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_settings_insert_own"
  on public.user_settings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_settings_update_own"
  on public.user_settings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- journals：手账（pages 为 JSONB，与 src/services/journal.ts 一致）
-- id 由客户端传入 UUID 字符串，与 Zustand 中手账 id 一致
-- -----------------------------------------------------------------------------
create table if not exists public.journals (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '未命名手账',
  pages jsonb not null default '[]'::jsonb,
  cover_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journals_user_id_idx on public.journals (user_id);
create index if not exists journals_created_at_idx on public.journals (created_at desc);

alter table public.journals enable row level security;

drop policy if exists "journals_select_own" on public.journals;
drop policy if exists "journals_insert_own" on public.journals;
drop policy if exists "journals_update_own" on public.journals;
drop policy if exists "journals_delete_own" on public.journals;
drop policy if exists "Users can only access own journals" on public.journals;

create policy "journals_select_own"
  on public.journals for select
  to authenticated
  using (auth.uid() = user_id);

create policy "journals_insert_own"
  on public.journals for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "journals_update_own"
  on public.journals for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "journals_delete_own"
  on public.journals for delete
  to authenticated
  using (auth.uid() = user_id);
