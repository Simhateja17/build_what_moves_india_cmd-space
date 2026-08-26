import Link from "next/link";
import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";

const COMPARISONS = [
  {
    before: "A 21-point legal wall you must tick before the form appears.",
    after: "No gate. You start with the actual question: who has the answer?",
  },
  {
    before:
      "One page with 23 fields — gender, rural or urban, literate or illiterate, BPL, CAPTCHA.",
    after:
      "Four short steps that ask only what the law requires, each explaining what it does on the government's side.",
  },
  {
    before:
      "A static flowchart image explaining the appeals process in the abstract.",
    after:
      "A live timeline of your request, showing the day you are on and what happens next.",
  },
  {
    before:
      "Silence. If they never reply, the portal says nothing about your rights.",
    after:
      "The day they cross 30 days, you are told it is a refusal in law, offered a free appeal, and shown the penalty accruing against the officer.",
  },
  {
    before:
      "A split request becomes four registration numbers you must track separately.",
    after: "One case, with each office's part and clock kept together inside it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <GovHeader />

      <main id="main" className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-4xl font-bold tracking-tight text-navy-900">
            How this works
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            RTI Saral is a redesign concept for India&apos;s RTI Online portal.
            The law does not change here, and neither does the process. What
            changes is who the interface is written for.
          </p>

          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              The rule we followed
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Official language never disappears — it just never goes first.
              Every status, every ground for appeal, every registration number
              is still here, exactly as the department writes it. It sits in
              small print beneath a sentence that a person in a hurry can
              actually read. You need the official terms to quote a section or
              call an office. You should not need them to understand your own
              case.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              What changed, point by point
            </h2>
            <div className="mt-6 space-y-3">
              {COMPARISONS.map((c) => (
                <div
                  key={c.before}
                  className="grid gap-0 overflow-hidden rounded-xl border border-line md:grid-cols-2"
                >
                  <div className="border-b border-line bg-canvas p-5 md:border-b-0 md:border-r">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-govred-700">
                      On the current portal
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                      {c.before}
                    </p>
                  </div>
                  <div className="bg-white p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-govgreen-700">
                      Here
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                      {c.after}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              About the penalty
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              The most striking thing in this demo is the counter that runs
              against an officer who keeps you waiting. It is not an invention.
              Section 20 of the Right to Information Act, 2005 already provides
              that a Public Information Officer who fails to answer within the
              time limit without reasonable cause is liable to a penalty of ₹250
              per day, up to ₹25,000, recoverable from their salary and imposed
              by the Information Commission.
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              That provision has existed for twenty years. Almost no citizen
              invokes it, because nothing in the process ever tells them it
              exists. Making it visible is not a new power — it is the same
              power, finally shown to the person it belongs to.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              About this demo
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Everything here is mocked and runs in your browser. No government
              system is contacted. Field names, statuses, the registration
              number format and the multi-office split behaviour were taken from
              the RTI Online citizen user manual so the redesign responds to the
              real system rather than an imagined one.
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              Each request carries a time machine so you can move it through its
              full life — the deadline passing, the penalty starting, the appeal
              unlocking, the appeal itself being ignored — without waiting
              ninety days to see it.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-block rounded-lg bg-navy-800 px-6 py-3.5 font-semibold text-white transition hover:bg-navy-700"
            >
              Open the demo
            </Link>
          </section>
        </div>
      </main>

      <GovFooter />
    </>
  );
}
