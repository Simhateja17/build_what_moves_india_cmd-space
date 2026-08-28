"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { Sheet } from "@/components/mobile/Primitives";
import { CHAR_LIMIT, questionError, useDraft } from "@/lib/draft";

/* ------------------------------------------------------------------
   Step 2 of 5 — the question.

   This is where first-time filers fail. People write a complaint, and
   complaints get refused: an officer can only hand over a record that
   already exists. The screen's whole job is to turn a grievance into a
   request for a document, and it does that with starters and advice —
   never by blocking the citizen from writing what they want.
------------------------------------------------------------------- */

const STARTERS = [
  { chip: "Status of…", text: "Please provide the current status of " },
  { chip: "Copies of…", text: "Please provide copies of " },
  { chip: "Reasons for…", text: "Please provide the reasons for " },
  {
    chip: "Who is responsible…",
    text: "Please provide the name and designation of the officer responsible for ",
  },
];

/** Words that signal an opinion question rather than a records request. */
const OPINION = /\b(why is|why are|why does|why do|should|do you think|is it fair|how can they|justify)\b/i;
const HAS_DATE = /\b(19|20)\d{2}\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i;

type Check = { tone: "good" | "warn"; text: string } | null;

function checkQuestion(q: string): Check {
  const t = q.trim();
  if (t.length < 15) return null;
  if (OPINION.test(t))
    return {
      tone: "warn",
      text: "This reads like an opinion question. Officers can only send records they already hold. Try asking for the file, the order, or the date instead.",
    };
  if (!HAS_DATE.test(t))
    return {
      tone: "warn",
      text: 'Add a time period, like "between April 2025 and March 2026". It helps the officer find the file.',
    };
  return {
    tone: "good",
    text: "This should get an answer — it asks for a record and names a period.",
  };
}

export default function QuestionStep() {
  const router = useRouter();
  const { draft, set, markDone } = useDraft();
  const box = useRef<HTMLTextAreaElement>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [touched, setTouched] = useState(false);

  const check = useMemo(() => checkQuestion(draft.question), [draft.question]);
  const error = questionError(draft);
  const count = draft.question.length;
  const atLimit = count >= CHAR_LIMIT;

  // A starter inserts its opening words and leaves the cursor after
  // them — it never replaces what has already been typed.
  function insert(text: string) {
    const current = draft.question;
    const next = current.trim().length === 0 ? text : `${current.trimEnd()}\n${text}`;
    set({ question: next.slice(0, CHAR_LIMIT) });
    requestAnimationFrame(() => {
      const el = box.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  return (
    <>
      <TaskBar
        step={2}
        total={5}
        onBack={() => router.push("/file-request/authority")}
      />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">What do you want to know?</h1>
        <p className="m-body mt-2">
          Write it the way you would say it. Ask for records, dates, names or
          reasons.
        </p>

        <div className="mt-4">
          <p className="m-eyebrow">Start with</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s.chip}
                type="button"
                onClick={() => insert(s.text)}
                className="m-chip"
              >
                {s.chip}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-4 block">
          <span className="sr-only">Your RTI question</span>
          <textarea
            ref={box}
            rows={8}
            className="m-field resize-y leading-relaxed"
            placeholder="Please provide…"
            value={draft.question}
            maxLength={CHAR_LIMIT}
            aria-invalid={touched && Boolean(error)}
            onBlur={() => setTouched(true)}
            onChange={(e) => set({ question: e.target.value })}
          />
        </label>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p
            className={`m-fine ${atLimit ? "font-semibold text-govred-700" : count > CHAR_LIMIT - 200 ? "font-semibold text-saffron-600" : ""}`}
            aria-live="polite"
          >
            {count} / {CHAR_LIMIT}
          </p>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="m-tap -mr-2 justify-end text-[15px] font-semibold text-navy-800 underline"
          >
            How to ask well
          </button>
        </div>

        {atLimit && (
          <div className="m-note m-note--bad mt-2">
            You have reached {CHAR_LIMIT} characters. Put the rest in a PDF and
            attach it below.
          </div>
        )}

        {/* Advice, never a gate. There is no "fix it" button and the
            citizen can always continue past a warning. */}
        {check && !atLimit && (
          <div
            className={`m-note mt-3 ${check.tone === "good" ? "m-note--good" : "m-note--warn"}`}
          >
            {check.tone === "good" && <span aria-hidden>✓ </span>}
            {check.text}
          </div>
        )}

        {touched && error && !atLimit && (
          <p className="m-error mt-2" role="alert">
            {error}
          </p>
        )}

        <div className="m-card mt-4">
          <p className="text-[17px] font-semibold text-ink">Add a PDF</p>
          <p className="m-fine mt-0.5">Optional · up to 1 MB</p>
          {draft.attachmentName ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="m-small min-w-0 flex-1 truncate font-medium text-ink">
                {draft.attachmentName}
              </span>
              <button
                type="button"
                onClick={() => set({ attachmentName: undefined })}
                className="m-tap -mr-2 shrink-0 text-[15px] font-semibold text-govred-700 underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              {/* Camera first: most citizens are holding a paper document,
                  not a PDF. The photo is converted on the device. */}
              <button
                type="button"
                onClick={() => set({ attachmentName: "Photo 1.pdf" })}
                className="m-btn m-btn--ghost min-h-[48px] text-[15px]"
              >
                Take a photo
              </button>
              <button
                type="button"
                onClick={() => set({ attachmentName: "application.pdf" })}
                className="m-btn m-btn--ghost min-h-[48px] text-[15px]"
              >
                Choose a file
              </button>
            </div>
          )}
        </div>
      </div>

      <ActionBar>
        <PrimaryButton
          disabled={Boolean(error)}
          disabledReason={error ?? undefined}
          onClick={() => {
            markDone("question");
            router.push("/file-request/you");
          }}
        >
          Continue
        </PrimaryButton>
      </ActionBar>

      <Sheet
        open={showHelp}
        onClose={() => setShowHelp(false)}
        title="How to ask so they must answer"
      >
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[15px] font-bold text-govgreen-700">
              ✓ Ask for a record
            </p>
            <p className="m-small">
              &ldquo;Copies of the inspection reports for March 2026&rdquo;
            </p>
          </div>
          <div>
            <p className="text-[15px] font-bold text-govred-700">
              ✗ Not an opinion
            </p>
            <p className="m-small">
              &ldquo;Why is this department so slow?&rdquo;
            </p>
          </div>
          <hr className="border-line" />
          <div>
            <p className="text-[15px] font-bold text-govgreen-700">
              ✓ Give dates
            </p>
            <p className="m-small">
              &ldquo;Between 1 April 2025 and 31 March 2026&rdquo;
            </p>
          </div>
          <div>
            <p className="text-[15px] font-bold text-govgreen-700">
              ✓ Ask one thing at a time
            </p>
            <p className="m-small">Number your questions 1, 2, 3.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(false)}
          className="m-btn m-btn--ghost mt-1"
        >
          Got it
        </button>
      </Sheet>
    </>
  );
}
