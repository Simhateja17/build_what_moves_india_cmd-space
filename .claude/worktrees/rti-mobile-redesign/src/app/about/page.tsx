"use client";

import Link from "next/link";
import { RootBar } from "@/components/mobile/AppBar";
import { SiteFooter } from "@/components/mobile/SiteFooter";
import { TabBar } from "@/components/mobile/TabBar";

/* ------------------------------------------------------------------
   Help.

   The third tab. Everything a citizen might otherwise hunt for in a
   hamburger menu lives here: what an RTI is, what it costs, what the
   deadlines are, and the settings — language and text size — that have
   no business hiding behind an icon.

   Written as questions, because that is how people arrive.
------------------------------------------------------------------- */

const QUESTIONS = [
  {
    q: "What is an RTI?",
    a: "A written question to a government office, asking for information it already holds. Any Indian citizen can file one. The officer must answer, or give a legal reason for refusing.",
  },
  {
    q: "What does it cost?",
    a: "₹10, fixed by the RTI Rules, 2012. Nothing if you hold a BPL card and attach a copy of it. A first appeal is always free. Later, an officer may ask for photocopy costs — you will be told the amount and the reason before you pay.",
  },
  {
    q: "How long do they have?",
    a: "30 days to reply, under section 7(1). If they miss it, that counts as a refusal in law, you can appeal free of cost, and a penalty of ₹250 a day starts running against the officer — up to ₹25,000.",
  },
  {
    q: "What can I ask for?",
    a: "Records that already exist: files, orders, notings, dates, names, amounts, inspection reports. You cannot ask for an opinion, and you cannot ask them to create something new. \"Copies of the inspection reports for March 2026\" works; \"Why is this department so slow?\" does not.",
  },
  {
    q: "What if they never reply?",
    a: "You file a first appeal. It goes to a senior officer, not to the person who ignored you, and it costs nothing. We write the letter for you and pre-fill the reason. They then have 45 days to decide.",
  },
  {
    q: "What if I pick the wrong office?",
    a: "If it is another central office, they must transfer it and you keep your place in the queue — we follow the new number for you. If it is a state government office, the request is returned and the ₹10 is not refunded, so we warn you before you pay.",
  },
  {
    q: "I paid but got no number",
    a: "Registration numbers are issued in batches and can take up to 48 working hours. Your money is not lost. Do not pay again — a second payment creates a second RTI and is not refunded. We text you the moment the number arrives.",
  },
];

export default function HelpPage() {
  return (
    <div className="m-shell flex min-h-full flex-1 flex-col">
      <RootBar title="Help" />

      <main id="main" className="m-page flex-1">
        <div className="m-col pt-5">
        <h1 className="m-h1">How this works</h1>
        <p className="m-body mt-2">
          Seven questions, answered plainly. Nothing here needs a lawyer.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {QUESTIONS.map(({ q, a }) => (
            <details key={q} className="m-card">
              <summary className="m-tap w-full cursor-pointer justify-start text-[17px] font-semibold leading-snug text-ink">
                {q}
              </summary>
              <p className="m-small mt-2">{a}</p>
            </details>
          ))}
        </div>

        {/* Settings live here, not behind an icon. */}
        <p className="m-eyebrow mt-7">Settings</p>
        <div className="mt-2.5 flex flex-col gap-3">
          <div className="m-card flex items-center gap-3">
            <span className="flex-1 text-[17px] font-semibold text-ink">
              Language
            </span>
            <span className="m-fine">English · हिन्दी</span>
          </div>
          <div className="m-card flex items-center gap-3">
            <span className="flex-1 text-[17px] font-semibold text-ink">
              Text size
            </span>
            <span className="m-fine">A · A+ · A−</span>
          </div>
        </div>

        <div className="m-card m-card--stripe mt-5">
          <p className="m-h3">Still stuck?</p>
          <p className="m-small mt-1">
            Every RTI you file lists the officer who has to answer it, with a
            phone number you can tap to call.
          </p>
          <Link href="/dashboard" className="m-btn mt-3.5">
            Go to My RTIs
          </Link>
        </div>

        </div>

        <SiteFooter />
      </main>

      <TabBar />
    </div>
  );
}
