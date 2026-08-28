"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DetailBar } from "@/components/mobile/AppBar";
import { useStore } from "@/lib/store";
import { deriveCase } from "@/lib/derive";
import { REPLY_DEADLINE_DAYS } from "@/lib/types";

/* ------------------------------------------------------------------
   Read their reply.

   Show the reply, then force the one decision that follows it. Most
   citizens read an unsatisfactory answer and simply stop, because
   nothing on the page tells them that an appeal exists, that it is
   free, or that there is a window for it.

   The reply text itself is never rewritten — it is the legal record.
   It is only set in something readable.
------------------------------------------------------------------- */

export default function ResponsePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCase, dayOf, appealOf, ready } = useStore();
  const [marked, setMarked] = useState(false);

  const c = getCase(id);

  if (!ready || !c) {
    return (
      <>
        <DetailBar backHref="/dashboard" backLabel="My RTIs" />
        <div className="m-col m-page pt-5" aria-busy>
          <div className="m-skel h-6 w-2/3" />
          <div className="m-skel mt-4 h-40 w-full rounded-xl" />
        </div>
      </>
    );
  }

  const d = deriveCase(c, dayOf(c.id), appealOf(c.id));

  if (!d.hasReply) {
    return (
      <>
        <DetailBar backHref={`/requests/${c.id}`} backLabel="Back" />
        <div className="m-col m-page pt-8 text-center">
          <h1 className="m-h2">No reply yet</h1>
          <p className="m-body mt-2">
            When they answer, it will appear here and we will text you.
          </p>
          <Link href={`/requests/${c.id}`} className="m-btn mt-5">
            Back to this RTI
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <DetailBar backHref={`/requests/${c.id}`} backLabel="Back" />

      <div className="m-col m-page pt-5">
        <div className="m-card m-card--done">
          <span className="inline-flex items-center rounded-full bg-govgreen-50 px-2.5 py-1 text-[12px] font-semibold text-govgreen-700">
            ✓ They replied
          </span>
          <p className="mt-2 text-[17px] font-semibold leading-snug text-ink">
            Answered on day {c.replyDay} of {REPLY_DEADLINE_DAYS}
          </p>
          <p className="m-fine mt-0.5">{c.authority.cpio}</p>
        </div>

        <div className="m-card mt-3">
          <p className="m-eyebrow">What they wrote</p>
          {/* 17px, 1.6 line height, ~40 characters. Officialese is not
              rewritten; it is made readable. */}
          <p className="mt-2 whitespace-pre-wrap text-[17px] leading-relaxed text-ink">
            {d.reply}
          </p>
        </div>

        <div className="m-card mt-3 flex items-center gap-3">
          <span className="min-w-0 flex-1">
            <span className="block text-[17px] font-semibold text-ink">
              Reply letter.pdf
            </span>
            {/* Page count and size, so somebody on mobile data knows what
                a tap will cost them. */}
            <span className="m-fine mt-0.5 block">3 pages · 240 KB</span>
          </span>
          <span className="m-tap -mr-2 shrink-0 text-[15px] font-semibold text-navy-800 underline">
            Open
          </span>
        </div>

        <hr className="my-6 border-line" />

        {marked ? (
          <div className="m-note m-note--good" role="status">
            <p className="font-semibold">Marked as answered.</p>
            <p className="mt-1">
              This RTI has moved to Replied in My RTIs.{" "}
              <button
                type="button"
                onClick={() => setMarked(false)}
                className="font-semibold underline"
              >
                Undo
              </button>
            </p>
          </div>
        ) : (
          <>
            <h2 className="m-h2">Did this answer your question?</h2>
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setMarked(true)}
                className="m-btn m-btn--go"
              >
                Yes — I&rsquo;m done
              </button>
              {/* The appeal screen pre-selects its ground from the case
                  state, so a citizen arriving from a reply lands on
                  "incomplete or misleading" already chosen. */}
              <button
                type="button"
                onClick={() => router.push(`/requests/${c.id}/appeal`)}
                className="m-btn m-btn--ghost"
              >
                No — I want to appeal
              </button>
            </div>
            <p className="m-fine mt-3 text-center">
              An appeal is free. You have 30 days from today.
            </p>
          </>
        )}
      </div>
    </>
  );
}
