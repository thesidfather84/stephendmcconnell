import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PasscodeForm } from "@/components/podcast/PasscodeForm";
import { StudioClient } from "@/components/podcast/StudioClient";
import { getStudioAuthConfigProblems, hasStudioSession } from "@/lib/podcast/auth";
import { getOrCreateCurrentEpisode, refreshRecordingStatus, toView } from "@/lib/podcast/episodes";
import { isDailyConfigured } from "@/lib/podcast/daily";

// Private page: never cached, never indexed, not linked from any navigation.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Stephen's Podcast Studio",
  robots: { index: false, follow: false, nocache: true },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-center text-3xl font-bold text-navy sm:text-4xl">Stephen&rsquo;s Podcast Studio</h1>
      {children}
    </Container>
  );
}

function Problem({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mx-auto mt-8 max-w-md rounded-xl border-2 border-red-700 bg-red-50 p-4 text-base font-medium text-red-900">
      {children}
    </p>
  );
}

export default async function PodcastStudioPage() {
  const setupProblems = getStudioAuthConfigProblems();
  if (setupProblems.length > 0) {
    return (
      <Shell>
        <Problem>The studio isn&rsquo;t ready yet. Please contact Sidney.</Problem>
      </Shell>
    );
  }

  if (!(await hasStudioSession())) {
    return (
      <Shell>
        <div className="mx-auto max-w-md">
          <PasscodeForm />
        </div>
      </Shell>
    );
  }

  if (!isDailyConfigured()) {
    return (
      <Shell>
        <Problem>
          The studio isn&rsquo;t ready yet. Please contact Sidney.
        </Problem>
      </Shell>
    );
  }

  let episode;
  try {
    episode = await toView(await refreshRecordingStatus(await getOrCreateCurrentEpisode()));
  } catch {
    return (
      <Shell>
        <Problem>
          The studio couldn&rsquo;t open right now. Please try again in a few minutes, or contact Sidney.
        </Problem>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mt-8">
        <StudioClient initialEpisode={episode} />
      </div>
    </Shell>
  );
}
