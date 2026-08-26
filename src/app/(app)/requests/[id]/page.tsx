"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusTimeline } from "@/components/StatusTimeline";
import { PenaltyMeter } from "@/components/PenaltyMeter";
import { SplitCaseCard } from "@/components/SplitCaseCard";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getRequest } = useStore();
  const request = getRequest(id);

  if (!request) {
    return (
      <div>
        <p className="text-slate-600">We couldn&apos;t find that request.</p>
        <Link href="/dashboard" className="text-indigo-600 underline">
          Back to your requests
        </Link>
      </div>
    );
  }

  const overdue = request.daysElapsed > request.deadlineDays;

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
        ← Your requests
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{request.plainTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">{request.officialSummary}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
            {request.registrationNumber} · {request.authority.ministry} ·{" "}
            {request.authority.department}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {overdue && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="font-medium text-amber-900">
            You&apos;re now entitled to file a First Appeal.
          </p>
          <p className="mt-1 text-sm text-amber-800">
            They missed the 30-day legal deadline — under the RTI Act, 2005,
            that&apos;s treated as a refusal, and you can escalate right now.
          </p>
          <Link
            href={`/requests/${request.id}/appeal`}
            className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
          >
            File a First Appeal
          </Link>
        </div>
      )}

      {request.penalty?.active && (
        <div className="mt-6">
          <PenaltyMeter penalty={request.penalty} />
        </div>
      )}

      <div className="mt-8">
        {request.parts ? (
          <SplitCaseCard parts={request.parts} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <StatusTimeline
              history={request.history}
              daysElapsed={request.daysElapsed}
              deadlineDays={request.deadlineDays}
            />
          </div>
        )}
      </div>
    </div>
  );
}
