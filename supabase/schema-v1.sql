-- BeyondBonus members area — V1 auth + grants foundation
-- Stack target: Astro + Supabase + Cloudflare R2

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_key text not null check (product_key in ('its-bundle', 'beyondbonus', 'beyondblended')),
  area text not null check (area in ('course', 'livecalls')),
  status text not null default 'active' check (status in ('active', 'expired')),
  starts_at timestamptz,
  ends_at timestamptz,
  source text default 'manual' check (source in ('stripe', 'manual', 'migration')),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists access_grants_user_id_idx on public.access_grants (user_id);
create index if not exists access_grants_product_area_idx on public.access_grants (product_key, area);
create index if not exists access_grants_status_idx on public.access_grants (status);
create index if not exists access_grants_ends_at_idx on public.access_grants (ends_at);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists access_grants_touch_updated_at on public.access_grants;
create trigger access_grants_touch_updated_at
  before update on public.access_grants
  for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.access_grants enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "access_grants_select_own" on public.access_grants;
create policy "access_grants_select_own"
  on public.access_grants
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Admin write policies deliberately left out for V1.
-- Manual grants/verlängerungen laufen zunächst über service-role oder SQL Editor,
-- bis die Mini-Admin-Oberfläche steht.
