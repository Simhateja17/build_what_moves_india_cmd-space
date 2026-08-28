"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RootBar } from "@/components/mobile/AppBar";
import { CardSkeleton } from "@/components/mobile/Primitives";
import {
  StatusCard,
  URGENCY_RANK,
  Urgency,
  urgencyOf,
} from "@/components/mobile/StatusCard";
import { ProcessDemo } from "@/components/mobile/ProcessDemo";
import { useStore } from "@/lib/store";
import { deriveCase } from "@/lib/derive";

/* ------------------------------------------------------------------
   My RTIs.

   Sorted by urgency, never by date. What needs the citizen comes first,
   then what is late, then what is waiting, then what is finished. The
   filter chips reorder within that; they do not change the rule.
------------------------------------------------------------------- */

const FILTERS: Array<{ key: Urgency | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "late", label: "They are late" },
  { key: "waiting", label: "Waiting" },
  { key: "done", label: "Replied" },
];

export default function MyRtisPage() {
  const { cases, dayOf, appealOf, ready } = useStore();
  const [filter, setFilter] = useState<Urgency | "all">("all");

  const rows = useMemo(() => {
    return cases
      .map((c) => {
        const d = deriveCase(c, dayOf(c.id), appealOf(c.id));
        return { c, d, urgency: urgencyOf(d) };
      })
      .sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]);
  }, [cases, dayOf, appealOf]);

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.urgency] = (acc[r.urgency] ?? 0) + 1;
    return acc;
  }, {});

  const shown = filter === "all" ? rows : rows.filter((r) => r.urgency === filter);

  return (
    <>
      <RootBar title="My RTIs" />

      {/* Clears both the tab bar and the action bar stacked above it. */}
      <div
        className="m-col pt-4"
        style={{
          paddingBottom:
            "calc(var(--tabbar-h) + var(--control-h) + 2.5rem)",
        }}
      >
        {!ready ? (
          <div className="flex flex-col gap-3" aria-busy>
            <div className="m-skel h-10 w-full rounded-full" />
            <CardSkeleton />
            <CardSkeleton />
            <p className="m-fine mt-1 text-center">Loading your RTIs…</p>
          </div>
        ) : rows.length === 0 ? (
          <>
            <div className="py-8 text-center">
              <h2 className="m-h2">No RTIs yet</h2>
              <p className="m-body mt-2">
                When you file one it will appear here, with the days counted for
                you.
              </p>
            </div>
            {/* With nothing to show, the walkthrough is the page. */}
            <ProcessDemo />
          </>
        ) : (
          <>
            <div
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1"
              role="group"
              aria-label="Filter your RTIs"
            >
              {FILTERS.map((f) => {
                const n = f.key === "all" ? rows.length : (counts[f.key] ?? 0);
                if (f.key !== "all" && n === 0) return null;
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={filter === f.key}
                    onClick={() => setFilter(f.key)}
                    className="m-chip shrink-0"
                  >
                    {f.label} · {n}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {shown.map(({ c, d }) => (
                <StatusCard key={c.id} c={c} d={d} />
              ))}
            </div>

            {/* Below the citizen's own RTIs, never above them: someone
                with a live case came here for that case. */}
            <div className="mt-6">
              <ProcessDemo />
            </div>
          </>
        )}
      </div>

      {/* Pinned above the tab bar, so filing is always one tap away. */}
      <div className="m-actionbar" style={{ bottom: "var(--tabbar-h)" }}>
        <div className="mx-auto w-full max-w-[520px]">
          <Link href="/file-request" className="m-btn">
            Start a new RTI
          </Link>
        </div>
      </div>
    </>
  );
}
