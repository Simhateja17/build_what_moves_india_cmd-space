"use client";

import Link from "next/link";
import { DerivedCase } from "@/lib/derive";
import { RtiCase, REPLY_DEADLINE_DAYS } from "@/lib/types";
import { formatDate, replyDueDate } from "@/lib/filing";

/* ------------------------------------------------------------------
   One RTI, as a card.

   Replaces the portal's View History counters — Registered [8],
   Disposed of [5], Pending [3]. A number in a bucket tells a citizen
   nothing about what to do; this card leads with what is happening and
   carries a button only when there is something they can act on.

   Colour is never the only signal: every stripe is paired with a pill
   that says the same thing in words.
------------------------------------------------------------------- */

export type Urgency = "needs" | "late" | "waiting" | "done";

export function urgencyOf(d: DerivedCase): Urgency {
  if (d.status === "overdue" || d.status === "appeal_overdue") return "late";
  if (d.hasReply) return "done";
  return "waiting";
}

/** Sort order for the list. Urgency always beats recency. */
export const URGENCY_RANK: Record<Urgency, number> = {
  needs: 0,
  late: 1,
  waiting: 2,
  done: 3,
};

const PILL: Record<Urgency, { text: string; cls: string }> = {
  needs: { text: "● Needs you", cls: "bg-govred-50 text-govred-700" },
  late: { text: "◷ They are late", cls: "bg-saffron-50 text-saffron-600" },
  waiting: { text: "Waiting for their reply", cls: "bg-navy-50 text-navy-900" },
  done: { text: "✓ They replied", cls: "bg-govgreen-50 text-govgreen-700" },
};

const STRIPE: Record<Urgency, string> = {
  needs: "m-card--needs",
  late: "m-card--late",
  waiting: "m-card--stripe",
  done: "m-card--done",
};

export function StatusCard({ c, d }: { c: RtiCase; d: DerivedCase }) {
  const urgency = urgencyOf(d);
  const pill = PILL[urgency];

  // Dates, not durations: "by 14 September" needs no arithmetic from
  // the reader; "18 days remaining" does.
  let line: string;
  if (d.hasReply) {
    line = "They sent their reply. Read it and decide what to do next.";
  } else if (d.status === "appeal_overdue") {
    line = `Day ${d.day}. Your appeal has had no decision in 45 days.`;
  } else if (d.isOverdue) {
    line = `Day ${d.day}. They missed the ${REPLY_DEADLINE_DAYS}-day deadline.`;
  } else if (d.status === "appeal_pending") {
    line = "Your appeal is with the senior officer.";
  } else {
    line = `${d.daysLeft} days left · they must reply by ${formatDate(replyDueDate(d.day))}`;
  }

  const action = d.hasReply
    ? { href: `/requests/${c.id}/response`, label: "View their reply", cls: "m-btn--go" }
    : d.canFileFirstAppeal
      ? { href: `/requests/${c.id}/appeal`, label: "File a free appeal", cls: "!bg-saffron-600" }
      : null;

  return (
    // The card is a plain container; the title link stretches over it so
    // the whole card is tappable, and the action button sits above that
    // overlay. Nested <a> would be invalid HTML.
    <div className={`m-card relative ${STRIPE[urgency]}`}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${pill.cls}`}
        >
          {pill.text}
        </span>
        <span className="m-mono m-fine min-w-0 truncate pt-1 text-right">
          {c.registrationNumber}
        </span>
      </div>

      <h3 className="mt-2 text-[17px] font-bold leading-snug text-ink">
        <Link
          href={`/requests/${c.id}`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {c.plainTitle}
        </Link>
      </h3>
      <p className="m-fine mt-0.5">{c.authority.office}</p>

      {!d.hasReply && !d.isOverdue && (
        <div className="m-meter mt-2.5" aria-hidden>
          <i
            style={{
              width: `${Math.min(100, (d.day / REPLY_DEADLINE_DAYS) * 100)}%`,
            }}
          />
        </div>
      )}

      <p className="m-small mt-2">{line}</p>

      {/* A button only when there is something to do. A waiting card has
          a date and a bar, and nothing to press. */}
      {action && (
        <Link
          href={action.href}
          className={`m-btn relative z-10 mt-3 min-h-[48px] text-[15px] ${action.cls}`}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
