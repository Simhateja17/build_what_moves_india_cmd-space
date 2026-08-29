import Link from "next/link";
import {
  FIRST_APPEAL_FILING_DAYS,
  PENALTY_CAP_INR,
  PENALTY_PER_DAY_INR,
  REPLY_DEADLINE_DAYS,
  SECOND_APPEAL_FILING_DAYS,
} from "@/lib/types";
import { FistBand } from "./FistBand";
import Image from "next/image";
import { RtiLogo } from "./RtiLogo";

export function GovFooter() {
  return (
    // The footer uses the same original-logo blue as the rest of the site.
    // A small tonal step keeps the raised-fist artwork readable without
    // returning to the old near-black navy.
    <footer
      className="relative isolate mt-6 overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(180deg, #4778bd 0%, #3d6fb3 52%, #3564a4 100%)",
      }}
    >
      <FistBand />

      {/* The emblem, in the footer's top-right corner. It sits in the empty
          run to the right of the "In this demo" links rather than on top of
          them, and is hidden below sm, where the three columns stack and
          there is no corner left to sit in. The artwork is white line work
          on black; the black is knocked out to transparency so the lines
          carry straight over the footer's blue. */}
      {/* Carried on the same centred, padded track as the columns below, so
          its right edge lines up with theirs. Pinned to the footer's own
          edge instead, it would drift out past the content on any viewport
          wider than the 1600px cap. */}
      <div className="pointer-events-none absolute inset-x-0 top-4 mx-auto hidden w-full max-w-[1600px] px-4 sm:block sm:px-8 lg:px-10 xl:px-12">
        <Image
          src="/emblem-white.png"
          alt="State Emblem of India"
          width={464}
          height={739}
          className="ml-auto h-[228px] w-auto select-none opacity-75 lg:h-[264px] xl:h-[300px]"
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-10 sm:grid-cols-3 sm:px-8 lg:px-10 xl:px-12">
        <div className="sm:border-r sm:border-white/10 sm:pr-8">
          <RtiLogo variant="white" className="h-auto w-[150px]" />
          <p className="mt-3 text-[15px] leading-relaxed text-white/75">
            A redesign concept for the Government of India&apos;s RTI Online
            portal, built for the Build What Moves India hackathon.
          </p>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-white/90">
            The law behind it
          </p>
          {/* The figures come from the statutory constants the rest of the
              app calculates with, so the footer cannot quietly drift out
              of step with the deadlines shown on a case. */}
          <ul className="mt-2 space-y-1.5 text-[15px] text-white/75">
            <li>Right to Information Act, 2005</li>
            <li>s.6(2) — no reason need be given</li>
            <li>
              s.7(1) — {REPLY_DEADLINE_DAYS} days to reply, 48 hours where
              life or liberty is concerned
            </li>
            <li>
              s.19 — first appeal in {FIRST_APPEAL_FILING_DAYS} days, second
              in {SECOND_APPEAL_FILING_DAYS}
            </li>
            <li>
              s.20 — ₹{PENALTY_PER_DAY_INR} a day against the officer, up to
              ₹{PENALTY_CAP_INR.toLocaleString("en-IN")}
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-white/90">In this demo</p>
          <ul className="mt-2 space-y-1.5 text-[15px] text-white/75">
            <li>
              <Link href="/track" className="hover:underline">
                Track without signing in
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Demo sign in
              </Link>
            </li>
            <li>
              <Link href="/guidelines" className="hover:underline">
                Portal guidelines
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        {/* A step up from white/50: this line sits over the densest
            part of the crowd, and needed the contrast back. */}
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2.5 px-4 py-4 sm:px-8 lg:px-10 xl:px-12">
          <p className="max-w-5xl text-sm text-white/70">
            This is an independent design concept and is not an official
            Government of India website. All data shown is fictional and created
            for demonstration. The real portal is at rtionline.gov.in.
          </p>
          {/* Moved off the dashboard, where these sat inside a call-to-action
              strip and competed with it. Provenance belongs with the rest of
              the disclaimer. */}
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-white/75">
            <li>✓ Local demo</li>
            <li>✓ Fictional case data</li>
            <li>✓ Independent concept</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
