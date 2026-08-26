"use client";

import { useEffect, useState } from "react";
import { PenaltyState } from "@/lib/types";

export function PenaltyMeter({ penalty }: { penalty: PenaltyState }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
    const target = penalty.accruedInr;
    const steps = 24;
    const stepAmount = target / steps;
    let current = 0;
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      current = Math.min(target, Math.round(stepAmount * step));
      setDisplay(current);
      if (step >= steps) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [penalty.accruedInr]);

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-red-800">
            Penalty accruing against the department
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-red-700">
            ₹{display.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-red-600">
            ₹{penalty.ratePerDayInr}/day · {penalty.daysOverdue} day
            {penalty.daysOverdue === 1 ? "" : "s"} overdue · capped at ₹
            {penalty.capInr.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
      <p className="mt-3 border-t border-red-200 pt-2 text-xs text-red-700">
        Per the RTI Act, 2005, Section 20 — a Public Information Officer who
        fails to respond within the time limit without reasonable cause is
        liable to a penalty of up to ₹250 per day, capped at ₹25,000. This is
        a real, existing right — most citizens are never shown it.
      </p>
    </div>
  );
}
