import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { libraryItems } from "@/data/library";

export const metadata: Metadata = {
  title: "Niacin Downloads",
  description:
    "Downloadable references related to Stephen D. McConnell's niacin and kidney health research.",
  alternates: { canonical: "/niacin/downloads" },
};

export default function NiacinDownloadsPage() {
  const downloads = libraryItems.filter(
    (item) => item.status === "published" && item.topics.includes("Niacin") && item.pdfUrl
  );

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Downloads"
        title="Downloadable references"
        description="PDF references related to Stephen's niacin research, including his titration protocol once approved for publication."
      />

      {downloads.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-mist p-10 text-center">
          <p className="font-semibold text-navy">No downloads available yet</p>
          <p className="mt-1 text-sm text-slate-600">
            This page will include downloadable PDFs, such as Stephen&apos;s
            titration protocol graphic, once they are approved for
            publication.
          </p>
        </div>
      ) : (
        <ul className="mt-10 max-w-2xl space-y-3">
          {downloads.map((item) => (
            <li key={item.id}>
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-medical hover:underline"
              >
                {item.title} (PDF) &rarr;
              </a>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
