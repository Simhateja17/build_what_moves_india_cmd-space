"use client";

import Link from "next/link";
import { RootBar } from "@/components/mobile/AppBar";
import { RtiLogo } from "@/components/mobile/Logo";
import { SiteFooter } from "@/components/mobile/SiteFooter";
import { TabBar } from "@/components/mobile/TabBar";
import { StatusCard, URGENCY_RANK, urgencyOf } from "@/components/mobile/StatusCard";
import { useStore } from "@/lib/store";
import { deriveCase } from "@/lib/derive";

/* ------------------------------------------------------------------
   Home.

   Signed out, it answers "what is this and what does it cost me" in the
   first two lines and then gets out of the way. Nothing above the fold
   except the sentence and the button — no stat counters, no scrolling
   hero, because on a phone those are three scrolls before the first
   thing a citizen can press.

   Signed in, whatever needs the citizen is the first thing on screen,
   with its own button. Everything else can wait.
------------------------------------------------------------------- */

export default function HomePage() {
  const { isAuthenticated, citizenName, cases, dayOf, appealOf, ready } =
    useStore();

  const rows = cases
    .map((c) => {
      const d = deriveCase(c, dayOf(c.id), appealOf(c.id));
      return { c, d, urgency: urgencyOf(d) };
    })
    .sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]);

  const first = rows[0];
  const signedIn = ready && isAuthenticated;

  return (
    <div className="m-shell flex min-h-full flex-1 flex-col">
      <RootBar title={signedIn ? `Namaste, ${citizenName.split(" ")[0]}` : "RTI Saral"} />

      {/* The column holds the content; the footer band sits outside it
          so it can run edge to edge. */}
      <main id="main" className="m-page flex-1">
        <div className="m-col pt-6">
        {!signedIn ? (
          <>
            <RtiLogo width={210} priority className="mb-6 h-auto w-[210px]" />
            <h1 className="m-h1">Ask the government a question.</h1>
            <p className="m-body mt-2.5">
              By law they must answer you in 30 days. It costs ₹10.
            </p>

            <div className="m-card m-card--stripe mt-6">
              <p className="m-h3">Start a new RTI</p>
              <p className="m-small mt-1">
                Six questions, one at a time. About five minutes.
              </p>
              <Link href="/login" className="m-btn mt-4">
                Start a new RTI
              </Link>
            </div>

            <div className="mt-3 flex gap-3">
              <Link href="/login" className="m-btn m-btn--ghost text-[15px]">
                Track an RTI
              </Link>
              <Link href="/about" className="m-btn m-btn--ghost text-[15px]">
                See an example
              </Link>
            </div>

            <div className="m-card mt-5">
              <p className="m-h3">What is an RTI?</p>
              <p className="m-small mt-1.5">
                It is a written question to a government office. Any Indian
                citizen can ask one. The officer must reply — or explain why
                not.
              </p>
              <Link
                href="/about"
                className="m-tap -ml-2 mt-2 justify-start text-[15px] font-semibold text-navy-800 underline"
              >
                Read a real one, start to finish
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Whatever needs the citizen comes first, with its button. */}
            {first && (first.urgency === "late" || first.urgency === "done") && (
              <div className="mb-5">
                <p className="m-eyebrow mb-2">Needs you</p>
                <StatusCard c={first.c} d={first.d} />
              </div>
            )}

            <Link href="/file-request" className="m-btn">
              Start a new RTI
            </Link>

            <p className="m-eyebrow mt-6">Your RTIs</p>
            <div className="mt-2.5 flex flex-col gap-3">
              {rows
                .filter((r) => r !== first || r.urgency === "waiting")
                .slice(0, 2)
                .map(({ c, d }) => (
                  <StatusCard key={c.id} c={c} d={d} />
                ))}
            </div>

            <Link
              href="/dashboard"
              className="m-tap mt-3 w-full justify-center text-[15px] font-semibold text-navy-800 underline"
            >
              See all {rows.length}
            </Link>
          </>
        )}
        </div>

        <SiteFooter />
      </main>

      <TabBar />
    </div>
  );
}
