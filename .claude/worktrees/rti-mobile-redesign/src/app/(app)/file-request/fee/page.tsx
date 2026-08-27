"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { ChoiceCard, Field, Sheet } from "@/components/mobile/Primitives";
import { RTI_FEE_INR, feeError, useDraft } from "@/lib/draft";

/* ------------------------------------------------------------------
   Step 4 of 5 — fee or waiver.

   Replaces the select labelled "Is the Applicant Below Poverty Line ?"
   — a piece of form-speak that decides whether the citizen pays
   anything at all, buried among twenty other fields.

   The question a person is actually answering is "what will this cost
   me", so that is the question asked, as two large cards that each
   state their own consequence.
------------------------------------------------------------------- */

export default function FeeStep() {
  const router = useRouter();
  const { draft, set, markDone } = useDraft();
  const [showWhy, setShowWhy] = useState(false);

  const error = feeError(draft);

  return (
    <>
      <TaskBar step={4} total={5} onBack={() => router.push("/file-request/you")} />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">The fee is ₹{RTI_FEE_INR}</h1>
        <p className="m-body mt-2">
          Fixed by the RTI Rules, 2012. Not a charge by this app.
        </p>

        <div
          role="radiogroup"
          aria-label="How you will pay"
          className="mt-5 flex flex-col gap-3"
        >
          <ChoiceCard
            checked={!draft.isBpl}
            onChange={() => set({ isBpl: false })}
            title={`Pay ₹${RTI_FEE_INR}`}
            detail="UPI, card or net banking. Takes a minute."
          />
          <ChoiceCard
            checked={draft.isBpl}
            onChange={() => set({ isBpl: true })}
            title="I have a BPL card — no fee"
            detail="You will attach a photo of the card. Nothing to pay."
          />
        </div>

        {!draft.isBpl && (
          <div className="m-note m-note--info mt-4">
            Below Poverty Line card holders pay nothing for an RTI. If you have
            the card, choose the second option — you only need a photo of it.
          </div>
        )}

        {draft.isBpl && (
          <div className="mt-5 flex flex-col gap-4">
            <div className="m-note m-note--good">
              No fee is payable. You will need to attach proof of your BPL
              status so the office can allow the waiver.
            </div>

            <Field label="BPL card number">
              <input
                className="m-field m-mono"
                value={draft.bplCardNo}
                onChange={(e) => set({ bplCardNo: e.target.value })}
              />
            </Field>

            <div className="flex gap-3">
              <div className="w-[40%]">
                <Field label="Year of issue">
                  <input
                    className="m-field m-mono"
                    inputMode="numeric"
                    maxLength={4}
                    value={draft.bplYear}
                    onChange={(e) =>
                      set({ bplYear: e.target.value.replace(/\D/g, "").slice(0, 4) })
                    }
                  />
                </Field>
              </div>
              <div className="min-w-0 flex-1">
                <Field label="Issued by">
                  <input
                    className="m-field"
                    value={draft.bplIssuer}
                    onChange={(e) => set({ bplIssuer: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="m-card">
              <p className="text-[17px] font-semibold text-ink">
                Photo of your BPL card
              </p>
              <p className="m-fine mt-0.5">Required · PDF or photo, up to 1 MB</p>
              {draft.bplProofName ? (
                <div className="mt-3 flex items-center gap-2">
                  <span className="m-small min-w-0 flex-1 truncate font-medium text-ink">
                    {draft.bplProofName}
                  </span>
                  <button
                    type="button"
                    onClick={() => set({ bplProofName: undefined })}
                    className="m-tap -mr-2 shrink-0 text-[15px] font-semibold text-govred-700 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  {/* Camera first — a BPL card is a physical object. */}
                  <button
                    type="button"
                    onClick={() => set({ bplProofName: "BPL card photo.pdf" })}
                    className="m-btn m-btn--ghost min-h-[48px] text-[15px]"
                  >
                    Take a photo
                  </button>
                  <button
                    type="button"
                    onClick={() => set({ bplProofName: "bpl-card.pdf" })}
                    className="m-btn m-btn--ghost min-h-[48px] text-[15px]"
                  >
                    Choose a file
                  </button>
                </div>
              )}
              {error && (
                <p className="m-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Nobody is trapped by a card they cannot photograph now. */}
            <button
              type="button"
              onClick={() => set({ isBpl: false })}
              className="m-tap w-full justify-center text-[15px] font-semibold text-navy-800 underline"
            >
              Pay ₹{RTI_FEE_INR} instead
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowWhy(true)}
          className="m-tap mt-4 w-full justify-center text-[15px] font-semibold text-navy-800 underline"
        >
          Why is there a fee at all?
        </button>
      </div>

      <ActionBar>
        <PrimaryButton
          disabled={Boolean(error)}
          disabledReason={error ?? undefined}
          onClick={() => {
            markDone("fee");
            router.push("/file-request/review");
          }}
        >
          Continue
        </PrimaryButton>
      </ActionBar>

      <Sheet open={showWhy} onClose={() => setShowWhy(false)} title="About the fee">
        <div className="m-small flex flex-col gap-3">
          <p>
            ₹{RTI_FEE_INR} is the application fee set by the RTI Rules, 2012. It
            goes to the government, not to this app, and it is the same at every
            central office.
          </p>
          <p>
            A citizen below the poverty line pays nothing, on producing the
            certificate issued by the appropriate government.
          </p>
          <p>
            Later, an officer may ask for more money — for photocopies, for
            example. That is separate, it only happens if the answer is large,
            and you will be told the amount and the reason before you pay it.
          </p>
          <p className="font-semibold text-ink">A first appeal is always free.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowWhy(false)}
          className="m-btn m-btn--ghost mt-1"
        >
          Close
        </button>
      </Sheet>
    </>
  );
}
