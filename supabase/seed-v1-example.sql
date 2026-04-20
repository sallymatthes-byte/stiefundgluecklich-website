-- Example seed for first manual test user + grants
-- Replace the UUID with the real auth.users / profiles id after first login.

-- Example:
-- update public.profiles
-- set full_name = 'Sally Test'
-- where email = 'deine-testmail@example.com';

-- insert into public.access_grants (user_id, product_key, area, status, starts_at, ends_at, source, note)
-- values
--   ('REPLACE_WITH_USER_UUID', 'beyondbonus', 'course', 'active', now(), now() + interval '12 months', 'manual', 'Initial test grant'),
--   ('REPLACE_WITH_USER_UUID', 'beyondbonus', 'livecalls', 'active', now(), now() + interval '6 months', 'manual', 'Initial livecall grant');
