"use client";

import { useState } from "react";
import { buildContext, fillTokens } from "@/lib/assistant/draft";
import { AuthorityResult } from "@/lib/assistant/match";
import { Assistant } from "@/lib/assistant/state";
import { TOPIC_BY_ID } from "@/lib/assistant/topics";
import { AskVsAskCard } from "./AskVsAskCard";
import { AssistantShell } from "./AssistantShell";
import { BottomSheet } from "./BottomSheet";
import { ClarifierCard } from "./ClarifierCard";
import { JurisdictionBanner, JurisdictionNotice } from "./JurisdictionNotice";
import { fillPlaces } from "@/lib/assistant/authorities";

/**
 * The teaching screen. It converts a grievance into a numbered list of
 * records the office already holds — which is the difference between a
 * request that has to be answered and one that can be refused.
 *
 * The "if nothing was sanctioned" ask is ticked by default on every
 * works-and-money topic. It is what turns a nil reply into evidence
 * instead of a dead end.
 */
export function AsksStep({
  assistant,
  result,
}: {
  assistant: Assistant;
  result: AuthorityResult;
}) {
  const { state, dispatch, goNext, goBack } = assistant;
  const [sheet, setSheet] = useState<"difference" | "why" | null>(null);
  const [custom, setCustom] = useState("");

  const topic = state.topicId ? TOPIC_BY_ID[state.topicId] : undefined;
  const ctx = buildContext(state);
  const chosen = state.selectedAskIds.length + state.customAsks.length;
  const place = { city: state.city, state: state.stateName };

  // Only the questions that still matter: a clarifier whose token does
  // not appear in a single ticked ask is not worth a citizen's time.
  // The reference number is the exception — it goes into the opening
  // line of the request rather than into any one point, and it is the
  // detail that stops an office replying that it could not trace the
  // matter.
  const clarifiers = (topic?.draftClarifiers ?? []).filter((c) => {
    if (c.id === "ref") return true;
    const token = `{${c.id}}`;
    return (topic?.asks ?? []).some(
      (a) => state.selectedAskIds.includes(a.id) && a.text.includes(token),
    );
  });

  return (
    <AssistantShell
      step="asks"
      title="What can you ask them for?"
      subtitle="Tick what you want. Each line becomes a numbered point in your request."
      banner={
        <JurisdictionBanner
          level={result.primary.level}
          stateName={state.stateName}
          onWhy={() => setSheet("why")}
        />
      }
      onBack={goBack}
      primaryLabel="Write my request"
      onPrimary={goNext}
      primaryDisabled={chosen === 0}
      primaryHint={chosen === 0 ? "Tick at least one thing to ask for." : undefined}
    >
      {clarifiers.map((c) => (
        <ClarifierCard
          key={c.id}
          clarifier={c}
          tone="amber"
          value={state.answers[c.id]}
          skipped={state.skipped.includes(c.id)}
          onAnswer={(value) => dispatch({ type: "answer", id: c.id, value })}
          onSkip={() => dispatch({ type: "skip", id: c.id })}
        />
      ))}

      <div className="gov-card divide-y divide-line-2 px-4">
        {(topic?.asks ?? []).map((a) => {
          const on = state.selectedAskIds.includes(a.id);
          return (
            <label
              key={a.id}
              className="flex cursor-pointer items-start gap-3 py-3.5"
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => dispatch({ type: "toggleAsk", id: a.id })}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--navy-800)]"
              />
              <span>
                <span className="block text-sm leading-relaxed text-ink">
                  {fillTokens(a.text, ctx).replace(/\[\[|\]\]/g, "")}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-muted">
                  {a.why}
                </span>
              </span>
            </label>
          );
        })}

        {state.customAsks.map((c, i) => (
          <div key={i} className="flex items-start gap-3 py-3.5">
            <span aria-hidden className="mt-0.5 text-sm text-govgreen-600">
              ✓
            </span>
            <span className="min-w-0 flex-1 text-sm leading-relaxed text-ink">
              {c}
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: "removeCustomAsk", index: i })}
              className="shrink-0 text-[13px] font-medium text-navy-700 underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Add my own point"
          className="field-input mt-0"
        />
        <button
          type="button"
          disabled={!custom.trim()}
          onClick={() => {
            dispatch({ type: "addCustomAsk", text: custom.trim() });
            setCustom("");
          }}
          className="shrink-0 rounded-lg border border-line px-4 text-sm font-semibold text-navy-800 disabled:text-muted"
        >
          Add
        </button>
      </div>

      <div className="rounded-xl border border-navy-600/20 bg-navy-50 px-4 py-3.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-navy-800/75">
          Keep it to facts and papers
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-navy-800">
          RTI gets you records the office already has. It does not force an
          officer to explain themselves — so ask for{" "}
          <em>the file notings on</em> something, not <em>why</em> it happened.
        </p>
        <button
          type="button"
          onClick={() => setSheet("difference")}
          className="mt-2 text-[13px] font-semibold text-navy-800 underline underline-offset-2"
        >
          Show me the difference
        </button>
      </div>

      <BottomSheet
        open={sheet === "difference"}
        title="How to word it"
        onClose={() => setSheet(null)}
      >
        <AskVsAskCard />
      </BottomSheet>

      <BottomSheet
        open={sheet === "why"}
        title="Where this one goes"
        onClose={() => setSheet(null)}
      >
        <JurisdictionNotice
          level={result.primary.level}
          authorityName={fillPlaces(result.primary.name, place)}
          stateName={state.stateName}
        />
      </BottomSheet>
    </AssistantShell>
  );
}
