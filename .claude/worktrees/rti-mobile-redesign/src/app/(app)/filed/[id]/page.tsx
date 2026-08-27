"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { RegNumber } from "@/components/mobile/Primitives";
import { useStore } from "@/lib/store";
import { formatDate, replyDueDate } from "@/lib/filing";
import { REPLY_DEADLINE_DAYS } from "@/lib/types";

/* ------------------------------------------------------------------
   Sent.

   The registration number is the one thing a citizen must keep — it is
   what tracking and appealing both key off. On the current portal it
   appears once, inside a paragraph, on a page they may never see
   again. Here it is the screen.

   There is no back button: this route is reached with history.replace,
   so Back goes to My RTIs and can never return to payment.
------------------------------------------------------------------- */

export default function FiledPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCase, ready } = useStore();

  const c = getCase(id);

  if (!ready) {
    return (
      <div className="m-col py-10">
        <div className="m-skel h-14 w-14 rounded-full" />
        <div className="m-skel mt-5 h-7 w-3/4" />
        <div className="m-skel mt-3 h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (!c) {
    return (
      <div className="m-col py-10">
        <h1 className="m-h2">We could not find that RTI</h1>
        <p className="m-body mt-2">
          It may have been filed on another device. Your RTIs are listed under
          My RTIs.
        </p>
        <Link href="/dashboard" className="m-btn mt-5">
          Go to My RTIs
        </Link>
      </div>
    );
  }

  const due = replyDueDate(0);

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
          <h1 className="m-h1 mt-4">Your RTI has been sent</h1>
        </div>

        <div className="mt-5">
          <RegNumber value={c.registrationNumber} />
        </div>

        <div className="m-card mt-3 flex items-start gap-3.5">
          <span
            className="m-mono w-11 shrink-0 text-[24px] font-bold leading-none text-navy-700"
            aria-hidden
          >
            {REPLY_DEADLINE_DAYS}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[17px] font-semibold leading-snug text-ink">
              They must reply by {formatDate(due)}
            </span>
            <span className="m-small mt-1 block">
              If they don&rsquo;t, you can appeal free of cost. We will tell you.
            </span>
            <span className="m-fine mt-1 block">
              Section 7(1), Right to Information Act, 2005
            </span>
          </span>
        </div>

        <p className="m-fine mt-4 text-center">
          Sent to your mobile and to {c.authority.office}.
        </p>
      </div>

      <ActionBar>
        <PrimaryButton variant="go" onClick={() => router.push(`/requests/${c.id}`)}>
          Track this RTI
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          onClick={() => router.push("/file-request")}
        >
          File another RTI
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
