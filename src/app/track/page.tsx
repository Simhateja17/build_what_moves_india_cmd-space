"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";
import { useStore } from "@/lib/store";

/**
 * Lookup by registration number, for someone who has no account here —
 * they filed on the old portal, or filed on paper, or someone filed for
 * them. That is the only job this page has ever had.
 *
 * It used to sit in the signed-in sidebar as "Track a request", where it
 * asked an already-authenticated citizen for their registration number,
 * their email and a security code in order to show them their own request.
 * Signed in, the way to track a request is to click it in your list.
 */
export default function TrackPage() {
  const router = useRouter();
  const { cases, isAuthenticated } = useStore();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [error, setError] = useState("");

  const sampleNumber = cases[0]?.registrationNumber ?? "";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const match = cases.find(
      (item) =>
        item.registrationNumber.toLowerCase() ===
        registrationNumber.trim().toLowerCase(),
    );

    if (!match) {
      setError(
        "No request found with that number. This may be verified against the acknowledgement email; the format is DOFPD/R/E/26/03310.",
      );
      return;
    }
    router.push(`/requests/${match.id}`);
  }

  return (
    <>
      <GovHeader />
      <main id="main" className="mx-auto w-full max-w-[720px] flex-1 px-4 py-10 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-[30px]">
          Track a request
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
          Enter the registration number from your acknowledgement. You do not
          need an account.
        </p>

        <section className="mt-7 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-panel)] sm:p-7">
          <form onSubmit={submit} noValidate>
            <label className="block">
              <span className="text-sm font-semibold text-ink">
                Registration number
              </span>
              <input
                required
                autoComplete="off"
                value={registrationNumber}
                onChange={(event) => {
                  setRegistrationNumber(event.target.value);
                  setError("");
                }}
                placeholder="e.g. DOFPD/R/E/26/03310"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "track-error" : undefined}
                className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 font-mono text-sm text-ink outline-none transition placeholder:font-sans placeholder:text-muted focus:border-navy-600 focus:ring-4 focus:ring-navy-50"
              />
            </label>

            {/* The old form also demanded an email and a five-character
                security code. The email was collected and never checked, and
                the code was a constant in the source — two fields of friction
                that proved nothing. */}

            {error ? (
              <p
                id="track-error"
                role="alert"
                className="mt-3 rounded-lg bg-govred-50 px-4 py-3 text-sm font-medium text-govred-700"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-navy-900 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-navy-700 sm:w-auto"
            >
              Show status
            </button>
          </form>

          {sampleNumber ? (
            <p className="mt-6 border-t border-line-2 pt-5 text-xs leading-5 text-muted">
              Demo request:{" "}
              <button
                type="button"
                onClick={() => {
                  setRegistrationNumber(sampleNumber);
                  setError("");
                }}
                className="break-all font-mono font-semibold text-navy-700 hover:underline"
              >
                {sampleNumber}
              </button>
            </p>
          ) : null}
        </section>

        <p className="mt-6 text-sm text-ink-2">
          {isAuthenticated ? (
            <>
              If already signed in, all requests are listed in{" "}
              <Link href="/my-rtis" className="font-bold text-navy-700 hover:underline">
                My requests
              </Link>
              . No registration number is required.
            </>
          ) : (
            <>
              <Link href="/login" className="font-bold text-navy-700 hover:underline">
                Sign in
              </Link>{" "}
              to see every request you have filed, with its response deadline tracked.
            </>
          )}
        </p>
      </main>
      <GovFooter />
    </>
  );
}
