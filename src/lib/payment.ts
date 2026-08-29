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
import { RtiCase, Tone } from "./types";

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

/**
 * The same tone vocabulary the case badges use — payment had its own
 * copy of the list, which is how two vocabularies drift apart. Payment
 * chips add the fill variant from `tone.ts`: a state nothing will change
 * on its own renders solid, a state still in flight renders tinted.
 */
export type AnswerTone = Tone;

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
    lead: `The RTI application fee is ₹${RTI_FEE_INR}. No additional charges apply.`,
    official: "PAYMENT PENDING — IPO/DD/NEFT/UPI",
    tone: "neutral",
    answers: {
      paid: { value: "Not yet. No amount has been charged.", tone: "neutral" },
      registered: { value: "Not yet", tone: "neutral" },
      action: { value: `Pay ₹${RTI_FEE_INR} to send your request`, tone: "info" },
      payAgain: { value: "Not applicable. This is the first attempt.", tone: "neutral" },
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
      paid: { value: "Confirmation is being sought from the bank", tone: "info" },
      registered: { value: "Not yet. Registration occurs after payment is confirmed.", tone: "neutral" },
      action: { value: "No action is required. Do not press Back or close this page.", tone: "info" },
      payAgain: { value: "No. This payment attempt is still in progress.", tone: "danger" },
    },
    payingIsSafe: false,
    isWorking: true,
    isTerminal: false,
  },

  paid: {
    headline: "Payment successful",
    lead: `₹${RTI_FEE_INR} received. The RTI application is being registered.`,
    official: "TRANSACTION SUCCESSFUL — REGISTRATION IN PROGRESS",
    tone: "good",
    answers: {
      paid: { value: "Yes. Confirmed by the bank.", tone: "good" },
      registered: { value: "Registration is in progress", tone: "info" },
      action: { value: "No action is required. The registration number will be available shortly.", tone: "info" },
      payAgain: { value: "No. This payment has already been completed.", tone: "danger" },
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
    banner: "Do not pay again. The amount has already been received by the government.",
    official: "TRANSACTION SUCCESSFUL — REGISTRATION PENDING RECONCILIATION",
    tone: "warn",
    answers: {
      paid: {
        value: `Yes. ₹${RTI_FEE_INR} was debited and has been received by the government.`,
        tone: "good",
      },
      registered: {
        value: "Not yet. The registration number is still being generated.",
        tone: "warn",
      },
      action: {
        value:
          "No action is required. The status is checked automatically at regular intervals, and an email and SMS will be sent once the registration number is available.",
        tone: "info",
      },
      payAgain: {
        value:
          `No. Paying again would take another ₹${RTI_FEE_INR} and create a duplicate request.`,
        tone: "danger",
      },
    },
    guarantee:
      `The amount paid is accounted for. If no registration number is generated within ${SETTLEMENT_WORKING_DAYS} working days, the ₹${RTI_FEE_INR} fee will be refunded automatically to the same account. No application is required for the refund.`,
    payingIsSafe: false,
    isWorking: true,
    isTerminal: false,
  },

  failed: {
    headline: "Payment failed — the transaction was not charged",
    lead: "No amount was charged. The request has been saved and is ready to submit.",
    official: "TRANSACTION FAILED — DECLINED BY BANK",
    tone: "danger",
    answers: {
      paid: { value: "No. The payment was not completed.", tone: "danger" },
      registered: { value: "No. A request is registered only once the fee is paid.", tone: "neutral" },
      action: { value: "Payment may be attempted again. The request has been saved exactly as entered.", tone: "info" },
      payAgain: {
        value: "Yes. This is safe, as no amount was charged and there is no duplicate risk.",
        tone: "good",
      },
    },
    guarantee:
      `If the bank app shows ₹${RTI_FEE_INR} debited despite this message, it is a temporary hold. Under the RBI's Turn Around Time rules, the bank is required to reverse it automatically, and is liable to pay ₹100 for each day of delay. Use Check Payment Status to track this.`,
    payingIsSafe: true,
    isWorking: false,
    isTerminal: true,
  },

  unknown: {
    headline: "Payment confirmation is pending",
    lead: "Do not pay again.",
    banner: "Do not pay again until the payment status has been confirmed.",
    official: "TRANSACTION STATUS AWAITED FROM PAYMENT GATEWAY",
    // Not "warn". Pending-registration wore the identical saffron chip,
    // and the two are not the same news: there the money is known to have
    // reached the government and is guaranteed back; here nobody yet knows
    // whether it moved at all. Tinted red, against failed's solid red.
    tone: "danger",
    answers: {
      paid: {
        value: "Confirmation is pending. The connection to the bank was interrupted before a response was received.",
        tone: "warn",
      },
      registered: { value: "Not yet", tone: "neutral" },
      action: {
        value: "No action is required at this time. An email and SMS will be sent once confirmation is received from the bank.",
        tone: "info",
      },
      payAgain: {
        value:
          "No. If the amount was already debited, paying again would result in a duplicate charge. Notification will be sent once it is safe to proceed.",
        tone: "danger",
      },
    },
    guarantee:
      `Every unconfirmed payment is settled within ${SETTLEMENT_WORKING_DAYS} working days. Either the RTI is registered, or the amount is refunded in full.`,
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
      paid: { value: `Yes. ₹${RTI_FEE_INR} paid and receipted.`, tone: "good" },
      registered: { value: "Yes. The registration number is shown below.", tone: "good" },
      action: {
        value: "No action is required. The Public Authority has 30 days to respond, and this period is tracked automatically.",
        tone: "good",
      },
      payAgain: { value: "No. This request is complete.", tone: "good" },
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

export function formatDay(d: Date, locale: "en" | "hi" = "en"): string {
  return d.toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(ms: number, locale: "en" | "hi" = "en"): string {
  return new Date(ms).toLocaleString(locale === "hi" ? "hi-IN" : "en-IN", {
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
      // Not yet a person. Saying so plainly is better than printing a
      // placeholder name the citizen might try to write to — the Nodal
      // Officer has two days to name the officer under s.5(1), and the
      // page says when that will happen rather than inventing it now.
      cpio: {
        name: "Not yet assigned",
        designation: "Central Public Information Officer",
        address: `${draft.office}, ${draft.ministry}`,
      },
      appellateAuthority: {
        name: "Not yet assigned",
        designation: "First Appellate Authority",
        address: `${draft.office}, ${draft.ministry}`,
      },
    },
    fee: draft.isBpl
      ? {
          amountInr: 0,
          waived: true,
          waiverBasis: "BPL certificate submitted with the application.",
        }
      : {
          amountInr: RTI_FEE_INR,
          waived: false,
          mode: "UPI",
          receiptNumber: registrationNumber.replace(/\//g, ""),
          paidOn: new Date().toISOString().slice(0, 10),
        },
    applicant: {
      name: draft.name,
      address: "As given in your application",
      email: draft.email,
      mobile: draft.mobile,
      isCitizen: true,
      isBpl: draft.isBpl,
    },
    format: "electronic",
    startDay: 0,
    maxDay: 120,
    demoNote:
      "Your new request. Drag the time machine forward to see what the law does if they stay silent.",
    events: [
      {
        day: 0,
        kind: "filed",
        plain: draft.isBpl
          ? "The application was filed. No fee was charged, as a BPL certificate was submitted."
          : `The application was filed, with the ₹${RTI_FEE_INR} fee paid.`,
        official: "REGISTERED",
      },
      {
        day: 0,
        kind: "routed",
        plain: "The application reached the department's Nodal Officer.",
        official: "FORWARDED TO NODAL OFFICER",
      },
      {
        day: 2,
        kind: "cpio",
        plain: "The Nodal Officer forwarded the application to the CPIO responsible for reply.",
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
