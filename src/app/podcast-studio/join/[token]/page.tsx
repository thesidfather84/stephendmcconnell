import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { GuestJoin } from "@/components/podcast/GuestJoin";
import { lookupInvite } from "@/lib/podcast/episodes";

// Private guest page: never cached, never indexed, shows nothing but the join screen.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Join the Podcast",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default async function GuestJoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await lookupInvite(token).catch(() => ({ state: "invalid" as const }));

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">Join Stephen&rsquo;s Podcast</h1>
        {invite.state === "valid" ? (
          <>
            <p className="mt-3 text-lg text-slate-700">
              Type your name, test your camera and microphone, then press Join Episode.
            </p>
            <GuestJoin linkToken={token} />
          </>
        ) : (
          <p role="alert" className="mt-8 rounded-2xl border-2 border-slate-300 bg-mist p-6 text-xl font-semibold text-navy">
            {invite.state === "expired"
              ? "This link has expired. Please ask Stephen to send you a new one."
              : "This link no longer works. The recording may be over. Please ask Stephen for a new link."}
          </p>
        )}
      </div>
    </Container>
  );
}
