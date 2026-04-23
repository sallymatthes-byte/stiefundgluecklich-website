-- BeyondBonus members area — profile fields + self-update policy
-- Run once in the Supabase SQL editor for project ckrztkobwhleawxwnxkh

alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists address_line1 text,
  add column if not exists postal_code text,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists phone text;

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
