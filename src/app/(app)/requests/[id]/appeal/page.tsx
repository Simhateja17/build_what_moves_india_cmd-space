"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { GROUNDS_FOR_APPEAL } from "@/lib/types";
import { GroundRealityNote } from "@/components/GroundRealityNote";

export default function FirstAppealPage() {
  const { id } = useParams<{ id: string }>();
  const { getRequest } = useStore();
  const router = useRouter();
  const request = getRequest(id);

  const overdueGroundIndex = GROUNDS_FOR_APPEAL.findIndex(
    (g) => g.official === "No Response Within the Time Limit",
  );
  const [groundIndex, setGroundIndex] = useState(
    overdueGroundIndex >= 0 ? overdueGroundIndex : 0,
  );
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-lg font-bold text-slate-900">Appeal sent</p>
        <p className="mt-2 text-sm text-slate-500">
          Your First Appeal has been filed against{" "}
          <span className="font-medium">{request.registrationNumber}</span>.
          No fee is required for a First Appeal, per the RTI Act.
        </p>
        <Link
          href={`/requests/${request.id}`}
          className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Back to this request
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/requests/${request.id}`}
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        ← Back to this request
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">File a First Appeal</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pre-filled from your original request — you don&apos;t need to look
        anything up.
      </p>

      <div className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Original request
          </p>
          <p className="font-medium text-slate-900">
            {request.plainTitle}
          </p>
          <p className="text-xs text-slate-400">
            {request.registrationNumber} · {request.filedDayLabel}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            What went wrong?
          </label>
          <select
            value={groundIndex}
            onChange={(e) => setGroundIndex(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {GROUNDS_FOR_APPEAL.map((g, i) => (
              <option key={g.official} value={i}>
                {g.plain}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
            Official ground: {GROUNDS_FOR_APPEAL[groundIndex].official}
          </p>
          <GroundRealityNote>
            This goes to the department&apos;s Appellate Authority, a more
            senior officer than the one who missed your original request.
          </GroundRealityNote>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Anything else to add? (optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <GroundRealityNote>
          No fee applies to a First Appeal, per the RTI Act, 2005 — if this
          also goes unanswered for 45 days, you get the right to a Second
          Appeal to the Central Information Commission.
        </GroundRealityNote>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-500"
          >
            Submit First Appeal
          </button>
        </div>
      </div>
    </div>
  );
}
