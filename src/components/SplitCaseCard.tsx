"use client";

import { useState } from "react";
import { RtiRequestPart } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function SplitCaseCard({ parts }: { parts: RtiRequestPart[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <p className="font-medium text-slate-900">
          Your request covered {parts.length} different offices, so it was
          split into {parts.length} parts
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Each part has its own official registration number and clock — here
          they're tracked together, in one place, instead of leaving you to
          juggle {parts.length} separate numbers.
        </p>
      </div>
      <ul className="divide-y divide-slate-100">
        {parts.map((part) => {
          const open = openId === part.id;
          return (
            <li key={part.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : part.id)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{part.plainLabel}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {part.registrationNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={part.status} />
                  <span className="text-slate-400">{open ? "−" : "+"}</span>
                </div>
              </button>
              {open ? (
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {part.reply
                    ? part.reply
                    : "No reply yet from this office for this part of your request."}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
