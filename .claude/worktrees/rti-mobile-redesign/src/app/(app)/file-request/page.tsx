"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DetailBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { ChoiceCard, Sheet } from "@/components/mobile/Primitives";

/* ------------------------------------------------------------------
   Before you start.

   Replaces the portal's full-page GUIDELINES FOR USE OF RTI ONLINE
   PORTAL — twelve numbered clauses and a mandatory tick-box, which on
   a phone is roughly seven screens of scrolling before the first
   field. The gate stays; the reading does not.

   These three are the only clauses that change what the citizen does:
   the fee, the clock, and the central-versus-state scope that gets
   requests returned without a refund. The full text is one tap away.
------------------------------------------------------------------- */

const THINGS = [
  {
    mark: "₹10",
    title: "You pay ₹10",
    body: "By UPI, card or net banking. Free if you have a BPL card.",
  },
  {
    mark: "30",
    title: "They answer in 30 days",
    body: "We count the days for you and tell you the moment they are late.",
  },
  {
    mark: "केंद्र",
    title: "Central offices only",
    body: "For a state office we will show you where to file instead — before you pay.",
  },
];

export default function BeforeYouStartPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [showFull, setShowFull] = useState(false);

  return (
    <>
      <DetailBar backHref="/dashboard" backLabel="My RTIs" />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">Three things before you start</h1>

        <div className="mt-5 flex flex-col gap-3">
          {THINGS.map((t) => (
            <div key={t.title} className="m-card flex items-start gap-3.5">
              <span
                className="m-mono w-11 shrink-0 pt-0.5 text-[20px] font-bold leading-none text-navy-700"
                aria-hidden
              >
                {t.mark}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold leading-snug text-ink">
                  {t.title}
                </span>
                <span className="m-small mt-1 block">{t.body}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          {/* The whole row is the target, not the 24px box inside it. */}
          <ChoiceCard
            kind="check"
            checked={agreed}
            onChange={() => setAgreed((v) => !v)}
            title="I have read these three things"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFull(true)}
          className="m-tap mt-3 w-full justify-center text-[15px] font-semibold text-navy-800 underline"
        >
          Read the full guidelines
        </button>
      </div>

      <ActionBar>
        <PrimaryButton
          disabled={!agreed}
          disabledReason="Tick the box above to start."
          onClick={() => router.push("/file-request/authority")}
        >
          Start · Step 1 of 5
        </PrimaryButton>
      </ActionBar>

      <Sheet
        open={showFull}
        onClose={() => setShowFull(false)}
        title="The full guidelines"
      >
        <div className="m-small flex flex-col gap-3">
          <p>
            This portal can be used by Indian citizens to file an RTI request,
            pay the fee online, and file a first appeal, to Ministries and
            Departments of the Government of India.
          </p>
          <p>
            The prescribed fee is ₹10 under the RTI Rules, 2012. No fee is
            payable by a citizen below the poverty line, who must attach a copy
            of the certificate issued by the appropriate government.
          </p>
          <p>
            A request must be about information held by the public authority you
            select. Requests for a public authority under a State Government,
            including the Government of NCT of Delhi, will be returned without
            refund of the amount paid.
          </p>
          <p>
            Text is limited to 3000 characters. A longer application can be
            uploaded as a PDF of up to 1 MB.
          </p>
          <p>
            All requirements of the RTI Act, 2005 — including time limits and
            exemptions — continue to apply.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFull(false)}
          className="m-btn m-btn--ghost mt-1"
        >
          Close
        </button>
      </Sheet>

      <p className="sr-only">
        <Link href="/dashboard">Back to my RTIs</Link>
      </p>
    </>
  );
}
