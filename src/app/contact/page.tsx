import type { Metadata } from "next";
import Link from "next/link";
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
        description="Use this form for general inquiries, media requests, research questions, coaching questions, and website feedback. This is not a channel for medical advice, diagnosis, or emergencies."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>

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

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-medical">
              Read
            </p>
            <Link
              href="/library"
              className="mt-2 block text-lg font-semibold text-navy hover:underline"
            >
              Research Library
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-mist p-6 text-sm text-slate-600">
            <p className="font-semibold text-navy">Response time</p>
            <p className="mt-1">
              Stephen&apos;s team aims to respond within a few business days.
              Response times can vary and are not guaranteed.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-mist p-6 text-sm text-slate-600">
            <p className="font-semibold text-navy">Privacy</p>
            <p className="mt-1">
              Information you submit through this form is used only to
              respond to your inquiry. It is not sold, and it is not shared
              beyond what&apos;s needed to answer you.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
