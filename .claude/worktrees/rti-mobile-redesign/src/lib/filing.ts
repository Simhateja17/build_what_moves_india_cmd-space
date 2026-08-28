import { Draft, RTI_FEE_INR } from "./draft";
import { getAuthority } from "./authorities";
import { MINISTRY_CODES } from "./mock-data";
import { REPLY_DEADLINE_DAYS, RtiCase } from "./types";

/* ------------------------------------------------------------------
   Turning a finished draft into a registered case.

   Kept separate from the payment screens so that a registration can be
   completed later than the payment — which is the whole point of the
   "paid, no number yet" state: the money and the RTI settle
   independently, and the citizen has to be able to see both.
------------------------------------------------------------------- */

/**
 * The portal's own format: AAAAA/B/C/DD/EEEEE — authority code, R for
 * request, E for online receipt, year, serial.
 */
export function makeRegistrationNumber(ministry: string): string {
  const code = MINISTRY_CODES[ministry] ?? "GOVIN";
  const serial = String(Math.floor(Math.random() * 90000) + 10000);
  return `${code}/R/E/26/${serial}`;
}

export function makeTransactionRef(): string {
  const n = Math.floor(Math.random() * 9000000) + 1000000;
  return `SBIEPAY/2026/${n}`;
}

/** A short plain title, taken from the citizen's own first sentence. */
function titleFrom(question: string): string {
  const first = question.trim().split(/[.\n?]/)[0] ?? "";
  const cleaned = first
    .replace(/^please provide (the )?/i, "")
    .replace(/^please give (the )?/i, "")
    .replace(/^please state (the )?/i, "")
    .trim();
  const t = cleaned.length > 4 ? cleaned : question.trim();
  const capped = t.charAt(0).toUpperCase() + t.slice(1);
  return capped.length > 72 ? `${capped.slice(0, 69)}…` : capped;
}

export function caseFromDraft(draft: Draft, id: string): RtiCase {
  const authority = getAuthority(draft.authorityId);
  const ministry = authority?.ministry ?? "Government of India";

  return {
    id,
    registrationNumber: makeRegistrationNumber(ministry),
    plainTitle: titleFrom(draft.question) || "Your new RTI request",
    question: draft.question.trim(),
    authority: {
      ministry,
      office: authority?.office ?? "Public Authority",
      cpio: "CPIO (to be assigned by the Nodal Officer)",
    },
    feeLabel: draft.isBpl
      ? "Fee waived — BPL certificate attached"
      : `₹${RTI_FEE_INR} paid by UPI`,
    startDay: 0,
    maxDay: 120,
    demoNote:
      "Your new request. Move the day forward to see what the law does if they stay silent.",
    events: [
      {
        day: 0,
        kind: "filed",
        plain: draft.isBpl
          ? "You filed this request — no fee, as you hold a BPL card"
          : `You filed this request and paid ₹${RTI_FEE_INR}`,
        official: "REGISTERED",
      },
      {
        day: 0,
        kind: "routed",
        plain: "It reached the department's front desk — the Nodal Officer",
        official: "FORWARDED TO NODAL OFFICER",
      },
      {
        day: 2,
        kind: "cpio",
        plain: "The Nodal Officer passed it to the officer who must answer you",
        official: "TRANSMITTED TO CPIO",
      },
    ],
  };
}

/* ---- Dates --------------------------------------------------------
   Citizens think in dates, not day counters. "They must reply by 26
   September" lands; "18 days remaining" has to be converted in the
   reader's head first.
------------------------------------------------------------------- */

export function addDays(days: number, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

/** The date the reply is legally due, counted from today minus days elapsed. */
export function replyDueDate(daysElapsed: number): Date {
  return addDays(REPLY_DEADLINE_DAYS - daysElapsed);
}
