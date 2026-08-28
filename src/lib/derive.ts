import {
  APPEAL_DECISION_DAYS,
  APPEAL_DECISION_DAYS_ORDINARY,
  RESPONSE_TRACKS,
  ResponseTrack,
  ResponseTrackSpec,
  CaseEvent,
  CasePart,
  CaseStatus,
  PENALTY_CAP_INR,
  PENALTY_PER_DAY_INR,
  REPLY_DEADLINE_DAYS,
  HearingChoice,
  RtiCase,
} from "./types";

/* ------------------------------------------------------------------
   How long they actually have.

   Not thirty days. Thirty is the ordinary period under s.7(1), and the
   Act sets three other limits beside it — 48 hours where life or liberty
   is concerned, 35 days where the application went through an Assistant
   PIO, 40 where a third party had to be heard. On top of that, s.7(3)(a)
   excludes the days between a demand for additional fee and its payment.

   A portal that prints one hardcoded date for all of these is telling
   most applicants the wrong day, and the wrong day is the one thing a
   citizen actually acts on.
------------------------------------------------------------------- */

export interface ResponseClock {
  track: ResponseTrack;
  spec: ResponseTrackSpec;
  /** Days allowed, before any exclusion. */
  allowedDays: number;
  /** Days excluded from the count under s.7(3)(a), while a fee was owed. */
  excludedDays: number;
  /** Day offset the reply falls due on, exclusions included. */
  dueDay: number;
  /** True while an additional-fee demand is unpaid — the clock is stopped. */
  stopped: boolean;
}

export function responseClock(c: RtiCase, day: number): ResponseClock {
  const track: ResponseTrack = c.track ?? "standard";
  const spec = RESPONSE_TRACKS[track];

  // s.7(3)(a): the period between the intimation of the additional fee
  // and its payment does not count. While it is unpaid the clock is
  // stopped outright, so the excluded span grows with the current day.
  const fee = c.additionalFee;
  const stopped = fee !== undefined && fee.paidOnDay === undefined && day >= fee.day;
  const excludedDays =
    fee === undefined || day < fee.day
      ? 0
      : Math.max(0, (fee.paidOnDay ?? day) - fee.day);

  return {
    track,
    spec,
    allowedDays: spec.days,
    excludedDays,
    dueDay: spec.days + excludedDays,
    stopped,
  };
}

export interface AppealState {
  /** Day the citizen filed the first appeal, if they have. */
  filedOnDay?: number;
  ground?: string;
  /** Appeal reference, e.g. FA2291. Issued when the appeal is registered. */
  number?: string;
  /** How the citizen answered a hearing notice, if one was issued. */
  hearingChoice?: HearingChoice;
  /** Day the citizen escalated to the Information Commission, if they have. */
  secondFiledOnDay?: number;
  secondGround?: string;
  /** Second appeal reference, e.g. CIC/A/2026/004417. */
  secondNumber?: string;
}

export interface PenaltyView {
  active: boolean;
  daysLate: number;
  accruedInr: number;
  atCap: boolean;
}

export interface DerivedCase {
  day: number;
  /** Which of the Act's clocks this request runs on, and where it stands. */
  clock: ResponseClock;
  status: CaseStatus;
  events: CaseEvent[];
  daysLeft: number;
  daysLate: number;
  isOverdue: boolean;
  hasReply: boolean;
  reply?: string;
  penalty: PenaltyView;
  canFileFirstAppeal: boolean;
  /** The reply landed but withheld what was asked — s.19(1), second limb. */
  firstAppealOnRefusal: boolean;
  appealFiled: boolean;
  canFileSecondAppeal: boolean;
  secondAppealFiled: boolean;
  /** Day the Appellate Authority's ordinary 30 days ran out — s.19(6). */
  appealDecisionDueDay?: number;
  /** Day its outer limit of 45 ran out, the point a Second Appeal opens. */
  appealOuterLimitDay?: number;
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
  const clock = responseClock(c, day);
  const hasReply = c.replyDay !== undefined && day >= c.replyDay;
  const daysLate = hasReply ? 0 : Math.max(0, day - clock.dueDay);
  const isOverdue = daysLate > 0;

  const events: CaseEvent[] = c.events.filter((e) => e.day <= day);

  // Statutory milestones are generated, not authored — they appear the
  // moment the clock crosses them.
  if (!hasReply && day >= clock.dueDay) {
    events.push({
      day: clock.dueDay,
      kind: "deadline",
      plain: `The ${clock.spec.label} the law allows passed with no reply from them`,
      official: "DEEMED REFUSAL — RTI ACT S.7(2)",
    });
    events.push({
      day: clock.dueDay,
      kind: "escalation",
      plain: "You became entitled to file a First Appeal, free of cost",
      official: "ELIGIBLE FOR FIRST APPEAL — S.19(1)",
    });
  }
  if (!hasReply && daysLate > 0) {
    events.push({
      day: clock.dueDay + 1,
      kind: "penalty",
      plain: `A penalty began accruing against the officer at ₹${PENALTY_PER_DAY_INR}/day`,
      official: "PENALTY LIABILITY — S.20(1)",
    });
  }
  if (c.additionalFee && day >= c.additionalFee.day) {
    const fee = c.additionalFee;
    events.push({
      day: fee.day,
      kind: "deadline",
      plain: `They asked for ₹${fee.amountInr} towards the cost of supplying the information. The clock stopped until it was paid.`,
      official: "ADDITIONAL FEE INTIMATED — S.7(3)",
    });
    if (fee.paidOnDay !== undefined && day >= fee.paidOnDay) {
      events.push({
        day: fee.paidOnDay,
        kind: "deadline",
        plain: `You paid ₹${fee.amountInr}. The clock restarted, ${fee.paidOnDay - fee.day} day${fee.paidOnDay - fee.day === 1 ? "" : "s"} later than it stopped.`,
        official: "ADDITIONAL FEE REALISED — S.7(3)(a)",
      });
    }
  }

  if (c.replyDay !== undefined && hasReply) {
    events.push({
      day: c.replyDay,
      kind: "reply",
      plain: c.replyIsRefusal
        ? "They replied, but withheld part of what you asked for"
        : "They sent their reply",
      official: c.replyIsRefusal ? "DISPOSED OF — PARTLY DENIED" : "DISPOSED OF",
    });
    // A reply that falls short opens the same door silence does, but the
    // 30 days to walk through it run from the reply, not from the expiry.
    if (c.replyIsRefusal) {
      events.push({
        day: c.replyDay,
        kind: "escalation",
        plain:
          "Because the answer fell short of the question, you became entitled to file a First Appeal, free of cost",
        official: "ELIGIBLE FOR FIRST APPEAL — S.19(1)",
      });
    }
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

  // s.19(6) gives the Appellate Authority thirty days, and forty-five at
  // the outside where the reasons for taking longer are recorded. The
  // portal used to print 45 as though it were the rule, which quietly
  // handed the department fifteen days it had not earned.
  const appealDecisionDueDay =
    appeal.filedOnDay !== undefined
      ? appeal.filedOnDay + APPEAL_DECISION_DAYS_ORDINARY
      : undefined;
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
        "Even the outer limit of 45 days passed with no decision on your appeal — you can now go to the Central Information Commission",
      official: "ELIGIBLE FOR SECOND APPEAL — S.19(3)",
    });
  }

  const secondAppealFiled =
    appeal.secondFiledOnDay !== undefined && day >= appeal.secondFiledOnDay;

  if (secondAppealFiled && appeal.secondFiledOnDay !== undefined) {
    events.push({
      day: appeal.secondFiledOnDay,
      kind: "appeal",
      plain:
        "You filed a Second Appeal to the Central Information Commission, which sits outside the department",
      official: "SECOND APPEAL — REGISTERED",
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
    clock,
    status,
    events,
    daysLeft: Math.max(0, clock.dueDay - day),
    daysLate,
    isOverdue,
    hasReply,
    reply: hasReply ? c.reply : undefined,
    penalty: penaltyFor(daysLate),
    // Silence (s.7(2)) and a short answer (s.19(1)) are both grounds. The
    // second was modelled nowhere, which meant a citizen who got a reply
    // refusing them the information saw no way forward at all.
    canFileFirstAppeal:
      (isOverdue || (hasReply && c.replyIsRefusal === true)) && !appealFiled,
    firstAppealOnRefusal: hasReply && c.replyIsRefusal === true && !appealFiled,
    appealFiled,
    canFileSecondAppeal: appealOverdue && !secondAppealFiled,
    secondAppealFiled,
    parts: c.parts?.map((p) => partStatus(p, day)),
  };
}

export function formatInr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}
