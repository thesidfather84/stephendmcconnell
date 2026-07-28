# Supabase Setup Guide

Exact steps to finish connecting the project you already created
(`vwaltfrjwajanrbxuokn`) to the codebase. No coding required — this is all
clicking through the Supabase dashboard.

## 1. Run the database migration

1. Go to https://supabase.com/dashboard/project/vwaltfrjwajanrbxuokn
2. In the left sidebar, click **SQL Editor**.
3. Click **New query**.
4. Open `supabase/migrations/0001_initial_schema.sql` from this project, copy
   the entire file, and paste it into the query box.
5. Click **Run** (bottom right). You should see "Success. No rows returned."
   This creates all 13 tables, security rules, and helper functions. It's
   safe to run more than once if you're ever unsure whether it applied.

## 2. Get your API keys

1. In the left sidebar, click the gear icon → **Project Settings**.
2. Click **API** in the settings menu.
3. You'll see:
   - **Project URL** — already saved in this project as
     `NEXT_PUBLIC_SUPABASE_URL`.
   - **anon / public key** — safe to use in the browser. Copy it.
   - **service_role key** — click "Reveal" to see it. This key bypasses all
     database security. **Never share it in chat, email, or a public place.**

4. Open `.env.local` in the project folder and fill in the two blank lines:

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-the-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=paste-the-service-role-key-here
   ```

## 3. Add the same keys to Vercel (for the live website)

`.env.local` only affects your local computer — the live website on Vercel
needs its own copy of these values.

1. Go to https://vercel.com/dashboard and open the `stephendmcconnell`
   project.
2. Click **Settings** → **Environment Variables**.
3. Add these three, each for all environments (Production, Preview,
   Development):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://vwaltfrjwajanrbxuokn.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (the anon key from step 2)
   - `SUPABASE_SERVICE_ROLE_KEY` = (the service role key from step 2)
4. Redeploy the project (Vercel will prompt you, or push any commit) for the
   new variables to take effect.

## 4. Create admin accounts for Stephen and Sidney

There's no sign-up page in the app yet (that comes in a later phase), so
accounts are created directly in the dashboard for now:

1. In the Supabase dashboard, go to **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter Stephen's email and a temporary password (he can change it later).
   Repeat for Sidney.
4. Each new user automatically gets a row in the `profiles` table with
   `role = 'viewer'` — that's intentional, so no one is an admin by default.
5. To make someone an admin, go back to **SQL Editor** and run (replacing
   the email):

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'stephens-email@example.com';
   ```

   Run it once per person who needs admin access.

## What this phase does *not* include yet

- No sign-in page in the app itself (you're managing users directly in
  Supabase for now).
- No Dropbox connection yet (Phase 3).
- No data in any of the tables yet — they're empty until ingestion is built.

## Estimated cost

Supabase's free tier covers this comfortably at the current scale (500MB
database, 1GB file storage, 50,000 monthly active users). You likely won't
need a paid plan until the document archive and embeddings grow large —
I'll flag that explicitly if/when it becomes relevant.
