import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { HEALTH_DEFENDER_NAME, HEALTH_DEFENDER_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Managing Niacin Flushing",
  description:
    "Stephen D. McConnell's educational guidance on why niacin flushing happens and how to manage it, including dosing, timing, food, and hydration.",
  alternates: { canonical: "/niacin/flushing-guide" },
};

export default function FlushingGuidePage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Managing Niacin Flushing"
        title="Why flushing happens, and how to manage it"
        description="Flushing is the most common reaction people notice when starting niacin. This page covers why it happens and the educational strategies Stephen discusses for managing it."
      />

      <div className="mt-12 max-w-3xl space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-navy">Why flushing happens</h2>
          <p className="mt-2 text-slate-600">
            Flushing occurs when niacin triggers the release of
            prostaglandins, which dilate small blood vessels near the skin.
            It typically appears as warming and reddening of the skin,
            usually starting in the face and chest. It is usually harmless
            and temporary, but can feel uncomfortable, especially at higher
            doses.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy">Flushing vs. non-flushing niacin</h2>
          <p className="mt-2 text-slate-600">
            Flushing niacin (immediate-release nicotinic acid) causes the
            temporary warming and reddening described above. Non-flushing or
            &quot;no-flush&quot; niacin products typically use a different
            compound, such as inositol hexanicotinate, that does not produce
            this effect &mdash; but may also not produce the same metabolic
            effects Stephen&apos;s research focuses on.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy">
            Practical flushing-management guidance
          </h2>
          <p className="mt-2 text-slate-600">
            Educational strategies Stephen discusses include starting with a
            lower dose and increasing gradually, taking niacin with food,
            staying well hydrated, and being consistent with timing. Dose,
            timing, food, hydration, and any interactions with existing
            medications should always be reviewed with a healthcare provider
            before starting.
          </p>
          <p className="mt-3 text-slate-600">
            For a specific, step-by-step schedule, see the{" "}
            <Link href="/niacin/titration" className="font-semibold text-medical hover:underline">
              No-Fail Niacin Titration
            </Link>{" "}
            page.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy">Known risks</h2>
          <p className="mt-2 text-slate-600">
            Niacin can interact with medications, affect liver enzymes and
            blood sugar, and is not appropriate for everyone. Anyone
            considering niacin, especially with existing kidney, liver, or
            metabolic conditions, should speak with a qualified healthcare
            professional first and use appropriate lab monitoring.
          </p>
        </Card>

        <div className="rounded-2xl border border-slate-200 bg-mist p-6">
          <p className="text-sm text-slate-600">
            Stephen currently contributes educational guidance &mdash;
            including practical information about managing niacin flushing
            &mdash; with{" "}
            <a
              href={HEALTH_DEFENDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-medical hover:underline"
            >
              {HEALTH_DEFENDER_NAME}
            </a>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
