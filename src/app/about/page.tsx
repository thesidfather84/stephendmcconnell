import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Portrait } from "@/components/ui/Portrait";
import { Button } from "@/components/ui/Button";
import {
  HEALTH_DEFENDER_NAME,
  HEALTH_DEFENDER_URL,
  SITE_NAME,
  YOUTUBE_CHANNEL_NAME,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About Stephen D. McConnell, MSc | Lipidemiologist",
  description:
    "A brief biography of Stephen D. McConnell, MSc — how his father's illness led him to study kidney disease, lipid metabolism, and cardiovascular health.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
        <Portrait
          src="/stephen/stephen-mcconnell.png"
          alt="Portrait of Stephen D. McConnell, MSc"
          size={200}
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-2 text-xl font-medium text-medical-dark">
            Lipidemiologist &middot; Kidney Researcher &middot; Educator
          </p>
        </div>
      </div>

      <div className="mt-12 max-w-3xl space-y-5 text-lg leading-relaxed text-slate-600">
        <p>
          Stephen D. McConnell&apos;s interest in kidney health began close to
          home: his father&apos;s illness set him on a search for answers
          that led him into the study of kidney disease, lipid metabolism,
          and cardiovascular health.
        </p>
        <p>
          Over the years that followed, Stephen has contributed to published
          articles and dedicated his work to educating patients and the
          public on the biochemistry behind chronic kidney disease &mdash;
          from lipid metabolism to niacin and sodium bicarbonate research.
        </p>
        <p>
          Today, his educational work continues through{" "}
          <a
            href={HEALTH_DEFENDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-medical hover:underline"
          >
            {HEALTH_DEFENDER_NAME}
          </a>{" "}
          and the{" "}
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-medical hover:underline"
          >
            {YOUTUBE_CHANNEL_NAME}
          </a>{" "}
          YouTube channel.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/approach">See His Kidney Health Approach</Button>
        <Button href="/research" variant="secondary">
          Read His Research & Articles
        </Button>
      </div>
    </Container>
  );
}
