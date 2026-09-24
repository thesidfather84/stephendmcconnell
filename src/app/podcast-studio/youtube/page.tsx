import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { YoutubeCopyButton } from "@/components/podcast/YoutubeCopyButton";
import { hasStudioSession } from "@/lib/podcast/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getYoutubeConfigProblems, getYoutubeConnection, TARGET_CHANNEL_HANDLE } from "@/lib/podcast/youtube";

// Site-owner page. Not linked from the studio, so Stephen never sees it.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Studio owner settings",
  robots: { index: false, follow: false, nocache: true },
};

const RESULTS: Record<string, { ok: boolean; text: string }> = {
  connected: { ok: true, text: "YouTube is connected." },
  denied: { ok: false, text: "Access wasn't approved, so nothing was connected." },
  failed: { ok: false, text: "YouTube couldn't be connected. Please try again." },
  "wrong-channel": {
    ok: false,
    text: `That Google account is not the Kidney Total Health channel (${TARGET_CHANNEL_HANDLE}). Nothing was connected.`,
  },
  signin: { ok: false, text: "Please enter the studio code, then open this page again." },
  "not-configured": { ok: false, text: "The Google settings aren't on the server yet (see below)." },
};

export default async function StudioOwnerPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const { result } = await searchParams;

  if (!(await hasStudioSession())) {
    return (
      <Container className="py-10">
        <p className="text-lg text-navy">
          Please{" "}
          <Link href="/podcast-studio" className="font-semibold underline">
            enter the studio code
          </Link>{" "}
          first, then open this page again.
        </p>
      </Container>
    );
  }

  const problems = getYoutubeConfigProblems();
  let connection: { connected: boolean; channelTitle: string | null } = { connected: false, channelTitle: null };
  let pending: { id: string; title: string; youtube_status: string; youtube_error: string | null }[] = [];
  let dbProblem = false;
  try {
    connection = await getYoutubeConnection();
    const { data } = await createAdminSupabaseClient()
      .from("podcast_episodes")
      .select("id, title, youtube_status, youtube_error")
      .eq("status", "published")
      .neq("youtube_status", "unlisted")
      .order("published_at", { ascending: false })
      .limit(20);
    pending = data ?? [];
  } catch {
    dbProblem = true;
  }
  const flash = result ? RESULTS[result] : undefined;

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-navy">Studio owner settings</h1>
        <p className="mt-2 text-base text-slate-700">
          For the site owner only. The studio user never needs this page. Episodes always publish to the website;
          this only controls the extra copy sent to the YouTube channel {TARGET_CHANNEL_HANDLE} (Unlisted).
        </p>

        {flash && (
          <p
            role={flash.ok ? "status" : "alert"}
            className={`mt-6 rounded-xl border-2 p-4 text-base font-medium ${flash.ok ? "border-green-700 bg-green-50 text-green-900" : "border-red-700 bg-red-50 text-red-900"}`}
          >
            {flash.text}
          </p>
        )}
        {dbProblem && (
          <p role="alert" className="mt-6 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-base font-medium text-red-900">
            The database couldn&rsquo;t be read. Check the Supabase settings and that migration 0003_podcast_studio.sql has
            been run.
          </p>
        )}

        <div className="mt-6 rounded-2xl bg-mist p-4 text-base text-slate-800">
          {problems.length > 0 ? (
            <>
              <p className="font-bold text-navy">Google settings are missing on the server.</p>
              <p className="mt-1">
                Add these in Vercel, then redeploy: {problems.join(", ")}. Steps are in docs/podcast-studio-setup.md.
              </p>
            </>
          ) : connection.connected ? (
            <p>
              Connected channel: <span className="font-semibold">{connection.channelTitle}</span>. New episodes are copied
              to it automatically.
            </p>
          ) : (
            <p className="font-bold text-navy">Not connected yet. Episodes still publish to the website.</p>
          )}
          {problems.length === 0 && (
            <a
              href="/api/podcast-studio/youtube/connect"
              className="mt-4 inline-block rounded-full bg-medical px-6 py-3 text-base font-bold text-white hover:bg-medical-dark"
            >
              {connection.connected ? "Reconnect YouTube" : "Connect YouTube"}
            </a>
          )}
        </div>

        {connection.connected && pending.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-navy">Published episodes not yet on YouTube</h2>
            <ul className="mt-3 space-y-4">
              {pending.map((e) => (
                <li key={e.id} className="rounded-2xl border-2 border-slate-300 p-4">
                  <p className="text-lg font-semibold text-navy">{e.title}</p>
                  {e.youtube_error && <p className="mt-1 text-sm text-red-900">Last problem: {e.youtube_error}</p>}
                  <div className="mt-3">
                    <YoutubeCopyButton episodeId={e.id} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Container>
  );
}
