/* ------------------------------------------------------------------
   The payment state machine.

   Every payment screen renders from this file. The rule: a citizen who
   has parted with money must always be able to answer four questions
   without reading a paragraph or phoning anyone —

     1. Did my payment succeed?
     2. Is my RTI registered?
     3. Do I need to do anything?
     4. Should I pay again?

   So each state below carries an explicit answer to all four. No state
   is allowed to leave one blank, and no state answers "maybe" to
   question 4 — either it is safe to pay, or it is not.
------------------------------------------------------------------- */

import { MINISTRY_CODES } from "./mock-data";
import { RtiCase } from "./types";

export const RTI_FEE_INR = 10;

/** How long the portal has to turn a taken payment into a registration. */
export const SETTLEMENT_WORKING_DAYS = 3;

export type PaymentState =
  | "payment" // nothing has happened yet — the pay screen
  | "processing" // sent to the bank, waiting on an answer
  | "paid" // bank said yes, registration still being written
  | "pending_registration" // money taken, no number yet — the case that breaks people
  | "failed" // bank said no, no money moved
  | "unknown" // we never got an answer, money may or may not have moved
  | "registered"; // done, number issued

export type AnswerTone = "good" | "warn" | "danger" | "info" | "neutral";

export interface Answer {
  value: string;
  tone: AnswerTone;
}

export interface PaymentStateCopy {
  /** Plain headline, written for someone who is already anxious. */
  headline: string;
  /** The single most important sentence. Rendered large. */
  lead: string;
  /** Shown only when the citizen must be stopped from paying twice. */
  banner?: string;
  /** What the department's own system would call this. */
  official: string;
  tone: AnswerTone;
  /** The four questions, always answered. */
  answers: {
    paid: Answer;
    registered: Answer;
    action: Answer;
    payAgain: Answer;
  };
  /** The promise that makes waiting tolerable. Money states only. */
  guarantee?: string;
  /** True when the citizen is safe to spend money. */
  payingIsSafe: boolean;
  /** True while the portal is still working — drives polling UI. */
  isWorking: boolean;
  /** Nothing more will change on its own. */
  isTerminal: boolean;
}

export const PAYMENT_COPY: Record<PaymentState, PaymentStateCopy> = {
  payment: {
    headline: `Pay ₹${RTI_FEE_INR} to send this request`,
    lead: `The RTI application fee is ₹${RTI_FEE_INR}. That is the whole cost.`,
    official: "PAYMENT PENDING — IPO/DD/NEFT/UPI",
    tone: "neutral",
    answers: {
      paid: { value: "Not yet — nothing has been charged", tone: "neutral" },
      registered: { value: "Not yet", tone: "neutral" },
      action: { value: `Pay ₹${RTI_FEE_INR} to send your request`, tone: "info" },
      payAgain: { value: "Not applicable — this is your first attempt", tone: "neutral" },
    },
    payingIsSafe: true,
    isWorking: false,
    isTerminal: false,
  },

  processing: {
    headline: "Processing your payment",
    lead: "Please stay on this page. This usually takes about ten seconds.",
    official: "TRANSACTION IN PROGRESS — AWAITING GATEWAY RESPONSE",
    tone: "info",
    answers: {
      paid: { value: "Checking with your bank now", tone: "info" },
      registered: { value: "Not yet — registration happens after payment", tone: "neutral" },
      action: { value: "Nothing. Do not press Back or close this page", tone: "info" },
      payAgain: { value: "No — this attempt is still live", tone: "danger" },
    },
    payingIsSafe: false,
    isWorking: true,
    isTerminal: false,
  },

  paid: {
    headline: "Payment successful",
    lead: `₹${RTI_FEE_INR} received. Registering your RTI now.`,
    official: "TRANSACTION SUCCESSFUL — REGISTRATION IN PROGRESS",
    tone: "good",
    answers: {
      paid: { value: "Yes — your bank confirmed it", tone: "good" },
      registered: { value: "Being registered right now", tone: "info" },
      action: { value: "Nothing. Your registration number is seconds away", tone: "info" },
      payAgain: { value: "No — your payment is already through", tone: "danger" },
    },
    payingIsSafe: false,
    isWorking: true,
    isTerminal: false,
  },

  // The state this redesign exists for. A citizen has paid, the money is
  // gone, and the old portal shows them nothing but a blank screen — so
  // they pay again, and again, and end up with three debits and no RTI.
  pending_registration: {
    headline: "Payment received. Your RTI registration is being confirmed.",
    lead: "Do not pay again.",
    banner: "Do not pay again. Your money has already reached the government.",
    official: "TRANSACTION SUCCESSFUL — REGISTRATION PENDING RECONCILIATION",
    tone: "warn",
    answers: {
      paid: {
        value: `Yes — ₹${RTI_FEE_INR} was debited and has reached the government`,
        tone: "good",
      },
      registered: {
        value: "Not yet — your registration number is still being generated",
        tone: "warn",
      },
      action: {
        value:
          "Nothing. We are checking every few minutes and will email and SMS you the moment your number is ready",
        tone: "info",
      },
      payAgain: {
        value:
          `No. Paying again would take another ₹${RTI_FEE_INR} and create a duplicate request`,
        tone: "danger",
      },
    },
    guarantee:
      `Your money is safe and accounted for. If no registration number is generated within ${SETTLEMENT_WORKING_DAYS} working days, your ₹${RTI_FEE_INR} is refunded automatically to the same account — you do not have to apply for it.`,
    payingIsSafe: false,
    isWorking: true,
    isTerminal: false,
  },

  failed: {
    headline: "Payment failed — your money was not taken",
    lead: "Nothing was charged. Your request is saved and ready to send.",
    official: "TRANSACTION FAILED — DECLINED BY BANK",
    tone: "danger",
    answers: {
      paid: { value: "No — the payment did not go through", tone: "danger" },
      registered: { value: "No — a request is only registered once the fee is paid", tone: "neutral" },
      action: { value: "Try paying again. Your request has been kept exactly as you wrote it", tone: "info" },
      payAgain: {
        value: "Yes — it is safe. You were not charged, so there is nothing to duplicate",
        tone: "good",
      },
    },
    guarantee:
      `If your bank app shows ₹${RTI_FEE_INR} debited despite this message, it is a temporary hold. Under the RBI's Turn Around Time rules your bank must reverse it automatically, and owes you ₹100 for every day it is late. Use Check Payment Status to track it.`,
    payingIsSafe: true,
    isWorking: false,
    isTerminal: true,
  },

  unknown: {
    headline: "We could not confirm your payment yet",
    lead: "Do not pay again.",
    banner: "Do not pay again until we know whether your money was taken.",
    official: "TRANSACTION STATUS AWAITED FROM PAYMENT GATEWAY",
    tone: "warn",
    answers: {
      paid: {
        value: "We are still finding out — the connection to your bank broke before we got an answer",
        tone: "warn",
      },
      registered: { value: "Not yet", tone: "neutral" },
      action: {
        value: "Nothing right now. We will email and SMS you as soon as your bank answers",
        tone: "info",
      },
      payAgain: {
        value:
          "No. If your money was taken, paying again would charge you twice. We will tell you the moment it is safe",
        tone: "danger",
      },
    },
    guarantee:
      `Every unconfirmed payment is settled within ${SETTLEMENT_WORKING_DAYS} working days — either your RTI is registered, or your money is refunded in full. Nothing is left hanging.`,
    payingIsSafe: false,
    isWorking: true,
    isTerminal: false,
  },

  registered: {
    headline: "Your RTI is registered",
    lead: "The 30-day legal clock has started.",
    official: "REGISTERED — FEE REALISED",
    tone: "good",
    answers: {
      paid: { value: `Yes — ₹${RTI_FEE_INR} paid and receipted`, tone: "good" },
      registered: { value: "Yes — your registration number is below", tone: "good" },
      action: {
        value: "Nothing. They have 30 days to answer, and we are counting them for you",
        tone: "good",
      },
      payAgain: { value: "No — this request is complete", tone: "good" },
    },
    payingIsSafe: false,
    isWorking: false,
    isTerminal: true,
  },
};

/** The four questions, in the order a worried citizen actually asks them. */
export const QUESTION_LABELS: Array<{
  key: keyof PaymentStateCopy["answers"];
  question: string;
}> = [
  { key: "paid", question: "Did my payment succeed?" },
  { key: "registered", question: "Is my RTI registered?" },
  { key: "action", question: "Do I need to do anything?" },
  { key: "payAgain", question: "Should I pay again?" },
];

/** What the citizen was buying — kept so a stuck payment can still be registered. */
export interface PaymentDraft {
  ministry: string;
  office: string;
  question: string;
  name: string;
  email: string;
  mobile?: string;
  isBpl: boolean;
}

export interface PaymentRecord {
  ref: string;
  /** The bank's own reference. Only exists once money actually moved. */
  bankRef?: string;
  state: PaymentState;
  amountInr: number;
  method: string;
  /** Epoch ms. */
  startedAt: number;
  settledAt?: number;
  /** Set once the payment turns into a real case. */
  caseId?: string;
  registrationNumber?: string;
  draft: PaymentDraft;
}

/**
 * One payment left stranded: the money is gone, no registration number
 * came back. It seeds the dashboard's "Payment needs confirmation"
 * action so the flow's worst case is visible from the home screen.
 */
export function seedPayments(): PaymentRecord[] {
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  return [
    {
      ref: "RTIPAY26418872",
      bankRef: "417290556",
      state: "pending_registration",
      amountInr: RTI_FEE_INR,
      method: "UPI · ananya@okhdfc",
      startedAt: twoDaysAgo,
      settledAt: twoDaysAgo + 42_000,
      draft: {
        ministry: "Ministry of Railways",
        office: "Zonal Railway Office",
        question:
          "Please provide the number of unreserved coaches removed from the Mumbai suburban network during 2025-26 and the reasons recorded for each removal.",
        name: "Ananya Sharma",
        email: "ananya.sharma@example.in",
        isBpl: false,
      },
    },
  ];
}

/** A portal-style transaction reference, stable enough to read down a phone. */
export function makePaymentRef(): string {
  const n = Math.floor(Math.random() * 900000) + 100000;
  return `RTIPAY26${n}`;
}

export function makeBankRef(): string {
  const n = Math.floor(Math.random() * 900000000) + 100000000;
  return `${n}`;
}

/** Money has demonstrably left the citizen's account. */
export function moneyIsGone(state: PaymentState): boolean {
  return (
    state === "paid" || state === "pending_registration" || state === "registered"
  );
}

/**
 * Working days from a moment, skipping Saturday and Sunday. Used for the
 * refund promise — a date the citizen can hold the portal to.
 */
export function addWorkingDays(from: number, days: number): Date {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return d;
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(ms: number): string {
  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Turn a paid-for draft into a real case. Kept separate from the payment
 * itself so a registration can be completed later — which is the whole
 * point of the pending state: the money and the RTI settle independently.
 */
export function caseFromDraft(
  draft: PaymentDraft,
  id: string,
  registrationNumber: string,
): RtiCase {
  const firstSentence = draft.question.trim().split(/[.\n]/)[0];
  return {
    id,
    registrationNumber,
    plainTitle: firstSentence.slice(0, 80) || "Your new RTI request",
    subject: firstSentence.slice(0, 46) || "New RTI request",
    submittedOn: new Date().toISOString().slice(0, 10),
    question: draft.question.trim(),
    authority: {
      ministry: draft.ministry,
      office: draft.office,
      cpio: "CPIO (to be assigned by the Nodal Officer)",
    },
    feeLabel: draft.isBpl
      ? "Fee waived — BPL certificate attached"
      : `₹${RTI_FEE_INR} paid by UPI`,
    startDay: 0,
    maxDay: 120,
    demoNote:
      "Your new request. Drag the time machine forward to see what the law does if they stay silent.",
    events: [
      {
        day: 0,
        kind: "filed",
        plain: draft.isBpl
          ? "You filed this request — no fee, as you hold a BPL card"
          : `You filed this request and paid ₹${RTI_FEE_INR}`,
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
}

export function makeRegistrationNumber(ministry: string): string {
  const code = MINISTRY_CODES[ministry] ?? "GOVIN";
  const serial = String(Math.floor(Math.random() * 90000) + 10000);
  return `${code}/R/E/26/${serial}`;
}
