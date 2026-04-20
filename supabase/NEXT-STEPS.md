# Supabase — Next external block

## Already done locally
- Astro switched to server output + Cloudflare adapter
- Supabase SSR client wired in
- Magic-link login flow wired in
- Protected routes wired in
- Grant model + DB schema prepared

## Missing external prerequisites
1. Supabase project must exist
2. `schema-v1.sql` must be run in Supabase SQL editor
3. Auth email template must point to:
   - `/auth/callback?token_hash={{ .TokenHash }}&type=email`
4. Deployment env vars must be set:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## First real production test
1. Create project
2. Run `schema-v1.sql`
3. Set env vars in deployment
4. Trigger first magic-link login
5. Copy created user UUID from `public.profiles`
6. Add first test grants via `seed-v1-example.sql`
7. Verify:
   - `/members/`
   - `/members/beyondbonus/`
   - `/livecalls/beyondbonus/`

## Current blocker
- No `SUPABASE_ACCESS_TOKEN` available in this runtime
- Browser tool currently unavailable, so dashboard setup cannot be done there either
