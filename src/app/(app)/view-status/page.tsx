"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";

const SECURITY_CODE = "7K9P2";

export default function ViewStatusPage() {
  const router = useRouter();
  const { cases } = useStore();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState("");

  const sampleNumber = cases[0]?.registrationNumber ?? "";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const match = cases.find(
      (item) => item.registrationNumber.toLowerCase() === registrationNumber.trim().toLowerCase(),
    );

    if (!match) {
      setError("We could not find an application with that registration number.");
      return;
    }
    if (securityCode.trim().toUpperCase() !== SECURITY_CODE) {
      setError("The security code does not match. Please try again.");
      return;
    }
    router.push(`/requests/${match.id}`);
  }

  function reset() {
    setRegistrationNumber("");
    setEmail("");
    setSecurityCode("");
    setError("");
  }

  function fillDemo() {
    setRegistrationNumber(sampleNumber);
    setEmail("ananya.sharma@example.com");
    setSecurityCode(SECURITY_CODE);
    setError("");
  }

  return (
    <div className="mx-auto max-w-[1120px]">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[30px]">View Status</h1>
        <p className="mt-1.5 text-sm text-ink-2 sm:text-[15px]">
          Track the current status of an RTI application or First Appeal.
        </p>
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-panel)]">
          <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-7">
            <h2 className="font-bold text-ink">Enter application details</h2>
            <p className="mt-1 text-xs text-ink-2">All fields are required to view the status report.</p>
          </div>

          <form onSubmit={submit} className="space-y-5 p-5 sm:p-7">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Registration Number <span className="text-govred-600">*</span></span>
              <input
                required
                autoComplete="off"
                value={registrationNumber}
                onChange={(event) => { setRegistrationNumber(event.target.value); setError(""); }}
                placeholder="e.g. DOFPD/R/E/26/03310"
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-mono text-sm text-ink outline-none transition placeholder:font-sans placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Email ID <span className="text-govred-600">*</span></span>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setError(""); }}
                placeholder="Enter the email used while filing"
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </label>

            <div>
              <span className="text-sm font-semibold text-ink">Security Code <span className="text-govred-600">*</span></span>
              <div className="mt-2 grid gap-3 sm:grid-cols-[150px_1fr]">
                <div aria-label={`Security code: ${SECURITY_CODE}`} className="flex h-12 select-none items-center justify-center rounded-xl border border-blue-200 bg-blue-50 font-mono text-xl font-bold tracking-[0.22em] text-blue-700">
                  {SECURITY_CODE}
                </div>
                <label>
                  <span className="sr-only">Enter security code</span>
                  <input
                    required
                    autoComplete="off"
                    value={securityCode}
                    onChange={(event) => { setSecurityCode(event.target.value); setError(""); }}
                    placeholder="Enter the code shown"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm uppercase text-ink outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </label>
              </div>
            </div>

            {error ? <p role="alert" className="rounded-lg bg-govred-50 px-4 py-3 text-sm font-medium text-govred-700">{error}</p> : null}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={reset} className="min-h-11 rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-ink-2 transition hover:bg-slate-50">Reset</button>
              <button type="submit" className="min-h-11 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Show Status</button>
            </div>
          </form>
        </section>

        <aside className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6 lg:sticky lg:top-28">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white text-blue-600 ring-1 ring-blue-100">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6"><path d="M6 3h9l4 4v14H6V3Z" stroke="currentColor" strokeWidth="1.8"/><path d="M15 3v5h4M9 12h7M9 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
          <h2 className="mt-4 font-bold text-ink">Looking for all your applications?</h2>
          <p className="mt-2 text-sm leading-6 text-ink-2">
            View History shows every request in your account with filters, dates, and current status.
          </p>
          <Link href="/my-rtis" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-blue-500 bg-white px-5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
            View Application History
          </Link>

          {sampleNumber ? (
            <div className="mt-6 border-t border-blue-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Demo application</p>
              <button type="button" onClick={fillDemo} className="mt-2 break-all text-left font-mono text-xs font-semibold text-ink-2 hover:text-blue-700 hover:underline">
                {sampleNumber}
              </button>
              <p className="mt-2 text-xs leading-5 text-muted">Click the number to fill the demo details, then select Show Status.</p>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
