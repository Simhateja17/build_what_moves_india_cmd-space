"use client";

/* ------------------------------------------------------------------
   The acknowledgement, as an actual document.

   "Download acknowledgement (PDF)" used to call window.print() on the
   status screen — so what came out was the status screen, navigation and
   progress bar and all, with a filename the browser invented. An
   acknowledgement is a specific thing: the number, the date, the office,
   the officer, the question as filed, the fee and its receipt, the date
   a reply is due, and the appeal that follows if it does not come. It is
   the paper a citizen carries to a hearing, and it has to stand on its
   own away from the portal.
------------------------------------------------------------------- */

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { buildView } from "@/lib/dashboard";
import { addDays, formatDate } from "@/lib/dates";
import {
  ACCESS_FORMAT_COPY,
  FIRST_APPEAL_FILING_DAYS,
  OfficerContact,
  feeLabelOf,
} from "@/lib/types";

export default function AcknowledgementPage() {
  const { id } = useParams<{ id: string }>();
  const { getCase, dayOf, appealOf, readResponses } = useStore();
  const c = getCase(id);

  // The page title becomes the filename the browser suggests when the
  // citizen saves it as a PDF, so it is set to the registration number
  // rather than left as whatever the portal is called.
  useEffect(() => {
    if (!c) return;
    const previous = document.title;
    document.title = `Acknowledgement ${c.registrationNumber.replace(/\//g, "-")}`;
    return () => {
      document.title = previous;
    };
  }, [c]);

  if (!c) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="font-semibold text-ink">This request could not be found.</p>
        <Link href="/my-rtis" className="mt-3 inline-block font-medium text-navy-700 hover:underline">
          Back to My requests
        </Link>
      </div>
    );
  }

  const day = dayOf(c.id);
  const v = buildView(c, day, appealOf(c.id), readResponses.includes(c.id));
  const forwardedOn = addDays(c.submittedOn, 2);
  const appealBy = addDays(c.submittedOn, v.d.clock.dueDay + FIRST_APPEAL_FILING_DAYS);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/requests/${c.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:underline"
        >
          <span aria-hidden>←</span> Back to this request
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700"
        >
          Print or save as PDF
        </button>
      </div>

      {/* Deliberately plain. This is the one screen in the portal meant to
          survive being printed in black and white and read across a desk. */}
      <article className="mt-5 rounded-2xl border border-line bg-white p-8 shadow-[var(--shadow-panel)] print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="border-b-2 border-navy-900 pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Government of India · {c.authority.ministry}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">
            Acknowledgement of an application under the
            <br />
            Right to Information Act, 2005
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Issued under section 7(1). This is a record of an application
            received; it is not a reply to it.
          </p>
        </header>

        <Row label="Registration number" value={c.registrationNumber} mono />
        <Row label="Date of receipt" value={formatDate(v.submittedOn)} />
        <Row label="Public authority" value={`${c.authority.office}, ${c.authority.ministry}`} />
        <Row
          label="Date forwarded to the CPIO"
          value={day >= 2 ? formatDate(forwardedOn) : "Pending"}
        />

        <Section title="Applicant" />
        {c.applicant ? (
          <>
            <Row label="Name" value={c.applicant.name} />
            <Row label="Address" value={c.applicant.address} />
            <Row label="Email" value={c.applicant.email} />
            {c.applicant.mobile ? (
              <Row label="Mobile" value={c.applicant.mobile} />
            ) : null}
            <Row
              label="Declaration"
              value={
                c.applicant.isCitizen
                  ? "The applicant has declared that they are a citizen of India (section 6(1))."
                  : "No citizenship declaration is on record."
              }
            />
          </>
        ) : (
          <Row label="Name" value="As given in the application" />
        )}

        <Section title="Information sought" />
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink">
          {c.question}
        </p>
        {c.format ? (
          <Row
            label="Form in which access was sought"
            value={`${ACCESS_FORMAT_COPY[c.format]} (section 7(9))`}
          />
        ) : null}

        <Section title="Fee" />
        <Row label="Application fee" value={feeLabelOf(c.fee)} />
        {c.fee.receiptNumber ? (
          <Row label="Receipt number" value={c.fee.receiptNumber} mono />
        ) : null}
        {c.fee.paidOn ? (
          <Row label="Received on" value={formatDate(new Date(`${c.fee.paidOn}T00:00:00`))} />
        ) : null}
        {c.fee.waived && c.fee.waiverBasis ? (
          <Row label="Basis of waiver" value={`${c.fee.waiverBasis} (proviso to section 7(5))`} />
        ) : null}
        {c.additionalFee ? (
          <Row
            label="Additional fee"
            value={`₹${c.additionalFee.amountInr} towards the cost of supply — ${c.additionalFee.calculation} Demanded ${formatDate(addDays(c.submittedOn, c.additionalFee.day))}${
              c.additionalFee.paidOnDay !== undefined
                ? `, paid ${formatDate(addDays(c.submittedOn, c.additionalFee.paidOnDay))}. The intervening period is excluded from the time allowed (section 7(3)(a)).`
                : ". The time allowed does not run while this is outstanding (section 7(3)(a))."
            }`}
          />
        ) : null}

        <Section title="Time allowed for a reply" />
        <Row label="Period allowed" value={v.d.clock.spec.label} />
        <Row label="Basis" value={v.d.clock.spec.basis} />
        <Row label="Reply due on or before" value={formatDate(v.expectedBy)} />
        <p className="mt-3 text-sm leading-7 text-ink-2">
          If no reply is given within that period, the failure is treated as a
          refusal under section 7(2), and an appeal may be filed free of cost.
        </p>

        <Section title="Officers" />
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          <OfficerBlock
            role="Central Public Information Officer — section 5(1)"
            officer={c.authority.cpio}
          />
          <OfficerBlock
            role="First Appellate Authority — section 19(1)"
            officer={c.authority.appellateAuthority}
          />
        </div>

        <Section title="Right of appeal" />
        <p className="mt-3 text-sm leading-7 text-ink-2">
          An appeal against a refusal, or against a failure to reply, lies to
          the First Appellate Authority named above. It must ordinarily be
          filed within {FIRST_APPEAL_FILING_DAYS} days — on the present
          reckoning, by {formatDate(appealBy)} — and a delayed appeal must
          still be admitted where sufficient cause for the delay is shown. No
          fee is payable on an appeal, and no lawyer is required.
        </p>

        <footer className="mt-8 border-t border-line-2 pt-4 text-xs leading-6 text-muted">
          Generated from the RTI Saral record for {c.registrationNumber} on{" "}
          {formatDate(v.today)}. Retain this acknowledgement; the registration
          number is required to pursue an appeal.
        </footer>
      </article>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <h2 className="mt-8 border-b border-line-2 pb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-navy-900">
      {title}
    </h2>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1 border-b border-line-2 py-3 sm:grid-cols-[210px_1fr] sm:gap-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className={`text-sm leading-6 text-ink ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function OfficerBlock({
  role,
  officer,
}: {
  role: string;
  officer: OfficerContact;
}) {
  return (
    <address className="not-italic">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {role}
      </p>
      <p className="mt-1.5 text-sm font-bold text-ink">{officer.name}</p>
      <p className="text-sm leading-6 text-ink-2">{officer.designation}</p>
      <p className="mt-1 text-sm leading-6 text-ink-2">{officer.address}</p>
      {officer.email ? (
        <p className="text-sm leading-6 text-ink-2">{officer.email}</p>
      ) : null}
      {officer.phone ? (
        <p className="text-sm leading-6 text-ink-2">{officer.phone}</p>
      ) : null}
    </address>
  );
}
