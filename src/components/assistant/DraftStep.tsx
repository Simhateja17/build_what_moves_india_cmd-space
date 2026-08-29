"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { fillPlaces } from "@/lib/assistant/authorities";
import { BLANK_RE, composeDraft, countBlanks } from "@/lib/assistant/draft";
import { AuthorityResult } from "@/lib/assistant/match";
import {
  PORTAL_CHAR_LIMIT,
  describeIssues,
  findCharIssues,
  fixForPortal,
} from "@/lib/assistant/portal-text";
import { Assistant } from "@/lib/assistant/state";
import { TOPIC_BY_ID } from "@/lib/assistant/topics";
import { DraftFormat } from "@/lib/assistant/types";
import { AssistantShell } from "./AssistantShell";
import { BottomSheet } from "./BottomSheet";
import { ClarifierCard } from "./ClarifierCard";
import { ExampleList } from "./ExampleDraftSheet";
import { JurisdictionBanner } from "./JurisdictionNotice";
import { useLocale } from "@/lib/i18n";

/**
 * The draft arrives written, and the citizen's unanswered questions
 * arrive with it as amber blanks. Filling them is the only hard block
 * in the whole flow — everything else can be skipped, but a request
 * that goes out with "[[name of the place]]" in it is worse than none.
 */
export function DraftStep({
  assistant,
  result,
}: {
  assistant: Assistant;
  result: AuthorityResult;
}) {
  const { t } = useLocale();
  const { state, dispatch, goNext, goBack } = assistant;
  const { citizenName } = useStore();
  const [editing, setEditing] = useState(false);
  const [sheet, setSheet] = useState<"examples" | "blank" | null>(null);
  const [blankLabel, setBlankLabel] = useState<string | null>(null);
  const [pendingFormat, setPendingFormat] = useState<DraftFormat | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const topic = state.topicId ? TOPIC_BY_ID[state.topicId] : undefined;
  const place = { city: state.city, state: state.stateName };

  const generated = useMemo(
    () =>
      composeDraft(
        state,
        result.primary,
        {
          name: citizenName,
          address: [state.city, state.stateName].filter(Boolean).join(", "),
        },
        state.format,
      ),
    [state, result.primary, citizenName],
  );

  const text = state.editedDraft ?? generated;
  const blanks = countBlanks(text);
  const issues = state.format === "portal" ? findCharIssues(text) : [];
  const overLimit = state.format === "portal" && text.length > PORTAL_CHAR_LIMIT;

  const blankClarifier = topic?.draftClarifiers.find(
    (c) => c.blankLabel === blankLabel,
  );

  function setFormat(format: DraftFormat) {
    if (state.editedDraft) {
      setPendingFormat(format);
      return;
    }
    dispatch({ type: "format", format });
  }

  return (
    <AssistantShell
      step="draft"
      title={t("Your request is ready")}
      subtitle={t("This text may be edited freely.")}
      banner={
        <JurisdictionBanner
          level={result.primary.level}
          stateName={state.stateName}
          onWhy={goBack}
        />
      }
      onBack={goBack}
      primaryLabel="Check and finish"
      onPrimary={goNext}
      primaryDisabled={blanks > 0}
      primaryHint={
        blanks > 0
          ? `${blanks} blank${blanks === 1 ? "" : "s"} left to fill`
          : undefined
      }
    >
      <div className="flex gap-1 rounded-lg bg-line-2 p-1">
        {(["letter", "portal"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormat(f)}
            className={`flex-1 rounded-md px-3 py-2 text-[13px] font-semibold transition ${
              state.format === f
                ? "bg-white text-ink shadow-sm"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            {f === "letter" ? "Letter format" : "Portal text box"}
          </button>
        ))}
      </div>
      <p className="-mt-1 text-[13px] leading-relaxed text-muted">
        {t("The portal has its own boxes for the address and your name, so it only needs the middle part.")}
      </p>

      {pendingFormat ? (
        <div className="rounded-xl border border-saffron-400/50 bg-saffron-50 px-4 py-3">
          <p className="text-sm leading-relaxed text-saffron-600">
            {t("You have changed this request yourself. Switching format will rewrite it and undo your edits.")}
          </p>
          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "restoreDraft" });
                dispatch({ type: "format", format: pendingFormat });
                setPendingFormat(null);
              }}
              className="rounded-lg bg-saffron-600 px-3.5 py-2 text-[13px] font-semibold text-white"
            >
              {t("Switch and rewrite")}
            </button>
            <button
              type="button"
              onClick={() => setPendingFormat(null)}
              className="rounded-lg border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-2"
            >
              {t("Keep current version")}
            </button>
          </div>
        </div>
      ) : null}

      {blanks > 0 ? (
        <div className="rounded-xl border border-saffron-400/50 bg-saffron-50 px-4 py-3">
          <p className="text-sm leading-relaxed text-saffron-600">
            <span className="font-semibold">
              ✎ {blanks} blank{blanks === 1 ? "" : "s"} left to fill.
            </span>{" "}
            Tap the highlighted part to complete it.
          </p>
        </div>
      ) : null}

      {issues.length > 0 ? (
        <div className="rounded-xl border border-govred-700/25 bg-govred-50 px-4 py-3">
          <p className="text-sm font-semibold text-govred-700">
            The portal will not accept {issues.length} character
            {issues.length === 1 ? "" : "s"}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-govred-700">
            Its text box allows only letters, numbers and , . - _ ( ) / @ : &amp;
            % \. The following were found: {describeIssues(issues)}.
          </p>
          <button
            type="button"
            onClick={() => {
              const fixed = fixForPortal(text);
              dispatch({ type: "editDraft", text: fixed });
              setToast(
                "Fixed. Rupee signs were replaced with Rs., and quote marks were removed, as the portal does not accept them. Review before submission.",
              );
            }}
            className="mt-2 rounded-lg bg-govred-700 px-3.5 py-2 text-[13px] font-semibold text-white"
          >
            {t("Fix automatically")}
          </button>
        </div>
      ) : null}

      {overLimit ? (
        <div className="rounded-xl border border-saffron-400/50 bg-saffron-50 px-4 py-3 text-[13px] leading-relaxed text-saffron-600">
          Over {PORTAL_CHAR_LIMIT.toLocaleString("en-IN")} characters. The
          portal requires the remainder as a PDF attachment. Deselect a
          point, or shorten the text.
        </div>
      ) : null}

      {editing ? (
        <textarea
          value={text}
          onChange={(e) => dispatch({ type: "editDraft", text: e.target.value })}
          rows={20}
          className="field-input font-mono text-[13px] leading-relaxed"
        />
      ) : (
        <div className="gov-card whitespace-pre-wrap p-4 text-[13px] leading-relaxed text-ink">
          <DraftBody text={text} onBlank={(label) => {
            setBlankLabel(label);
            setSheet("blank");
          }} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = document.documentElement.lang || "en-IN";
            window.speechSynthesis.speak(utterance);
          }}
          className="rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-2"
        >
          {t("Listen to the draft")}
        </button>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-2"
        >
          {editing ? "Done" : "✎ Edit"}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setToast("Copied to clipboard.");
            } catch {
              setToast("Could not copy automatically. Select the text and copy it manually.");
            }
          }}
          className="rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-2"
        >
          {t("⧉ Copy")}
        </button>
        <button
          type="button"
          onClick={() => setSheet("examples")}
          className="rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-2"
        >
          {t("📄 See an example")}
        </button>
        {state.editedDraft ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "restoreDraft" })}
            className="text-[13px] font-medium text-navy-700 underline underline-offset-2"
          >
            {t("Restore the written version")}
          </button>
        ) : null}
      </div>

      <p className="text-[13px] tabular-nums text-muted">
        {text.length.toLocaleString("en-IN")} /{" "}
        {PORTAL_CHAR_LIMIT.toLocaleString("en-IN")} characters
      </p>

      {toast ? (
        <p
          role="status"
          className="rounded-lg border border-govgreen-600/30 bg-govgreen-50 px-3.5 py-2.5 text-[13px] text-govgreen-700"
        >
          {toast}
        </p>
      ) : null}

      <BottomSheet
        open={sheet === "examples"}
        title={t("Example requests")}
        onClose={() => setSheet(null)}
      >
        <ExampleList
          onUse={(t) => {
            dispatch({ type: "editDraft", text: t });
            setSheet(null);
            setToast("Example loaded. Edit it to match your own case.");
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={sheet === "blank"}
        title={t("Complete this field")}
        onClose={() => setSheet(null)}
      >
        {blankClarifier ? (
          <ClarifierCard
            clarifier={blankClarifier}
            value={state.answers[blankClarifier.id]}
            skipped={state.skipped.includes(blankClarifier.id)}
            onAnswer={(value) => {
              dispatch({ type: "answer", id: blankClarifier.id, value });
              dispatch({ type: "restoreDraft" });
            }}
            onSkip={() => setSheet(null)}
          />
        ) : (
          <p className="text-sm text-ink-2">
            Use <span className="font-semibold">{t("✎ Edit")}</span> {t("to complete this part directly.")}
          </p>
        )}
        <button
          type="button"
          onClick={() => setSheet(null)}
          className="btn-primary mt-4 w-full text-sm"
        >
          {t("Done")}
        </button>
      </BottomSheet>

      <p className="text-[13px] leading-relaxed text-muted">
        Going to {result.primary.pioTitle},{" "}
        {fillPlaces(result.primary.name, place)}.
      </p>
    </AssistantShell>
  );
}

/** Renders [[blanks]] as tappable amber tokens. */
function DraftBody({
  text,
  onBlank,
}: {
  text: string;
  onBlank: (label: string) => void;
}) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(BLANK_RE.source, "g");

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const label = match[1];
    parts.push(
      <button
        key={`${match.index}-${label}`}
        type="button"
        onClick={() => onBlank(label)}
        className="rounded border-b-2 border-saffron-400 bg-saffron-50 px-1 font-semibold text-saffron-600"
      >
        {label}
      </button>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
