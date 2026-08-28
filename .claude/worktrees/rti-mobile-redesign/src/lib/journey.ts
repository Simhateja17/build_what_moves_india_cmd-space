import {
  APPEAL_DECISION_DAYS,
  PENALTY_CAP_INR,
  PENALTY_PER_DAY_INR,
  REPLY_DEADLINE_DAYS,
} from "./types";

/* ------------------------------------------------------------------
   The whole life of an RTI, as a walkthrough.

   The portal explains none of this. A citizen finds out what a Nodal
   Officer is, what a deemed refusal is, or that a first appeal is free
   only by living through it — usually too late to act on.

   Each stage below answers the same five questions, because those are
   the five a person actually has:

     what is happening   — in words they already use
     who has it now      — a named role, not a queue
     how long            — a number of days, with the section behind it
     what you do         — the action, or explicitly "nothing"
     what it is called   — the portal's own term, kept but demoted

   Nothing here is invented: every section reference is a real
   provision of the Right to Information Act, 2005.
------------------------------------------------------------------- */

export type Branch = "main" | "good" | "bad";

export interface Stage {
  id: string;
  /** Day this happens on, for the clock. Undefined = not on the clock. */
  day?: number;
  /** Which path this belongs to: the spine, the happy end, or the fight. */
  branch: Branch;
  /** Plain headline. Never government vocabulary. */
  title: string;
  /** Two or three sentences. What is actually going on. */
  body: string;
  who: string;
  /** The portal's own status string, or the legal term. */
  official: string;
  /** Section of the RTI Act, where one governs this step. */
  section?: string;
  /** What the citizen does. Explicitly "Nothing" where that is true. */
  youDo: string;
  /** Money moving, if any. */
  money?: string;
}

export const STAGES: Stage[] = [
  {
    id: "write",
    day: 0,
    branch: "main",
    title: "You write your question",
    body: "You ask for a record the office already holds — a file, an order, a date, a name, an amount. You are never required to say why you want it, and no officer may ask you.",
    who: "You",
    official: "ONLINE RTI REQUEST FORM",
    section: "s.6(2) — no reason need be given",
    youDo: "Write the question in your own words. Five minutes.",
  },
  {
    id: "pay",
    day: 0,
    branch: "main",
    title: "You pay ₹10",
    body: "Ten rupees, fixed by the RTI Rules, 2012. Nothing at all if you hold a BPL card and attach a copy of it. This is the entire cost of asking.",
    who: "You",
    official: "FEE REALISED",
    section: "RTI Rules, 2012",
    youDo: "Pay by UPI, card or net banking — or claim the BPL waiver.",
    money: "₹10 out",
  },
  {
    id: "registered",
    day: 0,
    branch: "main",
    title: "It is registered and you get a number",
    body: "The portal issues a registration number in the format AAAAA/R/E/YY/NNNNN — office code, R for request, E for online, year, serial. This number is the key to everything that follows: tracking, appealing, and proving you asked.",
    who: "The portal",
    official: "REGISTERED",
    youDo: "Keep the number. We save it and text it to you.",
  },
  {
    id: "nodal",
    day: 0,
    branch: "main",
    title: "It reaches the department's front desk",
    body: "Every ministry has a Nodal Officer whose only job is to receive RTIs and route them to whichever officer holds the record. They do not answer you themselves.",
    who: "Nodal Officer",
    official: "FORWARDED TO NODAL OFFICER",
    youDo: "Nothing. This is automatic and usually same-day.",
  },
  {
    id: "cpio",
    day: 2,
    branch: "main",
    title: "The officer who must answer receives it",
    body: "The Central Public Information Officer — the CPIO — is the person the law makes personally responsible for answering you. If the record sits with a different office, they must transfer it within five days and tell you the new number.",
    who: "CPIO",
    official: "TRANSMITTED TO CPIO",
    section: "s.6(3) — transfer within 5 days",
    youDo: "Nothing. From here the clock is theirs, not yours.",
  },
  {
    id: "clock",
    day: 15,
    branch: "main",
    title: "The 30-day clock runs",
    body: "They have thirty days from the date you filed. During this time they may write to you once — usually to say the answer runs to many pages and ask for photocopy costs. That pauses the clock until you pay.",
    who: "CPIO",
    official: "PENDING WITH CPIO",
    section: `s.7(1) — ${REPLY_DEADLINE_DAYS} days`,
    youDo: "Nothing, unless they ask for photocopy costs. We count the days.",
  },
  {
    id: "reply",
    day: 28,
    branch: "good",
    title: "They reply — the usual ending",
    body: "Most RTIs end here. The answer arrives as a letter, often with the records attached. If it answers your question, you are done. If it is incomplete, evasive, or answers a question you did not ask, that is itself a ground for appeal.",
    who: "CPIO",
    official: "DISPOSED OF",
    youDo: "Read it, then tell us whether it actually answered you.",
  },
  {
    id: "silence",
    day: 30,
    branch: "bad",
    title: "Or the 30 days pass in silence",
    body: "Silence is not a dead end — in law it is a refusal. Once day thirty passes with no reply, the request is treated as refused, and everything that follows a refusal becomes available to you immediately.",
    who: "Nobody — that is the problem",
    official: "DEEMED REFUSAL",
    section: "s.7(2) — silence counts as refusal",
    youDo: "Nothing yet. You are now entitled to appeal, free.",
  },
  {
    id: "penalty",
    day: 31,
    branch: "bad",
    title: "A penalty starts running against the officer",
    body: `From the day they are late, the officer becomes personally liable for ₹${PENALTY_PER_DAY_INR} for every day of delay, up to ₹${PENALTY_CAP_INR.toLocaleString("en-IN")}. It is charged to the officer, not the department, and it is not paid to you — but it is the reason a late RTI suddenly gets answered.`,
    who: "The Information Commission decides this",
    official: "PENALTY LIABILITY",
    section: `s.20(1) — ₹${PENALTY_PER_DAY_INR} a day, capped at ₹${PENALTY_CAP_INR.toLocaleString("en-IN")}`,
    youDo: "Nothing. Mention it in your appeal — we do that for you.",
    money: `₹${PENALTY_PER_DAY_INR}/day against the officer`,
  },
  {
    id: "appeal",
    day: 32,
    branch: "bad",
    title: "You file a first appeal — free",
    body: "The appeal goes to the First Appellate Authority: a senior officer above the one who ignored you, inside the same department. There is no fee, and no form to fight — we write the letter from your registration number, the date and the reason.",
    who: "First Appellate Authority",
    official: "FIRST APPEAL — REGISTERED",
    section: "s.19(1) — within 30 days of the refusal",
    youDo: "Read the letter we drafted, change anything, send it.",
    money: "Free",
  },
  {
    id: "decision",
    day: 62,
    branch: "bad",
    title: "They have 45 days to decide",
    body: "The senior officer can order the CPIO to hand over the information, uphold the refusal with reasons, or call both sides to a hearing. Most appeals that reach this stage are simply granted — the delay was never a legal position, just an unanswered letter.",
    who: "First Appellate Authority",
    official: "FIRST APPEAL — PENDING",
    section: `s.19(6) — ${APPEAL_DECISION_DAYS} days at the outside`,
    youDo: "Nothing. We watch the date for you.",
  },
  {
    id: "second",
    day: 77,
    branch: "bad",
    title: "Still nothing? The Commission is next",
    body: "If the appeal is refused or simply not decided, the second appeal goes outside the department entirely — to the Central Information Commission, which is independent of it. The Commission is the body that can actually impose the penalty on the officer.",
    who: "Central Information Commission",
    official: "SECOND APPEAL — CIC",
    section: "s.19(3) — within 90 days",
    youDo: "File at the Commission. Everything you need is in your case file.",
  },
];

/** Day the clock stands at when a stage is showing. */
export function dayAt(i: number): number {
  for (let k = i; k >= 0; k -= 1) {
    const d = STAGES[k]?.day;
    if (d !== undefined) return d;
  }
  return 0;
}

/** Penalty accrued by a given day, capped as the Act caps it. */
export function penaltyAt(day: number): number {
  const late = Math.max(0, day - REPLY_DEADLINE_DAYS);
  return Math.min(late * PENALTY_PER_DAY_INR, PENALTY_CAP_INR);
}
