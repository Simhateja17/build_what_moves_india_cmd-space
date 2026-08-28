"use client";

import { useState } from "react";
import { fillPlaces } from "@/lib/assistant/authorities";
import { AuthorityResult } from "@/lib/assistant/match";
import { Assistant } from "@/lib/assistant/state";
import { AlternativeAuthorities, AuthorityCard } from "./AuthorityCard";
import { AssistantShell } from "./AssistantShell";
import { BottomSheet } from "./BottomSheet";
import { JurisdictionNotice } from "./JurisdictionNotice";
import { StateFilingSheet } from "./StateFilingSheet";

/**
 * The gate. It names one office, explains the reasoning, and — when
 * the matter is not central — stops the citizen here, before a single
 * form field has been shown to them.
 *
 * It never dead-ends. A state or local match still gets the draft; it
 * just does not get a route into a form that would return it.
 */
export function AuthorityStep({
  assistant,
  result,
  mode,
  onContinue,
}: {
  assistant: Assistant;
  result: AuthorityResult;
  mode: "assistant" | "finder";
  onContinue: () => void;
}) {
  const { state, dispatch, goBack } = assistant;
  const [sheet, setSheet] = useState(false);
  const place = { city: state.city, state: state.stateName };
  const { primary, alternatives, assumedLabel } = result;
  const warn = primary.level !== "central";

  const continueLabel =
    mode === "finder"
      ? "Continue to draft the request"
      : "What can be requested?";

  return (
    <AssistantShell
      step="authority"
      title={`This is most likely with the ${fillPlaces(primary.shortName, place)}`}
      onBack={goBack}
      primaryLabel={
        warn ? `How to file this in ${state.stateName || "your state"}` : continueLabel
      }
      primaryTone={warn ? "amber" : "navy"}
      onPrimary={warn ? () => setSheet(true) : onContinue}
      secondary={
        warn ? (
          <button
            type="button"
            onClick={onContinue}
            className="text-[13px] font-medium text-navy-700 underline underline-offset-2"
          >
            Continue anyway and prepare the draft
          </button>
        ) : null
      }
    >
      <AuthorityCard
        authority={primary}
        place={place}
        assumedLabel={assumedLabel}
        onChangeAssumption={goBack}
      />

      <JurisdictionNotice
        level={primary.level}
        authorityName={fillPlaces(primary.name, place)}
        stateName={state.stateName}
      />

      <AlternativeAuthorities
        alternatives={alternatives}
        place={place}
        onPick={(id) => dispatch({ type: "override", id })}
      />

      {state.authorityOverrideId ? (
        <button
          type="button"
          onClick={() => dispatch({ type: "override", id: undefined })}
          className="text-[13px] font-medium text-navy-700 underline underline-offset-2"
        >
          Go back to the suggested office
        </button>
      ) : null}

      <BottomSheet
        open={sheet}
        title={`Filing in ${state.stateName || "your state"}`}
        onClose={() => setSheet(false)}
      >
        <StateFilingSheet
          authority={primary}
          stateName={state.stateName}
          city={state.city}
        />
      </BottomSheet>
    </AssistantShell>
  );
}
