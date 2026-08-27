"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Category = "General" | "Filing RTI" | "Payment" | "Status & Tracking" | "Appeals" | "Others";
type Faq = { question: string; answer: string; category: Category };

const CATEGORIES: Array<"All" | Category> = ["All", "General", "Filing RTI", "Payment", "Status & Tracking", "Appeals", "Others"];
const FAQS: Faq[] = [
  { category: "General", question: "What is RTI?", answer: "The Right to Information (RTI) Act, 2005 empowers Indian citizens to request information from public authorities. It promotes transparency and accountability in the working of public institutions." },
  { category: "General", question: "Who can file an RTI application?", answer: "Any citizen of India can file an RTI application. You do not need to explain why you want the information." },
  { category: "Filing RTI", question: "How do I file an RTI online?", answer: "Choose Submit Request, select the appropriate public authority, write a clear request for existing records, add your contact details, and pay the prescribed application fee unless you are exempt." },
  { category: "Payment", question: "What is the application fee for filing an RTI?", answer: "The standard application fee for a Central Government RTI request is ₹10. Applicants below the poverty line are exempt when valid proof is provided. Additional copying charges may apply." },
  { category: "Status & Tracking", question: "How can I track the status of my RTI application?", answer: "Open View Status and enter your registration number, email address, and the security code. If you are signed in, View History also shows all your applications together." },
  { category: "Status & Tracking", question: "What is the time limit for a response?", answer: "A public authority ordinarily has 30 days to respond. Requests concerning a person's life or liberty must be answered within 48 hours. Different statutory limits can apply in some transfer and third-party cases." },
  { category: "Appeals", question: "What if I am not satisfied with the response?", answer: "You may file a First Appeal if the response is incomplete, misleading, refused, or otherwise unsatisfactory. You can also appeal when the public authority misses the legal response deadline." },
  { category: "Appeals", question: "How do I file a first appeal?", answer: "Open the relevant application, choose File First Appeal, select the reason for appeal, and submit it to the designated First Appellate Authority. There is no fee for a First Appeal on this portal." },
  { category: "Filing RTI", question: "Can I file an RTI application in any language?", answer: "An application may be made in English, Hindi, or the official language of the area where the request is filed. Use clear, specific wording so the authority can identify the records." },
  { category: "Others", question: "What information cannot be provided under RTI?", answer: "Sections 8 and 9 of the RTI Act exempt limited categories such as information affecting national security, protected commercial confidence, certain personal information, and copyrighted material. Exempt portions should be separated where the remaining record can be disclosed." },
];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [openQuestion, setOpenQuestion] = useState(FAQS[0].question);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return FAQS.filter((faq) =>
      (category === "All" || faq.category === category) &&
      (!needle || `${faq.question} ${faq.answer}`.toLowerCase().includes(needle)),
    );
  }, [query, category]);

  return (
    <div className="mx-auto max-w-[1240px]">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-ink-2">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-navy-700 hover:underline">
          <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" /></svg>
          Home
        </Link>
        <span aria-hidden>›</span><span>FAQ</span>
      </nav>

      <header className="relative mt-9 min-h-[145px] overflow-hidden sm:pr-[290px]">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-[40px]">Frequently Asked Questions</h1>
        <p className="mt-2 text-base text-ink-2">Find answers to the most common questions about RTI.</p>
        <span className="mt-5 block h-0.5 w-24 bg-saffron-500" />
        <FaqIllustration />
      </header>

      <section aria-label="Search and filter frequently asked questions" className="mt-4">
        <label className="relative block">
          <span className="sr-only">Search for questions</span>
          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-2"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for questions..." className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-navy-600 focus:ring-4 focus:ring-navy-50" />
        </label>

        <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="FAQ categories">
          <div className="flex min-w-max gap-3">
            {CATEGORIES.map((item) => {
              const active = category === item;
              return <button key={item} type="button" role="tab" aria-selected={active} onClick={() => { setCategory(item); setOpenQuestion(""); }} className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${active ? "bg-navy-900 text-white shadow-sm" : "bg-navy-50 text-navy-900 hover:bg-blue-100"}`}>{item}</button>;
            })}
          </div>
        </div>
      </section>

      <section aria-live="polite" className="mt-6 space-y-3">
        {results.length ? results.map((faq) => {
          const open = openQuestion === faq.question;
          return (
            <article key={faq.question} className={`overflow-hidden rounded-xl border bg-white shadow-[0_4px_16px_rgba(45,87,143,0.04)] transition ${open ? "border-navy-600/25" : "border-slate-200"}`}>
              <h2>
                <button type="button" aria-expanded={open} onClick={() => setOpenQuestion(open ? "" : faq.question)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-bold text-ink transition hover:bg-slate-50 sm:px-7">
                  {faq.question}
                  <svg aria-hidden viewBox="0 0 20 20" fill="none" className={`size-5 shrink-0 text-navy-900 transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </h2>
              {open ? <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-6 text-ink-2 sm:px-7">{faq.answer}</div> : null}
            </article>
          );
        }) : (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center"><p className="font-semibold text-ink">No matching questions</p><p className="mt-1 text-sm text-ink-2">Try another search term or category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-4 text-sm font-semibold text-navy-700 hover:underline">Clear search</button></div>
        )}
      </section>

      <aside className="mt-7 flex flex-wrap items-center gap-4 overflow-hidden rounded-xl border border-navy-600/15 bg-navy-50 p-4 sm:px-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-navy-800 ring-1 ring-navy-600/10"><SupportIcon /></div>
        <div className="mr-auto"><p className="font-bold text-navy-900">Still have questions?</p><p className="mt-0.5 text-sm text-ink-2">Our support team is here to help you.</p></div>
        <Link href="/contact" className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg bg-navy-900 px-7 text-sm font-semibold text-white transition hover:bg-navy-800 sm:w-auto">Contact Us <span aria-hidden className="text-saffron-400">→</span></Link>
      </aside>
    </div>
  );
}

function FaqIllustration() {
  return (
    <svg aria-hidden viewBox="0 0 280 150" className="absolute right-0 top-0 hidden h-[145px] w-[280px] sm:block">
      <path d="M42 108c19-23 44-36 70-38M52 95l-21-10M63 85l-7-22M82 76 79 55M46 108l-22 7M98 71l9-18" stroke="#AFC3EA" strokeWidth="7" strokeLinecap="round" opacity=".8"/>
      <circle cx="226" cy="62" r="38" fill="#FFF3E2"/>
      <path d="M93 18h72a24 24 0 0 1 24 24v38a24 24 0 0 1-24 24h-32l-22 17 2-17H93a24 24 0 0 1-24-24V42a24 24 0 0 1 24-24Z" fill="#EA951C"/>
      <text x="130" y="78" textAnchor="middle" fontSize="54" fontWeight="700" fill="white">?</text>
      <path d="M160 67h68a23 23 0 0 1 23 23v31a23 23 0 0 1-23 23h-12l3 15-22-15h-37a23 23 0 0 1-23-23V90a23 23 0 0 1 23-23Z" fill="#4362B7"/>
      <circle cx="177" cy="106" r="5" fill="white"/><circle cx="195" cy="106" r="5" fill="white"/><circle cx="213" cy="106" r="5" fill="white"/>
    </svg>
  );
}

function SupportIcon() {
  return <svg aria-hidden viewBox="0 0 32 32" fill="none" className="size-7"><path d="M7 18v-4a9 9 0 0 1 18 0v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><path d="M5 18a3 3 0 0 1 3-3h2v9H8a3 3 0 0 1-3-3v-3Zm22 0a3 3 0 0 0-3-3h-2v9h2a3 3 0 0 0 3-3v-3Z" fill="#FF9933" stroke="currentColor" strokeWidth="1.8"/><path d="M24 24c-1 3-3.5 4-7 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="28" r="1.8" fill="currentColor"/></svg>;
}
