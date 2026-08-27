"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";
import { useStore } from "@/lib/store";

const SUPPORT_OPTIONS: Array<{
  title: string;
  primary: ReactNode;
  secondary: ReactNode;
  icon: "phone" | "mail" | "chat" | "location";
}> = [
  {
    title: "Call Us",
    primary: <a href="tel:18001234789" className="font-bold text-navy-700 hover:underline">1800 123 4789</a>,
    secondary: <>Mon – Fri (9:00 AM – 6:00 PM)<br />(Toll Free)</>,
    icon: "phone",
  },
  {
    title: "Email Us",
    primary: <a href="mailto:support@rtionline.gov.in" className="font-bold text-navy-700 hover:underline">support@rtionline.gov.in</a>,
    secondary: <>We will respond within<br />1–2 working days</>,
    icon: "mail",
  },
  {
    title: "Live Chat",
    primary: <span>Chat with our support executive</span>,
    secondary: <>Mon – Fri (9:00 AM – 6:00 PM)</>,
    icon: "chat",
  },
  {
    title: "Write to Us",
    primary: <span>RTI Online Support Desk</span>,
    secondary: <>Department of Personnel &amp; Training,<br />North Block, New Delhi – 110001</>,
    icon: "location",
  },
];

export default function ContactPage() {
  const { citizenName } = useStore();
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <>
      <GovHeader />
      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-7 sm:px-8 sm:py-9 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-ink-2">
            <Link href="/" className="inline-flex items-center gap-1.5 text-navy-700 hover:underline"><HomeIcon /> Home</Link>
            <span aria-hidden className="text-muted">›</span>
            <span>Contact Us</span>
          </nav>

          <header className="mt-5 grid items-center gap-6 border-b border-line-2 pb-7 sm:grid-cols-[1fr_310px]">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Contact Us</h1>
              <p className="mt-3 text-[15px] text-ink-2">We are here to help. Reach out to us for any assistance.</p>
              <span className="mt-5 block h-0.5 w-20 rounded-full bg-saffron-400" />
            </div>
            <ContactIllustration />
          </header>

          <section className="mt-7" aria-labelledby="support-options-title">
            <h2 id="support-options-title" className="text-lg font-bold text-navy-900">How can we help you?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {SUPPORT_OPTIONS.map((option) => (
                <article key={option.title} className="rounded-2xl border border-line bg-white px-5 py-6 text-center shadow-[var(--shadow-panel)]">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-saffron-50 text-saffron-500"><SupportIcon kind={option.icon} /></span>
                  <h3 className="mt-4 text-lg font-bold text-navy-900">{option.title}</h3>
                  <div className="mt-2 text-sm leading-5 text-ink-2">{option.primary}</div>
                  <div className="mt-3 text-xs leading-5 text-ink-2">{option.secondary}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="message-title">
            <h2 id="message-title" className="text-lg font-bold text-navy-900">Send us a message</h2>
            <form onSubmit={submit} className="mt-4 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-panel)] sm:p-7">
              <div className="grid gap-5 md:grid-cols-2 md:gap-8">
                <div className="space-y-5">
                  <label className="field-label">Full Name
                    <input name="name" required defaultValue={citizenName} placeholder="Enter your full name" className="field-input" />
                  </label>
                  <label className="field-label">Email Address
                    <input name="email" type="email" required placeholder="Enter your email address" className="field-input" />
                  </label>
                  <label className="field-label">Subject
                    <select name="subject" required defaultValue="" className="field-input">
                      <option value="" disabled>Select a subject</option>
                      <option>Application status</option>
                      <option>Payment issue</option>
                      <option>First Appeal</option>
                      <option>Technical problem</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="field-label">Application Number <span className="font-normal text-muted">(Optional)</span>
                    <input name="applicationNumber" placeholder="Enter application number" className="field-input" />
                  </label>
                  <label className="mt-5 flex flex-1 flex-col field-label">Message
                    <textarea name="message" required rows={6} placeholder="Type your message here..." className="field-input min-h-36 flex-1 resize-y" />
                  </label>
                  <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 self-end rounded-lg bg-navy-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-navy-700 sm:w-auto">
                    <SendIcon /> Send Message
                  </button>
                </div>
              </div>
              {submitted ? (
                <div role="status" className="mt-5 rounded-xl border border-govgreen-600/25 bg-govgreen-50 px-4 py-3 text-sm font-semibold text-govgreen-700">
                  Your message has been sent. Our support team will get back to you within 1–2 working days.
                </div>
              ) : null}
            </form>
          </section>

          <aside className="mt-7 flex flex-col gap-4 rounded-2xl border border-navy-600/15 bg-navy-50 p-5 sm:flex-row sm:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-navy-600 text-lg font-bold text-navy-700">i</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-navy-900">Before contacting us, please check our FAQ section.</p>
              <p className="mt-1 text-sm text-ink-2">You may find answers to common questions there.</p>
            </div>
            <Link href="/about" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-navy-700 shadow-sm hover:bg-navy-50">View FAQ <span aria-hidden>→</span></Link>
          </aside>
        </div>
      </main>
      <GovFooter />
    </>
  );
}

function SupportIcon({ kind }: { kind: "phone" | "mail" | "chat" | "location" }) {
  if (kind === "phone") return <svg aria-hidden width="30" height="30" viewBox="0 0 32 32" fill="none"><path d="M8 5h5l2 6-3 2c2 4 4 6 8 8l2-3 6 2v5c0 2-2 3-4 3C13 26 6 19 4 9c0-2 2-4 4-4Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /></svg>;
  if (kind === "mail") return <svg aria-hidden width="31" height="31" viewBox="0 0 32 32" fill="none"><path d="M4 7h24v18H4V7Z" stroke="currentColor" strokeWidth="2.3"/><path d="m5 9 11 9L27 9" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round"/></svg>;
  if (kind === "chat") return <svg aria-hidden width="31" height="31" viewBox="0 0 32 32" fill="none"><path d="M5 6h22v17H14l-6 4v-4H5V6Z" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round"/><path d="M10 13h12M10 17h8" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"/></svg>;
  return <svg aria-hidden width="31" height="31" viewBox="0 0 32 32" fill="none"><path d="M25 13c0 7-9 15-9 15S7 20 7 13a9 9 0 1 1 18 0Z" stroke="currentColor" strokeWidth="2.3"/><circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="2.3"/></svg>;
}

function HomeIcon() { return <svg aria-hidden width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="m2 7 6-5 6 5v7h-4v-4H6v4H2V7Z" /></svg>; }
function SendIcon() { return <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m21 3-8 18-3-8-8-3 19-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="m10 13 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }

function ContactIllustration() {
  return (
    <svg aria-hidden className="mx-auto hidden w-full max-w-[290px] sm:block" viewBox="0 0 320 170" fill="none">
      <path d="M42 151h246" stroke="#D5E1F3" strokeWidth="3" strokeLinecap="round"/>
      <path d="M84 75c-22 23-23 55-10 76h170c16-22 10-62-16-80-19-14-40-2-56-10-26-12-64-10-88 14Z" fill="#EDF4FF"/>
      <path d="M83 151c-8-27-5-55-28-76 4 26 10 52 28 76Zm171 0c13-23 18-47 40-60-7 26-18 47-40 60Z" fill="#F8E9D8"/>
      <path d="M97 70h145a9 9 0 0 1 9 9v72H88V79a9 9 0 0 1 9-9Z" fill="#405FAD"/>
      <path d="m91 85 76 52 81-52v61H91V85Z" fill="#7793D9"/>
      <path d="M115 49h107v70l-54 37-53-37V49Z" fill="white"/>
      <path d="M132 68h73M132 82h73M132 96h52" stroke="#DCE5F4" strokeWidth="5" strokeLinecap="round"/>
      <path d="m240 28 52-15-27 45-7-18-18-12Z" fill="#EA8A1E"/>
      <path d="m258 40-24 20" stroke="#C56C0B" strokeWidth="3" strokeLinecap="round"/>
      <path d="M99 151h145" stroke="#253E84" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="122" cy="30" r="15" stroke="#9AB2E4" strokeWidth="2" strokeDasharray="4 4"/>
      <path d="M138 36c11 1 18 7 24 14" stroke="#9AB2E4" strokeWidth="2" strokeDasharray="4 4"/>
    </svg>
  );
}
