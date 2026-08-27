"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { deriveCase, formatInr } from "@/lib/derive";
import { GROUNDS_FOR_APPEAL } from "@/lib/types";
import { GroundRealityNote } from "@/components/GroundRealityNote";

export default function FirstAppealPage() {
  const { id } = useParams<{ id: string }>();
  const { getCase, dayOf, appealOf, fileAppeal } = useStore();
  const router = useRouter();

  const c = getCase(id);
  const [groundIndex, setGroundIndex] = useState(0);
  const [extra, setExtra] = useState("");

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
  const d = deriveCase(c, day, appealOf(c.id));
  const ground = GROUNDS_FOR_APPEAL[groundIndex];

  function submit() {
    fileAppeal(c!.id, ground.official, day);
    router.push(`/requests/${c!.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link
        href={`/requests/${c.id}`}
        className="text-sm font-medium text-navy-700 hover:underline"
      >
        ← Back to this request
      </Link>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900">
        File a First Appeal
      </h1>
      <p className="mt-2 text-ink-2">
        This goes to a senior officer inside the same department — the Appellate
        Authority. It is free, and everything below is already filled in from
        your original request.
      </p>

      {/* Pre-filled context — no registration numbers to look up */}
      <div className="mt-6 gov-card p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Appealing against
        </p>
        <p className="mt-1.5 font-semibold text-ink">{c.plainTitle}</p>
        <p className="mt-1 text-sm text-ink-2">
          {c.authority.office} · filed {day} days ago
        </p>
        <p className="mt-1 font-mono text-[12px] text-muted">
          {c.registrationNumber}
        </p>
        {d.penalty.active ? (
          <p className="mt-3 rounded-md bg-govred-50 px-3 py-2 text-sm text-govred-700">
            {d.daysLate} days overdue · {formatInr(d.penalty.accruedInr)}{" "}
            penalty accrued against {c.authority.cpio}
          </p>
        ) : null}
        <GroundRealityNote>
          The current portal makes you type this registration number and your
          email from memory, then solve a CAPTCHA, before it will even show you
          the appeal form.
        </GroundRealityNote>
      </div>

      {/* Ground for appeal — plain language leads, official term follows */}
      <div className="mt-5 gov-card p-5">
        <p className="field-label">What went wrong?</p>
        <p className="mt-1 text-sm text-muted">
          Pick the closest one. We send the official wording to the department.
        </p>

        <div className="mt-4 space-y-2.5">
          {GROUNDS_FOR_APPEAL.map((g, i) => {
            const selected = i === groundIndex;
            const recommended =
              d.isOverdue && g.official === "No Response Within the Time Limit";
            return (
              <label
                key={g.official}
                className={`flex cursor-pointer gap-3 rounded-lg border p-3.5 transition ${
                  selected
                    ? "border-navy-600 bg-navy-50"
                    : "border-line bg-white hover:border-navy-600/40"
                }`}
              >
                <input
                  type="radio"
                  name="ground"
                  checked={selected}
                  onChange={() => setGroundIndex(i)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-ink">
                    {g.plain}
                    {recommended ? (
                      <span className="ml-2 rounded bg-govred-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-govred-700">
                        Applies to you
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-[11px] uppercase tracking-wider text-muted">
                    {g.official}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-5 gov-card p-5">
        <label htmlFor="extra" className="field-label">
          Anything you want to add? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="extra"
          rows={4}
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="You do not need to write anything here. Your original request and their silence are the whole case."
          className="field-input"
        />
        <GroundRealityNote>
          Your appeal reaches the Appellate Authority through the same Nodal
          Officer. They have 45 days to decide — after that you can go to the
          Central Information Commission, which is the body that can impose the
          Section 20 penalty.
        </GroundRealityNote>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-5">
        <p className="text-sm text-ink-2">
          <strong className="text-ink">No fee.</strong> A First Appeal is free
          under the RTI Act.
        </p>
        <button
          type="button"
          onClick={submit}
          className="rounded-lg bg-navy-800 px-6 py-3 font-semibold text-white transition hover:bg-navy-700"
        >
          Send my appeal
        </button>
      </div>
    </div>
  );
}
