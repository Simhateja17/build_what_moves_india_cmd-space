import Link from "next/link";
import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";

const PROBLEMS = [
  {
    stat: "21",
    label: "legal bullet points",
    body: "You must scroll and tick 'I have read and understood' before the portal even shows you the form.",
  },
  {
    stat: "1",
    label: "form, 23 fields",
    body: "Ministry, authority, gender, rural or urban, literate or illiterate, BPL status, a CAPTCHA — all on one page, in one go.",
  },
  {
    stat: "0",
    label: "words about your rights",
    body: "If they never reply, nothing tells you that this is a refusal in law, that you can appeal free of cost, or that the officer owes a penalty.",
  },
];

const FEATURES = [
  {
    title: "One question at a time",
    body: "The 23-field wall becomes a guided flow in plain Indian English. Nothing is asked before it matters, and every field says what it actually does on the government's side.",
  },
  {
    title: "A clock that works for you",
    body: "The static flowchart on the current site becomes a live timeline of your request. You always know which day you are on and what happens next.",
  },
  {
    title: "Delay has a price, and you can see it",
    body: "The moment they cross 30 days, Section 20 starts running: ₹250 a day against the officer, up to ₹25,000. This right already exists — we just make it visible.",
  },
  {
    title: "Split requests stay together",
    body: "When one question is scattered across four offices with four numbers, we keep them in one case instead of leaving you to chase each one.",
  },
];

export default function HomePage() {
  return (
    <>
      <GovHeader />

      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="border-b border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-800">
                Right to Information Act, 2005
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-navy-900 sm:text-5xl">
                Ask the government a question.
                <br />
                <span className="text-navy-600">Know exactly what happens next.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
                Every Indian has the right to demand information from the
                government — and a legal answer within 30 days. Today that right
                is buried under forms, jargon and silence. RTI Saral is what it
                could look like instead.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-lg bg-navy-800 px-6 py-3.5 font-semibold text-white transition hover:bg-navy-700"
                >
                  Try the demo
                </Link>
                <Link
                  href="/about"
                  className="rounded-lg border border-line bg-white px-6 py-3.5 font-semibold text-navy-800 transition hover:bg-navy-50"
                >
                  How it works
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted">
                No signup. Test account is pre-filled and ready.
              </p>
            </div>

            {/* Illustrative preview of the accountability idea */}
            <div className="lg:pt-6">
              <div className="gov-card overflow-hidden shadow-sm">
                <div className="border-b border-line px-5 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted">
                    MORTH/R/E/26/01193
                  </p>
                  <p className="mt-0.5 font-semibold text-ink">
                    How ₹4.2 crore of road repair money was spent in my ward
                  </p>
                </div>
                <div className="bg-govred-50 px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-govred-700/80">
                    Penalty accruing against the officer
                  </p>
                  <p className="mt-1 text-4xl font-bold tabular-nums text-govred-700">
                    ₹1,000
                  </p>
                  <p className="mt-1 text-sm text-govred-700">
                    4 days late · ₹250/day · RTI Act s.20
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm leading-relaxed text-ink-2">
                    They missed the legal deadline. You can file a free appeal
                    to a senior officer right now — and here is the button.
                  </p>
                  <span className="mt-3 inline-block rounded-lg bg-saffron-500 px-4 py-2 text-sm font-semibold text-white">
                    File a First Appeal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900">
            What filing an RTI looks like today
          </h2>
          <p className="mt-2 max-w-2xl text-ink-2">
            The current portal is not broken because it lacks features. It is
            broken because it was built for the department, not the citizen.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.label} className="gov-card p-5">
                <p className="text-4xl font-bold text-govred-600">{p.stat}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-ink">
                  {p.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What's different */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900">
              What we changed
            </h2>
            <p className="mt-2 max-w-2xl text-ink-2">
              Same law, same process, same official terms — reordered around the
              person who actually needs the answer.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 font-bold text-navy-800">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">
                      {f.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principle */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="gov-card overflow-hidden">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="border-b border-line p-8 md:border-b-0 md:border-r">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  Our one rule
                </p>
                <p className="mt-3 text-2xl font-bold leading-snug text-navy-900">
                  Official language never disappears.
                  <br />
                  It just never goes first.
                </p>
                <p className="mt-3 text-ink-2">
                  You need the official terms when you call the department or
                  quote a section. You should not need them to understand your
                  own case.
                </p>
              </div>
              <div className="space-y-4 bg-canvas p-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Instead of
                  </p>
                  <p className="mt-1 font-mono text-sm text-govred-700">
                    Status: DISPOSED OF — REQUEST TRANSFERRED TO OTHER PUBLIC
                    AUTHORITY
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    You see
                  </p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    Your request moved to a different office
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-muted">
                    REQUEST TRANSFERRED TO OTHER PUBLIC AUTHORITY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy-800">
          <div className="mx-auto max-w-6xl px-4 py-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              See it for yourself
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Three real-world situations are loaded and ready — including one
              where the government simply never replies, and you can move the
              clock forward to watch what the law does about it.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-block rounded-lg bg-saffron-400 px-7 py-3.5 font-bold text-navy-900 transition hover:bg-saffron-500 hover:text-white"
            >
              Open the demo
            </Link>
          </div>
        </section>
      </main>

      <GovFooter />
    </>
  );
}
