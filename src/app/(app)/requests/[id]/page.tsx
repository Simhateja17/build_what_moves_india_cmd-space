"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { deriveCase, formatInr } from "@/lib/derive";
import { REPLY_DEADLINE_DAYS } from "@/lib/types";
import { buildView } from "@/lib/dashboard";
import { formatDate } from "@/lib/dates";
import { stagesFor } from "@/lib/stages";
import { PAYMENT_COPY } from "@/lib/payment";
import { StatusPill } from "@/components/StatusPill";
import { StageTimeline } from "@/components/StageTimeline";
import { CaseTimeline } from "@/components/CaseTimeline";
import { PenaltyMeter } from "@/components/PenaltyMeter";
import { SplitParts } from "@/components/SplitParts";
import { TimeMachine } from "@/components/TimeMachine";
import { CaseAppealPanel } from "@/components/CaseAppealPanel";

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    getCase,
    dayOf,
    setDay,
    appealOf,
    readResponses,
    markResponseRead,
    payments,
  } = useStore();

  const c = getCase(id);

  // Opening the case is what marks its response as read — that is what
  // clears "Response received — review it" from Action Required.
  const replyIsVisible =
    c?.replyDay !== undefined && dayOf(id) >= c.replyDay;
  useEffect(() => {
    if (replyIsVisible) markResponseRead(id);
  }, [replyIsVisible, id, markResponseRead]);

  if (!c) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="font-semibold text-ink">We could not find that request.</p>
        <Link
          href="/my-rtis"
          className="mt-3 inline-block font-medium text-navy-700 hover:underline"
        >
          Back to your RTIs
        </Link>
      </div>
    );
  }

  const day = dayOf(c.id);
  const appeal = appealOf(c.id);
  const d = deriveCase(c, day, appeal);
  const v = buildView(c, day, appeal, readResponses.includes(c.id));

  // A payment still in flight makes the Payment stage shout instead of tick.
  const stuckPayment = payments.find(
    (p) => PAYMENT_COPY[p.state].isWorking && p.caseId === c.id,
  );
  const stages = stagesFor({
    d,
    paymentUnconfirmed: Boolean(stuckPayment),
    feeWaived: c.feeLabel.toLowerCase().includes("waived"),
  });

  const markers = [
    { day: 0, label: "Filed" },
    { day: REPLY_DEADLINE_DAYS, label: "Deadline (day 30)" },
    ...(c.replyDay !== undefined
      ? [{ day: c.replyDay, label: `They reply (day ${c.replyDay})` }]
      : [{ day: 44, label: "Two weeks late" }]),
    { day: c.maxDay, label: `Day ${c.maxDay}` },
  ].filter((m, i, arr) => arr.findIndex((x) => x.day === m.day) === i);

  return (
    <div>
      <Link
        href="/my-rtis"
        className="text-sm font-medium text-navy-700 hover:underline"
      >
        ← My RTIs
      </Link>

      {/* Case summary: identity, status and key dates belong together. */}
      <section id="overview" className="mt-4 scroll-mt-28 overflow-hidden rounded-[28px] border border-line bg-surface shadow-[var(--shadow-panel-lg)]">
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
              {c.registrationNumber}
            </p>
            <StatusPill status={d.status} />
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-navy-900 sm:text-4xl">
            {c.plainTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">{c.authority.office}</span>
            <span className="mx-1.5 text-muted">·</span>
            {c.authority.ministry}
          </p>
          <p className="mt-2 text-xs text-muted">
            {c.feeLabel} · Answerable by {c.authority.cpio}
          </p>
        </div>

        <dl className="grid grid-cols-2 border-t border-line-2 bg-canvas/55">
          <div className="border-r border-line-2 px-5 py-3.5 sm:px-6">
            <dt className="text-[11px] uppercase tracking-wider text-muted">
              Submitted
            </dt>
            <dd className="mt-0.5 text-[15px] font-semibold text-ink">
              {formatDate(v.submittedOn)}
            </dd>
          </div>
          <div
            className={`px-5 py-3.5 sm:px-6 ${d.isOverdue ? "bg-govred-50" : ""}`}
          >
            <dt className="text-[11px] uppercase tracking-wider text-muted">
              {d.hasReply ? "Answered on" : "Expected response"}
            </dt>
            <dd
              className={`mt-0.5 text-[15px] font-semibold ${
                d.isOverdue ? "text-govred-700" : "text-ink"
              }`}
            >
              {d.hasReply && v.repliedOn
                ? formatDate(v.repliedOn)
                : formatDate(v.expectedBy)}
            </dd>
          </div>
        </dl>
      </section>

      <nav
        aria-label="Case sections"
        className="sticky top-[88px] z-20 -mx-4 mt-5 overflow-x-auto border-y border-line bg-canvas/90 px-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:bg-surface/92"
      >
        <div className="flex min-w-max gap-1 py-2">
          {[
            ["#overview", "Overview"],
            ["#progress", "Progress"],
            ["#request", "Request"],
            ...(d.hasReply ? [["#response", "Response"]] : []),
            ["#documents", "Documents"],
            ...(d.canFileFirstAppeal || d.hasReply || d.appealFiled
              ? [["#appeal", "Appeal"]]
              : []),
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-[13px] font-semibold text-ink-2 transition hover:bg-navy-50 hover:text-navy-800"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Where this actually is, in six plain stages */}
      <section id="progress" className="mt-5 scroll-mt-20 gov-card p-5">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Where your request is
          </h2>
          <span
            className={`text-[13px] font-semibold ${d.isOverdue ? "text-govred-700" : "text-ink-2"}`}
          >
            {d.isOverdue
              ? `Day ${day} · ${d.daysLate} past the limit`
              : `Day ${day} of ${REPLY_DEADLINE_DAYS}`}
          </span>
        </div>
        <StageTimeline stages={stages} />
      </section>

      <p id="request" className="mt-5 scroll-mt-20 rounded-lg border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          What you asked
        </span>
        <br />
        {c.question}
      </p>

      {/* Time machine */}
      <div className="mt-6">
        <TimeMachine
          day={day}
          maxDay={c.maxDay}
          onChange={(v) => setDay(c.id, v)}
          markers={markers}
        />
        <p className="mt-2 text-xs text-muted">{c.demoNote}</p>
      </div>

      {!d.appealFiled && v.firstAppealDue ? (
        <div
          className={`mt-5 rounded-xl border px-5 py-4 ${
            v.firstAppealWindowExpired
              ? "border-govred-600/25 bg-govred-50"
              : "border-saffron-400/40 bg-saffron-50"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  v.firstAppealWindowExpired
                    ? "text-govred-700"
                    : "text-saffron-600"
                }`}
              >
                First Appeal filing date
              </p>
              <p className="mt-1 font-bold text-ink">
                {v.firstAppealWindowExpired
                  ? "The usual filing period has passed"
                  : `${v.firstAppealDaysLeft} day${v.firstAppealDaysLeft === 1 ? "" : "s"} left`}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {v.firstAppealWindowExpired
                  ? "You may still file a delayed appeal. Include the reason for the delay so the Appellate Authority can consider it."
                  : `File by ${formatDate(v.firstAppealDue)} if you want to challenge the silence or response.`}
              </p>
            </div>
            <a
              href="#appeal"
              className="shrink-0 rounded-xl bg-navy-800 px-4 py-3 text-center text-sm font-bold text-white"
            >
              Review appeal options
            </a>
          </div>
        </div>
      ) : null}

      {/* What you can do right now — always above the fold of the detail */}
      {d.canFileSecondAppeal ? (
        <div className="mt-6 rounded-xl border border-saffron-400/50 bg-saffron-50 p-5">
          <p className="font-semibold text-saffron-600">
            Your appeal was ignored as well. You can escalate to the Information
            Commission.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
            45 days have passed since you filed your First Appeal with no
            decision. Under Section 19(3) of the RTI Act, you may now file a
            Second Appeal to the Central Information Commission — the body that
            can actually impose the penalty below.
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-saffron-600"
          >
            File a Second Appeal to the CIC
          </button>
        </div>
      ) : d.appealFiled ? (
        <div className="mt-6 rounded-xl border border-navy-600/25 bg-navy-50 p-5">
          <p className="flex flex-wrap items-center gap-2 font-semibold text-navy-800">
            Your First Appeal is with the Appellate Authority
            {appeal.number ? (
              <span className="rounded bg-saffron-50 px-2 py-1 font-mono text-[12px] font-bold text-saffron-600">
                {appeal.number}
              </span>
            ) : null}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
            Filed on day {appeal.filedOnDay} on the ground &ldquo;{appeal.ground}
            &rdquo;. They have 45 days to decide. Move the clock past day{" "}
            {(appeal.filedOnDay ?? 0) + 45} to see what happens if they do not.
          </p>
        </div>
      ) : d.canFileFirstAppeal ? (
        <div className="mt-6 rounded-xl border border-govred-700/25 bg-govred-50 p-5">
          <p className="font-semibold text-govred-700">
            They missed the legal deadline. You can appeal right now, free of
            cost.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
            In law this silence is already a refusal — Section 7(2) of the RTI
            Act treats no reply within 30 days as a deemed refusal, which is
            itself a ground for appeal. You do not have to wait any longer, and
            an appeal costs nothing.
          </p>
          <Link
            href="#appeal"
            className="mt-4 inline-block rounded-lg bg-govred-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-govred-700"
          >
            File a First Appeal
          </Link>
        </div>
      ) : null}

      {/* Their reply — anchored, because every "View response" link lands here */}
      {d.hasReply && d.reply ? (
        <section
          id="response"
          className="mt-6 scroll-mt-20 rounded-xl border border-govgreen-600/30 bg-govgreen-50 p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-govgreen-700">
              Their response
            </p>
            {v.repliedOn ? (
              <p className="text-[13px] font-medium text-govgreen-700">
                Received {formatDate(v.repliedOn)}
              </p>
            ) : null}
          </div>

          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{d.reply}</p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="flex-1 rounded-lg bg-navy-800 px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-navy-700"
            >
              Download as PDF
            </button>
            <Link
              href="#appeal"
              className="flex-1 rounded-lg border border-govgreen-600/40 bg-surface px-4 py-3 text-center text-[13px] font-semibold text-govgreen-700 transition hover:bg-govgreen-50"
            >
              Not satisfied? File an appeal
            </Link>
          </div>

          <p className="mt-3 border-t border-govgreen-600/20 pt-3 text-[13px] leading-relaxed text-ink-2">
            An incomplete, misleading or partial answer is itself a ground for
            appeal — you do not have to accept it just because they replied.
          </p>
        </section>
      ) : null}

      <section id="documents" className="mt-6 scroll-mt-20 gov-card overflow-hidden">
        <div className="border-b border-line-2 px-5 py-4">
          <h2 className="text-lg font-bold tracking-tight text-navy-900">
            Case documents
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Every file connected to this RTI, kept in one place.
          </p>
        </div>
        <ul className="divide-y divide-line-2">
          <DocumentRow
            title="Original RTI request"
            detail={`Submitted ${formatDate(v.submittedOn)} · PDF`}
          />
          <DocumentRow title="Payment receipt" detail={`${c.feeLabel} · PDF`} />
          <DocumentRow
            title="Submission acknowledgement"
            detail={`${c.registrationNumber} · PDF`}
          />
          {d.hasReply && v.repliedOn ? (
            <DocumentRow
              title="Department response"
              detail={`Received ${formatDate(v.repliedOn)} · PDF`}
            />
          ) : null}
          {d.appealFiled && appeal.number ? (
            <DocumentRow
              title="First Appeal acknowledgement"
              detail={`${appeal.number} · PDF`}
            />
          ) : null}
        </ul>
      </section>

      {d.canFileFirstAppeal || (d.hasReply && !d.appealFiled) ? (
        <section id="appeal" className="mt-6 scroll-mt-20">
          <CaseAppealPanel caseId={c.id} day={day} />
        </section>
      ) : d.appealFiled ? (
        <section id="appeal" className="mt-6 scroll-mt-20 rounded-xl border border-saffron-400/40 bg-saffron-50 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-600">
            First Appeal
          </p>
          <p className="mt-1.5 font-bold text-navy-900">Appeal in progress</p>
          <p className="mt-1 text-sm text-ink-2">
            {appeal.number ? `${appeal.number} · ` : ""}Filed on day {appeal.filedOnDay}.
            It remains attached to this RTI case.
          </p>
        </section>
      ) : null}

      {/* Penalty */}
      {d.penalty.active ? (
        <div className="mt-6">
          <PenaltyMeter penalty={d.penalty} officer={c.authority.cpio} />
        </div>
      ) : null}

      {/* Split parts or timeline */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="gov-card p-5">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted">
            What has happened so far
          </p>
          <CaseTimeline events={d.events} day={day} hasReply={d.hasReply} />
        </div>

        <aside className="space-y-4">
          <div className="gov-card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Where this stands in law
            </p>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Time they get to reply</dt>
                <dd className="font-medium text-ink">
                  30 days · RTI Act s.7(1)
                </dd>
              </div>
              <div>
                <dt className="text-muted">If they miss it</dt>
                <dd className="font-medium text-ink">
                  Treated as a refusal · s.7(2)
                </dd>
              </div>
              <div>
                <dt className="text-muted">Your appeal</dt>
                <dd className="font-medium text-ink">
                  Free, within 30 days · s.19(1)
                </dd>
              </div>
              <div>
                <dt className="text-muted">Penalty on the officer</dt>
                <dd className="font-medium text-ink">
                  {formatInr(250)}/day up to {formatInr(25000)} · s.20
                </dd>
              </div>
            </dl>
          </div>

          <div className="gov-card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Official record
            </p>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Registration number</dt>
                <dd className="font-mono text-[13px] font-medium text-ink">
                  {c.registrationNumber}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Public authority</dt>
                <dd className="font-medium text-ink">{c.authority.office}</dd>
              </div>
              <div>
                <dt className="text-muted">CPIO</dt>
                <dd className="font-medium text-ink">{c.authority.cpio}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Quote this number if you call or write to the department.
            </p>
          </div>
        </aside>
      </div>

      {d.parts ? (
        <div className="mt-6">
          <SplitParts parts={d.parts} />
        </div>
      ) : null}
    </div>
  );
}

function DocumentRow({ title, detail }: { title: string; detail: string }) {
  return (
    <li className="flex items-center gap-3 px-5 py-3.5">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-sm font-bold text-navy-700"
      >
        PDF
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 truncate text-[12px] text-muted">{detail}</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg border border-line px-3 py-2 text-[12px] font-semibold text-navy-700"
      >
        Download
      </button>
    </li>
  );
}
