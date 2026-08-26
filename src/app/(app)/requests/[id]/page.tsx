"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { deriveCase, formatInr } from "@/lib/derive";
import { REPLY_DEADLINE_DAYS } from "@/lib/types";
import { StatusPill } from "@/components/StatusPill";
import { CaseTimeline } from "@/components/CaseTimeline";
import { PenaltyMeter } from "@/components/PenaltyMeter";
import { SplitParts } from "@/components/SplitParts";
import { TimeMachine } from "@/components/TimeMachine";

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getCase, dayOf, setDay, appealOf } = useStore();

  const c = getCase(id);
  if (!c) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="font-semibold text-ink">We could not find that request.</p>
        <Link
          href="/dashboard"
          className="mt-3 inline-block font-medium text-navy-700 hover:underline"
        >
          Back to your requests
        </Link>
      </div>
    );
  }

  const day = dayOf(c.id);
  const appeal = appealOf(c.id);
  const d = deriveCase(c, day, appeal);

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
        href="/dashboard"
        className="text-sm font-medium text-navy-700 hover:underline"
      >
        ← Your requests
      </Link>

      {/* Case header */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-snug tracking-tight text-navy-900">
            {c.plainTitle}
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            {c.authority.office} · {c.authority.ministry}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">
            {c.registrationNumber} · {c.feeLabel} · answerable by {c.authority.cpio}
          </p>
        </div>
        <StatusPill status={d.status} />
      </div>

      <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink-2">
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
          <p className="font-semibold text-navy-800">
            Your First Appeal is with the Appellate Authority
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
            href={`/requests/${c.id}/appeal`}
            className="mt-4 inline-block rounded-lg bg-govred-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-govred-700"
          >
            File a First Appeal
          </Link>
        </div>
      ) : null}

      {/* Their reply */}
      {d.hasReply && d.reply ? (
        <div className="mt-6 rounded-xl border border-govgreen-600/30 bg-govgreen-50 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-govgreen-700">
            Their reply · day {c.replyDay}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{d.reply}</p>
          <p className="mt-3 border-t border-govgreen-600/20 pt-3 text-sm text-ink-2">
            Not satisfied with this answer? An incomplete or misleading reply is
            itself a ground for appeal.{" "}
            <Link
              href={`/requests/${c.id}/appeal`}
              className="font-medium text-navy-700 hover:underline"
            >
              File a First Appeal
            </Link>
          </p>
        </div>
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
