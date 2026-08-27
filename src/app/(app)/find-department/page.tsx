"use client";

import { useRouter } from "next/navigation";
import { resolveAuthority } from "@/lib/assistant/match";
import { useAssistant } from "@/lib/assistant/state";
import { AuthorityStep } from "@/components/assistant/AuthorityStep";
import { LocationStep } from "@/components/assistant/LocationStep";
import { ProblemStep } from "@/components/assistant/ProblemStep";

/**
 * The finder on its own: describe the problem, say where you are, and
 * find out which government actually holds the record — including the
 * warning when it is not this one.
 *
 * It is the same machine as /assistant, stopped after three steps. A
 * citizen who then wants the request written carries every answer over
 * with them, and is asked nothing twice.
 */
export default function FindDepartmentPage() {
  const assistant = useAssistant();
  const router = useRouter();
  const { state, ready, dispatch } = assistant;

  const result = resolveAuthority(
    state.topicId,
    state.answers,
    state.bodyType,
    state.authorityOverrideId,
  );

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-xl py-12 text-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  if (state.step === "problem" || !state.topicId || !result) {
    return <ProblemStep assistant={assistant} />;
  }
  if (state.step === "location") return <LocationStep assistant={assistant} />;

  return (
    <AuthorityStep
      assistant={assistant}
      result={result}
      mode="finder"
      onContinue={() => {
        dispatch({ type: "go", step: "asks" });
        router.push("/assistant");
      }}
    />
  );
}
