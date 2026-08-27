"use client";

import { fillPlaces } from "@/lib/assistant/authorities";
import { AuthorityMatch } from "@/lib/assistant/types";
import { GovLevelBadge } from "./GovLevelBadge";

/**
 * One office, and the reasoning behind it.
 *
 * The third "why" line is the one that earns its place: it names the
 * department a citizen would plausibly have picked instead, and says
 * why that one is wrong. Two lines explain a match; the third teaches
 * the citizen something they can use next time.
 */
export function AuthorityCard({
  authority,
  place,
  assumedLabel,
  onChangeAssumption,
}: {
  authority: AuthorityMatch;
  place: { city: string; state: string };
  assumedLabel?: string;
  onChangeAssumption?: () => void;
}) {
  return (
    <div className="gov-card p-5">
      <GovLevelBadge level={authority.level} />
      <h2 className="mt-3 text-lg font-bold leading-tight text-ink">
        {fillPlaces(authority.name, place)}
      </h2>
      <p className="mt-1 text-sm text-ink-2">
        {fillPlaces(authority.wing, place)}
      </p>
      <p className="mt-2 text-[13px] text-muted">
        Address it to the{" "}
        <span className="font-semibold text-ink-2">{authority.pioTitle}</span>
      </p>

      {assumedLabel ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-saffron-400/40 bg-saffron-50 px-3 py-2 text-[13px] text-saffron-600">
          <span>We assumed: {assumedLabel.toLowerCase()}.</span>
          {onChangeAssumption ? (
            <button
              type="button"
              onClick={onChangeAssumption}
              className="font-semibold underline underline-offset-2"
            >
              Change
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 space-y-2.5 border-t border-line-2 pt-4">
        <WhyLine tone="yes" lead="They do the work." text={authority.why.work} />
        <WhyLine tone="yes" lead="They hold the papers." text={authority.why.records} />
        <WhyLine tone="no" lead="" text={authority.why.notThem} />
      </div>
    </div>
  );
}

function WhyLine({
  tone,
  lead,
  text,
}: {
  tone: "yes" | "no";
  lead: string;
  text: string;
}) {
  return (
    <p className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
      <span
        aria-hidden
        className={`shrink-0 font-bold ${
          tone === "yes" ? "text-govgreen-600" : "text-muted"
        }`}
      >
        {tone === "yes" ? "✓" : "✕"}
      </span>
      <span>
        {lead ? <span className="font-semibold text-ink">{lead} </span> : null}
        {text}
      </span>
    </p>
  );
}

export function AlternativeAuthorities({
  alternatives,
  place,
  onPick,
}: {
  alternatives: AuthorityMatch[];
  place: { city: string; state: string };
  onPick: (id: string) => void;
}) {
  if (alternatives.length === 0) return null;
  return (
    <div className="gov-card p-5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
        If that is not it
      </p>
      <div className="mt-3 space-y-3">
        {alternatives.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onPick(a.id)}
            className="block w-full rounded-lg border border-line px-3.5 py-3 text-left transition hover:border-navy-600/40"
          >
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink">
                {fillPlaces(a.shortName, place)}
              </span>
              <GovLevelBadge level={a.level} />
            </span>
            {a.condition ? (
              <span className="mt-1 block text-[13px] text-muted">
                {a.condition}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
