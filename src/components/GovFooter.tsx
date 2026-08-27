import Link from "next/link";
import { FistBand } from "./FistBand";
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

      <div className="relative mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-10 sm:grid-cols-3 sm:px-8 lg:px-10 xl:px-12">
        <div className="sm:border-r sm:border-white/10 sm:pr-8">
          <div className="inline-flex overflow-hidden rounded-lg bg-white px-2 py-1">
            <RtiLogo className="w-[150px]" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            A redesign concept for the Government of India&apos;s RTI Online
            portal, built for the Build What Moves India hackathon.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">The law behind it</p>
          <ul className="mt-2 space-y-1.5 text-sm text-white/70">
            <li>Right to Information Act, 2005</li>
            <li>s.7(1) — 30 days to reply</li>
            <li>s.19 — appeals and time limits</li>
            <li>s.20 — penalty on the officer</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">In this demo</p>
          <ul className="mt-2 space-y-1.5 text-sm text-white/70">
            <li>
              <Link href="/about" className="hover:underline">
                How this works
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Demo sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        {/* A step up from white/50: this line sits over the densest
            part of the crowd, and needed the contrast back. */}
        <p className="mx-auto w-full max-w-[1600px] px-4 py-4 text-xs text-white/65 sm:px-8 lg:px-10 xl:px-12">
          This is an independent design concept and is not an official
          Government of India website. All data shown is fictional and created
          for demonstration. The real portal is at rtionline.gov.in.
        </p>
      </div>
    </footer>
  );
}
