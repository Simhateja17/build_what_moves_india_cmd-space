"use client";

import { resolveAuthority } from "@/lib/assistant/match";
import { useAssistant } from "@/lib/assistant/state";
import { AsksStep } from "@/components/assistant/AsksStep";
import { AuthorityStep } from "@/components/assistant/AuthorityStep";
import { DraftStep } from "@/components/assistant/DraftStep";
import { LocationStep } from "@/components/assistant/LocationStep";
import { ProblemStep } from "@/components/assistant/ProblemStep";
import { ReviewStep } from "@/components/assistant/ReviewStep";
import { useLocale } from "@/lib/i18n";

/**
 * My problem → the right authority → what to ask for → a draft →
 * review → the existing form.
 *
 * Six steps, one state machine. `/find-department` runs the first
 * three of these and stops; everything below is shared with it.
 */
export default function AssistantPage() {
  const { t } = useLocale();
  const assistant = useAssistant();
  const { state, ready, dispatch } = assistant;

  const result = resolveAuthority(
    state.topicId,
    state.answers,
    state.bodyType,
    state.authorityOverrideId,
  );

  // sessionStorage is only read after mount, so the first render must
  // not commit to a step — otherwise a citizen returning from the
  // finder sees step 1 flash before their own answers appear.
  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-xl py-12 text-center text-sm text-muted">
        {t("Loading…")}
      </div>
    );
  }

  // Someone landing on a later step with nothing filled in — a stale
  // session, a shared link — gets the first step rather than an empty
  // authority card built out of nothing.
  if (!state.topicId || !result) return <ProblemStep assistant={assistant} />;

  switch (state.step) {
    case "location":
      return <LocationStep assistant={assistant} />;
    case "authority":
      return (
        <AuthorityStep
          assistant={assistant}
          result={result}
          mode="assistant"
          onContinue={() => dispatch({ type: "go", step: "asks" })}
        />
      );
    case "asks":
      return <AsksStep assistant={assistant} result={result} />;
    case "draft":
      return <DraftStep assistant={assistant} result={result} />;
    case "review":
      return <ReviewStep assistant={assistant} result={result} />;
    default:
      return <ProblemStep assistant={assistant} />;
  }
}
