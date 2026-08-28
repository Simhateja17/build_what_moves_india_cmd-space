"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DetailBar } from "@/components/mobile/AppBar";
import { RegNumber, Sheet } from "@/components/mobile/Primitives";
import { useStore } from "@/lib/store";
import { deriveCase, formatInr } from "@/lib/derive";
import { REPLY_DEADLINE_DAYS, PENALTY_PER_DAY_INR } from "@/lib/types";
import { formatDate, replyDueDate } from "@/lib/filing";

/* ------------------------------------------------------------------
   Track one RTI.

   "What is happening now" comes before "What happened so far". The
   current state is the answer to the question the citizen opened the
   app to ask; the timeline is the supporting evidence.

   Every timeline row is a plain sentence with the portal's own status
   string underneath it at 13px. Nothing is hidden — an appeal may need
   the exact wording — but it never leads.
------------------------------------------------------------------- */

export default function TrackPage() {
  const { id } = useParams<{ id: string }>();
  const { getCase, dayOf, setDay, appealOf, ready } = useStore();
  const [showAll, setShowAll] = useState(false);
  const [showOfficer, setShowOfficer] = useState(false);

  const c = getCase(id);

  if (!ready) {
    return (
      <>
        <DetailBar backHref="/dashboard" backLabel="My RTIs" />
        <div className="m-col m-page pt-5" aria-busy>
          <div className="m-skel h-6 w-3/4" />
          <div className="m-skel mt-3 h-4 w-1/2" />
          <div className="m-skel mt-5 h-32 w-full rounded-xl" />
        </div>
      </>
    );
  }

  if (!c) {
    return (
      <>
        <DetailBar backHref="/dashboard" backLabel="My RTIs" />
        <div className="m-col m-page pt-10 text-center">
          <h1 className="m-h2">We couldn&rsquo;t find that RTI</h1>
          <p className="m-body mt-2">
            Nothing is lost — your RTIs are listed under My RTIs.
          </p>
          <Link href="/dashboard" className="m-btn mt-5">
            Go to My RTIs
          </Link>
        </div>
      </>
    );
  }

  const day = dayOf(c.id);
  const appeal = appealOf(c.id);
  const d = deriveCase(c, day, appeal);
  const events = [...d.events].reverse();
  const visible = showAll ? events : events.slice(0, 3);

  /* ---- The "now" card -------------------------------------------- */
  let now: {
    tone: string;
    pill: string;
    headline: string;
    fact: string;
    next?: string;
    cta?: { href: string; label: string; variant: string };
  };

  if (d.hasReply) {
    now = {
      tone: "m-card--done",
      pill: "✓ They replied",
      headline: "They sent their reply",
      fact: `Answered on day ${c.replyDay} of ${REPLY_DEADLINE_DAYS}.`,
      next: "Read it and tell us whether it answered your question.",
      cta: {
        href: `/requests/${c.id}/response`,
        label: "Read their reply",
        variant: "m-btn--go",
      },
    };
  } else if (d.canFileSecondAppeal) {
    now = {
      tone: "m-card--needs",
      pill: "◷ Appeal ignored too",
      headline: "Your appeal has had no decision",
      fact: `45 days have passed since you appealed.`,
      next: "You can now go to the Central Information Commission.",
    };
  } else if (d.appealFiled) {
    now = {
      tone: "m-card--stripe",
      pill: "Appeal in progress",
      headline: "Your appeal is with a senior officer",
      fact: `Filed on day ${appeal.filedOnDay}. They have 45 days to decide.`,
    };
  } else if (d.isOverdue) {
    now = {
      tone: "m-card--late",
      pill: "◷ They are late",
      headline: "They are late",
      fact: `Day ${day}. The ${REPLY_DEADLINE_DAYS} days ran out ${d.daysLate} ${d.daysLate === 1 ? "day" : "days"} ago.`,
      next: `You can now file a first appeal. It is free. A penalty of ${formatInr(PENALTY_PER_DAY_INR)} a day is also running against the officer — currently ${formatInr(d.penalty.accruedInr)}.`,
      cta: {
        href: `/requests/${c.id}/appeal`,
        label: "File a free appeal",
        variant: "!bg-saffron-600",
      },
    };
  } else {
    now = {
      tone: "m-card--stripe",
      pill: "Waiting for their reply",
      headline: "Waiting for their reply",
      fact: `Day ${day} of ${REPLY_DEADLINE_DAYS} · they must reply by ${formatDate(replyDueDate(day))}.`,
      next: "If they do not reply by then, you can file a free appeal. We will tell you.",
    };
  }

  return (
    <>
      <DetailBar backHref="/dashboard" backLabel="My RTIs" />

      <div className="m-col m-page pt-5">
        <h1 className="m-h2 leading-snug">{c.plainTitle}</h1>
        <p className="m-fine mt-1">{c.authority.office}</p>

        <div className="mt-4">
          <RegNumber value={c.registrationNumber} label="RTI number" />
        </div>

        {/* --- What is happening now ---------------------------------- */}
        <div className={`m-card ${now.tone} mt-4`}>
          <p className="m-eyebrow">What is happening now</p>
          <p className="m-h3 mt-1.5">{now.headline}</p>

          {!d.hasReply && !d.appealFiled && (
            <div className="m-meter mt-2.5" aria-hidden>
              <i
                className={d.isOverdue ? "is-late" : undefined}
                style={{
                  width: `${Math.min(100, (day / REPLY_DEADLINE_DAYS) * 100)}%`,
                }}
              />
            </div>
          )}

          <p className="m-small mt-2">{now.fact}</p>
          {now.next && <p className="m-fine mt-1.5">{now.next}</p>}

          {now.cta && (
            <Link
              href={now.cta.href}
              className={`m-btn mt-3.5 ${now.cta.variant}`}
            >
              {now.cta.label}
            </Link>
          )}
        </div>

        {/* --- What happened so far ----------------------------------- */}
        <p className="m-eyebrow mt-6">What happened so far</p>
        <ol className="mt-2.5 flex flex-col gap-3.5">
          {visible.map((e, i) => (
            <li key={`${e.day}-${e.kind}-${i}`} className="flex items-start gap-3">
              <span
                aria-hidden
                className={`mt-1.5 text-[10px] ${
                  e.kind === "deadline" || e.kind === "penalty"
                    ? "text-govred-600"
                    : "text-govgreen-600"
                }`}
              >
                ●
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold leading-snug text-ink">
                  Day {e.day} · {e.plain}
                </span>
                {/* The portal's own words, kept but demoted. */}
                {e.official && (
                  <span className="m-fine mt-0.5 block">
                    Official: {e.official}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>

        {events.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="m-tap mt-2 w-full justify-center text-[15px] font-semibold text-navy-800 underline"
          >
            {showAll ? "Show fewer steps" : `See all ${events.length} steps`}
          </button>
        )}

        {/* --- Officer and documents ---------------------------------- */}
        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowOfficer(true)}
            className="m-card flex items-center gap-3 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold text-ink">
                Who has to answer you
              </span>
              <span className="m-fine mt-0.5 block">Name, phone and email</span>
            </span>
            <span className="m-tap -mr-2 shrink-0 text-muted" aria-hidden>›</span>
          </button>

          <div className="m-card flex items-center gap-3">
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold text-ink">
                Your RTI
              </span>
              <span className="m-fine mt-0.5 block">
                What you sent · {c.feeLabel}
              </span>
            </span>
            <span className="m-tap -mr-2 shrink-0 text-navy-800 underline text-[15px] font-semibold">
              Open
            </span>
          </div>
        </div>

        {/* Demo control: moves this case through its life. */}
        <fieldset className="mt-8 rounded-xl border border-dashed border-line p-3.5">
          <legend className="m-fine px-1">Demo: move the clock</legend>
          <p className="m-fine">{c.demoNote}</p>
          <label className="mt-3 block">
            <span className="m-fine">
              Day {day} of {c.maxDay}
            </span>
            <input
              type="range"
              min={0}
              max={c.maxDay}
              value={day}
              onChange={(e) => setDay(c.id, Number(e.target.value))}
              className="mt-1.5 w-full"
              aria-label="Day of this request"
            />
          </label>
        </fieldset>
      </div>

      <Sheet
        open={showOfficer}
        onClose={() => setShowOfficer(false)}
        title="Who has to answer you"
      >
        <div className="flex flex-col gap-3">
          <div className="m-card">
            <p className="m-eyebrow">The officer</p>
            <p className="mt-1 text-[17px] font-semibold text-ink">
              {c.authority.cpio}
            </p>
            <p className="m-small mt-1">
              This is the Central Public Information Officer — the person
              legally required to answer your RTI.
            </p>
          </div>
          <div className="m-card">
            <p className="m-eyebrow">The office</p>
            <p className="mt-1 text-[17px] font-semibold text-ink">
              {c.authority.office}
            </p>
            <p className="m-small">{c.authority.ministry}</p>
            <div className="mt-3 flex gap-2">
              {/* tel: and mailto: — on a phone these should dial, not be
                  read out to somebody. */}
              <a href="tel:+911123456789" className="m-btn m-btn--ghost min-h-[48px] text-[15px]">
                Call
              </a>
              <a
                href="mailto:cpio@example.gov.in"
                className="m-btn m-btn--ghost min-h-[48px] text-[15px]"
              >
                Email
              </a>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowOfficer(false)}
          className="m-btn m-btn--ghost mt-1"
        >
          Close
        </button>
      </Sheet>
    </>
  );
}
