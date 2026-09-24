# Stephen's Podcast Studio: Owner Setup Guide

For the site owner (Sidney). **Stephen only ever needs the 4-digit code.** He never creates accounts,
connects YouTube, or sees any settings.

`/podcast-studio` is passcode-protected and marked "do not index". It is reached from the
"Stephen's Podcast Studio" card on the home page and the Media page.

## What Stephen does
1. Enter the 4-digit code.
2. **Test Camera & Microphone** (this also opens the private room).
3. **Invite Guest** (up to 4 guests; each gets a private link that expires after 12 hours or when recording stops).
4. **Start Podcast**, then **Stop Podcast** (saves a private draft; **Start Over** discards it).
5. **Publish Episode**. Stephen sees "Your episode is published."

Publishing adds the episode to the Media page under **Podcast Episodes** (newest first), where visitors
watch it directly on the website. If YouTube is connected, the same video is also uploaded to
@kidneytotalhealth as Unlisted, quietly in the background. YouTube can never block or undo the website publish.

## How the pieces fit
| Job | Service | Setting |
| --- | --- | --- |
| Group video room + recording | Daily.co | `DAILY_API_KEY` |
| Episodes, guest links, login limits | Supabase (already used) | migration `0003_podcast_studio.sql` |
| Public Media entry | Commit to `src/data/podcast-episodes.json` through the GitHub API | `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` |
| Optional YouTube copy | YouTube Data API (Google OAuth) | `GOOGLE_YOUTUBE_*`, `TOKEN_ENCRYPTION_KEY` |

The recording stays at Daily. The website plays it through `/api/podcast/video/<episode id>`, which
only answers for **published** episodes and sends the visitor to a fresh, expiring link. Drafts are
never reachable. Do not delete a published episode's recording in the Daily dashboard: the website
video plays from it.

## Steps (Sidney)

### 1. Run the database migration
Supabase dashboard → SQL Editor → paste and run `supabase/migrations/0003_podcast_studio.sql`
(safe to run twice). All tables are locked to the server.

### 2. Set the passcode
Choose 4 digits. Create a signing secret:
`node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
In Vercel → Settings → Environment Variables (Production) add:
```
PODCAST_STUDIO_PASSCODE
PODCAST_STUDIO_SESSION_SECRET
```
Redeploy. To change the code later, change `PODCAST_STUDIO_PASSCODE` and redeploy. Every try is counted
before the code is checked: 5 tries per 15 minutes per device, 60 per 15 minutes overall. The code is
only checked on the server. The sign-in cookie is HttpOnly, SameSite=Lax, and Secure on the live site.

### 3. Daily.co
Create an account at https://dashboard.daily.co, add a payment method, create an API key
(Developers → API keys), and add `DAILY_API_KEY` in Vercel. Cloud recording is billed per recorded
minute plus storage (about $0.013 + $0.003 per minute at last check; https://www.daily.co/pricing/).
Then confirm your account allows 5 people with cloud recording. This makes and deletes a test room:
`node --env-file=.env.local scripts/check-podcast-setup.mjs`

### 4. Website publishing
Uses the same `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` as the admin panel. The token needs
**Contents: Read and write** on this repository only (fine-grained), or `repo` scope (classic).
Publishing reads `src/data/podcast-episodes.json`, adds or replaces this episode's entry (retries never
duplicate), and commits only that file, naming the version it read. It refuses to write if the file is
damaged, and it never touches any other Media content. Vercel then redeploys automatically, so the entry
appears a few minutes after Stephen presses Publish Episode. `GITHUB_BRANCH` must be the branch Vercel deploys.

### 5. Optional: copy to the YouTube channel
Skip this and publishing still works. To turn it on:
1. https://console.cloud.google.com → create a project → APIs & Services → Library → enable **YouTube Data API v3**.
2. OAuth consent screen → External; add scopes `youtube.upload` and `youtube.readonly`;
   **Publish app (Production)**. In Testing mode Google expires the connection after 7 days.
3. Credentials → OAuth client ID → **Web application**; authorized redirect URI exactly:
   `https://YOUR-SITE-DOMAIN/api/podcast-studio/youtube/callback`
4. In Vercel add these and redeploy (`TOKEN_ENCRYPTION_KEY` already exists for Dropbox):
```
GOOGLE_YOUTUBE_CLIENT_ID
GOOGLE_YOUTUBE_CLIENT_SECRET
GOOGLE_YOUTUBE_REDIRECT_URI
TOKEN_ENCRYPTION_KEY
```
5. Open `https://YOUR-SITE-DOMAIN/podcast-studio/youtube` (owner page, not linked anywhere; it asks for the
   4-digit code first), press **Connect YouTube**, and sign in with the Google account that manages
   @kidneytotalhealth. Any other channel is refused.
6. The same page lists published episodes that are not on YouTube yet, with an **Upload to YouTube** button
   (also used to retry after a problem). Uploads run in 32 MB pieces and resume where they stopped.

Google limits (not caused by this app): until the project passes Google's YouTube API Services Audit,
uploads from an unverified project are locked to Private; a channel that isn't phone-verified can only
upload videos up to 15 minutes. The website copy is unaffected by either.

## Testing checklist (Stephen + one guest first)
1. Sign in, type a title, press **Test Camera & Microphone**, allow access. You are taken into the private room.
2. **Invite Guest**, send the link. Links can be made before recording starts.
3. On a second device, open the link, type a name, test camera/mic, **Join Episode**. Stephen sees "2 of 5 participants".
4. When everyone is ready, **Start Podcast**. Talk for 30 seconds. **Stop Podcast**. The guest is removed and the link stops working.
5. Watch the private preview, then **Publish Episode**. After a few minutes confirm the entry on `/media` under Podcast Episodes and that it plays.
6. Only then try 2, 3 and 4 guests (a fifth link is refused).

## Known limits
- No MP3 (Daily produces MP4 only); the draft says so.
- A published episode's video depends on the Daily recording staying in your Daily account.
- Anyone typing 60 wrong codes in 15 minutes locks everyone, including Stephen, out for 15 minutes.
