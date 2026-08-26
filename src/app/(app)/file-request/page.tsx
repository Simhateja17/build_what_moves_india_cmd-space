"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { RtiRequest } from "@/lib/types";
import { GroundRealityNote } from "@/components/GroundRealityNote";

const MINISTRIES = [
  "Ministry of Rural Development",
  "Ministry of Road Transport and Highways",
  "Ministry of Education",
  "Ministry of Health and Family Welfare",
  "Ministry of Railways",
  "Department of Posts",
];

const STEPS = ["Who are you asking?", "Your details", "What do you want to know?", "Review & submit"];

function generateRegistrationNumber(ministry: string) {
  const code = ministry
    .split(" ")
    .filter((w) => w.length > 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 5)
    .padEnd(5, "X");
  const serial = String(Math.floor(1000 + (Date.now() % 8999))).padStart(5, "0");
  return `${code}/R/E/26/${serial}`;
}

export default function FileRequestPage() {
  const { addRequest } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [ministry, setMinistry] = useState(MINISTRIES[0]);
  const [authorityName, setAuthorityName] = useState("");
  const [isBpl, setIsBpl] = useState<"no" | "yes">("no");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestText, setRequestText] = useState("");

  const charCount = requestText.length;
  const charLimit = 3000;

  const canContinue = useMemo(() => {
    if (step === 0) return ministry && authorityName.trim().length > 0;
    if (step === 1) return name.trim().length > 0 && email.trim().length > 0;
    if (step === 2) return requestText.trim().length > 0 && charCount <= charLimit;
    return true;
  }, [step, ministry, authorityName, name, email, requestText, charCount]);

  function handleSubmit() {
    const id = `req-${Date.now()}`;
    const registrationNumber = generateRegistrationNumber(ministry);
    const newRequest: RtiRequest = {
      id,
      registrationNumber,
      plainTitle: requestText.slice(0, 60) || "Your new RTI request",
      officialSummary: requestText,
      authority: { ministry, department: authorityName },
      filedDayLabel: "Filed just now",
      daysElapsed: 0,
      deadlineDays: 30,
      status: "filed",
      history: [
        { day: "Day 0", plainLabel: "You filed this request", officialLabel: "REGISTERED" },
        {
          day: "Day 0",
          plainLabel: "Sent to the department's Nodal Officer",
          officialLabel: "FORWARDED TO NODAL OFFICER",
        },
      ],
    };
    addRequest(newRequest);
    router.push(`/requests/${id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">File an RTI request</h1>
      <p className="mt-1 text-sm text-slate-500">
        One question at a time — no giant form, no legal wall to read first.
      </p>

      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full ${
                i <= step ? "bg-indigo-500" : "bg-slate-200"
              }`}
            />
            <span
              className={`text-[11px] ${
                i === step ? "font-medium text-indigo-700" : "text-slate-400"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Which ministry or department are you asking?
              </label>
              <select
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {MINISTRIES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <GroundRealityNote>
                This goes to that department&apos;s Nodal Officer, who has a
                few days to forward it to the right office if you picked the
                wrong one — you won&apos;t be silently rejected for this.
              </GroundRealityNote>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Which specific office within it?
              </label>
              <input
                value={authorityName}
                onChange={(e) => setAuthorityName(e.target.value)}
                placeholder="e.g. District Education Office"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <GroundRealityNote>
                This is the only place your registration number and every
                status update will be sent — nothing else here is mandatory.
              </GroundRealityNote>
            </div>
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Are you below the poverty line?
              </span>
              <div className="mt-1.5 flex gap-4 text-sm">
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    checked={isBpl === "no"}
                    onChange={() => setIsBpl("no")}
                  />
                  No — ₹10 fee applies
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    checked={isBpl === "yes"}
                    onChange={() => setIsBpl("yes")}
                  />
                  Yes — fee waived
                </label>
              </div>
              <GroundRealityNote>
                {isBpl === "yes"
                  ? "No payment step at all — you'll just need to attach your BPL card as proof."
                  : "You'll pay ₹10 by UPI or card on the next step, set by the RTI Rules, 2012 — not a portal fee."}
              </GroundRealityNote>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-slate-700">
              What do you want to know?
            </label>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              rows={6}
              placeholder="Write your question in your own words, as plainly as you like."
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className={charCount > charLimit ? "text-red-600" : "text-slate-400"}>
                {charCount}/{charLimit} characters
              </span>
              {charCount > charLimit && (
                <span className="text-red-600">
                  Over the limit — the rest will go in an attachment instead.
                </span>
              )}
            </div>
            <GroundRealityNote>
              This is sent to the office&apos;s CPIO, who has 30 days to
              reply — we&apos;ll track that clock for you automatically from
              here.
            </GroundRealityNote>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Asking</p>
              <p className="font-medium text-slate-900">
                {ministry} — {authorityName || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">From</p>
              <p className="font-medium text-slate-900">
                {name || "—"} ({email || "—"})
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Your question
              </p>
              <p className="whitespace-pre-wrap text-slate-700">
                {requestText || "—"}
              </p>
            </div>
            <GroundRealityNote>
              Once you submit, a 30-day legal clock starts immediately — if
              they go quiet, we&apos;ll tell you the moment you&apos;re
              entitled to escalate, and show any penalty accruing against
              them.
            </GroundRealityNote>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 disabled:opacity-0"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Submit request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
