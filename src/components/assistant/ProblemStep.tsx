"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { guessPeriod, matchTopic, suggestedTopics } from "@/lib/assistant/match";
import { TOPICS, TOPIC_BY_ID } from "@/lib/assistant/topics";
import { Assistant } from "@/lib/assistant/state";
import { AssistantShell } from "./AssistantShell";
import { BottomSheet } from "./BottomSheet";
import { ExampleList } from "./ExampleDraftSheet";
import { VoiceInputButton } from "./VoiceInputButton";

const PERIOD_LABEL: Record<string, string> = {
  "6m": "Last 6 months",
  "1y": "Last year",
  "3y": "Last 3 years",
};

export function ProblemStep({ assistant }: { assistant: Assistant }) {
  const { state, dispatch, goNext } = assistant;
  const [sheet, setSheet] = useState<"topics" | "examples" | null>(null);
  const [touched, setTouched] = useState(false);

  const suggestions = useMemo(
    () => suggestedTopics(state.rawProblem),
    [state.rawProblem],
  );

  // Matching runs as they type, but it only ever *proposes*: the chip
  // below is editable, and a weak match shows the full list instead of
  // putting a department in front of somebody on one keyword.
  useEffect(() => {
    if (touched || state.rawProblem.trim().length < 12) return;
    const guess = matchTopic(state.rawProblem);
    if (guess && guess.id !== state.topicId) {
      dispatch({ type: "topic", id: guess.id });
      const period = guessPeriod(state.rawProblem);
      if (period) dispatch({ type: "answer", id: "period", value: period });
    }
  }, [state.rawProblem, state.topicId, touched, dispatch]);

  const topic = state.topicId ? TOPIC_BY_ID[state.topicId] : undefined;
  const noMatch =
    state.rawProblem.trim().length >= 12 && !topic && !touched;

  function choose(id: string) {
    setTouched(true);
    dispatch({ type: "topic", id });
    const period = guessPeriod(state.rawProblem);
    if (period) dispatch({ type: "answer", id: "period", value: period });
    setSheet(null);
  }

  return (
    <AssistantShell
      step="problem"
      title="Describe the problem"
      subtitle="Describe the issue in everyday language. No knowledge of the relevant department or law is required."
      primaryLabel="Continue"
      onPrimary={goNext}
      primaryDisabled={!topic}
      primaryHint={topic ? undefined : "Select a problem to continue"}
      secondary={
        <Link
          href="/file-request"
          className="text-[13px] font-medium text-navy-700 underline underline-offset-2"
        >
          The department is already known. Go to the form.
        </Link>
      }
    >
      <textarea
        rows={4}
        value={state.rawProblem}
        onChange={(e) => dispatch({ type: "problem", text: e.target.value })}
        placeholder="Our street has been broken for months and nobody has repaired it…"
        className="field-input"
      />

      <div className="-mt-1 flex items-center justify-between gap-3">
        <VoiceInputButton
          onTranscript={(text) =>
            dispatch({
              type: "problem",
              text: [state.rawProblem.trim(), text].filter(Boolean).join(" "),
            })
          }
        />
        <p className="text-right text-[11px] leading-relaxed text-muted">
          You can review every word before continuing.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setSheet("examples")}
        className="text-[13px] font-medium text-navy-700 underline underline-offset-2"
      >
        Uncertain how to begin? Read an example request
      </button>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {noMatch ? "Select the closest match" : "Or select the closest match"}
        </p>
        {noMatch ? (
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
            This description could not be matched automatically. Select the
            closest option below; it may be changed later.
          </p>
        ) : null}
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {suggestions.map((t) => {
            const on = t.id === state.topicId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => choose(t.id)}
                className={`flex flex-col gap-1.5 rounded-xl border p-3 text-left transition ${
                  on
                    ? "border-navy-600 bg-navy-50"
                    : "border-line bg-surface hover:border-navy-600/40"
                }`}
              >
                <span aria-hidden className="text-lg leading-none">
                  {t.icon}
                </span>
                <span
                  className={`text-[13px] font-semibold leading-snug ${
                    on ? "text-navy-800" : "text-ink"
                  }`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setSheet("topics")}
          className="mt-2.5 text-[13px] font-medium text-navy-700 underline underline-offset-2"
        >
          See all {TOPICS.length} problems
        </button>
      </div>

      {topic ? (
        <div className="rounded-xl border border-navy-600/25 bg-navy-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-navy-800/75">
            Understood as
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Chip label={topic.label} onEdit={() => setSheet("topics")} />
            {state.answers.period && PERIOD_LABEL[state.answers.period] ? (
              <Chip
                label={PERIOD_LABEL[state.answers.period]}
                onEdit={() => dispatch({ type: "skip", id: "period" })}
              />
            ) : null}
          </div>
          <p className="mt-2.5 text-[13px] text-navy-800/80">
            Tap any chip to change it.
          </p>
        </div>
      ) : null}

      <BottomSheet
        open={sheet === "topics"}
        title="Select a problem category"
        onClose={() => setSheet(null)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => choose(t.id)}
              className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition ${
                t.id === state.topicId
                  ? "border-navy-600 bg-navy-50"
                  : "border-line hover:border-navy-600/40"
              }`}
            >
              <span aria-hidden className="text-lg">
                {t.icon}
              </span>
              <span className="text-sm font-medium text-ink">{t.label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet
        open={sheet === "examples"}
        title="Example requests"
        onClose={() => setSheet(null)}
      >
        <ExampleList />
      </BottomSheet>
    </AssistantShell>
  );
}

function Chip({ label, onEdit }: { label: string; onEdit: () => void }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="inline-flex items-center gap-1.5 rounded-full border border-navy-600/40 bg-white px-3 py-1.5 text-[13px] font-semibold text-navy-800"
    >
      {label}
      <span aria-hidden className="text-[11px] opacity-60">
        ✎
      </span>
    </button>
  );
}
