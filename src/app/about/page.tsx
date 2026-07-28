import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Portrait } from "@/components/ui/Portrait";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  FULL_CREDENTIAL_TAGLINE,
  HEALTH_DEFENDER_NAME,
  HEALTH_DEFENDER_URL,
  SITE_NAME,
  YOUTUBE_CHANNEL_NAME,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `About ${SITE_NAME} | Lipid Specialist`,
  description:
    "A brief biography of Stephen D. McConnell — how his father's illness led him to study kidney disease, lipid metabolism, and cardiovascular health — plus his complete professional credentials.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
        <Portrait
          src="/images/stephen/stephen-hero.png"
          alt="Portrait of Stephen D. McConnell"
          size={200}
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-2 max-w-xl text-lg font-medium leading-snug text-medical-dark sm:text-xl">
            {FULL_CREDENTIAL_TAGLINE}
          </p>
        </div>
      </div>

      <div className="mt-12 max-w-3xl space-y-5 text-lg leading-relaxed text-slate-600">
        <p>
          Stephen D. McConnell&apos;s interest in kidney health began close to
          home: his father&apos;s illness set him on a search for answers
          that led him into the study of kidney disease, lipid metabolism,
          and cardiovascular health. For more than two decades, he has
          continued that research and developed his own educational approach
          to kidney health.
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
        <Button href="/library" variant="secondary">
          Read His Research Library
        </Button>
      </div>

      <div className="mt-16 max-w-4xl">
        <SectionHeading eyebrow="Credentials" title="Professional Credentials" />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <p className="text-lg font-bold text-navy">{SITE_NAME}</p>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>PMM, LLC &ndash; Subject Matter Expert (SME)</li>
              <li>Lipid Specialist</li>
              <li>Clinical Application Specialist</li>
              <li>Medical Science Liaison</li>
            </ul>
          </Card>

          <Card>
            <p className="text-sm font-semibold uppercase tracking-wide text-medical">
              Healthcare Policy &amp; Consulting Experience
            </p>
            <div className="mt-4 space-y-4 text-slate-600">
              <div>
                <p className="font-semibold text-navy">Consultant for:</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>Federally Qualified Health Centers (FQHCs)</li>
                  <li>Rural Health Clinics</li>
                </ul>
              </div>
              <p>
                CMS (Centers for Medicare &amp; Medicaid Services) Medicare
                Shared Savings Programs (MSSP)
              </p>
              <div>
                <p className="font-semibold text-navy">Experience supporting:</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>Accountable Care Organizations (ACO)</li>
                  <li>MACRA (Medicare Access and CHIP Reauthorization Act)</li>
                  <li>MIPS (Merit-based Incentive Payment System)</li>
                  <li>Direct Contracting</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
