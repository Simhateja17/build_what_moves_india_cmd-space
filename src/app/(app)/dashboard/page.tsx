"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { deriveCase, formatInr } from "@/lib/derive";
import { StatusPill } from "@/components/StatusPill";

export default function DashboardPage() {
  const { cases, dayOf, appealOf, citizenName } = useStore();

  const derived = cases.map((c) => ({
    c,
    d: deriveCase(c, dayOf(c.id), appealOf(c.id)),
  }));

  const needAction = derived.filter(
    ({ d }) => d.canFileFirstAppeal || d.canFileSecondAppeal,
  ).length;
  const totalPenalty = derived.reduce((sum, { d }) => sum + d.penalty.accruedInr, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">
            Namaste, {citizenName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-ink-2">
            {cases.length} request{cases.length === 1 ? "" : "s"} filed ·{" "}
            {needAction > 0 ? (
              <span className="font-semibold text-govred-700">
                {needAction} need{needAction === 1 ? "s" : ""} your attention
              </span>
            ) : (
              <span>nothing needs your attention</span>
            )}
          </p>
        </div>
        <Link
          href="/file-request"
          className="rounded-lg bg-navy-800 px-5 py-3 font-semibold text-white transition hover:bg-navy-700"
        >
          File a new request
        </Link>
      </div>

      {/* Summary strip — the accountability number a citizen never normally sees */}
      {totalPenalty > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-govred-700/20 bg-govred-50 px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-govred-700/80">
              Owed by officers for keeping you waiting
            </p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums text-govred-700">
              {formatInr(totalPenalty)}
            </p>
          </div>
          <p className="max-w-md text-sm text-govred-700">
            Accrued under Section 20 of the RTI Act, 2005 across your overdue
            requests.
          </p>
        </div>
      ) : null}

      <ul className="mt-6 space-y-3">
        {derived.map(({ c, d }) => (
          <li key={c.id}>
            <Link
              href={`/requests/${c.id}`}
              className="block gov-card p-5 transition hover:border-navy-600/40 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-snug text-ink">
                    {c.plainTitle}
                  </p>
                  <p className="mt-1 text-sm text-ink-2">
                    {c.authority.office} · {c.authority.ministry}
                  </p>
                  <p className="mt-1.5 text-[11px] uppercase tracking-wider text-muted">
                    {c.registrationNumber} · day {d.day} · {c.feeLabel}
                  </p>
                </div>
                <StatusPill status={d.status} />
              </div>

              {/* The one line that tells them what to do about it */}
              {d.canFileSecondAppeal ? (
                <p className="mt-3 border-t border-line-2 pt-3 text-sm font-medium text-saffron-600">
                  Your appeal was ignored too — you can now go to the Central
                  Information Commission →
                </p>
              ) : d.canFileFirstAppeal ? (
                <p className="mt-3 border-t border-line-2 pt-3 text-sm font-medium text-govred-700">
                  They are {d.daysLate} days late ·{" "}
                  {formatInr(d.penalty.accruedInr)} penalty accruing · you can
                  appeal free of cost →
                </p>
              ) : d.parts ? (
                <p className="mt-3 border-t border-line-2 pt-3 text-sm text-ink-2">
                  Split across {d.parts.length} offices ·{" "}
                  {d.parts.filter((p) => p.status === "replied").length}{" "}
                  answered,{" "}
                  {d.parts.filter((p) => p.isOverdue).length} overdue →
                </p>
              ) : d.hasReply ? (
                <p className="mt-3 border-t border-line-2 pt-3 text-sm text-govgreen-700">
                  Answered on day {c.replyDay} — read their reply →
                </p>
              ) : (
                <p className="mt-3 border-t border-line-2 pt-3 text-sm text-ink-2">
                  {d.daysLeft} days left before they are legally required to
                  reply →
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
