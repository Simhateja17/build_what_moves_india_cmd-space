"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";

export default function DashboardPage() {
  const { requests } = useStore();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Your RTI requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Plain language first — official terms always follow underneath.
          </p>
        </div>
        <Link
          href="/file-request"
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          File a new request
        </Link>
      </div>

      <ul className="space-y-3">
        {requests.map((req) => (
          <li key={req.id}>
            <Link
              href={`/requests/${req.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">
                  {req.plainTitle}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {req.registrationNumber} · {req.authority.ministry}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {req.filedDayLabel}
                  {req.parts ? ` · split into ${req.parts.length} parts` : ""}
                </p>
              </div>
              <StatusBadge status={req.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
