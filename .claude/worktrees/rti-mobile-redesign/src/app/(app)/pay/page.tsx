"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DetailBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { ChoiceCard } from "@/components/mobile/Primitives";
import { RTI_FEE_INR, useDraft } from "@/lib/draft";
import { getAuthority } from "@/lib/authorities";

/* ------------------------------------------------------------------
   Payment — choose a method.

   UPI first and pre-selected: it is the method most citizens have, it
   needs no card number typed on a phone, and it returns fastest.

   Back is still allowed here, because nothing has been charged yet. It
   is only blocked once the gateway has the money — see /pay/confirming.
------------------------------------------------------------------- */

const METHODS = [
  {
    id: "upi",
    title: "UPI",
    detail: "GPay, PhonePe, Paytm — any UPI app",
    tag: "Fastest",
  },
  { id: "card", title: "Debit or credit card", detail: "RuPay, Visa, Mastercard" },
  { id: "net", title: "Net banking", detail: "Log in to your bank" },
];

export default function PayPage() {
  const router = useRouter();
  const { draft } = useDraft();
  const [method, setMethod] = useState("upi");

  const authority = getAuthority(draft.authorityId);

  return (
    <>
      <DetailBar backHref="/file-request/review" backLabel="Back" />

      <div className="m-col m-page--action pt-5">
        <div className="m-card text-center">
          <p className="m-eyebrow">Amount to pay</p>
          <p className="m-mono mt-1 text-[38px] font-bold leading-none tracking-tight text-navy-900">
            ₹{RTI_FEE_INR}
          </p>
          <p className="m-small mt-1.5">
            RTI fee · {authority?.short ?? "your chosen office"}
          </p>
        </div>

        <p className="m-eyebrow mt-6">How do you want to pay?</p>
        <div
          role="radiogroup"
          aria-label="Payment method"
          className="mt-2.5 flex flex-col gap-3"
        >
          {METHODS.map((m) => (
            <ChoiceCard
              key={m.id}
              checked={method === m.id}
              onChange={() => setMethod(m.id)}
              title={
                <span className="flex items-center gap-2">
                  {m.title}
                  {m.tag && (
                    <span className="rounded-full bg-govgreen-50 px-2 py-0.5 text-[12px] font-semibold text-govgreen-700">
                      {m.tag}
                    </span>
                  )}
                </span>
              }
              detail={m.detail}
            />
          ))}
        </div>

        {/* The portal prints this warning and then does nothing about it.
            Here it is also enforced on the next screen. */}
        <div className="m-note m-note--warn mt-5">
          Once you tap Pay, do not press back or refresh until you see your RTI
          number.
        </div>
      </div>

      <ActionBar>
        <PrimaryButton
          onClick={() => router.push(`/pay/confirming?method=${method}`)}
        >
          Pay ₹{RTI_FEE_INR}
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
