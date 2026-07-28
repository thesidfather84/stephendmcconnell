import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL, YOUTUBE_CHANNEL_NAME, YOUTUBE_CHANNEL_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Stephen D. McConnell. Please do not submit medical records or private health information.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="For general inquiries, media requests, and research questions. This is not a channel for medical advice or private health information."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <ContactForm />

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-medical">
              Email
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 block text-lg font-semibold text-navy hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-medical">
              Watch
            </p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-lg font-semibold text-navy hover:underline"
            >
              {YOUTUBE_CHANNEL_NAME} on YouTube
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
