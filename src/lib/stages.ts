/* ------------------------------------------------------------------
   The six stages of an RTI, in the citizen's words.

   The portal's own vocabulary — REGISTERED, TRANSMITTED TO CPIO,
   DISPOSED OF, DEEMED REFUSAL — is accurate and useless to a person
   who has never filed before. Each stage below leads with what it
   means and keeps the official term underneath it, never the reverse.
------------------------------------------------------------------- */

import { DerivedCase } from "./derive";

export type StageKey =
  | "submitted"
  | "payment"
  | "received"
  | "processing"
  | "response"
  | "appeal";

export type StageState =
  | "done"
  | "current"
  | "overdue"
  | "pending"
  | "attention"
  | "skipped";

export interface Stage {
  key: StageKey;
  /** What the citizen calls it. */
  label: string;
  /** What the department calls it — shown small, underneath. */
  official: string;
  state: StageState;
  /** One line explaining what is happening, or what happens next. */
  note: string;
  /** Day this stage was reached, when it has been. */
  day?: number;
}

export const STAGE_ORDER: StageKey[] = [
  "submitted",
  "payment",
  "received",
  "processing",
  "response",
  "appeal",
];

interface StageInput {
  d: DerivedCase;
  /** True when a payment for this case is still unconfirmed. */
  paymentUnconfirmed?: boolean;
  feeWaived?: boolean;
}

/**
 * Collapse the derived case into the six stages. Exactly one stage is
 * "current" unless the case is finished, so the citizen can always point
 * at where their request actually is.
 */
export function stagesFor({
  d,
  paymentUnconfirmed = false,
  feeWaived = false,
}: StageInput): Stage[] {
  const replied = d.hasReply;
  const appealLive = d.appealFiled || d.canFileFirstAppeal || d.canFileSecondAppeal;

  const submitted: Stage = {
    key: "submitted",
    label: "Submitted",
    official: "REGISTERED",
    state: "done",
    note: "You filed this request and it entered the system.",
    day: 0,
  };

  const payment: Stage = {
    key: "payment",
    label: "Payment",
    official: feeWaived ? "FEE WAIVED — BPL" : "FEE REALISED",
    state: paymentUnconfirmed ? "attention" : "done",
    note: paymentUnconfirmed
      ? "Your money was taken but not yet matched to this request. Do not pay again."
      : feeWaived
        ? "No fee was due — you hold a BPL card, so the ₹10 was waived."
        : "The ₹10 application fee was paid and receipted.",
    day: 0,
  };

  const received: Stage = {
    key: "received",
    label: "Received by department",
    official: "TRANSMITTED TO CPIO",
    state: d.day >= 2 ? "done" : "current",
    note:
      d.day >= 2
        ? "The Nodal Officer passed it to the officer who must answer you."
        : "Waiting for the department's Nodal Officer to route it.",
    day: 2,
  };

  const processing: Stage = {
    key: "processing",
    label: "Under process",
    official: replied
      ? "PROCESSED BY CPIO"
      : d.isOverdue
        ? "DEEMED REFUSAL — S.7(2)"
        : "PENDING WITH CPIO",
    state: replied
      ? "done"
      : d.isOverdue
        ? "overdue"
        : d.day >= 2
          ? "current"
          : "pending",
    note: replied
      ? "The officer finished with it and sent their answer."
      : d.isOverdue
        ? `${d.daysLate} days past the legal deadline. In law this silence is already a refusal.`
        : `They have ${d.daysLeft} days left to answer you.`,
  };

  const response: Stage = {
    key: "response",
    label: "Response",
    official: replied ? "DISPOSED OF" : "AWAITED",
    state: replied ? "done" : d.isOverdue ? "overdue" : "pending",
    note: replied
      ? "Their answer is on your case, in full."
      : d.isOverdue
        ? "No answer arrived within the 30 days the law allows."
        : "Their written answer will appear here.",
  };

  const appeal: Stage = {
    key: "appeal",
    label: "Appeal",
    official: d.canFileSecondAppeal
      ? "ELIGIBLE FOR SECOND APPEAL — S.19(3)"
      : d.appealFiled
        ? "FIRST APPEAL — PENDING"
        : d.canFileFirstAppeal
          ? "ELIGIBLE FOR FIRST APPEAL — S.19(1)"
          : "NOT REQUIRED",
    state: d.canFileSecondAppeal
      ? "attention"
      : d.appealFiled
        ? "current"
        : d.canFileFirstAppeal
          ? "attention"
          : appealLive
            ? "pending"
            : "skipped",
    note: d.canFileSecondAppeal
      ? "Your appeal went undecided for 45 days. You can now go to the Information Commission."
      : d.appealFiled
        ? "With the senior Appellate Authority, who has 45 days to decide."
        : d.canFileFirstAppeal
          ? "You are entitled to appeal, free of cost, right now."
          : "Only needed if they stay silent or their answer falls short.",
  };

  return [submitted, payment, received, processing, response, appeal];
}
