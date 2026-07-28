"use client";

import { FormEvent, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

const inputClasses =
  "mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-medical focus:outline-none focus:ring-2 focus:ring-medical/40";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = formRef.current;
    if (!form) return;

    if (!FORMSPREE_ENDPOINT) {
      setStatus("error");
      setErrorMessage(
        "This form isn't connected yet. Please email us directly using the address above."
      );
      return;
    }

    const formData = new FormData(form);

    // Honeypot: real visitors never fill this hidden field.
    if (String(formData.get("_gotcha") ?? "").trim() !== "") {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        setErrorMessage(
          data?.errors?.map((e: { message: string }) => e.message).join(" ") ||
            "Something went wrong sending your message. Please try again."
        );
        setStatus("error");
      }
    } catch {
      setErrorMessage(
        "Something went wrong sending your message. Please check your connection and try again."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-slate-200 bg-mist p-6 text-navy"
      >
        <p className="font-semibold">Thank you for reaching out.</p>
        <p className="mt-1 text-sm text-slate-600">
          Your message has been sent. Stephen&apos;s team will get back to you
          as soon as they can.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate={false} className="space-y-5">
      {/* Honeypot field — hidden from real visitors, left empty by them. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="_gotcha">Leave this field empty</label>
        <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-navy">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-navy">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-navy">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="What's this about?"
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-navy">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="How can Stephen's team help?"
          required
          className={inputClasses}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-navy">
            Phone <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="preferredContact" className="block text-sm font-semibold text-navy">
            Preferred Contact Method <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <select id="preferredContact" name="preferredContact" defaultValue="" className={inputClasses}>
            <option value="">No preference</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="inquiryType" className="block text-sm font-semibold text-navy">
          Reason for Contacting <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <select id="inquiryType" name="inquiryType" defaultValue="" className={inputClasses}>
          <option value="">Select one</option>
          <option value="Research question">Research question</option>
          <option value="Website question">Website question</option>
          <option value="Coaching inquiry">Coaching inquiry</option>
          <option value="Technical issue">Technical issue</option>
          <option value="Media or collaboration">Media or collaboration</option>
          <option value="General inquiry">General inquiry</option>
        </select>
      </div>

      <p className="text-xs text-slate-500">
        Please do not include medical records or private health information
        in this form.
      </p>

      <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
        This form is not monitored for medical emergencies. For urgent
        medical concerns, contact your healthcare provider or local
        emergency services.
      </p>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 flex-none rounded border-slate-300 text-medical focus:outline-none focus:ring-2 focus:ring-medical/40"
        />
        <label htmlFor="consent" className="text-sm text-slate-600">
          I understand that this contact form is for general, educational,
          research, coaching, and website-related inquiries and is not for
          medical emergencies.
        </label>
      </div>

      {status === "error" && (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full min-w-[160px] items-center justify-center rounded-full bg-medical px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-medical-dark focus:outline-none focus:ring-2 focus:ring-medical/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
