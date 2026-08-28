"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TaskBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { RTI_FEE_INR, useDraft } from "@/lib/draft";
import { getAuthority } from "@/lib/authorities";

/* ------------------------------------------------------------------
   Step 5 of 5 — check and send.

   Three blocks in the order they were filled in, each with its own
   Edit that returns to that step and comes straight back here. The
   intermediate steps are not replayed: correcting a typo in the
   address should not cost four taps.
------------------------------------------------------------------- */

function Block({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="m-card">
      <div className="flex items-baseline justify-between gap-3">
        <p className="m-eyebrow">{label}</p>
        <Link
          href={href}
          className="shrink-0 text-[15px] font-semibold text-navy-800 underline"
        >
          Edit
        </Link>
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default function ReviewStep() {
  const router = useRouter();
  const { draft } = useDraft();
  const [readAll, setReadAll] = useState(false);

  const authority = getAuthority(draft.authorityId);
  const free = draft.isBpl;

  return (
    <>
      <TaskBar step={5} total={5} onBack={() => router.push("/file-request/fee")} />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">Check before you send</h1>
        <p className="m-body mt-2">You cannot change an RTI after it is sent.</p>

        <div className="mt-5 flex flex-col gap-3">
          <Block label="Going to" href="/file-request/authority">
            <p className="text-[17px] font-semibold leading-snug text-ink">
              {authority?.office ?? "No office chosen"}
            </p>
            <p className="m-small">{authority?.ministry}</p>
          </Block>

          <Block label="Your question" href="/file-request/question">
            <p
              className={`m-small whitespace-pre-wrap ${readAll ? "" : "line-clamp-3"}`}
            >
              {draft.question}
            </p>
            {draft.question.length > 160 && (
              <button
                type="button"
                onClick={() => setReadAll((v) => !v)}
                className="m-tap -ml-2 mt-1 justify-start text-[15px] font-semibold text-navy-800 underline"
              >
                {readAll ? "Show less" : "Read all"}
              </button>
            )}
            {draft.attachmentName && (
              <p className="m-fine mt-2">Attached: {draft.attachmentName}</p>
            )}
          </Block>

          <Block label="From" href="/file-request/you">
            <p className="text-[17px] font-semibold text-ink">{draft.name}</p>
            <p className="m-fine mt-0.5">
              {[draft.address, draft.pincode, draft.state]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="m-fine">{draft.email}</p>
          </Block>

          <div className="flex items-center justify-between px-1">
            <span className="text-[17px] font-semibold text-ink">To pay</span>
            <span className="m-mono text-[19px] font-bold text-navy-900">
              {free ? "₹0" : `₹${RTI_FEE_INR}`}
            </span>
          </div>
          {free && (
            <p className="m-fine -mt-1 px-1">
              Fee waived — BPL certificate attached.
            </p>
          )}
        </div>
      </div>

      {/* The amount is on the button as well as in the summary. Nobody
          should reach a bank page unsure what is being charged. */}
      <ActionBar
        note={
          free
            ? "No payment needed. Your RTI goes straight to the office."
            : "You will be taken to your bank or UPI app."
        }
      >
        <PrimaryButton
          disabled={!authority || draft.question.trim().length < 15}
          disabledReason="Some steps are not finished. Use Edit above to complete them."
          onClick={() =>
            router.push(free ? "/pay/confirming?free=1" : "/pay")
          }
        >
          {free ? "Send my RTI — no fee" : `Pay ₹${RTI_FEE_INR} and send`}
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
