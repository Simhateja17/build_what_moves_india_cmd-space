"use client";

import { TOPIC_BY_ID } from "@/lib/assistant/topics";
import { STATES } from "@/lib/assistant/places";
import { Assistant } from "@/lib/assistant/state";
import { AssistantShell } from "./AssistantShell";
import { ClarifierCard } from "./ClarifierCard";
import { useLocale } from "@/lib/i18n";

/**
 * Location and the one authority-deciding question sit together,
 * because they are doing the same job: narrowing jurisdiction. A
 * damaged road is municipal, state or central depending entirely on
 * *which* road — so this has to be settled before any office is named.
 */
export function LocationStep({ assistant }: { assistant: Assistant }) {
  const { t } = useLocale();
  const { state, dispatch, goNext, goBack } = assistant;
  const topic = state.topicId ? TOPIC_BY_ID[state.topicId] : undefined;
  const clarifier = topic?.authorityClarifier;

  return (
    <AssistantShell
      step="location"
      title={t("Location")}
      subtitle={t("The same problem is handled by different offices in different places.")}
      onBack={goBack}
      primaryLabel="Find the department"
      onPrimary={goNext}
      primaryDisabled={!state.stateName}
      primaryHint={state.stateName ? undefined : "Choose your state to continue"}
    >
      <div>
        <label htmlFor="state" className="field-label">
          {t("State")}
        </label>
        <select
          id="state"
          value={state.stateName}
          onChange={(e) =>
            dispatch({ type: "location", stateName: e.target.value })
          }
          className="field-input"
        >
          <option value="">{t("Select your state")}</option>
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="field-label">
          City, town or village{" "}
          <span className="font-normal text-muted">{t("(optional)")}</span>
        </label>
        <input
          id="city"
          value={state.city}
          onChange={(e) => dispatch({ type: "location", city: e.target.value })}
          placeholder={t("e.g. Hyderabad")}
          className="field-input"
        />
      </div>

      <div className="flex gap-2">
        {(["urban", "rural"] as const).map((b) => {
          const on = state.bodyType === b;
          return (
            <button
              key={b}
              type="button"
              onClick={() => dispatch({ type: "location", bodyType: b })}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                on
                  ? "border-navy-600 bg-navy-50 text-navy-800"
                  : "border-line bg-surface text-ink-2 hover:border-navy-600/40"
              }`}
            >
              {b === "urban" ? "City / town" : "Village"}
            </button>
          );
        })}
      </div>

      {clarifier ? (
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            {t("Additional detail")}
          </p>
          <ClarifierCard
            clarifier={clarifier}
            value={state.answers[clarifier.id]}
            skipped={state.skipped.includes(clarifier.id)}
            onAnswer={(value) =>
              dispatch({ type: "answer", id: clarifier.id, value })
            }
            onSkip={() => dispatch({ type: "skip", id: clarifier.id })}
          />
        </div>
      ) : null}
    </AssistantShell>
  );
}
