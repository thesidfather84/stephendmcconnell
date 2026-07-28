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

## 5. Tell me when this is done

Once you've done steps 1–4, tell me:
- The **App key**
- That the App secret is saved in `.env.local` (don't paste the value)
- That you added both redirect URIs

I'll then build the actual connection ("Connect Dropbox" button + the code
that exchanges your authorization for a long-lived, read-only connection),
and walk you through the one-time step of clicking "Allow" to link your
Dropbox account.

## What happens after this

Once connected, the app requests a **refresh token** — a credential that
lets it re-authenticate itself in the background without you having to
approve it again every few hours. That refresh token gets stored as a
server-only environment variable (never in the browser, never in GitHub),
exactly like the Supabase service role key.
