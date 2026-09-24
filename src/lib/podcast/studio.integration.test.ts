// @vitest-environment node
/**
 * Runs the real guest-link and publish code against a LOCAL/TEST database.
 * Skipped unless PODCAST_TEST_DB=1 (and the NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
 * variables point at a throwaway test database — never production).
 * Daily, Google and GitHub are replaced by in-memory fakes.
 */
import crypto from "crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const enabled = process.env.PODCAST_TEST_DB === "1";
const CHUNK = 32 * 1024 * 1024;
const TOTAL = CHUNK * 2 + 5000; // 3 pieces

describe.skipIf(!enabled)("studio against a test database", () => {
  const realFetch = globalThis.fetch;
  const state = {
    received: 0,
    sessions: 0,
    failPutOnce: false,
    githubFile: JSON.stringify([{ id: "old", title: "Earlier", description: "", date: "2025-01-01", youtubeId: "old1", publishedAt: "2025-01-01T00:00:00Z" }]),
    githubSha: "sha0",
    githubFailWrites: 0,
    githubWrites: 0,
    recordingLinks: 0,
  };

  let ep: typeof import("./episodes");
  let pub: typeof import("./publish");
  let db: ReturnType<typeof import("@/lib/supabase/admin").createAdminSupabaseClient>;

  beforeAll(async () => {
    process.env.DAILY_API_KEY = "test";
    process.env.GOOGLE_YOUTUBE_CLIENT_ID = "id";
    process.env.GOOGLE_YOUTUBE_CLIENT_SECRET = "secret";
    process.env.GOOGLE_YOUTUBE_REDIRECT_URI = "https://x/cb";
    process.env.TOKEN_ENCRYPTION_KEY = crypto.randomBytes(32).toString("base64");
    process.env.GITHUB_TOKEN = "t";
    process.env.GITHUB_REPO = "o/r";

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const h = (init?.headers ?? {}) as Record<string, string>;
      const method = init?.method ?? "GET";

      if (url.startsWith("https://api.daily.co/v1")) {
        if (url.endsWith("/rooms") && method === "POST") return json({ name: "room1", url: "https://d.example/room1" });
        if (url.includes("/meeting-tokens")) return json({ token: "mt" });
        if (url.includes("/access-link")) {
          state.recordingLinks++;
          return json({ download_link: "https://files.example/rec.mp4" });
        }
        return json({});
      }
      if (url.startsWith("https://oauth2.googleapis.com")) return json({ access_token: "tok" });
      if (url === "https://files.example/rec.mp4") {
        const [, a, b] = /bytes=(\d+)-(\d+)/.exec(h.Range)!;
        const start = Number(a);
        const end = Math.min(Number(b), TOTAL - 1);
        return new Response(new Uint8Array(end - start + 1), {
          status: 206,
          headers: { "content-range": `bytes ${start}-${end}/${TOTAL}` },
        });
      }
      if (url.startsWith("https://www.googleapis.com/upload/youtube")) {
        state.sessions++;
        const body = JSON.parse(String(init?.body));
        expect(body.status.privacyStatus).toBe("unlisted");
        return new Response(null, { status: 200, headers: { location: "https://upload.example/s1" } });
      }
      if (url === "https://upload.example/s1") {
        const cr = h["Content-Range"];
        if (cr.startsWith("bytes */")) {
          return state.received >= TOTAL
            ? json({ id: "yt123" })
            : new Response(null, { status: 308, headers: state.received ? { range: `bytes=0-${state.received - 1}` } : {} });
        }
        const [, s, e] = /bytes (\d+)-(\d+)\//.exec(cr)!;
        if (Number(s) !== state.received) return new Response(null, { status: 400 });
        if (state.failPutOnce && Number(s) > 0) {
          state.failPutOnce = false;
          throw new TypeError("network dropped");
        }
        state.received = Number(e) + 1;
        return state.received >= TOTAL
          ? json({ id: "yt123" })
          : new Response(null, { status: 308, headers: { range: `bytes=0-${state.received - 1}` } });
      }
      if (url.startsWith("https://api.github.com/")) {
        if (method === "GET") {
          return json({ content: Buffer.from(state.githubFile).toString("base64"), sha: state.githubSha });
        }
        state.githubWrites++;
        if (state.githubFailWrites > 0) {
          state.githubFailWrites--;
          return new Response("{}", { status: 500 });
        }
        const body = JSON.parse(String(init?.body));
        expect(body.sha).toBe(state.githubSha); // must replace the version it read, never blindly overwrite
        state.githubFile = Buffer.from(body.content, "base64").toString("utf8");
        state.githubSha = "sha" + state.githubWrites;
        return json({});
      }
      return realFetch(input, init); // the local test database
    }) as typeof fetch;

    ep = await import("./episodes");
    pub = await import("./publish");
    const { createAdminSupabaseClient } = await import("@/lib/supabase/admin");
    db = createAdminSupabaseClient();
    // Start from a clean test database every run.
    await db.from("youtube_connection").delete().eq("id", 1);
    await db.from("podcast_episodes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  });
  afterAll(() => {
    globalThis.fetch = realFetch;
  });

  it("guest links can be made BEFORE recording starts, are hashed, and die when recording ends", async () => {
    const episode = await ep.createEpisode();
    expect(episode.status).toBe("setup");

    const made = await ep.createInvite(episode.id);
    expect(made.ok).toBe(true);
    if (!made.ok) return;

    const { data: rows } = await db.from("podcast_guest_invites").select("*").eq("episode_id", episode.id);
    expect(rows).toHaveLength(1);
    expect(JSON.stringify(rows)).not.toContain(made.token); // raw link token is never stored
    expect(rows![0].token_hash).toBe(ep.hashToken(made.token));
    const hours = (new Date(rows![0].expires_at).getTime() - Date.now()) / 3.6e6;
    expect(hours).toBeGreaterThan(11.9);
    expect(hours).toBeLessThanOrEqual(12);

    expect((await ep.lookupInvite(made.token)).state).toBe("valid");
    expect((await ep.lookupInvite("A".repeat(32))).state).toBe("invalid");

    // Up to 4 guests, not 5.
    for (let i = 0; i < 3; i++) expect((await ep.createInvite(episode.id)).ok).toBe(true);
    expect((await ep.createInvite(episode.id)).ok).toBe(false);

    // Recording running: links still work. Recording stopped: they don't.
    await ep.updateEpisode(episode.id, { status: "recording" });
    expect((await ep.lookupInvite(made.token)).state).toBe("valid");
    await ep.revokeAllInvites(episode.id);
    expect((await ep.lookupInvite(made.token)).state).toBe("ended");

    // A link whose episode moved on (draft/published) never works, revoked or not.
    const fresh = await ep.createEpisode();
    const second = await ep.createInvite(fresh.id);
    if (!second.ok) throw new Error("invite");
    await ep.updateEpisode(fresh.id, { status: "draft" });
    expect((await ep.lookupInvite(second.token)).state).toBe("ended");

    // Expiry after 12 hours.
    const third = await ep.createEpisode();
    const exp = await ep.createInvite(third.id);
    if (!exp.ok) throw new Error("invite");
    await db.from("podcast_guest_invites").update({ expires_at: new Date(Date.now() - 1000).toISOString() }).eq("token_hash", ep.hashToken(exp.token));
    expect((await ep.lookupInvite(exp.token)).state).toBe("expired");
  });

  it("Publish Episode: website first, Published only when the site entry is saved; YouTube copy is separate and resumes", async () => {
    const e = await ep.createEpisode();
    await ep.updateEpisode(e.id, { title: "My Episode", description: "About kidneys", status: "draft", recording_id: "rec1" });
    state.received = 0;
    state.sessions = 0;
    state.githubFailWrites = 2; // the website save fails (first try + its one internal retry)

    // 1) Website save fails: NOT published, recording stays private, message has no technical detail.
    const failed = await pub.publishEpisode(e.id);
    expect(failed.ok).toBe(false);
    expect(failed.message).toBe("Your episode couldn't be published right now. Your recording is safe. Please press Publish Episode again.");
    expect(failed.episode.status).toBe("draft");
    expect(state.githubFile).not.toContain("My Episode");
    // ...and the public video route refuses an unpublished episode.
    const video = await import("@/app/api/podcast/video/[id]/route");
    const ctx = { params: Promise.resolve({ id: e.id }) };
    expect((await video.GET(new Request("http://x"), ctx)).status).toBe(404);

    // 2) Press again: published, existing Media entries preserved, no YouTube needed.
    const ok = await pub.publishEpisode(e.id);
    expect(ok.ok).toBe(true);
    expect(ok.message).toBe("Your episode is published.");
    expect(ok.episode.status).toBe("published");
    expect(ok.continueUpload).toBe(false); // YouTube not connected yet: nothing else happens
    const played = await video.GET(new Request("http://x"), ctx);
    expect(played.status).toBe(302);
    expect(played.headers.get("location")).toBe("https://files.example/rec.mp4");
    expect((await video.GET(new Request("http://x"), { params: Promise.resolve({ id: "not-a-uuid" }) })).status).toBe(404);
    const list = JSON.parse(state.githubFile);
    expect(list.map((x: { id: string }) => x.id)).toEqual([e.id, "old"]);
    expect(Object.keys(list[0]).sort()).toEqual(["date", "description", "id", "publishedAt", "title"]);

    // 3) Pressing publish again never duplicates.
    await pub.publishEpisode(e.id);
    expect(JSON.parse(state.githubFile)).toHaveLength(2);

    // 4) Owner connects YouTube later: the copy uploads in pieces, survives a dropped connection, and never restarts.
    const { encryptSecret } = await import("@/lib/dropbox/crypto");
    const enc = encryptSecret("refresh-token");
    await db.from("youtube_connection").upsert({
      id: 1, encrypted_refresh_token: enc.ciphertext, token_iv: enc.iv, token_auth_tag: enc.authTag, channel_id: "c", channel_title: "Kidney Total Health",
    });
    state.failPutOnce = true;
    let calls = 0;
    let r = await pub.copyEpisodeToYoutube(e.id);
    while (calls++ < 20 && (r.continueUpload || !r.ok)) r = await pub.copyEpisodeToYoutube(e.id);
    expect(r).toMatchObject({ ok: true, continueUpload: false });
    expect(state.sessions).toBe(1);
    const { data: done } = await db.from("podcast_episodes").select("youtube_status, youtube_video_id, status").eq("id", e.id).single();
    expect(done).toMatchObject({ youtube_status: "unlisted", youtube_video_id: "yt123", status: "published" });
  });

  it("refuses to overwrite a damaged podcast list", async () => {
    const e = await ep.createEpisode();
    await ep.updateEpisode(e.id, { title: "Second", status: "draft", recording_id: "rec2" });
    state.githubFile = "{not an array";
    const r = await pub.publishEpisode(e.id);
    expect(r.ok).toBe(false);
    expect(r.episode.status).toBe("draft");
    expect(state.githubFile).toBe("{not an array");
  });

  it("rate limit counts atomically: a parallel burst cannot exceed the limit", async () => {
    const key = "burst-" + crypto.randomUUID();
    const results = await Promise.all(
      Array.from({ length: 20 }, () => db.rpc("podcast_login_hit", { p_key: key, p_max: 5, p_window_seconds: 900, p_lock_seconds: 900 }))
    );
    const allowed = results.filter((r) => r.data === false).length;
    expect(allowed).toBe(5);
  });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
