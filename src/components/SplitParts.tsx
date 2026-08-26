"use client";

import { useState } from "react";
import { DerivedPart, formatInr } from "@/lib/derive";
import { PENALTY_PER_DAY_INR } from "@/lib/types";
import { StatusPill } from "./StatusPill";

export function SplitParts({ parts }: { parts: DerivedPart[] }) {
  const [openId, setOpenId] = useState<string | null>(parts[0]?.id ?? null);

  const answered = parts.filter((p) => p.status === "replied").length;
  const late = parts.filter((p) => p.isOverdue).length;

  return (
    <section className="gov-card overflow-hidden">
      <div className="border-b border-line bg-canvas px-5 py-4">
        <p className="font-semibold text-ink">
          One question, {parts.length} offices, {parts.length} separate clocks
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          The portal splits a request like this into {parts.length} registration
          numbers and then leaves you to track each one yourself. Here they stay
          together.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span className="text-govgreen-700">
            <strong>{answered}</strong> answered
          </span>
          <span className="text-navy-800">
            <strong>{parts.length - answered - late}</strong> still in time
          </span>
          <span className="text-govred-700">
            <strong>{late}</strong> overdue
          </span>
        </div>
      </div>

      <ul className="divide-y divide-line-2">
        {parts.map((part) => {
          const open = openId === part.id;
          return (
            <li key={part.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : part.id)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-canvas"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{part.office}</p>
                  <p className="mt-0.5 truncate text-[11px] uppercase tracking-wider text-muted">
                    {part.registrationNumber}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusPill status={part.status} size="sm" />
                  <span aria-hidden className="text-muted">
                    {open ? "−" : "+"}
                  </span>
                </div>
              </button>

              {open ? (
                <div className="border-t border-line-2 bg-canvas px-5 py-4">
                  {part.status === "replied" ? (
                    <>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-govgreen-700">
                        Their reply
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">
                        {part.reply}
                      </p>
                    </>
                  ) : part.isOverdue ? (
                    <>
                      <p className="text-sm text-govred-700">
                        {part.daysLate} days past the deadline with no reply —{" "}
                        <strong>
                          {formatInr(part.daysLate * PENALTY_PER_DAY_INR)}
                        </strong>{" "}
                        of penalty has accrued against this office alone.
                      </p>
                      <p className="mt-2 text-sm text-ink-2">
                        You can appeal this part on its own, using{" "}
                        <span className="font-medium">
                          {part.registrationNumber}
                        </span>{" "}
                        — not your original number. The current portal expects
                        you to know that.
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-ink-2">
                      No reply yet from this office. Still inside its 30-day
                      window.
                    </p>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
