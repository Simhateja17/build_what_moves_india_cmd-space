"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { useStore } from "@/lib/store";
import { deriveCase } from "@/lib/derive";
import { CHAR_LIMIT } from "@/lib/draft";
import { draftAppealLetter } from "@/lib/appeal-letter";
import { useAppealDraft } from "../layout";

/* ------------------------------------------------------------------
   Appeal · Step 2 of 3 — the letter.

   The app writes it; the citizen edits it. This is the single
   highest-leverage change in the redesign: it turns "I would have to
   compose a legal letter on my phone" into "read this and press send".
------------------------------------------------------------------- */

export default function AppealWriteStep() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCase, dayOf, appealOf, ready } = useStore();
  const { draft, set } = useAppealDraft();

  const c = getCase(id);
  const d = c ? deriveCase(c, dayOf(c.id), appealOf(c.id)) : null;

  // Generate once, and stop regenerating the moment the citizen types —
  // overwriting somebody's own words would be unforgivable.
  useEffect(() => {
    if (!c || !d || draft.edited || draft.letter) return;
    set({ letter: draftAppealLetter(c, d, draft.ground) });
  }, [c, d, draft.edited, draft.letter, draft.ground, set]);

  useEffect(() => {
    if (ready && (!c || !draft.ground)) router.replace(`/requests/${id}/appeal`);
  }, [ready, c, draft.ground, id, router]);

  if (!ready || !c || !d) {
    return (
      <div className="m-col m-page pt-6" aria-busy>
        <div className="m-skel h-7 w-2/3" />
        <div className="m-skel mt-4 h-40 w-full rounded-xl" />
      </div>
    );
  }

  const count = draft.letter.length;

  return (
    <>
      <TaskBar
        step={2}
        total={3}
        onBack={() => router.push(`/requests/${c.id}/appeal`)}
      />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">We have written it for you</h1>
        <p className="m-body mt-2">
          Read it and change anything you like. Most people send it as it is.
        </p>

        <label className="mt-4 block">
          <span className="sr-only">Your appeal letter</span>
          <textarea
            rows={11}
            className="m-field resize-y leading-relaxed"
            value={draft.letter}
            maxLength={CHAR_LIMIT}
            onChange={(e) => set({ letter: e.target.value, edited: true })}
          />
        </label>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="m-fine" aria-live="polite">
            {count} / {CHAR_LIMIT}
          </p>
          <button
            type="button"
            onClick={() =>
              set({ letter: draftAppealLetter(c, d, draft.ground), edited: false })
            }
            className="m-tap -mr-2 justify-end text-[15px] font-semibold text-navy-800 underline"
          >
            Reset to our draft
          </button>
        </div>

        <div className="m-note m-note--info mt-4">
          Your original RTI and their reply are attached automatically. You do
          not need to send them again.
        </div>
      </div>

      <ActionBar>
        <PrimaryButton
          disabled={draft.letter.trim().length < 20}
          disabledReason="Write a line or two before you continue."
          onClick={() => router.push(`/requests/${c.id}/appeal/review`)}
        >
          Continue
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
