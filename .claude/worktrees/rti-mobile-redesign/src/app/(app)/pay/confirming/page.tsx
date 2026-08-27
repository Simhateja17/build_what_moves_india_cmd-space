"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { RTI_FEE_INR, useDraft } from "@/lib/draft";
import { useStore } from "@/lib/store";
import { caseFromDraft, makeTransactionRef } from "@/lib/filing";

/* ------------------------------------------------------------------
   Payment — confirming, and the three ways it ends.

   A bare spinner tells a frightened person nothing. Naming the three
   things that are happening — bank, submission, number — turns dead
   waiting into visible progress, and pre-explains the state they land
   in if the third one does not complete.

   The three endings are all real portal states:
     done    — number issued
     pending — money taken, number not yet issued (24–48 working hours)
     failed  — bank declined, nothing charged
   The old portal has a screen for exactly one of them.
------------------------------------------------------------------- */

type Phase = "bank" | "sending" | "number" | "done" | "pending" | "failed";
type Outcome = "done" | "pending" | "failed";

const STEPS = [
  { key: "bank", label: `Your bank approved ₹${RTI_FEE_INR}` },
  { key: "sending", label: "Sending your RTI to the office" },
  { key: "number", label: "Getting your registration number" },
] as const;

export default function ConfirmingPage() {
  const router = useRouter();
  const { draft, clear } = useDraft();
  const { addCase } = useStore();

  const free = draft.isBpl;
  const [phase, setPhase] = useState<Phase>(free ? "sending" : "bank");
  const [outcome, setOutcome] = useState<Outcome>("done");
  const [txnRef] = useState(makeTransactionRef);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const settled = useRef(false);

  const finish = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    const id = `new-${Date.now()}`;
    addCase(caseFromDraft(draft, id));
    clear();
    // replace, never push: back from the sent screen must not be able to
    // reach payment again and take a second ₹10.
    router.replace(`/filed/${id}`);
  }, [addCase, clear, draft, router]);

  useEffect(() => {
    const at = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    if (!free) at(() => setPhase("sending"), 1400);
    at(() => setPhase("number"), free ? 1200 : 2900);
    at(
      () => {
        if (outcome === "done") finish();
        else setPhase(outcome);
      },
      free ? 2400 : 4400,
    );

    const list = timers.current;
    return () => {
      list.forEach(clearTimeout);
      timers.current = [];
    };
    // Deliberately mounts once: restarting the sequence on every state
    // change would replay the bank step the citizen already passed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back is blocked while the bank has the money. The portal prints a
  // warning about this; here the warning is enforced.
  const working = phase === "bank" || phase === "sending" || phase === "number";

  useEffect(() => {
    if (!working) return;
    const onPop = () => {
      setLeaving(true);
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPop);
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("beforeunload", warn);
    };
  }, [working]);

  const doneIndex = free
    ? { sending: 0, number: 1 }[phase as "sending" | "number"] ?? 2
    : { bank: 0, sending: 1, number: 2 }[phase as "bank" | "sending" | "number"] ?? 3;

  /* ---- Still working -------------------------------------------- */
  if (working) {
    return (
      <div className="m-col flex min-h-[70vh] flex-col justify-center py-10">
        <div
          className="mx-auto h-10 w-10 rounded-full border-[3.5px] border-line border-t-navy-700 motion-safe:animate-spin"
          role="status"
          aria-label="Confirming your payment"
        />
        <h1 className="m-h2 mt-5 text-center">
          {free ? "Sending your RTI…" : "Confirming your payment…"}
        </h1>
        <p className="m-body mt-2 text-center">
          This can take up to 30 seconds. Please don&rsquo;t close this screen.
        </p>

        <div className="m-card mt-6">
          <ul className="flex flex-col gap-3">
            {STEPS.filter((s) => !(free && s.key === "bank")).map((s, i) => {
              const state = i < doneIndex ? "done" : i === doneIndex ? "now" : "next";
              return (
                <li key={s.key} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={`mt-0.5 text-[15px] ${
                      state === "done"
                        ? "text-govgreen-700"
                        : state === "now"
                          ? "text-navy-700"
                          : "text-muted/60"
                    }`}
                  >
                    {state === "done" ? "✓" : state === "now" ? "●" : "○"}
                  </span>
                  <span
                    className={`text-[15px] leading-snug ${
                      state === "next" ? "text-muted" : "font-semibold text-ink"
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {!free && (
          <p className="m-fine mt-4 text-center">
            Money is taken only once. You will not be charged twice.
          </p>
        )}

        {leaving && (
          <div className="m-note m-note--warn mt-5" role="alert">
            Your payment is still being confirmed. Leaving now will not cancel
            it — please wait a few more seconds.
          </div>
        )}

        {/* Demo control. In production the gateway decides this. */}
        <fieldset className="mt-8 rounded-xl border border-dashed border-line p-3">
          <legend className="m-fine px-1">Demo: how this attempt ends</legend>
          <div className="flex flex-wrap gap-2">
            {(["done", "pending", "failed"] as const).map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={outcome === o}
                onClick={() => setOutcome(o)}
                className="m-chip min-h-[40px]"
              >
                {o === "done"
                  ? "Number issued"
                  : o === "pending"
                    ? "Paid, no number"
                    : "Payment fails"}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    );
  }

  /* ---- Paid, but no number yet ----------------------------------- */
  if (phase === "pending") {
    return (
      <>
        <div className="m-col m-page--action pt-5">
          <div className="m-note m-note--warn">
            <p className="text-[17px] font-bold leading-snug">
              Your ₹{RTI_FEE_INR} was paid. Your RTI number is taking longer.
            </p>
            <p className="mt-1.5">
              Your money reached the department. Registration numbers are issued
              in batches and can take up to 48 working hours.
            </p>
          </div>

          <div className="m-card mt-4">
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5 text-govgreen-700">✓</span>
                <span className="text-[15px] font-semibold text-ink">
                  ₹{RTI_FEE_INR} debited just now
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5 text-govgreen-700">✓</span>
                <span className="text-[15px] font-semibold text-ink">
                  Your RTI reached the office
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5 text-saffron-600">◷</span>
                <span className="text-[15px] font-semibold text-saffron-600">
                  Waiting for the registration number
                </span>
              </li>
            </ul>
          </div>

          <div className="m-card mt-3">
            <p className="m-eyebrow">Transaction reference</p>
            {/* The only thing a help desk can act on. Asking a citizen to
                copy it off a screenshot is how these cases die. */}
            <p className="m-mono mt-1 select-all break-all text-[15px] font-semibold text-navy-900">
              {txnRef}
            </p>
          </div>

          <div className="m-note m-note--bad mt-3">
            Do not pay again. A second payment creates a second RTI and is not
            refunded.
          </div>
        </div>

        <ActionBar note="We will text you the moment your number arrives.">
          <PrimaryButton onClick={() => router.replace("/dashboard")}>
            Go to My RTIs
          </PrimaryButton>
        </ActionBar>
      </>
    );
  }

  /* ---- Failed ----------------------------------------------------- */
  return (
    <>
      <div className="m-col m-page--action pt-8">
        <div className="flex flex-col items-center text-center">
          <span
            aria-hidden
            className="flex h-14 w-14 items-center justify-center rounded-full bg-govred-50 text-[26px] font-bold text-govred-700"
          >
            !
          </span>
          <h1 className="m-h2 mt-4">Payment didn&rsquo;t go through</h1>
          <p className="m-body mt-2">
            Your bank declined it.{" "}
            <span className="font-semibold text-ink">No money was taken.</span>
          </p>
        </div>

        <div className="m-note m-note--info mt-5">
          Your RTI is saved. Nothing you wrote is lost — you can pay now or come
          back later.
        </div>

        <div className="m-card mt-3">
          <p className="m-eyebrow">Common reasons</p>
          <p className="m-small mt-1">
            The UPI request timed out · the daily limit was reached · the app was
            closed before approving
          </p>
        </div>
      </div>

      <ActionBar>
        <PrimaryButton onClick={() => router.replace("/pay")}>
          Try paying again
        </PrimaryButton>
        <PrimaryButton variant="ghost" onClick={() => router.replace("/dashboard")}>
          Save and pay later
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
