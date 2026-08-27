"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { GROUNDS_FOR_APPEAL } from "@/lib/types";

export function CaseAppealPanel({ caseId, day }: { caseId: string; day: number }) {
  const { fileAppeal } = useStore();
  const [groundIndex, setGroundIndex] = useState(0);
  const [extra, setExtra] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function submit() {
    const ground = GROUNDS_FOR_APPEAL[groundIndex].official;
    fileAppeal(caseId, extra.trim() ? `${ground}: ${extra.trim()}` : ground, day);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="rounded-xl border border-govgreen-600/30 bg-govgreen-50 p-5">
        <p className="font-bold text-govgreen-700">First Appeal submitted</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          It is now part of this RTI case. Its status and decision deadline will
          appear in the timeline above.
        </p>
      </div>
    );
  }

  return (
    <div className="gov-card overflow-hidden">
      <div className="border-b border-line-2 p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-govred-700">
          First Appeal
        </p>
        <h2 className="mt-1.5 text-xl font-bold text-navy-900">
          What went wrong?
        </h2>
        <p className="mt-1 text-sm text-ink-2">
          Your RTI details and authority are already attached to this appeal.
        </p>
      </div>

      <div className="space-y-2.5 p-5">
        {GROUNDS_FOR_APPEAL.map((ground, index) => (
          <label
            key={ground.official}
            className={`flex cursor-pointer gap-3 rounded-xl border p-3.5 transition ${
              groundIndex === index
                ? "border-navy-600 bg-navy-50"
                : "border-line hover:border-navy-600/40"
            }`}
          >
            <input
              type="radio"
              name="appeal-ground"
              checked={groundIndex === index}
              onChange={() => setGroundIndex(index)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-semibold text-ink">
                {ground.plain}
              </span>
              <span className="mt-0.5 block text-[11px] uppercase tracking-wider text-muted">
                {ground.official}
              </span>
            </span>
          </label>
        ))}

        <label className="block pt-2 text-sm font-semibold text-ink">
          Anything to add? <span className="font-normal text-muted">(optional)</span>
          <textarea
            rows={3}
            value={extra}
            onChange={(event) => setExtra(event.target.value)}
            className="field-input font-normal"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-line-2 bg-canvas/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-2">
          <strong className="text-ink">No fee.</strong> A First Appeal is free.
        </p>
        <button
          type="button"
          onClick={submit}
          className="rounded-lg bg-navy-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-700"
        >
          Review and submit appeal
        </button>
      </div>
    </div>
  );
}
