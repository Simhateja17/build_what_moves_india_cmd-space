"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TaskBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { RegNumber } from "@/components/mobile/Primitives";
import { useStore } from "@/lib/store";
import { deriveCase } from "@/lib/derive";
import { GROUNDS_FOR_APPEAL, APPEAL_DECISION_DAYS } from "@/lib/types";
import { addDays, formatDate } from "@/lib/filing";
import { useAppealDraft } from "../layout";

/* ------------------------------------------------------------------
   Appeal · Step 3 of 3 — check and send, then the confirmation.

   Same review shape as filing step 5. The button carries the fact that
   matters most about a first appeal: it is free.
------------------------------------------------------------------- */

export default function AppealReviewStep() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCase, dayOf, appealOf, fileAppeal, ready } = useStore();
  const { draft } = useAppealDraft();

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [appealNumber, setAppealNumber] = useState("");

  const c = getCase(id);
  const d = c ? deriveCase(c, dayOf(c.id), appealOf(c.id)) : null;

  useEffect(() => {
    if (ready && !sent && (!c || !draft.ground || !draft.letter))
      router.replace(`/requests/${id}/appeal`);
  }, [ready, sent, c, draft.ground, draft.letter, id, router]);

  if (!ready || !c || !d) {
    return (
      <div className="m-col m-page pt-6" aria-busy>
        <div className="m-skel h-7 w-2/3" />
        <div className="m-skel mt-4 h-32 w-full rounded-xl" />
      </div>
    );
  }

  const plain =
    GROUNDS_FOR_APPEAL.find((g) => g.official === draft.ground)?.plain ??
    draft.ground;

  function send() {
    if (!c) return;
    setSending(true);
    // The appeal number follows the portal's format with A for appeal.
    const number = c.registrationNumber.replace("/R/", "/A/");
    setTimeout(() => {
      fileAppeal(c.id, draft.ground, dayOf(c.id));
      setAppealNumber(number);
      setSending(false);
      setSent(true);
    }, 1200);
  }

  /* ---- Sent ------------------------------------------------------- */
  if (sent) {
    const due = addDays(APPEAL_DECISION_DAYS);
    return (
      <>
        <div className="m-col m-page--action pt-6">
          <div className="flex flex-col items-center text-center">
            <span
              aria-hidden
              className="animate-pop flex h-16 w-16 items-center justify-center rounded-full border-2 border-govgreen-600 bg-govgreen-50 text-[30px] font-bold text-govgreen-700"
            >
              ✓
            </span>
            <h1 className="m-h1 mt-4">Your appeal has been sent</h1>
            <p className="m-body mt-2">No fee was charged.</p>
          </div>

          <div className="mt-5">
            <RegNumber value={appealNumber} label="Your appeal number" />
          </div>

          <div className="m-card mt-3 flex items-start gap-3.5">
            <span
              className="m-mono w-11 shrink-0 text-[24px] font-bold leading-none text-navy-700"
              aria-hidden
            >
              {APPEAL_DECISION_DAYS}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold leading-snug text-ink">
                They must decide by {formatDate(due)}
              </span>
              <span className="m-small mt-1 block">
                If they do not, you can take it to the Central Information
                Commission. We will tell you.
              </span>
              <span className="m-fine mt-1 block">
                Section 19(6), Right to Information Act, 2005
              </span>
            </span>
          </div>
        </div>

        <ActionBar>
          <PrimaryButton
            variant="go"
            onClick={() => router.replace(`/requests/${c.id}`)}
          >
            Track this RTI
          </PrimaryButton>
        </ActionBar>
      </>
    );
  }

  /* ---- Review ------------------------------------------------------ */
  return (
    <>
      <TaskBar
        step={3}
        total={3}
        onBack={() => router.push(`/requests/${c.id}/appeal/write`)}
      />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">Check before you send</h1>
        <p className="m-body mt-2">
          This goes to the senior officer above the one who handled your RTI.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <div className="m-card">
            <p className="m-eyebrow">About</p>
            <p className="mt-1.5 text-[17px] font-semibold leading-snug text-ink">
              {c.plainTitle}
            </p>
            <p className="m-mono m-fine mt-1">{c.registrationNumber}</p>
          </div>

          <div className="m-card">
            <div className="flex items-baseline justify-between gap-3">
              <p className="m-eyebrow">Why</p>
              <Link
                href={`/requests/${c.id}/appeal`}
                className="shrink-0 text-[15px] font-semibold text-navy-800 underline"
              >
                Edit
              </Link>
            </div>
            <p className="mt-1.5 text-[17px] font-semibold leading-snug text-ink">
              {plain}
            </p>
            <p className="m-fine mt-1">Official: {draft.ground}</p>
          </div>

          <div className="m-card">
            <div className="flex items-baseline justify-between gap-3">
              <p className="m-eyebrow">What you wrote</p>
              <Link
                href={`/requests/${c.id}/appeal/write`}
                className="shrink-0 text-[15px] font-semibold text-navy-800 underline"
              >
                Edit
              </Link>
            </div>
            <p className="m-small mt-1.5 whitespace-pre-wrap">{draft.letter}</p>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-[17px] font-semibold text-ink">To pay</span>
            <span className="m-mono text-[19px] font-bold text-govgreen-700">
              ₹0
            </span>
          </div>
        </div>
      </div>

      <ActionBar note="No fee is charged for a first appeal.">
        <PrimaryButton busy={sending} busyLabel="Sending your appeal…" onClick={send}>
          Send my appeal — free
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
