"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n";

const AUTO_ADVANCE_MS = 4000;

const TOPICS = [
  {
    label: "About the RTI Act",
    title: "Why this law exists",
    body: "The Right to Information Act, 2005 gives every citizen of India the right to request records held by a public authority. Files, orders, reports, dates, spending details: any record held by a government office may be requested, and the law requires the responsible office to answer within a fixed time.",
  },
  {
    label: "Who can file an RTI",
    title: "This right belongs to you",
    body: "Any citizen of India may file a request, with no exceptions. No explanation is required for making a request, and there is no need to show that the matter affects you personally. The request need only describe what is sought clearly enough to be located.",
  },
  {
    label: "What information you can ask for",
    title: "Records held by the government",
    body: "Copies of files, orders, contracts, reports, inspection records, expenditure details and more may be requested. The clearest requests ask for records and facts already held, rather than for opinion or justification.",
  },
  {
    label: "Fees and exemptions",
    title: "The fee is not a barrier",
    body: "A small fee applies to most requests, along with charges for copies. The fee is waived entirely for a BPL cardholder. Where a category of information is exempt under the Act, the exact reason for withholding it must still be provided.",
  },
  {
    label: "Response and appeal timelines",
    title: "Fixed timelines apply",
    body: "A reply is required within 30 days. If that deadline is missed, or a request is refused without reason or answered only in part, a First Appeal may be filed. Every deadline and next step remains visible throughout.",
  },
];

export function GeneralInformation() {
  const [selected, setSelected] = useState(0);
  const { t } = useLocale();
  const topic = TOPICS[selected];

  useEffect(() => {
    const id = setInterval(() => {
      setSelected((current) => (current + 1) % TOPICS.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(id);
  }, [selected]);

  return (
    <Reveal className="grid gap-7 py-5 md:grid-cols-[minmax(220px,0.72fr)_minmax(0,2fr)] md:gap-12 lg:gap-16">
      <div className="flex min-h-[320px] flex-col sm:min-h-[380px] md:py-3 lg:min-h-[420px]">
        <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
          {t("General Information")}
        </h2>
        <div className="mt-4 h-px w-full bg-line" />
        <ul className="flex flex-1 flex-col divide-y divide-line">
          {TOPICS.map((item, index) => (
            <li key={item.label} className="flex flex-1">
              <button
                type="button"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
                className={`group flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm leading-snug transition ${
                  selected === index
                    ? "font-semibold text-navy-700"
                    : "text-ink-2 hover:text-navy-700"
                }`}
              >
                <span>{t(item.label)}</span>
                <span
                  aria-hidden
                  className={`transition ${
                    selected === index
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                  }`}
                >
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <article
        className="gov-card relative grid min-h-[320px] items-center gap-6 p-6 sm:min-h-[380px] sm:p-8 lg:min-h-[420px] lg:grid-cols-[minmax(0,1.45fr)_minmax(220px,0.75fr)] lg:gap-10"
        aria-live="polite"
      >
        <div key={selected} className="animate-slide">
          <p className="text-lg font-bold text-saffron-500">{t(topic.title)}</p>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-ink-2">
            {t(topic.body)}
          </p>
          <Link
            href="/faq"
            className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-navy-700 transition hover:text-navy-900 hover:underline"
          >
            {t("Know more")} <span aria-hidden>›</span>
          </Link>
        </div>

        {/* Run into the card's bottom-right corner rather than floated in the
            middle of it. The artwork is cut off at its own bottom edge, so
            centred it ended on a hard horizontal line; bled off the corner
            the cut falls outside the card and reads as intended. The card
            clips to its own radius, so the overhang is trimmed for free.

            One element, two behaviours: in flow underneath the text while the
            card is a single column, absolute in the corner once the second
            column exists to keep the text clear of it.

            Decorative, so it carries an empty alt — the heading and body
            already say everything the picture stands in for. */}
        <div
          className="mx-auto w-full max-w-[280px] lg:absolute lg:-bottom-2 lg:right-0 lg:mx-0 lg:w-[38%] lg:max-w-[360px]"
          aria-hidden="true"
        >
          <Image
            src="/rti-stamp-gavel.png"
            alt=""
            width={550}
            height={420}
            className="h-auto w-full"
          />
        </div>
      </article>
    </Reveal>
  );
}
