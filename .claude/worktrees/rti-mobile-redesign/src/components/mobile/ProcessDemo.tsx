"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STAGES, Stage, dayAt, penaltyAt } from "@/lib/journey";
import { REPLY_DEADLINE_DAYS } from "@/lib/types";
import { RtiMark } from "./Logo";

/* ------------------------------------------------------------------
   The walkthrough.

   The whole life of an RTI, played out: what happens, who is holding
   it, how many days have gone, and what the citizen does at each step
   — including the many steps where the answer is "nothing".

   It plays on its own, because a citizen who has never filed will not
   know to press anything. It can be paused, stepped, and jumped
   around. Under prefers-reduced-motion it does not auto-play at all
   and every transition is instant; the content is identical, so
   nothing is only available to people who can watch it move.
------------------------------------------------------------------- */

const DWELL_MS = 5200;

const BRANCH_STYLE: Record<
  Stage["branch"],
  { dot: string; rail: string; tint: string; label: string }
> = {
  main: {
    dot: "bg-navy-700",
    rail: "bg-navy-600",
    tint: "m-card--stripe",
    label: "How it normally goes",
  },
  good: {
    dot: "bg-govgreen-600",
    rail: "bg-govgreen-600",
    tint: "m-card--done",
    label: "If they answer",
  },
  bad: {
    dot: "bg-govred-600",
    rail: "bg-saffron-400",
    tint: "m-card--late",
    label: "If they stay silent",
  },
};

export function ProcessDemo() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Auto-advance. The last step simply schedules nothing, so it comes
  // to rest at the end rather than looping forever in the corner of
  // somebody's dashboard — no state change needed to stop it.
  useEffect(() => {
    if (!open || !playing || i >= STAGES.length - 1) return;
    timer.current = setTimeout(() => setI((n) => n + 1), DWELL_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open, playing, i]);

  // Keep the active step in view as it advances.
  useEffect(() => {
    if (!open) return;
    rowRefs.current[i]?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [i, open, reduced]);

  const start = useCallback(() => {
    setOpen(true);
    setI(0);
    setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const stage = STAGES[i];
  const day = dayAt(i);
  const penalty = penaltyAt(day);
  const style = BRANCH_STYLE[stage.branch];
  const atEnd = i === STAGES.length - 1;

  /* ---- Closed: the invitation --------------------------------- */
  if (!open) {
    return (
      <section className="m-card m-card--stripe">
        <div className="flex items-start gap-3.5">
          <RtiMark className="h-12 w-[23px] shrink-0 text-navy-700" />
          <div className="min-w-0 flex-1">
            <h2 className="m-h3">What happens after you file</h2>
            <p className="m-small mt-1">
              The whole journey — the ₹10, the 30 days, the silence, the free
              appeal, the penalty — in twelve steps. Two minutes.
            </p>
          </div>
        </div>
        <button type="button" onClick={start} className="m-btn mt-3.5">
          Watch how an RTI works
        </button>
      </section>
    );
  }

  /* ---- Open: the walkthrough ---------------------------------- */
  return (
    <section className="m-card" aria-label="How an RTI works">
      {/* Clock and money, always on screen — they are the two things
          the process is actually about. */}
      <div className="flex items-stretch gap-3">
        <div className="flex-1">
          <p className="m-eyebrow">Day</p>
          <p className="m-mono text-[30px] font-bold leading-none text-navy-900">
            {day}
          </p>
          <div className="m-meter mt-2">
            <i
              className={day > REPLY_DEADLINE_DAYS ? "is-late" : undefined}
              style={{
                width: `${Math.min(100, (day / REPLY_DEADLINE_DAYS) * 100)}%`,
                transition: reduced ? "none" : undefined,
              }}
            />
          </div>
          <p className="m-fine mt-1">
            {day > REPLY_DEADLINE_DAYS
              ? `${day - REPLY_DEADLINE_DAYS} days late`
              : `of ${REPLY_DEADLINE_DAYS} allowed`}
          </p>
        </div>

        <div className="w-px bg-line" aria-hidden />

        <div className="flex-1">
          <p className="m-eyebrow">Penalty</p>
          <p
            className={`m-mono text-[30px] font-bold leading-none ${
              penalty > 0 ? "text-govred-700" : "text-muted"
            }`}
          >
            ₹{penalty.toLocaleString("en-IN")}
          </p>
          <p className="m-fine mt-2">
            {penalty > 0
              ? "owed by the officer, not the department"
              : "nothing owed while they are on time"}
          </p>
        </div>
      </div>

      {/* The rail: twelve steps, tappable, current one marked. */}
      <ol
        className="-mx-4 mt-4 flex gap-1.5 overflow-x-auto px-4 pb-1"
        aria-label="Steps"
      >
        {STAGES.map((s, k) => (
          <li
            key={s.id}
            ref={(el) => {
              rowRefs.current[k] = el;
            }}
            className="shrink-0"
          >
            <button
              type="button"
              onClick={() => {
                setI(k);
                setPlaying(false);
              }}
              aria-current={k === i ? "step" : undefined}
              aria-label={`Step ${k + 1}: ${s.title}`}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all ${
                  k === i
                    ? `h-3.5 w-3.5 ${BRANCH_STYLE[s.branch].dot}`
                    : k < i
                      ? `h-2 w-2 ${BRANCH_STYLE[s.branch].rail} opacity-70`
                      : "h-2 w-2 bg-line"
                }`}
              />
            </button>
          </li>
        ))}
      </ol>

      {/* The step itself. Keyed so it re-enters on each change. */}
      <div
        key={stage.id}
        className={`m-card ${style.tint} ${reduced ? "" : "animate-rise"} mt-1`}
        aria-live="polite"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="m-eyebrow">{style.label}</p>
          <p className="m-fine shrink-0">
            Step {i + 1} of {STAGES.length}
          </p>
        </div>

        <h3 className="m-h2 mt-1.5 leading-snug">{stage.title}</h3>
        <p className="m-small mt-2">{stage.body}</p>

        <dl className="mt-3.5 flex flex-col gap-2.5 border-t border-line-2 pt-3.5">
          <div className="flex gap-3">
            <dt className="m-eyebrow w-[88px] shrink-0 pt-0.5">Who has it</dt>
            <dd className="m-small flex-1 font-semibold text-ink">{stage.who}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="m-eyebrow w-[88px] shrink-0 pt-0.5">You do</dt>
            <dd className="m-small flex-1 font-semibold text-ink">{stage.youDo}</dd>
          </div>
          {stage.money && (
            <div className="flex gap-3">
              <dt className="m-eyebrow w-[88px] shrink-0 pt-0.5">Money</dt>
              <dd className="m-small flex-1 font-semibold text-ink">
                {stage.money}
              </dd>
            </div>
          )}
          <div className="flex gap-3">
            <dt className="m-eyebrow w-[88px] shrink-0 pt-0.5">Called</dt>
            <dd className="flex-1">
              {/* The portal's own vocabulary, kept but demoted — it is
                  what a citizen will see on the real site. */}
              <span className="m-fine block font-semibold">{stage.official}</span>
              {stage.section && (
                <span className="m-fine block">{stage.section}</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Controls. Big enough to hit, and the primary is the one a
          first-time viewer wants: keep going. */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setI((n) => Math.max(0, n - 1));
          }}
          disabled={i === 0}
          className="m-btn m-btn--ghost min-h-[48px] w-auto flex-1 text-[15px] disabled:opacity-40"
        >
          Back
        </button>

        {atEnd ? (
          <button
            type="button"
            onClick={() => {
              setI(0);
              setPlaying(!reduced);
            }}
            className="m-btn min-h-[48px] flex-1 text-[15px]"
          >
            Watch again
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (playing) {
                setPlaying(false);
                return;
              }
              setI((n) => Math.min(STAGES.length - 1, n + 1));
            }}
            className="m-btn min-h-[48px] flex-1 text-[15px]"
          >
            {playing ? "Pause" : "Next"}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setPlaying(false);
        }}
        className="m-tap mt-1 w-full justify-center text-[15px] font-semibold text-navy-800 underline"
      >
        Close
      </button>
    </section>
  );
}
