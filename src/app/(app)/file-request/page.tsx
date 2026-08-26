"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { MINISTRIES, MINISTRY_CODES, OFFICES } from "@/lib/mock-data";
import { RtiCase } from "@/lib/types";
import { GroundRealityNote } from "@/components/GroundRealityNote";

const STEPS = [
  { title: "Who has the answer", hint: "The office that holds the information" },
  { title: "What you want to know", hint: "Your question, in your own words" },
  { title: "About you", hint: "Only what the law actually requires" },
  { title: "Check and send", hint: "Review, pay ₹10, done" },
];

const CHAR_LIMIT = 3000;

/** Prompts that turn a vague grievance into an answerable RTI question. */
const QUESTION_STARTERS = [
  "Please provide the current status of …",
  "Please provide copies of the file notings relating to …",
  "Please provide the name and designation of the officer responsible for …",
  "Please state the reasons for the delay in …",
];

export default function FileRequestPage() {
  const { addCase } = useStore();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [ministry, setMinistry] = useState("");
  const [office, setOffice] = useState("");
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("Ananya Sharma");
  const [email, setEmail] = useState("ananya.sharma@example.in");
  const [mobile, setMobile] = useState("");
  const [isBpl, setIsBpl] = useState(false);

  const offices = ministry ? (OFFICES[ministry] ?? []) : [];

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!ministry) e.ministry = "Choose the ministry or department.";
      if (!office) e.office = "Choose the office that holds this information.";
    }
    if (step === 1) {
      if (question.trim().length < 15)
        e.question = "Write at least a sentence so the officer knows what to look for.";
      if (question.length > CHAR_LIMIT)
        e.question = `Trim to ${CHAR_LIMIT} characters, or attach the rest as a PDF.`;
    }
    if (step === 2) {
      if (!name.trim()) e.name = "The law requires your name on the request.";
      if (!email.trim()) e.email = "We need an email to send your registration number.";
    }
    return e;
  }, [step, ministry, office, question, name, email]);

  const canContinue = Object.keys(errors).length === 0;

  function submit() {
    const code = MINISTRY_CODES[ministry] ?? "GOVIN";
    const serial = String(Math.floor(Math.random() * 90000) + 10000);
    const id = `new-${Date.now()}`;
    const newCase: RtiCase = {
      id,
      registrationNumber: `${code}/R/E/26/${serial}`,
      plainTitle:
        question.trim().split(/[.\n]/)[0].slice(0, 80) || "Your new RTI request",
      question: question.trim(),
      authority: {
        ministry,
        office,
        cpio: "CPIO (to be assigned by the Nodal Officer)",
      },
      feeLabel: isBpl ? "Fee waived — BPL certificate attached" : "₹10 paid by UPI",
      startDay: 0,
      maxDay: 120,
      demoNote:
        "Your new request. Drag the time machine forward to see what the law does if they stay silent.",
      events: [
        {
          day: 0,
          kind: "filed",
          plain: isBpl
            ? "You filed this request — no fee, as you hold a BPL card"
            : "You filed this request and paid ₹10",
          official: "REGISTERED",
        },
        {
          day: 0,
          kind: "routed",
          plain: "It reached the department's Nodal Officer",
          official: "FORWARDED TO NODAL OFFICER",
        },
        {
          day: 2,
          kind: "cpio",
          plain: "The Nodal Officer passed it to the CPIO who must answer you",
          official: "TRANSMITTED TO CPIO",
        },
      ],
    };
    addCase(newCase);
    router.push(`/requests/${id}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Vertical stepper */}
      <aside>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">
          File an RTI request
        </h1>
        <p className="mt-1.5 text-sm text-ink-2">
          Four short steps. Nothing to read before you start.
        </p>
        <ol className="mt-6 space-y-1">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => setStep(i)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-navy-50"
                      : i > step
                        ? "opacity-45"
                        : "hover:bg-canvas"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? "bg-govgreen-600 text-white"
                        : active
                          ? "bg-navy-800 text-white"
                          : "bg-line text-ink-2"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span>
                    <span
                      className={`block text-sm font-semibold ${active ? "text-navy-800" : "text-ink"}`}
                    >
                      {s.title}
                    </span>
                    <span className="block text-xs text-muted">{s.hint}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Step body */}
      <div>
        <div className="gov-card p-6 sm:p-7">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink">
                  Who has the answer?
                </h2>
                <p className="mt-1 text-sm text-ink-2">
                  Not sure? Pick your best guess — it cannot be held against
                  you.
                </p>
              </div>

              <div>
                <label htmlFor="ministry" className="field-label">
                  Ministry or department
                </label>
                <select
                  id="ministry"
                  value={ministry}
                  onChange={(e) => {
                    setMinistry(e.target.value);
                    setOffice("");
                  }}
                  className="field-input"
                >
                  <option value="">Select a ministry or department</option>
                  {MINISTRIES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                {errors.ministry ? (
                  <p className="mt-1.5 text-sm text-govred-700">{errors.ministry}</p>
                ) : null}
                <GroundRealityNote>
                  This decides which Nodal Officer receives your request. If you
                  pick the wrong one, Section 6(3) of the RTI Act requires them
                  to forward it to the correct authority within 5 days — they
                  cannot simply reject it.
                </GroundRealityNote>
              </div>

              <div>
                <label htmlFor="office" className="field-label">
                  Which office within it
                </label>
                <select
                  id="office"
                  value={office}
                  onChange={(e) => setOffice(e.target.value)}
                  disabled={!ministry}
                  className="field-input disabled:cursor-not-allowed disabled:bg-canvas"
                >
                  <option value="">
                    {ministry ? "Select an office" : "Choose a ministry first"}
                  </option>
                  {offices.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                {errors.office ? (
                  <p className="mt-1.5 text-sm text-govred-700">{errors.office}</p>
                ) : null}
              </div>

              <div className="rounded-lg border border-saffron-400/40 bg-saffron-50 px-4 py-3">
                <p className="text-sm leading-relaxed text-saffron-600">
                  <strong>One thing worth knowing:</strong> this portal only
                  covers central government bodies. A request meant for a state
                  government is returned without a refund — so if your question
                  is about a state office, file it on your state&apos;s own RTI
                  portal instead.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink">
                  What do you want to know?
                </h2>
                <p className="mt-1 text-sm text-ink-2">
                  Write it plainly. You are asking for facts and documents the
                  government already holds — you never have to justify why you
                  want them.
                </p>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {QUESTION_STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setQuestion((q) => (q ? q : s))
                      }
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink-2 transition hover:border-navy-600/40 hover:text-navy-800"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <label htmlFor="question" className="field-label sr-only">
                  Your question
                </label>
                <textarea
                  id="question"
                  rows={8}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="For example: Please provide the current status of pension case file PPO-2019/44871, the reason for the delay since January, and the name of the officer holding the file."
                  className="field-input"
                />
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span
                    className={
                      question.length > CHAR_LIMIT
                        ? "font-medium text-govred-700"
                        : "text-muted"
                    }
                  >
                    {question.length.toLocaleString("en-IN")} / {CHAR_LIMIT.toLocaleString("en-IN")} characters
                  </span>
                  {question.length > CHAR_LIMIT ? (
                    <span className="text-govred-700">
                      Over the limit — attach the rest as a PDF
                    </span>
                  ) : null}
                </div>
                {errors.question ? (
                  <p className="mt-1.5 text-sm text-govred-700">{errors.question}</p>
                ) : null}
                <GroundRealityNote>
                  This text is what the CPIO actually reads. From the day it
                  reaches them, they have 30 days to answer — and if they do
                  not, the law already treats that silence as a refusal you can
                  appeal.
                </GroundRealityNote>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink">About you</h2>
                <p className="mt-1 text-sm text-ink-2">
                  The current form asks for your gender, whether you live in a
                  rural or urban area, and whether you are literate. None of
                  that changes your rights, so we do not ask.
                </p>
              </div>

              <div>
                <label htmlFor="name" className="field-label">
                  Your name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field-input"
                />
                {errors.name ? (
                  <p className="mt-1.5 text-sm text-govred-700">{errors.name}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input"
                />
                {errors.email ? (
                  <p className="mt-1.5 text-sm text-govred-700">{errors.email}</p>
                ) : null}
                <GroundRealityNote>
                  Your registration number arrives here, and it is the only way
                  to track or appeal this request later. We keep it on your case
                  so you never have to remember it.
                </GroundRealityNote>
              </div>

              <div>
                <label htmlFor="mobile" className="field-label">
                  Mobile number{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="For SMS updates"
                  className="field-input"
                />
              </div>

              <label className="flex cursor-pointer gap-3 rounded-lg border border-line p-4 transition hover:border-navy-600/40">
                <input
                  type="checkbox"
                  checked={isBpl}
                  onChange={(e) => setIsBpl(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-ink">
                    I hold a Below Poverty Line card
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-2">
                    Then you pay nothing at all. Attach your BPL certificate and
                    the ₹10 fee is waived — this is your right under the RTI
                    Rules, 2012, not a concession.
                  </span>
                </span>
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink">Check and send</h2>
                <p className="mt-1 text-sm text-ink-2">
                  Last look before this becomes a legal request.
                </p>
              </div>

              <dl className="divide-y divide-line-2 rounded-lg border border-line">
                <Row label="Going to" onEdit={() => setStep(0)}>
                  {office}
                  <span className="block text-sm text-muted">{ministry}</span>
                </Row>
                <Row label="Your question" onEdit={() => setStep(1)}>
                  <span className="block whitespace-pre-wrap text-[15px] leading-relaxed">
                    {question}
                  </span>
                </Row>
                <Row label="From" onEdit={() => setStep(2)}>
                  {name}
                  <span className="block text-sm text-muted">
                    {email}
                    {mobile ? ` · ${mobile}` : ""}
                  </span>
                </Row>
                <Row label="Fee" onEdit={() => setStep(2)}>
                  {isBpl ? (
                    <span className="text-govgreen-700">
                      ₹0 — waived, BPL certificate attached
                    </span>
                  ) : (
                    "₹10 by UPI"
                  )}
                </Row>
              </dl>

              <div className="rounded-lg border border-navy-600/20 bg-navy-50 px-4 py-3.5">
                <p className="text-sm leading-relaxed text-navy-800">
                  <strong>The moment you send this,</strong> a 30-day legal
                  clock starts. We will track it for you — and if they go
                  silent, we will tell you the day you become entitled to
                  appeal, and show you the penalty running against the officer.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-line-2 pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-2 hover:bg-canvas ${
                step === 0 ? "invisible" : ""
              }`}
            >
              ← Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-lg bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="rounded-lg bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
              >
                {isBpl ? "Send my request" : "Pay ₹10 and send"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {label}
        </dt>
        <dd className="mt-1 font-medium text-ink">{children}</dd>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-sm font-medium text-navy-700 hover:underline"
      >
        Edit
      </button>
    </div>
  );
}
