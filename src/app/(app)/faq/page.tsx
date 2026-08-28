"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Category = "General" | "Filing RTI" | "Payment" | "Status & Tracking" | "Appeals" | "Others";
type Faq = { question: string; answer: string; category: Category };

const CATEGORIES: Array<"All" | Category> = ["All", "General", "Filing RTI", "Payment", "Status & Tracking", "Appeals", "Others"];
const FAQS: Faq[] = [
  { category: "General", question: "What is RTI?", answer: "The Right to Information (RTI) Act, 2005 empowers Indian citizens to request information from public authorities. It promotes transparency and accountability in the working of public institutions." },
  { category: "General", question: "Who can file an RTI application?", answer: "Any citizen of India can file an RTI application. You do not need to explain why you want the information." },
  { category: "Filing RTI", question: "How do I file an RTI online?", answer: "Choose Submit Request, select the appropriate public authority, write a clear request for existing records, add your contact details, and pay the prescribed application fee unless you are exempt." },
  { category: "Payment", question: "What is the application fee for filing an RTI?", answer: "The standard application fee for a Central Government RTI request is ₹10. Applicants below the poverty line are exempt when valid proof is provided. Additional copying charges may apply." },
  { category: "Status & Tracking", question: "How can I track the status of my RTI application?", answer: "If you are signed in, every request is in My requests with its current stage and how many of the 30 days are left — open one to see its full history. If you do not have an account, use Track a request and enter the registration number from your acknowledgement." },
  { category: "Status & Tracking", question: "What is the time limit for a response?", answer: "A public authority ordinarily has 30 days to respond. Requests concerning a person's life or liberty must be answered within 48 hours. Different statutory limits can apply in some transfer and third-party cases." },
  { category: "Appeals", question: "What if I am not satisfied with the response?", answer: "You may file a First Appeal if the response is incomplete, misleading, refused, or otherwise unsatisfactory. You can also appeal when the public authority misses the legal response deadline." },
  { category: "Appeals", question: "How do I file a first appeal?", answer: "Open the relevant application, choose File First Appeal, select the reason for appeal, and submit it to the designated First Appellate Authority. There is no fee for a First Appeal on this portal." },
  { category: "Filing RTI", question: "Can I file an RTI application in any language?", answer: "An application may be made in English, Hindi, or the official language of the area where the request is filed. Use clear, specific wording so the authority can identify the records." },
  { category: "Others", question: "What information cannot be provided under RTI?", answer: "Sections 8 and 9 of the RTI Act exempt limited categories such as information affecting national security, protected commercial confidence, certain personal information, and copyrighted material. Exempt portions should be separated where the remaining record can be disclosed." },
];

/** Stable anchor per question — FAQ links get shared, so they must land. */
function slugFor(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The first sentence, as a preview under a collapsed question. */
function previewOf(answer: string): string {
  const end = answer.indexOf(". ");
  return end === -1 ? answer : `${answer.slice(0, end + 1)}`;
}

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  // The top three open by default. Eleven collapsed rows of near-identical
  // height read as a wall of chevrons with no way in.
  const [open, setOpen] = useState<string[]>(() => {
    const top = FAQS.slice(0, 3).map((f) => f.question);
    // A shared link must land on an open answer, whichever one it names.
    if (typeof window === "undefined") return top;
    const hash = window.location.hash.slice(1);
    const linked = FAQS.find((faq) => slugFor(faq.question) === hash);
    return linked && !top.includes(linked.question)
      ? [...top, linked.question]
      : top;
  });

  const searched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return FAQS;
    return FAQS.filter((faq) =>
      `${faq.question} ${faq.answer}`.toLowerCase().includes(needle),
    );
  }, [query]);

  const results = useMemo(
    () => searched.filter((faq) => category === "All" || faq.category === category),
    [searched, category],
  );

  // Counts run over the searched set, so a category never advertises
  // questions that the current search has already filtered away.
  const countFor = (item: "All" | Category) =>
    item === "All"
      ? searched.length
      : searched.filter((faq) => faq.category === item).length;

  const toggle = (question: string) =>
    setOpen((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question],
    );

  // Deep link: scroll to the question named in the URL hash. The question
  // it names is opened in the initial state above, not by a setState here,
  // so this effect only ever touches the DOM.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="mx-auto max-w-[1240px]">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-ink-2">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-navy-700 hover:underline">
          <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" /></svg>
          Home
        </Link>
        <span aria-hidden>›</span><span>FAQ</span>
      </nav>

      {/* The cartoon speech-bubble illustration that sat here was drawn in a
          flat orange/indigo style used nowhere else in the app, and brought
          a third orange with it. Dropped rather than half-adopted. */}
      <header className="mt-9">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-[40px]">Frequently Asked Questions</h1>
        <p className="mt-2 max-w-xl text-base text-ink-2">Find answers to the most common questions about RTI.</p>
        <span className="mt-5 block h-0.5 w-24 bg-saffron-500" />
      </header>

      <section aria-label="Search and filter frequently asked questions" className="mt-4">
        <label className="relative block">
          <span className="sr-only">Search for questions</span>
          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-2"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for questions..." className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-navy-600 focus:ring-4 focus:ring-navy-50" />
        </label>

        {query.trim() ? (
          <p aria-live="polite" className="mt-2.5 text-sm text-ink-2">
            {searched.length === 0
              ? "No questions match "
              : `${searched.length} question${searched.length === 1 ? "" : "s"} match${searched.length === 1 ? "es" : ""} `}
            <span className="font-semibold text-ink">&ldquo;{query.trim()}&rdquo;</span>
            {" · "}
            <button
              type="button"
              onClick={() => setQuery("")}
              className="font-semibold text-navy-700 hover:underline"
            >
              Clear
            </button>
          </p>
        ) : null}

        <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="FAQ categories">
          <div className="flex min-w-max gap-3">
            {CATEGORIES.map((item) => {
              const active = category === item;
              const count = countFor(item);
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  disabled={count === 0}
                  onClick={() => setCategory(item)}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${active ? "bg-navy-900 text-white shadow-sm" : "bg-navy-50 text-navy-900 hover:bg-blue-100"}`}
                >
                  {item}{" "}
                  <span className={active ? "text-white/60" : "text-navy-700/55"}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-live="polite" className="mt-6 space-y-3">
        {results.length ? results.map((faq) => {
          const slug = slugFor(faq.question);
          const isOpen = open.includes(faq.question);
          return (
            <article id={slug} key={faq.question} className={`scroll-mt-24 overflow-hidden rounded-xl border bg-white shadow-[0_4px_16px_rgba(45,87,143,0.04)] transition ${isOpen ? "border-navy-600/25" : "border-slate-200"}`}>
              <h2>
                <button type="button" aria-expanded={isOpen} onClick={() => toggle(faq.question)} className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-7">
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold text-ink">
                      <Highlight text={faq.question} term={query} />
                    </span>
                    {/* A one-line preview, so a closed row still says
                        something. Eleven identical title bars gave a reader
                        no way to choose which one to open. */}
                    {!isOpen ? (
                      <span className="mt-1 block line-clamp-1 text-[13px] leading-6 text-ink-2">
                        {previewOf(faq.answer)}
                      </span>
                    ) : null}
                  </span>
                  <svg aria-hidden viewBox="0 0 20 20" fill="none" className={`mt-1 size-5 shrink-0 text-navy-900 transition-transform ${isOpen ? "rotate-180" : ""}`}><path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </h2>
              {isOpen ? (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-7">
                  <p className="text-sm leading-6 text-ink-2">
                    <Highlight text={faq.answer} term={query} />
                  </p>
                  <a
                    href={`#${slug}`}
                    className="mt-3 inline-block text-xs font-semibold text-navy-700 hover:underline"
                  >
                    Link to this answer
                  </a>
                </div>
              ) : null}
            </article>
          );
        }) : (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center"><p className="font-semibold text-ink">No matching questions</p><p className="mt-1 text-sm text-ink-2">Try another search term or category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-4 text-sm font-semibold text-navy-700 hover:underline">Clear search and filters</button></div>
        )}
      </section>

      <aside className="mt-7 flex flex-wrap items-center gap-4 overflow-hidden rounded-xl border border-navy-600/15 bg-navy-50 p-4 sm:px-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-navy-800 ring-1 ring-navy-600/10"><SupportIcon /></div>
        <div className="mr-auto"><p className="font-bold text-navy-900">Additional assistance</p><p className="mt-0.5 text-sm text-ink-2">Contact support for further assistance.</p></div>
        <Link href="/contact" className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg bg-navy-900 px-7 text-sm font-semibold text-white transition hover:bg-navy-800 sm:w-auto">Contact Us <span aria-hidden className="text-saffron-400">→</span></Link>
      </aside>
    </div>
  );
}

/** Marks the searched term inside a question or answer. */
function Highlight({ text, term }: { text: string; term: string }) {
  const needle = term.trim();
  if (!needle) return <>{text}</>;

  const parts = text.split(new RegExp(`(${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === needle.toLowerCase() ? (
          <mark key={i} className="rounded bg-saffron-50 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function SupportIcon() {
  return <svg aria-hidden viewBox="0 0 32 32" fill="none" className="size-7"><path d="M7 18v-4a9 9 0 0 1 18 0v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><path d="M5 18a3 3 0 0 1 3-3h2v9H8a3 3 0 0 1-3-3v-3Zm22 0a3 3 0 0 0-3-3h-2v9h2a3 3 0 0 0 3-3v-3Z" fill="#FF9933" stroke="currentColor" strokeWidth="1.8"/><path d="M24 24c-1 3-3.5 4-7 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="28" r="1.8" fill="currentColor"/></svg>;
}
