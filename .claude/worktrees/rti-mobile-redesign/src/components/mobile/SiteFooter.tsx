import Image from "next/image";
import Link from "next/link";
import { RtiMark } from "./Logo";

/* ------------------------------------------------------------------
   The footer.

   Built the way the reference site does it: a full-bleed illustrated
   band sitting directly on top of a dark bar, with no gap between
   them, and the small print closing it off underneath.

   The band is the only decorative image in the whole app. It earns its
   place here because this is the end of the page — nothing below it is
   waiting on the download, so it cannot delay anything a citizen came
   to do.
------------------------------------------------------------------- */

export function SiteFooter() {
  return (
    <footer className="mt-10">
      {/* The band. Full-bleed: no gutters, edge to edge. */}
      <div className="relative aspect-[798/384] w-full bg-[#f4f4f2]">
        <Image
          src="/rti-mural.jpg"
          alt="A wall painted with raised fists beneath the Right to Information mark"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* The dark bar, flush against the band above it. */}
      <div className="bg-navy-900 text-white">
        <div className="m-col py-7">
          <div className="flex items-center gap-3">
            <RtiMark className="h-9 w-[17px] shrink-0 text-white" />
            <div>
              <p className="text-[17px] font-bold leading-tight">RTI Saral</p>
              <p className="text-[13px] leading-tight text-white/60">
                Right to Information, made plain
              </p>
            </div>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-white/75">
            Every Indian has the right to ask the government a question and get
            a legal answer in 30 days. This is what that right looks like when
            it fits in your hand.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">
                On this app
              </p>
              <ul className="mt-2 flex flex-col gap-2 text-[15px] text-white/80">
                <li>
                  <Link href="/dashboard" className="m-tap -ml-1 justify-start">
                    My RTIs
                  </Link>
                </li>
                <li>
                  <Link href="/file-request" className="m-tap -ml-1 justify-start">
                    File an RTI
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="m-tap -ml-1 justify-start">
                    How this works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">
                The law behind it
              </p>
              <ul className="mt-2 flex flex-col gap-2 text-[15px] leading-snug text-white/70">
                <li>RTI Act, 2005</li>
                <li>s.7(1) — 30 days to reply</li>
                <li>s.19 — appeals</li>
                <li>s.20 — penalty on the officer</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <p className="m-col py-4 text-[13px] leading-relaxed text-white/45">
            An independent design concept, not an official Government of India
            website. All case data shown is fictional. The real portal is at
            rtionline.gov.in.
          </p>
        </div>
      </div>
    </footer>
  );
}
