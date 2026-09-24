// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: { encrypted_refresh_token: "x", token_iv: "y", token_auth_tag: "z" },
          }),
        }),
      }),
    }),
  }),
}));
vi.mock("@/lib/dropbox/crypto", () => ({ decryptSecret: () => "refresh", encryptSecret: () => ({}) }));

import { getSourceSize, UPLOAD_CHUNK_BYTES, uploadNextChunk } from "./youtube";

const TOTAL = UPLOAD_CHUNK_BYTES * 2 + 1000; // three pieces
const SOURCE = "https://files.example/rec.mp4";
const UPLOAD = "https://upload.example/session";

/** A fake recording host (supports byte ranges) and a fake YouTube resumable endpoint. */
function installFakes(opts: { failNextPut?: boolean } = {}) {
  let received = 0;
  let failNextPut = opts.failNextPut ?? false;
  const ranges: string[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const headers = (init?.headers ?? {}) as Record<string, string>;
      if (url.startsWith("https://oauth2.googleapis.com")) {
        return new Response(JSON.stringify({ access_token: "tok" }), { status: 200 });
      }
      if (url === SOURCE) {
        const [, a, b] = /bytes=(\d+)-(\d+)/.exec(headers.Range)!;
        const start = Number(a);
        const end = Math.min(Number(b), TOTAL - 1);
        return new Response(new Uint8Array(end - start + 1), {
          status: 206,
          headers: { "content-range": `bytes ${start}-${end}/${TOTAL}` },
        });
      }
      if (url === UPLOAD) {
        const cr = headers["Content-Range"];
        if (cr.startsWith("bytes */")) {
          return received >= TOTAL
            ? new Response(JSON.stringify({ id: "vid123" }), { status: 200 })
            : new Response(null, { status: 308, headers: received ? { range: `bytes=0-${received - 1}` } : {} });
        }
        const [, s, e] = /bytes (\d+)-(\d+)\//.exec(cr)!;
        ranges.push(`${s}-${e}`);
        if (Number(s) !== received) return new Response(null, { status: 400 }); // a gap or overlap would break the video
        if (failNextPut) {
          failNextPut = false;
          received = Number(e) + 1; // YouTube got the data but the reply was lost
          throw new TypeError("network dropped");
        }
        received = Number(e) + 1;
        return received >= TOTAL
          ? new Response(JSON.stringify({ id: "vid123" }), { status: 200 })
          : new Response(null, { status: 308, headers: { range: `bytes=0-${received - 1}` } });
      }
      throw new Error("unexpected " + url);
    })
  );
  return { ranges };
}

beforeEach(() => {
  process.env.GOOGLE_YOUTUBE_CLIENT_ID = "id";
  process.env.GOOGLE_YOUTUBE_CLIENT_SECRET = "secret";
  process.env.GOOGLE_YOUTUBE_REDIRECT_URI = "https://x/cb";
});
afterEach(() => vi.unstubAllGlobals());

describe("resumable YouTube upload", () => {
  it("uploads a large file in pieces with no gaps and returns the video id", async () => {
    const { ranges } = installFakes();
    let result = await uploadNextChunk({ uploadUrl: UPLOAD, sourceUrl: SOURCE, totalBytes: TOTAL });
    let calls = 1;
    while (!("done" in result && result.done)) {
      result = await uploadNextChunk({ uploadUrl: UPLOAD, sourceUrl: SOURCE, totalBytes: TOTAL });
      calls++;
    }
    expect(calls).toBe(3);
    expect(ranges).toHaveLength(3);
    expect(result).toMatchObject({ done: true, videoId: "vid123" });
  });

  it("resumes after a dropped connection without re-sending or skipping data", async () => {
    installFakes({ failNextPut: true });
    await expect(
      uploadNextChunk({ uploadUrl: UPLOAD, sourceUrl: SOURCE, totalBytes: TOTAL })
    ).rejects.toMatchObject({ retryable: true });

    let result = await uploadNextChunk({ uploadUrl: UPLOAD, sourceUrl: SOURCE, totalBytes: TOTAL });
    while (!("done" in result && result.done)) {
      result = await uploadNextChunk({ uploadUrl: UPLOAD, sourceUrl: SOURCE, totalBytes: TOTAL });
    }
    expect(result).toMatchObject({ done: true, videoId: "vid123" });
  });

  it("reads the recording size from a byte-range response", async () => {
    installFakes();
    expect(await getSourceSize(SOURCE)).toBe(TOTAL);
  });

  it("reports an expired paused upload so a fresh one can begin", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.startsWith("https://oauth2")
          ? new Response(JSON.stringify({ access_token: "t" }), { status: 200 })
          : new Response(null, { status: 404 })
      )
    );
    expect(await uploadNextChunk({ uploadUrl: UPLOAD, sourceUrl: SOURCE, totalBytes: TOTAL })).toEqual({ expired: true });
  });
});
