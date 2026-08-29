"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import { addDays, formatDate } from "@/lib/dates";
import { buildView, caseStage } from "@/lib/dashboard";
import { AppealTag } from "@/components/AppealTag";
import { StatusPill } from "@/components/StatusPill";
import { useLocale } from "@/lib/i18n";
import {
  ACCESS_FORMAT_COPY,
  AdditionalFee,
  Applicant,
  Authority,
  CaseNotice,
  APPEAL_DECISION_DAYS,
  APPEAL_DECISION_DAYS_ORDINARY,
  CpioDecision,
  EXEMPTIONS,
  HEARING_CHOICES,
  INFORMATION_COMMISSION,
  OfficerContact,
  SECOND_APPEAL_FILING_DAYS,
  feeLabelOf,
} from "@/lib/types";

type ProgressState = "complete" | "current" | "pending";

export default function CaseDetailPage() {
  const { t } = useLocale();
  const { id } = useParams<{ id: string }>();
  const { getCase, dayOf, appealOf, readResponses, markResponseRead, uploadsFor } =
    useStore();
  const { actionCaseIds, actions } = useDashboard();
  const [historyOpen, setHistoryOpen] = useState(false);
  const c = getCase(id);

  const replyIsVisible = c?.replyDay !== undefined && dayOf(id) >= c.replyDay;
  useEffect(() => {
    if (replyIsVisible) markResponseRead(id);
  }, [replyIsVisible, id, markResponseRead]);

  if (!c) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="font-semibold text-ink">{t("This request could not be found.")}</p>
        <Link href="/my-rtis" className="mt-3 inline-block font-medium text-navy-700 hover:underline">
          {t("Back to My requests")}
        </Link>
      </div>
    );
  }

  const day = dayOf(c.id);
  const appeal = appealOf(c.id);
  const v = buildView(c, day, appeal, readResponses.includes(c.id));
  const badge = caseStage(v, actionCaseIds.has(c.id));
  const forwardedOn = addDays(c.submittedOn, 2);

  /**
   * The actions this case actually has, from the same derivation the
   * dashboard cards read.
   *
   * The page used to say "Needs you — ACTION REQUIRED" at the top and then
   * offer only "File First Appeal" at the bottom, while the thing genuinely
   * required — upload proof of son-ship — appeared only on the dashboard.
   * The badge promised a task the page never named.
   */
  const caseActions = actions.filter(
    (a) => a.kind !== "response" && a.id.endsWith(`-${c.id}`),
  );

  // An appeal is only competent once the 30 days lapse (s.19(1)) or a reply
  // arrives that falls short. Offering it as the primary button on day 6 of
  // 30 invites a citizen to file something that will be rejected.
  const appealAvailable = v.d.canFileFirstAppeal || v.d.canFileSecondAppeal || v.d.appealFiled;

  // The office's ask, and what has been sent against it. Both are needed
  // even after the ask is answered — a citizen should be able to see the
  // receipt for what they sent.
  const documentAsk = v.notices.find((n) => n.kind === "document_requested");
  const sentDocs = uploadsFor(c.id);

  // The hearing notice, and the day it sits on. Answering it is the whole
  // reason this page has a Hearing section — the card said "Action
  // required" and then linked back to itself.
  const hearingNotice = v.notices.find(
    (n) => n.kind === "hearing_scheduled" && n.hearingDay !== undefined,
  );
  const hearingOn =
    hearingNotice?.hearingDay !== undefined
      ? addDays(c.submittedOn, hearingNotice.hearingDay)
      : undefined;

  // Formal register, plain words. These stop short of the portal's own
  // terms — "Forwarded to Public Authority", "Response to Applicant" — which
  // are precise but mean nothing to someone filing for the first time.
  const steps: Array<{ label: string; date: string; state: ProgressState }> = [
    { label: "Application filed", date: formatDate(v.submittedOn), state: "complete" },
    {
      label: "Forwarded to the department",
      date: day >= 2 ? formatDate(forwardedOn) : "Pending",
      state: day >= 2 ? "complete" : "current",
    },
    {
      label: "Reply from department",
      date: v.repliedOn ? formatDate(v.repliedOn) : v.d.isOverdue ? "Overdue" : "Pending",
      state: v.d.hasReply ? "complete" : day >= 2 ? "current" : "pending",
    },
    {
      label: "Reply received",
      date: v.repliedOn ? formatDate(v.repliedOn) : "Pending",
      state: v.d.hasReply ? "complete" : "pending",
    },
    {
      label: v.d.appealFiled ? "Appeal" : "Closed",
      date: v.d.appealFiled ? "Pending" : v.d.hasReply ? formatDate(v.repliedOn!) : "Pending",
      state: v.d.appealFiled ? "current" : v.d.hasReply ? "complete" : "pending",
    },
  ];

  const history = [
    {
      title: "Application received",
      text: c.fee.waived
        ? "Your RTI application was received. No fee was charged."
        : `Your RTI application was received, with the ₹${c.fee.amountInr} fee.`,
      // No clock time. The hour printed here used to be a literal in this
      // file — the same 9:30 AM on every request ever filed. On a record
      // a citizen may carry to a hearing, an invented timestamp is worse
      // than none at all.
      date: formatDate(v.submittedOn),
      state: "complete" as ProgressState,
    },
    {
      title: "Forwarded to Public Authority",
      text: "Your application was forwarded to the concerned Public Authority.",
      date: day >= 2 ? formatDate(forwardedOn) : "Pending",
      state: day >= 2 ? ("complete" as ProgressState) : ("current" as ProgressState),
    },
    {
      title: "Reply from Public Authority",
      text: v.d.hasReply ? "The Public Authority sent its reply." : "The Public Authority has not yet replied.",
      date: v.repliedOn ? formatDate(v.repliedOn) : v.d.isOverdue ? `${v.d.daysLate} days overdue` : "Pending",
      state: v.d.hasReply ? ("complete" as ProgressState) : day >= 2 ? ("current" as ProgressState) : ("pending" as ProgressState),
    },
    {
      title: "Response to Applicant",
      // This read "Pending" on both lines — the word printed twice, one
      // under the other, which looked like a rendering fault.
      text: v.d.hasReply
        ? "The response is available on this page."
        : "The response will be published here once received, and you will be notified.",
      date: v.repliedOn ? formatDate(v.repliedOn) : "Not yet",
      state: v.d.hasReply ? ("complete" as ProgressState) : ("pending" as ProgressState),
    },
    {
      title: v.d.appealFiled ? "First Appeal" : "Closed",
      text: v.d.appealFiled ? "Your First Appeal is under review." : v.d.hasReply ? "The request has been completed." : "Pending",
      date: v.d.appealFiled && appeal.filedOnDay !== undefined ? formatDate(addDays(c.submittedOn, appeal.filedOnDay)) : v.d.hasReply && v.repliedOn ? formatDate(v.repliedOn) : "Pending",
      state: v.d.appealFiled ? ("current" as ProgressState) : v.d.hasReply ? ("complete" as ProgressState) : ("pending" as ProgressState),
    },
  ];

  return (
    <div className="mx-auto max-w-[1240px]">
      <Link href="/my-rtis" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:underline">
        <span aria-hidden>←</span> {t("My requests")}
      </Link>

      {/* The heading is the office and the question, not "View Status" —
          the citizen already knows they are looking at a status. */}
      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-[30px]">
            {c.authority.office}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-ink-2">{c.plainTitle}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusPill badge={badge} />
            {/* The appeal flag belongs to the application, not to the
                status — beside the number it annotates, so the status
                slot stays one answer to "where is my request?". */}
            <span className="inline-flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted">
                {c.registrationNumber}
              </span>
              {badge.inAppeal ? <AppealTag /> : null}
            </span>
          </div>
        </div>
        {/* Not window.print() on this screen. That printed the status
            page — navigation, progress bar and all — and called it an
            acknowledgement. The acknowledgement is its own document. */}
        <Link
          href={`/requests/${c.id}/acknowledgement`}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-navy-600/50 bg-white px-5 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50 print:hidden"
        >
          <DownloadIcon /> {t("Acknowledgement")}
        </Link>
      </header>

      <section className="mt-7 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-panel)]">
        <div className="border-b border-line-2 px-5 py-7 sm:px-8">
          {/* The clock is the hero. It was the smallest text in the card,
              and it is the single fact that decides what the citizen can
              do and when. */}
          <Deadline v={v} />

          <ol className="mt-8 grid gap-5 sm:grid-cols-5 sm:gap-0">
            {steps.map((step, index) => <ProgressStep key={step.label} {...step} first={index === 0} last={index === steps.length - 1} />)}
          </ol>
        </div>

        {/* Status History used to sit beside this as a second, permanent
            copy of the same five stages with the same five dates. It is the
            same information at more depth, so it is the same block, opened
            on demand. */}
        <div className="px-5 sm:px-8">
          <button
            type="button"
            onClick={() => setHistoryOpen((open) => !open)}
            aria-expanded={historyOpen}
            className="flex w-full items-center gap-2 py-4 text-left text-sm font-bold text-navy-700 hover:underline"
          >
            <span aria-hidden className={`transition ${historyOpen ? "rotate-90" : ""}`}>
              ›
            </span>
            {historyOpen ? "Hide full history" : "Show full history"}
          </button>
          {historyOpen ? (
            <ol className="pb-7 pl-1">
              {history.map((item, index) => <HistoryItem key={`${item.title}-${index}`} {...item} last={index === history.length - 1} />)}
            </ol>
          ) : null}
        </div>
      </section>

      {/* What happens next and the appeal used to be two blocks about a
          thousand pixels apart, with the action at the very bottom of the
          page. They are one decision, so they are one block. */}
      <section
        id="appeal"
        className={`relative mt-6 overflow-hidden rounded-2xl px-6 py-5 sm:px-7 ${
          caseActions.length
            ? "border-l-4 border-l-saffron-500 border-y border-r border-y-saffron-400/35 border-r-saffron-400/35 bg-saffron-50/60"
            : "border border-navy-600/15 bg-navy-50"
        }`}
      >
        <div className="max-w-3xl">
          <h2 className="font-bold text-navy-900">
            {caseActions.length ? "Action required" : "Next step"}
          </h2>

          {/* The real tasks first, named, each with its own control. */}
          {caseActions.length ? (
            <ul className="mt-3 space-y-4">
              {caseActions.map((action) => (
                <li key={action.id}>
                  <p className="text-sm font-bold text-ink">{action.title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-2">{action.detail}</p>
                  {/* The document task is answered on this page, a few
                      hundred pixels down. Sending it away to the same URL
                      it is already on was the whole bug: the button
                      appeared dead. */}
                  {action.kind === "document" || action.kind === "hearing" ? (
                    <a
                      href={action.kind === "document" ? "#documents" : "#hearing"}
                      className="mt-2.5 inline-flex items-center rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700"
                    >
                      {action.cta} →
                    </a>
                  ) : (
                    <Link
                      href={action.href}
                      className="mt-2.5 inline-flex items-center rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700"
                    >
                      {action.cta} →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm leading-6 text-ink-2">{nextStepCopy(v.d.hasReply, v.d.isOverdue, v.d.appealFiled, v.d.daysLeft, v.d.clock.spec.label)}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {v.d.hasReply && v.d.reply ? (
              <a
                href="#response"
                className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                  caseActions.length
                    ? "border border-navy-600 bg-white text-navy-700 hover:bg-navy-50"
                    : "bg-navy-900 text-white hover:bg-navy-700"
                }`}
              >
                {t("View the response")}
              </a>
            ) : null}

            {/* The Commission is the live venue once a Second Appeal is
                available or filed, so it gets the primary weight and the
                First Appeal drops to a record you can look back at. */}
            {v.d.canFileSecondAppeal || v.d.secondAppealFiled ? (
              <Link
                href={`/requests/${c.id}/second-appeal`}
                className="inline-flex items-center rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700"
              >
                {v.d.secondAppealFiled ? "View Second Appeal" : "File Second Appeal"}
              </Link>
            ) : null}

            {v.d.appealFiled ? (
              <Link
                href={`/requests/${c.id}/appeal`}
                className="inline-flex items-center rounded-lg border border-navy-600 bg-white px-5 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50"
              >
                {t("View First Appeal")}
              </Link>
            ) : null}
          </div>

          {appealAvailable && !v.d.appealFiled ? (
            <p className="mt-3 text-xs text-ink-2">
              {t("Filing a First Appeal is free and does not require a lawyer.")}
            </p>
          ) : null}
        </div>
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-8 hidden h-24 w-24 items-end justify-center text-navy-600/80 lg:flex"><NextIllustration /></div>
      </section>

      {hearingNotice && hearingOn ? (
        <HearingSection
          caseId={c.id}
          on={hearingOn}
          notice={hearingNotice}
          fallbackBefore={`${c.authority.appellateAuthority.name}, ${c.authority.appellateAuthority.designation}`}
          fallbackVenue={c.authority.appellateAuthority.address}
          appealNumber={appeal.number}
        />
      ) : null}

      {documentAsk || sentDocs.length ? (
        <DocumentsSection
          caseId={c.id}
          ask={documentAsk?.plain}
          office={c.authority.office}
        />
      ) : null}

      {v.d.hasReply && v.d.reply ? (
        <ResponseSection
          reply={v.d.reply}
          on={v.repliedOn}
          decision={c.decision}
          appellateAuthority={c.authority.appellateAuthority}
          appealBy={v.firstAppealDue}
        />
      ) : null}

      <section id="application" className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7">
        <h2 className="text-lg font-bold text-navy-900">{t("Information sought")}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-2">{c.question}</p>

        {/* The facts, once. The old page had a header card and a Details
            card that repeated the department, the submission date and the
            status between them. */}
        {/* Ordered by what people come here to look up — who is answerable
            and by when — rather than by the shape of the record. */}
        <dl className="mt-6 grid gap-x-8 border-t border-line-2 pt-2 sm:grid-cols-2">
          <DetailRow
            label={t("Officer (CPIO)")}
            value={`${c.authority.cpio.name} · ${c.authority.cpio.designation}`}
          />
          <DetailRow
            label={v.d.hasReply ? "Replied" : "Reply due"}
            value={
              v.d.hasReply && v.repliedOn
                ? formatDate(v.repliedOn)
                : `${formatDate(v.expectedBy)} (${v.d.clock.spec.label})`
            }
          />
          <DetailRow label={t("Fee")} value={feeLabelOf(c.fee)} />
          <DetailRow label={t("Filed")} value={`Online · ${formatDate(v.submittedOn)}`} />
          <DetailRow label={t("Ministry")} value={c.authority.ministry} />
          {/* s.7(9) — the form the information was asked for in. An office
              may depart from it only where doing so would disproportionately
              divert its resources, so the form asked for is worth a line. */}
          {c.format ? (
            <DetailRow label={t("Form requested")} value={ACCESS_FORMAT_COPY[c.format]} />
          ) : null}
          {c.fee.receiptNumber ? (
            <DetailRow label={t("Fee receipt")} value={c.fee.receiptNumber} />
          ) : null}
          {c.fee.waived && c.fee.waiverBasis ? (
            <DetailRow label={t("Basis of waiver")} value={c.fee.waiverBasis} />
          ) : null}
        </dl>
      </section>

      {c.additionalFee ? (
        <AdditionalFeeSection fee={c.additionalFee} submittedOn={c.submittedOn} />
      ) : null}

      <OfficersSection authority={c.authority} />

      {c.applicant ? (
        <ApplicantSection applicant={c.applicant} office={c.authority.office} />
      ) : null}

      <RightsSection
        caseId={c.id}
        appellateAuthority={c.authority.appellateAuthority}
        appealBy={v.firstAppealDue}
        appealWindowExpired={v.firstAppealWindowExpired}
        appealFiled={v.d.appealFiled}
        secondAppealFiled={v.d.secondAppealFiled}
        decisionDue={
          v.d.appealDecisionDueDay !== undefined
            ? addDays(c.submittedOn, v.d.appealDecisionDueDay)
            : undefined
        }
        outerLimit={
          v.d.appealOuterLimitDay !== undefined
            ? addDays(c.submittedOn, v.d.appealOuterLimitDay)
            : undefined
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------
   The particulars of the reply, as section 7(8) requires them.

   A refusal is not a paragraph of prose. The Act makes four things
   mandatory: the reasons, the provision relied on, the period within
   which an appeal may be preferred, and the particulars of the
   Appellate Authority. The page used to print the covering letter in a
   green box titled "Response received" and stop — so a citizen whose
   request had been refused outright was shown the word "received" in
   the colour the portal uses for good news.
------------------------------------------------------------------- */

const OUTCOME_COPY: Record<
  CpioDecision["outcome"],
  { title: string; tint: string; text: string; border: string }
> = {
  provided: {
    title: "Information provided",
    tint: "bg-govgreen-50",
    text: "text-govgreen-700",
    border: "border-govgreen-600/25",
  },
  partial: {
    title: "Provided in part, refused in part",
    tint: "bg-saffron-50/70",
    text: "text-ink",
    border: "border-saffron-400/40",
  },
  rejected: {
    title: "Refused",
    tint: "bg-govred-50",
    text: "text-govred-700",
    border: "border-govred-600/25",
  },
};

function ResponseSection({
  reply,
  on,
  decision,
  appellateAuthority,
  appealBy,
}: {
  reply: string;
  on?: Date;
  decision?: CpioDecision;
  appellateAuthority: OfficerContact;
  appealBy?: Date;
}) {
  const { t } = useLocale();
  const outcome = decision?.outcome ?? "provided";
  const look = OUTCOME_COPY[outcome];
  const refused = outcome !== "provided";
  const clauses = (decision?.exemptions ?? [])
    .map((key) => EXEMPTIONS[key])
    .filter(Boolean);

  return (
    <section
      id="response"
      className={`mt-6 scroll-mt-28 rounded-2xl border p-6 sm:p-7 ${look.border} ${look.tint}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={`font-bold ${look.text}`}>{look.title}</h2>
        <span className={`text-xs font-semibold ${look.text}`}>
          {on ? formatDate(on) : ""}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-ink-2">{reply}</p>

      {refused ? (
        <div className="mt-5 space-y-4 rounded-xl bg-white/80 p-5">
          {decision?.withheld ? (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                {t("What was withheld")}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-ink-2">
                {decision.withheld}
              </p>
            </div>
          ) : null}

          {clauses.length ? (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                {t("The provision relied on")}
              </h3>
              <ul className="mt-1.5 space-y-3">
                {clauses.map((ex) => (
                  <li key={ex.clause}>
                    <p className="text-sm font-bold text-ink">
                      {ex.clause} — {ex.heading}
                    </p>
                    {/* The clause number alone tells a citizen nothing.
                        Beside the words of the Act, they can judge for
                        themselves whether it fits what they asked for. */}
                    <p className="mt-1 text-sm leading-6 text-ink-2">{ex.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {decision?.reasons ? (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                {t("The reasons recorded")}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-ink-2">
                {decision.reasons}
              </p>
            </div>
          ) : null}

          {decision?.publicInterestConsidered === false ? (
            <p className="rounded-lg bg-saffron-50 px-4 py-3 text-sm leading-6 text-ink">
              {t("Nothing on the record shows that the public interest in disclosure was weighed against the harm claimed. Section 8(2) requires that weighing, and its absence is itself a ground of appeal.")}
            </p>
          ) : null}

          {/* s.7(8)(ii) and (iii) — the appeal period and the particulars
              of the Authority are part of the refusal, not a separate
              favour the portal may or may not do. */}
          <div className="border-t border-line-2 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              {t("Your right of appeal")}
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-ink-2">
              You may appeal this decision free of cost within 30 days
              {appealBy ? `, that is by ${formatDate(appealBy)}` : ""}. A
              delayed appeal may still be admitted where the delay is
              explained. The appeal lies to:
            </p>
            <OfficerCard officer={appellateAuthority} className="mt-3" />
          </div>
        </div>
      ) : null}
    </section>
  );
}

/**
 * The two officers, with the particulars needed to actually reach them.
 *
 * The page named the CPIO and stopped there — no designation, no address,
 * no email — and never named the Appellate Authority at all, on a case
 * that was already in appeal before that Authority. Section 7(8)(iii)
 * makes the second of those a legal defect, and the first makes the
 * penalty this portal advertises against the officer unenforceable by
 * the only person entitled to pursue it.
 */
function OfficersSection({ authority }: { authority: Authority }) {
  const { t } = useLocale();
  return (
    <section
      id="officers"
      className="mt-6 scroll-mt-28 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7"
    >
      <h2 className="text-lg font-bold text-navy-900">{t("Who is answerable")}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-2">
        {t("Correspondence about this request may be sent to either officer directly, quoting the registration number. Neither of them may charge you for doing so.")}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {t("Answers the request — s.5(1)")}
          </p>
          <OfficerCard officer={authority.cpio} className="mt-2" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {t("Hears a First Appeal — s.19(1)")}
          </p>
          <OfficerCard officer={authority.appellateAuthority} className="mt-2" />
        </div>
      </div>
    </section>
  );
}

function OfficerCard({
  officer,
  className = "",
}: {
  officer: OfficerContact;
  className?: string;
}) {
  return (
    <address
      className={`rounded-xl border border-line bg-canvas p-4 not-italic ${className}`}
    >
      <p className="text-sm font-bold text-ink">{officer.name}</p>
      <p className="mt-0.5 text-sm leading-6 text-ink-2">{officer.designation}</p>
      <p className="mt-2 text-sm leading-6 text-ink-2">{officer.address}</p>
      <div className="mt-2 space-y-0.5">
        {officer.email ? (
          <p className="text-sm">
            <a
              href={`mailto:${officer.email}`}
              className="font-medium text-navy-700 hover:underline"
            >
              {officer.email}
            </a>
          </p>
        ) : null}
        {officer.phone ? (
          <p className="text-sm text-ink-2">{officer.phone}</p>
        ) : null}
        {officer.web ? (
          <p className="text-sm text-ink-2">{officer.web}</p>
        ) : null}
      </div>
    </address>
  );
}

/**
 * The applicant, as the office holds them.
 *
 * A wrong address on the record is the commonest reason a reply never
 * arrives, and the person who filed is the only one in a position to
 * notice it. It cost nothing to show, and it was shown nowhere.
 */
function ApplicantSection({
  applicant,
  office,
}: {
  applicant: Applicant;
  office: string;
}) {
  const { t } = useLocale();
  return (
    <section className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7">
      <h2 className="text-lg font-bold text-navy-900">{t("Your details on record")}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-2">
        This is what {office} holds against this request, and where any reply
        by post will be sent. If any of it is wrong, tell the officer above —
        a reply sent to the wrong address is still treated as a reply given.
      </p>
      <dl className="mt-5 grid gap-x-8 border-t border-line-2 pt-2 sm:grid-cols-2">
        <DetailRow label={t("Name")} value={applicant.name} />
        <DetailRow label={t("Email")} value={applicant.email} />
        <DetailRow label={t("Address")} value={applicant.address} />
        {applicant.mobile ? (
          <DetailRow label={t("Mobile")} value={applicant.mobile} />
        ) : null}
        <DetailRow
          label={t("Citizenship")}
          value={
            applicant.isCitizen
              ? "Declared a citizen of India — s.6(1)"
              : "Not declared"
          }
        />
        {applicant.isBpl ? (
          <DetailRow label={t("Fee category")} value="Below Poverty Line — no fee payable" />
        ) : null}
      </dl>
    </section>
  );
}

/**
 * The demand for the cost of supply, and what it did to the clock.
 *
 * Section 7(3) requires the office to give the calculation, not just a
 * figure — and section 7(3)(a) excludes the days it waited for payment
 * from the days it is allowed. A portal that shows neither is showing a
 * due date it cannot justify.
 */
function AdditionalFeeSection({
  fee,
  submittedOn,
}: {
  fee: AdditionalFee;
  submittedOn: string;
}) {
  const { t } = useLocale();
  const paid = fee.paidOnDay !== undefined;
  const excluded = paid ? fee.paidOnDay! - fee.day : undefined;

  return (
    <section className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7">
      <h2 className="text-lg font-bold text-navy-900">
        {t("Additional fee for the cost of supply")}
      </h2>
      <dl className="mt-5 grid gap-x-8 border-t border-line-2 pt-2 sm:grid-cols-2">
        <DetailRow label={t("Amount")} value={`₹${fee.amountInr}`} />
        <DetailRow
          label={t("Demanded on")}
          value={formatDate(addDays(submittedOn, fee.day))}
        />
        <DetailRow label={t("How it was worked out")} value={fee.calculation} />
        <DetailRow
          label={t("Paid on")}
          value={
            paid ? formatDate(addDays(submittedOn, fee.paidOnDay!)) : "Not yet paid"
          }
        />
      </dl>
      <p className="mt-4 text-sm leading-6 text-ink-2">
        {paid
          ? `The ${excluded} day${excluded === 1 ? "" : "s"} between the demand and the payment do not count against the department. Section 7(3)(a) excludes them, so the reply date above already allows for it.`
          : "While this is unpaid the department's clock is stopped, and the days do not count against it. Section 7(3)(a) excludes the whole period between the demand and the payment."}
      </p>
    </section>
  );
}

/**
 * Every route out of here, named, with its own deadline and its own
 * address.
 *
 * The page's account of the citizen's rights used to end at the First
 * Appeal. Nothing on it mentioned the Information Commission, the 90 days
 * a Second Appeal has to be brought in, or the complaint under s.18 —
 * which is a different remedy from an appeal and the only one available
 * where the office refused to take the application at all.
 */
function RightsSection({
  caseId,
  appellateAuthority,
  appealBy,
  appealWindowExpired,
  appealFiled,
  secondAppealFiled,
  decisionDue,
  outerLimit,
}: {
  caseId: string;
  appellateAuthority: OfficerContact;
  appealBy?: Date;
  appealWindowExpired: boolean;
  appealFiled: boolean;
  secondAppealFiled: boolean;
  decisionDue?: Date;
  outerLimit?: Date;
}) {
  const { t } = useLocale();
  return (
    <section
      id="rights"
      className="mt-6 scroll-mt-28 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7"
    >
      <h2 className="text-lg font-bold text-navy-900">{t("Your rights from here")}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-2">
        {t("All three are free. None of them requires a lawyer, and none of them may be refused for want of a form or a stamp.")}
      </p>

      <ol className="mt-6 flex flex-col gap-6 border-l-2 border-navy-600/30 pl-5">
        <li>
          <h3 className="text-sm font-bold text-ink">
            {t("First Appeal — section 19(1)")}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-ink-2">
            To a senior officer in the same department, within 30 days of the
            reply or of the date it was due
            {appealBy ? `, that is by ${formatDate(appealBy)}` : ""}.
            {appealWindowExpired
              ? " That period has passed, but a delayed appeal must still be admitted where the Authority is satisfied there was sufficient cause for the delay."
              : ""}
            {appealFiled && decisionDue
              ? ` Your appeal is filed. A decision is due by ${formatDate(decisionDue)}${outerLimit ? `, and by ${formatDate(outerLimit)} at the very outside` : ""}.`
              : ""}
          </p>
          <OfficerCard officer={appellateAuthority} className="mt-3 max-w-md" />
        </li>

        <li>
          <h3 className="text-sm font-bold text-ink">
            {t("Second Appeal — section 19(3)")}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-ink-2">
            To the Central Information Commission, which sits outside the
            department entirely. It must be brought within{" "}
            {SECOND_APPEAL_FILING_DAYS} days of the First Appeal being decided,
            or of the date the decision was due and never came. The Commission
            can order the information released and impose the penalty on the
            officer.
          </p>
          <OfficerCard officer={INFORMATION_COMMISSION} className="mt-3 max-w-md" />
          <Link
            href={`/requests/${caseId}/second-appeal`}
            className="mt-3 inline-flex items-center text-sm font-bold text-navy-700 hover:underline"
          >
            {secondAppealFiled ? "View your Second Appeal" : "About filing a Second Appeal"} →
          </Link>
        </li>

        <li>
          <h3 className="text-sm font-bold text-ink">
            {t("Complaint — section 18")}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-ink-2">
            {t("A complaint is not an appeal. It goes straight to the same Commission, at any time, and it is the remedy where an office refused to accept the application, refused to name a CPIO, charged a fee it was not entitled to, or gave information that was knowingly false. There is no deadline on it.")}
          </p>
        </li>
      </ol>
    </section>
  );
}

/**
 * Where a hearing notice is actually answered.
 *
 * The dashboard has raised this as "Action required" since the notice
 * existed, and its See details button pointed at this page — which had
 * nothing to say about the hearing at all. It was the documents bug
 * again: a task the portal insisted on, with nowhere to do it.
 *
 * The three options are equal in law. The page says so, because the
 * unstated assumption that a citizen must travel to a government office
 * to be heard is what stops most people from pursuing an appeal at all.
 */
const HEARING_MODE_COPY: Record<
  NonNullable<CaseNotice["hearingMode"]>,
  string
> = {
  in_person: "In person",
  video: "By video conference",
  hybrid: "In person or by video conference — your choice",
};

function HearingSection({
  caseId,
  on,
  notice,
  fallbackBefore,
  fallbackVenue,
  appealNumber,
}: {
  caseId: string;
  on: Date;
  notice: CaseNotice;
  fallbackBefore: string;
  fallbackVenue: string;
  appealNumber?: string;
}) {
  const { t } = useLocale();
  const { appealOf, setHearingChoice } = useStore();
  const chosen = appealOf(caseId).hearingChoice;

  return (
    <section
      id="hearing"
      className="mt-6 scroll-mt-28 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7"
    >
      <h2 className="text-lg font-bold text-navy-900">{t("Hearing on your appeal")}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-2">
        A hearing has been fixed{appealNumber ? ` in appeal ${appealNumber}` : ""}.
        Tell them how you want to be heard. All three choices carry the same
        weight, and none of them requires a lawyer.
      </p>

      {/* The particulars of the notice. A date on its own is not a notice
          — nobody can attend a hearing whose hour, place and manner they
          were never told, and being unable to attend is how a citizen
          loses an appeal they were entitled to win. */}
      <dl className="mt-5 grid gap-x-8 border-y border-line-2 py-2 sm:grid-cols-2">
        <DetailRow
          label={t("Date and time")}
          value={`${formatDate(on)}${notice.hearingTime ? `, ${notice.hearingTime}` : ""}`}
        />
        <DetailRow label={t("Before")} value={notice.hearingBefore ?? fallbackBefore} />
        <DetailRow
          label={t("How it sits")}
          value={
            notice.hearingMode
              ? HEARING_MODE_COPY[notice.hearingMode]
              : "In person"
          }
        />
        <DetailRow label={t("Venue")} value={notice.hearingVenue ?? fallbackVenue} />
        {notice.hearingLink ? (
          <DetailRow label={t("Joining link")} value={notice.hearingLink} />
        ) : null}
      </dl>

      <fieldset className="mt-5">
        <legend className="sr-only">{t("How you want to be heard")}</legend>
        <ul className="space-y-3">
          {HEARING_CHOICES.map((option) => {
            const selected = chosen === option.value;
            return (
              <li key={option.value}>
                <label
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                    selected
                      ? "border-navy-600 bg-navy-50"
                      : "border-line hover:bg-canvas"
                  }`}
                >
                  <input
                    type="radio"
                    name={`hearing-${caseId}`}
                    value={option.value}
                    checked={selected}
                    onChange={() => setHearingChoice(caseId, option.value)}
                    className="mt-1 h-4 w-4 shrink-0 accent-navy-700"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-ink">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-ink-2">
                      {option.detail}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {chosen ? (
        <p className="mt-4 rounded-lg bg-govgreen-50 px-4 py-3 text-sm leading-6 text-govgreen-700">
          Recorded. The Appellate Authority has been informed of your choice.
          You may change it at any time before {formatDate(on)}.
        </p>
      ) : (
        <p className="mt-4 text-xs text-ink-2">
          {t("If you record nothing, the hearing goes ahead on the date fixed and the appeal is decided whether or not you attend.")}
        </p>
      )}
    </section>
  );
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ".pdf,.jpg,.jpeg,.png";

function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Where a "supporting document requested" notice is actually answered.
 *
 * The dashboard has asked for this document since the first build, but
 * its button pointed at this page and this page had nowhere to put a
 * file — so the one task the portal insisted on was the one task it made
 * impossible.
 */
function DocumentsSection({
  caseId,
  ask,
  office,
}: {
  caseId: string;
  ask?: string;
  office: string;
}) {
  const { t } = useLocale();
  const { uploadsFor, addUpload, removeUpload } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const sent = uploadsFor(caseId);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Let the same file be picked again after a failed attempt.
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(
        `This file is ${fileSize(file.size)}. The maximum permitted size is 5 MB. Please upload a smaller file, such as a lower-resolution scan or photograph.`,
      );
      return;
    }
    if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) {
      setError("Only PDF, JPG or PNG files are accepted. Other formats will be rejected.");
      return;
    }
    setError(null);
    addUpload(caseId, file);
  }

  return (
    <section
      id="documents"
      className="mt-6 scroll-mt-28 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7"
    >
      <h2 className="text-lg font-bold text-navy-900">{t("Documents submitted")}</h2>
      {ask ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-2">{ask}.</p>
      ) : null}

      {sent.length ? (
        <ul className="mt-4 divide-y divide-line-2 border-y border-line-2">
          {sent.map((doc) => (
            <li
              key={`${doc.name}-${doc.uploadedAt}`}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{doc.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  Submitted to {office} on{" "}
                  {formatDate(new Date(doc.uploadedAt))} · {fileSize(doc.sizeBytes)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeUpload(caseId, doc.name, doc.uploadedAt)}
                className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-2 transition hover:bg-canvas"
              >
                {t("Remove")}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          onChange={onPick}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700"
        >
          <UploadIcon />
          {sent.length ? "Submit another document" : "Choose a document to submit"}
        </button>
        <p className="mt-2 text-xs text-muted">
          {t("Accepted formats: PDF, JPG or PNG, up to 5 MB. A clear photograph of the document is acceptable.")}
        </p>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-govred-700">
          {error}
        </p>
      ) : null}

      {sent.length && ask ? (
        <p className="mt-4 rounded-xl bg-govgreen-50 px-4 py-3 text-sm leading-6 text-govgreen-700">
          {t("Submitted. The office has received the requested document. The 30-day response period continues to run.")}
        </p>
      ) : null}
    </section>
  );
}

/**
 * The clock, as the hero of the card.
 *
 * Days remaining decides everything a citizen can do here — whether an
 * appeal is competent, whether the officer is accruing a penalty, whether
 * silence has become a refusal in law. It used to be the smallest text on
 * the page, inside a sentence, below the fold.
 */
function Deadline({ v }: { v: ReturnType<typeof buildView> }) {
  const { t } = useLocale();
  const { d } = v;

  if (d.hasReply) {
    return (
      <div>
        <p className="text-2xl font-bold tracking-tight text-govgreen-700">
          {t("Response received")}
        </p>
        <p className="mt-1 text-sm text-ink-2">
          {v.repliedOn ? `Replied ${formatDate(v.repliedOn)}` : "Reply received"}
          {` · within the ${d.clock.spec.label} the law allowed here`}
        </p>
      </div>
    );
  }

  const overdue = d.isOverdue;

  /* The bar is one continuous track: the filled part is time spent, the grey
     part is the time still allowed. Which window it measures depends on who
     is holding the file, and it is always the window named in the sentence
     under the bar — otherwise the bar and its caption count different things.

     Once an appeal is filed the governing clock is the Appellate Authority's
     30 days (s.19(6)), so the days already gone are measured against that —
     not against the outer limit of 45, which is a concession the Authority
     has to record reasons to take, not a period it is simply given.
     Before an appeal, an overdue case has no remaining days at all — the
     allowed days are spent — so the track is legitimately full. */
  const allowed = d.clock.dueDay;
  const total =
    overdue && d.appealFiled ? APPEAL_DECISION_DAYS_ORDINARY : allowed;
  const spent = overdue
    ? d.daysLate
    : Math.min(allowed, allowed - d.daysLeft);
  const pct =
    overdue && !d.appealFiled
      ? 100
      : Math.min(100, Math.round((spent / total) * 100));

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2.5">
        <span
          className={`text-[40px] font-bold leading-none tracking-tight tabular-nums ${overdue ? "text-govred-700" : "text-navy-900"}`}
        >
          {overdue ? d.daysLate : d.daysLeft}
        </span>
        <span className="text-lg font-bold text-ink">
          {overdue
            ? `day${d.daysLate === 1 ? "" : "s"} past the deadline`
            : `day${d.daysLeft === 1 ? "" : "s"} remaining of ${allowed}`}
        </span>
      </p>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${overdue ? "bg-govred-600" : "bg-navy-700"}`}
          style={{ width: `${Math.max(3, pct)}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-ink-2">
        {d.appealFiled
          ? `With the Appellate Authority, which is required to decide within ${APPEAL_DECISION_DAYS_ORDINARY} days — and within ${APPEAL_DECISION_DAYS} at the very outside, and only where it records its reasons for taking longer.`
          : overdue
            ? "Under Section 7(2) of the Act, this silence is deemed a refusal."
            : `A response is due by ${formatDate(v.expectedBy)}.`}
      </p>

      {/* Which clock this is, and why it is that one. Every request used
          to be told it had thirty days, including the ones the Act gives
          forty, thirty-five, or forty-eight hours. */}
      <p className="mt-1.5 text-xs leading-5 text-muted">
        {d.clock.spec.basis}
        {d.clock.excludedDays > 0
          ? ` ${d.clock.excludedDays} day${d.clock.excludedDays === 1 ? " is" : "s are"} excluded from the count under section 7(3)(a), for the time an additional fee was outstanding.`
          : ""}
      </p>

      {d.clock.stopped ? (
        <p className="mt-3 rounded-lg bg-saffron-50/80 px-4 py-3 text-sm leading-6 text-ink">
          <strong className="font-semibold">{t("The clock is stopped.")}</strong> {t("It will not run again until the additional fee is paid, and the days it is stopped for do not count against the department.")}
        </p>
      ) : null}
    </div>
  );
}

function nextStepCopy(hasReply: boolean, isOverdue: boolean, appealFiled: boolean, daysLeft: number, limit: string) {
  if (appealFiled) return "The Appellate Authority is reviewing your appeal. You will be notified when a decision is available.";
  if (hasReply) return "Review the response carefully. If it is incomplete, misleading, or unsatisfactory, you may file a First Appeal.";
  if (isOverdue) return "The legal response deadline has passed. You may now file a First Appeal free of cost.";
  return `The Public Authority will review your request and provide a response within ${limit}. ${daysLeft} day${daysLeft === 1 ? "" : "s"} remain; you will be notified once a response is available.`;
}

function ProgressStep({ label, date, state, first, last }: { label: string; date: string; state: ProgressState; first: boolean; last: boolean }) {
  const active = state !== "pending";

  /* The connector.
     Each step is one grid cell with its node centred in it, and each cell
     draws its own segment of the line. A middle cell spans edge to edge and
     the node masks the middle; the end cells must draw only the half that
     faces a neighbour, or the line overshoots into empty space.

     Exactly one width class is emitted per axis. Listing both sm:w-full and
     sm:w-1/2 and relying on the later one winning does not work — they have
     equal specificity, so the generated stylesheet's order decides, not the
     order they appear in this string. That is why the last step's line still
     ran past the final tick. */
  const vTop = first ? "top-3.5" : "top-0";
  const vHeight = first ? "h-[calc(100%-0.875rem)]" : last ? "h-3.5" : "h-full";
  const hLeft = first ? "sm:left-1/2" : "sm:left-0";
  const hWidth = first || last ? "sm:w-1/2" : "sm:w-full";

  return (
    <li className="relative flex gap-3 sm:block sm:text-center">
      {/* A lone step connects to nothing. */}
      {!(first && last) ? (
        <div
          aria-hidden
          className={`absolute left-3 w-px sm:top-3 sm:h-px ${vTop} ${vHeight} ${hLeft} ${hWidth} ${active ? "bg-navy-600" : "bg-slate-200"}`}
        />
      ) : null}
      <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-4 border-white text-[10px] font-bold sm:mx-auto ${active ? "bg-navy-700 text-white" : "bg-slate-200 text-slate-500"}`}>{state === "complete" ? "✓" : state === "current" ? "•" : ""}</span>
      <div className="relative sm:mt-2">
        <p className={`text-xs font-semibold leading-5 ${active ? "text-navy-900" : "text-ink-2"}`}>{label}</p>
        <p className="text-[11px] text-muted">{date}</p>
      </div>
    </li>
  );
}

function HistoryItem({ title, text, date, state, last }: { title: string; text: string; date: string; state: ProgressState; last: boolean }) {
  const active = state !== "pending";
  return <li className="relative flex gap-4 pb-6 last:pb-0">{!last ? <span className={`absolute left-[9px] top-5 h-full w-px ${active ? "bg-navy-600/25" : "bg-slate-200"}`} /> : null}<span className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${state === "complete" ? "bg-govgreen-600 text-white" : state === "current" ? "bg-navy-700 text-white" : "bg-slate-200 text-slate-500"}`}>{state === "complete" ? "✓" : state === "current" ? "•" : ""}</span><div><h3 className="text-sm font-bold text-ink">{title}</h3><p className="mt-1 text-xs leading-5 text-ink-2">{text}</p><p className="mt-1 text-xs text-muted">{date}</p></div></li>;
}

function DetailRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 py-3.5 sm:grid-cols-[135px_1fr] sm:gap-4"><dt className="text-xs font-medium text-muted">{label}</dt><dd className="text-sm font-semibold leading-5 text-ink-2">{value}</dd></div>; }

function UploadIcon() { return <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 20V9m0 0 4 4m-4-4-4 4M5 5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function DownloadIcon() { return <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 16v4h14v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function NextIllustration() { return <svg width="95" height="90" viewBox="0 0 95 90" fill="none"><path d="M50 41h37v35H50z" fill="#CFE0FB"/><path d="m50 42 18 16 19-16" stroke="currentColor" strokeWidth="2"/><path d="M8 15h37M13 20h27M17 20c0 15 4 17 10 21-6 4-10 7-10 22m23-43c0 15-4 17-10 21 6 4 10 7 10 22M9 66h36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M18 28h21L28 38 18 28Zm1 30h20L29 46 19 58Z" fill="currentColor" opacity=".25"/><circle cx="82" cy="65" r="11" fill="#4778BD"/><path d="M82 59v7l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>; }
