"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-mist p-6 text-navy">
        <p className="font-semibold">Thank you for reaching out.</p>
        <p className="mt-1 text-sm text-slate-600">
          This form is not yet connected to a mailbox. Please use the email
          address above until the contact form is fully active.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-navy">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
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
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
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
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
        />
      </div>
      <p className="text-xs text-slate-500">
        Please do not include medical records or private health information
        in this form.
      </p>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-medical px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-medical-dark"
      >
        Send Message
      </button>
    </form>
  );
}
