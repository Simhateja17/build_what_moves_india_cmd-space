"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TaskBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { ChoiceCard } from "@/components/mobile/Primitives";
import { useStore } from "@/lib/store";
import { deriveCase } from "@/lib/derive";
import { GROUNDS_FOR_APPEAL, REPLY_DEADLINE_DAYS } from "@/lib/types";
import { useAppealDraft } from "./layout";

/* ------------------------------------------------------------------
   Appeal · Step 1 of 3 — why.

   Replaces the "Ground For Appeal" dropdown, whose five options are
   written in a register most citizens will not recognise as describing
   what happened to them. The five are kept one-to-one and rewritten;
   the official string is what gets submitted.

   The ground is also chosen for the citizen from the state of the case,
   and labelled as such, because by the time somebody reaches this
   screen the reason is usually already a matter of record.
------------------------------------------------------------------- */

export default function AppealWhyStep() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCase, dayOf, appealOf, ready } = useStore();
  const { draft, set } = useAppealDraft();

  const c = getCase(id);
  const d = c ? deriveCase(c, dayOf(c.id), appealOf(c.id)) : null;

  // Pre-select from what actually happened, once.
  useEffect(() => {
    if (!d || draft.ground) return;
    set({
      ground: d.hasReply
        ? "Provided Incomplete,Misleading or False Information"
        : "No Response Within the Time Limit",
    });
  }, [d, draft.ground, set]);

  if (!ready || !c || !d) {
    return (
      <div className="m-col m-page pt-6" aria-busy>
        <div className="m-skel h-7 w-2/3" />
        <div className="m-skel mt-4 h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (d.appealFiled) {
    return (
      <>
        <TaskBar step={1} total={3} onBack={() => router.push(`/requests/${c.id}`)} />
        <div className="m-col m-page pt-8 text-center">
          <h1 className="m-h2">You have already appealed this RTI</h1>
          <p className="m-body mt-2">
            It is with the senior officer, who has 45 days to decide.
          </p>
          <Link href={`/requests/${c.id}`} className="m-btn mt-5">
            Back to this RTI
          </Link>
        </div>
      </>
    );
  }

  const autoReason = d.hasReply
    ? "We chose this because they replied, but you said it did not answer your question."
    : `We chose this because they are ${d.daysLate} ${d.daysLate === 1 ? "day" : "days"} past the ${REPLY_DEADLINE_DAYS}-day deadline.`;

  return (
    <>
      <TaskBar step={1} total={3} onBack={() => router.push(`/requests/${c.id}`)} />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">Why are you appealing?</h1>
        <p className="m-body mt-2">
          Pick the closest reason. An appeal costs nothing.
        </p>

        <div
          role="radiogroup"
          aria-label="Ground for appeal"
          className="mt-5 flex flex-col gap-3"
        >
          {GROUNDS_FOR_APPEAL.map((g) => (
            <ChoiceCard
              key={g.official}
              checked={draft.ground === g.official}
              onChange={() => set({ ground: g.official, edited: false })}
              title={g.plain}
              detail={
                draft.ground === g.official && !draft.edited ? autoReason : undefined
              }
            />
          ))}
        </div>

        <div className="m-note m-note--good mt-5">
          No fee. The appeal goes to a senior officer, not to the same person who
          ignored you.
        </div>
      </div>

      <ActionBar>
        <PrimaryButton
          disabled={!draft.ground}
          disabledReason="Choose the closest reason above."
          onClick={() => router.push(`/requests/${c.id}/appeal/write`)}
        >
          Continue
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
