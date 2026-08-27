import {
  APPEAL_DECISION_DAYS,
  CaseEvent,
  CasePart,
  CaseStatus,
  PENALTY_CAP_INR,
  PENALTY_PER_DAY_INR,
  REPLY_DEADLINE_DAYS,
  RtiCase,
} from "./types";

export interface AppealState {
  /** Day the citizen filed the first appeal, if they have. */
  filedOnDay?: number;
  ground?: string;
}

export interface PenaltyView {
  active: boolean;
  daysLate: number;
  accruedInr: number;
  atCap: boolean;
}

export interface DerivedCase {
  day: number;
  status: CaseStatus;
  events: CaseEvent[];
  daysLeft: number;
  daysLate: number;
  isOverdue: boolean;
  hasReply: boolean;
  reply?: string;
  penalty: PenaltyView;
  canFileFirstAppeal: boolean;
  appealFiled: boolean;
  canFileSecondAppeal: boolean;
  parts?: DerivedPart[];
}

export interface DerivedPart extends CasePart {
  status: CaseStatus;
  isOverdue: boolean;
  daysLate: number;
}

function penaltyFor(daysLate: number): PenaltyView {
  const raw = Math.max(0, daysLate) * PENALTY_PER_DAY_INR;
  const accruedInr = Math.min(raw, PENALTY_CAP_INR);
  return {
    active: daysLate > 0,
    daysLate: Math.max(0, daysLate),
    accruedInr,
    atCap: raw >= PENALTY_CAP_INR,
  };
}

function partStatus(part: CasePart, day: number): DerivedPart {
  const replied = part.replyDay !== undefined && day >= part.replyDay;
  const daysLate = Math.max(0, day - REPLY_DEADLINE_DAYS);
  if (replied) {
    return { ...part, status: "replied", isOverdue: false, daysLate: 0 };
  }
  if (daysLate > 0) {
    return { ...part, status: "overdue", isOverdue: true, daysLate };
  }
  return { ...part, status: "awaiting_reply", isOverdue: false, daysLate: 0 };
}

/**
 * The whole state of a case at an arbitrary day. Every screen reads from
 * this, which is what lets the demo time machine move a request forwards
 * and backwards without any of the views knowing about time at all.
 */
export function deriveCase(
  c: RtiCase,
  day: number,
  appeal: AppealState = {},
): DerivedCase {
  const hasReply = c.replyDay !== undefined && day >= c.replyDay;
  const daysLate = hasReply ? 0 : Math.max(0, day - REPLY_DEADLINE_DAYS);
  const isOverdue = daysLate > 0;

  const events: CaseEvent[] = c.events.filter((e) => e.day <= day);

  // Statutory milestones are generated, not authored — they appear the
  // moment the clock crosses them.
  if (!hasReply && day >= REPLY_DEADLINE_DAYS) {
    events.push({
      day: REPLY_DEADLINE_DAYS,
      kind: "deadline",
      plain: "The 30-day legal deadline passed with no reply from them",
      official: "DEEMED REFUSAL — RTI ACT S.7(2)",
    });
    events.push({
      day: REPLY_DEADLINE_DAYS,
      kind: "escalation",
      plain: "You became entitled to file a First Appeal, free of cost",
      official: "ELIGIBLE FOR FIRST APPEAL — S.19(1)",
    });
  }
  if (!hasReply && daysLate > 0) {
    events.push({
      day: REPLY_DEADLINE_DAYS + 1,
      kind: "penalty",
      plain: `A penalty began accruing against the officer at ₹${PENALTY_PER_DAY_INR}/day`,
      official: "PENALTY LIABILITY — S.20(1)",
    });
  }
  if (c.replyDay !== undefined && hasReply) {
    events.push({
      day: c.replyDay,
      kind: "reply",
      plain: "They sent their reply",
      official: "DISPOSED OF",
    });
  }

  const appealFiled =
    appeal.filedOnDay !== undefined && day >= appeal.filedOnDay;

  if (appealFiled && appeal.filedOnDay !== undefined) {
    events.push({
      day: appeal.filedOnDay,
      kind: "appeal",
      plain: "You filed a First Appeal to the senior Appellate Authority",
      official: "FIRST APPEAL — REGISTERED",
    });
  }

  const appealDecisionDue =
    appeal.filedOnDay !== undefined
      ? appeal.filedOnDay + APPEAL_DECISION_DAYS
      : undefined;
  const appealOverdue =
    appealFiled && appealDecisionDue !== undefined && day >= appealDecisionDue;

  if (appealOverdue && appealDecisionDue !== undefined) {
    events.push({
      day: appealDecisionDue,
      kind: "escalation",
      plain:
        "45 days passed with no decision on your appeal — you can now go to the Central Information Commission",
      official: "ELIGIBLE FOR SECOND APPEAL — S.19(3)",
    });
  }

  events.sort((a, b) => a.day - b.day);

  let status: CaseStatus;
  if (hasReply) status = "replied";
  else if (appealOverdue) status = "appeal_overdue";
  else if (appealFiled) status = "appeal_pending";
  else if (isOverdue) status = "overdue";
  else if (day === 0) status = "filed";
  else status = "awaiting_reply";

  return {
    day,
    status,
    events,
    daysLeft: Math.max(0, REPLY_DEADLINE_DAYS - day),
    daysLate,
    isOverdue,
    hasReply,
    reply: hasReply ? c.reply : undefined,
    penalty: penaltyFor(daysLate),
    canFileFirstAppeal: isOverdue && !appealFiled,
    appealFiled,
    canFileSecondAppeal: appealOverdue,
    parts: c.parts?.map((p) => partStatus(p, day)),
  };
}

export function formatInr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}
