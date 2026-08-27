"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  AnswerTone,
  PAYMENT_COPY,
  PaymentRecord,
  SETTLEMENT_WORKING_DAYS,
  formatTime,
} from "@/lib/payment";

const CHIP: Record<AnswerTone, string> = {
  good: "bg-govgreen-50 text-govgreen-700 ring-green-200",
  warn: "bg-saffron-50 text-saffron-600 ring-orange-200",
  danger: "bg-govred-50 text-govred-700 ring-red-200",
  info: "bg-navy-50 text-navy-800 ring-navy-100",
  neutral: "bg-slate-100 text-ink-2 ring-slate-200",
};

export default function CheckPaymentPage() {
  const { payments } = useStore();
  const [lookup, setLookup] = useState("");
  const [notFound, setNotFound] = useState(false);

  const query = lookup.trim().toUpperCase();
  const results = query
    ? payments.filter(
        (p) =>
          p.ref.includes(query) ||
          (p.bankRef ?? "").includes(query) ||
          (p.registrationNumber ?? "").toUpperCase().includes(query),
      )
    : payments;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold tracking-tight text-navy-900">
        Check payment status
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
        Paid, but nothing seems to have happened? Find out exactly what became
        of your money — and whether you need to do anything at all.
      </p>
      <p className="mt-1.5 text-[11px] uppercase tracking-wider text-muted">
        On the current portal this is called &ldquo;Payment Reconciliation&rdquo;
      </p>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] xl:gap-8">
      <div>
      {/* Lookup, for someone holding a bank SMS and nothing else. */}
      <div className="gov-card p-5">
        <label htmlFor="lookup" className="field-label">
          Have a reference number?
        </label>
        <p className="mt-0.5 text-[13px] text-muted">
          From your bank SMS, UPI app, or the receipt we showed you. Leave it
          blank to see every payment on your account.
        </p>
        <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="lookup"
            value={lookup}
            onChange={(e) => {
              setLookup(e.target.value);
              setNotFound(false);
            }}
            placeholder="RTIPAY26… or your bank reference"
            className="field-input mt-0 flex-1 font-mono"
          />
          <button
            type="button"
            onClick={() => setNotFound(query.length > 0 && results.length === 0)}
            className="rounded-lg bg-navy-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Check
          </button>
        </div>
        {notFound ? (
          <p className="mt-3 rounded-lg bg-govred-50 px-3 py-2.5 text-[13px] leading-relaxed text-govred-700">
            No payment on this account matches that reference. If money did
            leave your account, it was not received by this portal — your bank
            reverses such debits automatically. Keep the SMS as proof.
          </p>
        ) : null}
      </div>

      {/* The list */}
      <div className="mt-6">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {query ? "Matching payments" : "Your payments"}
        </h2>

        {results.length === 0 ? (
          <div className="mt-2 gov-card p-8 text-center">
            <p className="font-semibold text-ink">No payments yet</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-2">
              Once you pay the ₹10 fee for a request, it appears here with a
              plain answer about where your money is.
            </p>
            <Link
              href="/start-rti"
              className="mt-4 inline-block rounded-lg bg-navy-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
            >
              File a request
            </Link>
          </div>
        ) : (
          <ul className="mt-2 space-y-3">
            {results.map((p) => (
              <PaymentRow key={p.ref} payment={p} />
            ))}
          </ul>
        )}
      </div>
      </div>

      {/* The promise, restated where a worried person will look for it. */}
      <div className="rounded-[var(--radius-panel)] border border-navy-600/20 bg-navy-50 p-5 xl:sticky xl:top-32 xl:p-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-navy-800/70">
          The rule we hold ourselves to
        </p>
        <p className="mt-1.5 text-[15px] font-semibold leading-snug text-navy-900">
          No payment is ever left unexplained.
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-navy-800">
          Every payment ends in one of two places within{" "}
          {SETTLEMENT_WORKING_DAYS} working days — a registered RTI, or the full
          amount back in the account it came from. You never have to apply for
          the refund, and you are never asked to pay a second time for the same
          request.
        </p>
      </div>
      </div>
    </div>
  );
}

function PaymentRow({ payment }: { payment: PaymentRecord }) {
  const copy = PAYMENT_COPY[payment.state];
  const verdict = copy.payingIsSafe
    ? { text: "Safe to pay again", tone: "good" as AnswerTone }
    : copy.isWorking
      ? { text: "Do not pay again", tone: "danger" as AnswerTone }
      : { text: "Nothing to do", tone: "good" as AnswerTone };

  return (
    <li>
      <Link
        href={`/pay/${payment.ref}`}
        className="lift block gov-card p-4 hover:border-navy-600/40"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-snug text-ink">
              {copy.headline}
            </p>
            <p className="mt-1 truncate text-sm text-ink-2">
              {payment.draft.office}
            </p>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-muted">
              {payment.ref} · ₹{payment.amountInr} ·{" "}
              {formatTime(payment.startedAt)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold ring-1 ${CHIP[verdict.tone]}`}
          >
            {verdict.text}
          </span>
        </div>

        <p className="mt-3 border-t border-line-2 pt-3 text-[13px] leading-relaxed text-ink-2">
          {copy.answers.action.value} →
        </p>
      </Link>
    </li>
  );
}
