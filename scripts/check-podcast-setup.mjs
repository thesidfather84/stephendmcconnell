// Checks the Podcast Studio's outside connections WITHOUT recording, publishing, or printing any secret.
// Run:  node --env-file=.env.local scripts/check-podcast-setup.mjs
const need = [
  "PODCAST_STUDIO_PASSCODE", "PODCAST_STUDIO_SESSION_SECRET", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY",
  "DAILY_API_KEY", "GITHUB_TOKEN", "GITHUB_REPO",
];
// Only needed for the optional copy on the YouTube channel. Publishing to the website works without them.
const optional = ["TOKEN_ENCRYPTION_KEY", "GOOGLE_YOUTUBE_CLIENT_ID", "GOOGLE_YOUTUBE_CLIENT_SECRET", "GOOGLE_YOUTUBE_REDIRECT_URI"];
let failed = false;
const line = (ok, text) => { if (!ok) failed = true; console.log(`${ok ? "PASS" : "FAIL"}  ${text}`); };

for (const name of need) line(Boolean(process.env[name]), `${name} is ${process.env[name] ? "set" : "MISSING"}`);
for (const name of optional) console.log(`${process.env[name] ? "PASS" : "INFO"}  ${name} is ${process.env[name] ? "set" : "not set (YouTube copy stays off; website publishing still works)"}`);
const code = process.env.PODCAST_STUDIO_PASSCODE;
if (code) line(/^\d{4}$/.test(code), "PODCAST_STUDIO_PASSCODE is exactly 4 digits");
if (process.env.PODCAST_STUDIO_SESSION_SECRET) line(process.env.PODCAST_STUDIO_SESSION_SECRET.length >= 32, "PODCAST_STUDIO_SESSION_SECRET is at least 32 characters");

if (process.env.DAILY_API_KEY) {
  const H = { Authorization: `Bearer ${process.env.DAILY_API_KEY}`, "Content-Type": "application/json" };
  const name = `check-${Date.now()}`;
  const res = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST", headers: H,
    body: JSON.stringify({ name, privacy: "private", properties: { max_participants: 5, enable_recording: "cloud", exp: Math.floor(Date.now() / 1000) + 600 } }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok) {
    line(body.config?.max_participants === 5, `Daily room allows 5 participants (reported: ${body.config?.max_participants})`);
    line(body.config?.enable_recording === "cloud", `Daily cloud recording enabled on the room (reported: ${body.config?.enable_recording})`);
    await fetch(`https://api.daily.co/v1/rooms/${name}`, { method: "DELETE", headers: H });
  } else {
    line(false, `Daily refused the test room (${res.status}): ${body.info ?? body.error ?? "no detail"}`);
  }
}

if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
  const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  const body = await res.json().catch(() => ({}));
  line(res.ok, `GitHub token can see ${process.env.GITHUB_REPO} (${res.status})`);
  if (res.ok) line(body.permissions?.push === true, "GitHub token can WRITE to the repository (needed to add the /media entry)");
}

console.log(failed ? "\nSome checks failed. See docs/podcast-studio-setup.md." : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
