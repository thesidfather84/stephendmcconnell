import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Portrait } from "@/components/ui/Portrait";
import { Card } from "@/components/ui/Card";
import { researchItems } from "@/data/research";
import { mediaItems } from "@/data/media";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Stephen D. McConnell, MSc | Lipidemiologist & Kidney Researcher",
  description:
    "Learn about Stephen D. McConnell, MSc — his background in lipidemiology, his kidney research mission, publications, and podcast appearances.",
  alternates: { canonical: "/about" },
};

const timeline = [
  { year: "Early Career", detail: "Foundational training and early research in lipidology." },
  { year: "Research Focus", detail: "Shifted research attention toward the intersection of lipid metabolism and chronic kidney disease." },
  { year: "Kidney Total Health", detail: "Launched the Kidney Total Health YouTube channel to share research and education publicly." },
  { year: "Today", detail: "Continues research, writing, and public education on kidney health." },
];

export default function AboutPage() {
  const interview = mediaItems.find((item) => item.type === "interview");

  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
        <Portrait
          src="/stephen/stephen-mcconnell.png"
          alt="Portrait of Stephen D. McConnell, MSc"
          size={220}
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

      <div className="mt-14 grid gap-14 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <SectionHeading eyebrow="Biography" title="Background" />
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Stephen D. McConnell, MSc, is a lipidemiologist whose career has
              focused on the relationship between lipid metabolism and
              chronic disease. His work bridges laboratory research and
              accessible public education, with a particular focus on
              chronic kidney disease.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              A full professional biography is being prepared and will be
              published here.
            </p>
          </section>

          <section>
            <SectionHeading eyebrow="Focus" title="Research interests" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Lipidology & lipid metabolism",
                "Chronic kidney disease",
                "Niacin-based protocols",
                "Sodium bicarbonate & renal function",
                "Patient education",
                "Metabolic health markers",
              ].map((topic) => (
                <li
                  key={topic}
                  className="rounded-lg bg-mist px-4 py-3 text-sm font-medium text-navy"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionHeading
              eyebrow="Mission"
              title="Kidney research mission"
              description="Stephen's mission is to make kidney research and lipidology education freely available, so patients and clinicians alike can make better-informed decisions grounded in evidence, careful observation, and honest interpretation."
            />
          </section>

          <section>
            <SectionHeading eyebrow="Publications" title="Selected publications" />
            <ul className="mt-4 space-y-4">
              {researchItems.map((item) => (
                <li key={item.slug} className="border-l-2 border-medical pl-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-medical">
                    {item.category} &middot; {item.year}
                  </p>
                  <p className="mt-1 font-semibold text-navy">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.publication}</p>
                </li>
              ))}
            </ul>
          </section>

          {interview && (
            <section>
              <SectionHeading eyebrow="Podcast Appearances" title="Interviews & appearances" />
              <Card className="mt-4">
                <p className="font-semibold text-navy">{interview.title}</p>
                <p className="mt-1 text-sm text-slate-600">{interview.description}</p>
              </Card>
            </section>
          )}
        </div>

        <aside>
          <SectionHeading eyebrow="Timeline" title="Career timeline" />
          <ol className="mt-4 space-y-6 border-l-2 border-slate-200 pl-6">
            {timeline.map((entry) => (
              <li key={entry.year}>
                <p className="text-sm font-bold text-medical">{entry.year}</p>
                <p className="mt-1 text-sm text-slate-600">{entry.detail}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Container>
  );
}
