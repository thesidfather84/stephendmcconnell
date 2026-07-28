# Dropbox App Setup Guide (Phase 3, Step 1)

This creates a **read-only** connection between the website and your Dropbox
archive. The app will only ever be able to *look at* files and their names —
it cannot delete, rename, move, edit, or upload anything. That's enforced at
the Dropbox permission level, not just in our code.

Do this once. No coding required.

## 1. Create the app

1. Go to https://www.dropbox.com/developers/apps
2. Click **Create app**.
3. Choose **Scoped access** (this is the only modern option; you may not
   even see the old choice).
4. Under "Choose the type of access you need," choose **Full Dropbox**.
   (This does *not* mean the app gets full permissions — that's controlled
   separately in step 2. "App folder" would instead create a brand-new,
   empty folder and only let the app see that, which won't work since your
   archive already exists elsewhere in your Dropbox.)
5. Name the app something like `Stephen McConnell Research Library`.
   Dropbox app names must be globally unique, so add a few random
   characters if it says the name is taken.
6. Click **Create app**.

## 2. Lock the permissions down to read-only

This is the most important step.

1. On the new app's page, click the **Permissions** tab.
2. Check **only** these two boxes:
   - `files.metadata.read`
   - `files.content.read`
3. Leave every other box unchecked — especially anything containing
   `.write`, `sharing.write`, or `file_requests.write`. If a box isn't in
   the list above, don't check it.
4. Click **Submit** at the bottom of the Permissions tab to save.

## 3. Get your App key and App secret

1. Click the **Settings** tab.
2. You'll see **App key** and **App secret** (click "Show" to reveal the
   secret).
3. Send me the **App key** — it's fine to paste in chat.
4. For the **App secret**, add it directly to `.env.local` yourself (I'll
   tell you the exact variable name once I build the connection code) —
   don't paste it in chat. It's as sensitive as a password.

## 4. Add the redirect URI

Still on the **Settings** tab, find **OAuth 2** → **Redirect URIs**, and add
both of these (one for testing on your computer, one for the live site):

```
http://localhost:3000/api/dropbox/callback
https://stephendmcconnell.com/api/dropbox/callback
```

Click **Add** after each one.

## 5. Run the second database migration

The connection needs one more database table to store the (encrypted)
connection info. Same process as the first one:

1. Open `supabase/migrations/0002_dropbox_connection.sql` in this project.
2. Copy the whole file into the Supabase **SQL Editor** and click **Run**.

## 6. Fill in `.env.local`

Open `.env.local` in the project folder. You'll see these lines already
there — fill in the two blank ones:

```
DROPBOX_APP_KEY=paste-your-app-key-here
DROPBOX_APP_SECRET=paste-your-app-secret-here
```

`DROPBOX_REDIRECT_URI` and `TOKEN_ENCRYPTION_KEY` are already filled in for
local development — you don't need to touch them.

## 7. Add the same variables to Vercel

Same as the Supabase step: go to your Vercel project → **Settings** →
**Environment Variables**, and add:

- `DROPBOX_APP_KEY`
- `DROPBOX_APP_SECRET`
- `DROPBOX_REDIRECT_URI` — use `https://stephendmcconnell.com/api/dropbox/callback` here (the production URL, not localhost)
- `TOKEN_ENCRYPTION_KEY` — use the exact same value as in `.env.local`

Redeploy after adding these.

## 8. Connect your account

1. Go to `/library-admin/login` on the site and sign in with the admin
   account created in the Supabase setup guide.
2. Click through to **Dropbox Connection**.
3. Click **Connect Dropbox**.
4. Dropbox will ask you to approve read-only access — click **Allow**.
5. You'll land back on the Dropbox Connection page showing "Connected" with
   your account email.

## What happens after this

Dropbox gives the app a **refresh token** — a credential that lets it
re-authenticate itself in the background without you approving it again
every few hours. That refresh token is encrypted (using
`TOKEN_ENCRYPTION_KEY`) before being stored in the `dropbox_connection`
table in Supabase, and is never sent to the browser or committed to
GitHub — only server-side code can decrypt and use it.
