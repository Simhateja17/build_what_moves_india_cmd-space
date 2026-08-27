"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";

const TOPICS = [
  {
    label: "About the RTI Act",
    title: "About the Right to Information Act",
    body: "The Right to Information Act, 2005 gives every Indian citizen the right to request records held by public authorities. It helps you ask for documents, orders, reports, dates and spending details—and requires the responsible office to reply within the legal time limit.",
  },
  {
    label: "Who can file an RTI",
    title: "Every Indian citizen can ask",
    body: "Any citizen of India can submit an RTI request. You do not need to explain why you want the information or prove that you are personally affected. You only need to describe the records clearly enough for the public authority to identify them.",
  },
  {
    label: "What information you can ask for",
    title: "Ask for records the government holds",
    body: "You can request copies of files, orders, contracts, reports, inspection records, expenditure details and other material held by a public authority. A strong RTI asks for existing records and facts instead of asking an officer for an opinion or justification.",
  },
  {
    label: "Fees and exemptions",
    title: "Fees should not become a barrier",
    body: "A small application fee may apply, along with charges for copies or other material. Eligible applicants below the poverty line are exempt from the application fee. Some protected categories of information may be withheld, but the authority must identify the legal reason.",
  },
  {
    label: "Response and appeal timelines",
    title: "The process has legal deadlines",
    body: "A standard RTI request should normally receive a response within 30 days. If the authority does not reply, refuses the request or gives an incomplete answer, the citizen can file a First Appeal. The case timeline should make every deadline and available next step visible.",
  },
];

export function GeneralInformation() {
  const [selected, setSelected] = useState(0);
  const topic = TOPICS[selected];

  return (
    <Reveal className="grid gap-7 py-5 md:grid-cols-[minmax(220px,0.72fr)_minmax(0,2fr)] md:gap-12 lg:gap-16">
      <div className="flex min-h-[320px] flex-col sm:min-h-[380px] md:py-3 lg:min-h-[420px]">
        <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
          General Information
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
                <span>{item.label}</span>
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
        className="gov-card grid min-h-[320px] items-center gap-6 p-6 sm:min-h-[380px] sm:p-8 lg:min-h-[420px] lg:grid-cols-[minmax(0,1.45fr)_minmax(220px,0.75fr)] lg:gap-10"
        aria-live="polite"
      >
        <div key={selected} className="animate-slide">
          <p className="text-lg font-bold text-saffron-500">
            {topic.title}
          </p>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-ink-2">
            {topic.body}
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-navy-700 transition hover:text-navy-900 hover:underline"
          >
            Know more <span aria-hidden>›</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[280px]" aria-hidden="true">
          <InformationIllustration />
        </div>
      </article>
    </Reveal>
  );
}

function InformationIllustration() {
  return (
    <svg viewBox="0 0 330 230" role="presentation">
      <path d="M28 202h274" stroke="#cbd6e8" strokeLinecap="round" strokeWidth="4" />
      <path d="M42 195c-15-31-9-70 24-92 23 25 26 61 6 92" fill="#98c6b0" />
      <path d="M57 183 52 121m6 31 20-20m-22 38-17-15" fill="none" stroke="#edf7f2" strokeLinecap="round" strokeWidth="4" />
      <path d="M272 196c21-29 18-64-11-86-27 22-31 60-13 86" fill="#a7c8b0" />
      <path d="m258 185 7-53m-5 24-19-14m17 30 17-17" fill="none" stroke="#edf7f2" strokeLinecap="round" strokeWidth="4" />

      <path d="M91 63h65v58H91c-16 0-28-13-28-29s12-29 28-29Z" fill="#75b9a7" />
      <path d="M156 63h62v58h-21c2 5 2 10 0 15-5 12-21 15-30 6-6-6-7-14-4-21h-27V63Z" fill="#315e9f" />
      <path d="M91 121h65v24c-5-2-10-2-15 0-12 5-15 21-6 30 6 6 14 7 21 4v17H91v-21c-4 2-9 2-14 0-12-5-15-21-6-30 6-6 13-7 20-4v-20Z" fill="#e47758" />
      <path d="M156 142c5 2 10 2 15 0 12-5 15-21 6-30-6-6-14-7-21-4V63h21c-2-5-2-10 0-15 5-12 21-15 30-6 6 6 7 14 4 21h7v58h22c-2 5-2 10 0 15 5 12 21 15 30 6 6-6 7-14 4-21h8v75h-64v-21c5 2 10 2 15 0 12-5 15-21 6-30-6-6-14-7-21-4v55h-62v-54Z" fill="#f2c85c" />

      <circle cx="112" cy="44" r="12" fill="#e5a06f" />
      <path d="M94 66c2-16 8-24 18-24s17 8 19 24" fill="#315e9f" />
      <circle cx="241" cy="92" r="12" fill="#d99162" />
      <path d="M223 122c1-19 7-29 18-29s18 10 20 29" fill="#e47758" />
      <circle cx="187" cy="184" r="11" fill="#d99162" />
      <path d="M169 204c3-14 9-21 18-21s15 7 18 21" fill="#315e9f" />
      <circle cx="78" cy="139" r="10" fill="#e5a06f" />
      <path d="M62 165c2-18 7-27 16-27s15 9 17 27" fill="#f2c85c" />
    </svg>
  );
}
