"use client";

import { REPLY_DEADLINE_DAYS } from "@/lib/types";

interface Marker {
  day: number;
  label: string;
}

export function TimeMachine({
  day,
  maxDay,
  onChange,
  markers,
}: {
  day: number;
  maxDay: number;
  onChange: (day: number) => void;
  markers: Marker[];
}) {
  const pct = (d: number) => Math.min(100, (d / maxDay) * 100);

  return (
    <section
      aria-label="Demo time machine"
      className="rounded-xl border border-navy-600/20 bg-navy-800 p-4 text-white shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-saffron-400">
            Demo control · time machine
          </p>
          <p className="mt-0.5 text-sm text-white/70">
            Drag to move this request through time and watch the law take
            effect.
          </p>
        </div>
        <p className="text-2xl font-bold tabular-nums">
          Day {day}
          <span className="ml-1 text-sm font-normal text-white/50">
            since you filed
          </span>
        </p>
      </div>

      <div className="relative mt-5 pt-1">
        {/* Deadline marker sits under the track so the thumb reads over it */}
        <div
          className="pointer-events-none absolute -top-0.5 bottom-6 w-px bg-saffron-400/70"
          style={{ left: `${pct(REPLY_DEADLINE_DAYS)}%` }}
          aria-hidden
        />
        <input
          type="range"
          min={0}
          max={maxDay}
          value={day}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`Day ${day} of ${maxDay}`}
          className="w-full accent-saffron-400"
        />
        <div className="mt-1 flex justify-between text-[11px] text-white/45">
          <span>Day 0 — filed</span>
          <span>Day {maxDay}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {markers.map((m) => (
          <button
            key={m.day}
            type="button"
            onClick={() => onChange(m.day)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              day === m.day
                ? "bg-saffron-400 text-navy-900"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </section>
  );
}
