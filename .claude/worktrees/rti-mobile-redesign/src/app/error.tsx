"use client";

import Link from "next/link";

/* ------------------------------------------------------------------
   Something failed.

   Four parts, always in this order: what failed, whether anything was
   lost, a retry, a way out. No error codes, no stack trace, no
   apology, and never a dead end.
------------------------------------------------------------------- */

export default function ErrorScreen({ reset }: { reset: () => void }) {
  return (
    <div className="m-shell m-col flex min-h-[70vh] flex-1 flex-col justify-center py-10">
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden
          className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron-50 text-[24px] font-bold text-saffron-600"
        >
          ↻
        </span>
        <h1 className="m-h2 mt-4">We couldn&rsquo;t load this</h1>
        <p className="m-body mt-2">
          The server did not respond.{" "}
          <span className="font-semibold text-ink">
            Nothing is lost — your RTIs are safe.
          </span>
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button type="button" onClick={reset} className="m-btn">
          Try again
        </button>
        <Link href="/dashboard" className="m-btn m-btn--ghost">
          Go to My RTIs
        </Link>
      </div>

      <p className="m-fine mt-5 text-center">
        If this keeps happening, the portal may be down for maintenance. Try
        again after an hour.
      </p>
    </div>
  );
}
