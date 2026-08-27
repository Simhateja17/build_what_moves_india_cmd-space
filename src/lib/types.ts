/* ------------------------------------------------------------------
   Statutory constants — RTI Act, 2005.
   These are real provisions of Indian law, not portal settings.
------------------------------------------------------------------- */
export const REPLY_DEADLINE_DAYS = 30; // s.7(1)
export const FIRST_APPEAL_FILING_DAYS = 30; // s.19(1)
export const APPEAL_DECISION_DAYS = 45; // s.19(6), outer limit
export const PENALTY_PER_DAY_INR = 250; // s.20(1)
export const PENALTY_CAP_INR = 25000; // s.20(1)

export type CaseStatus =
  | "filed"
  | "awaiting_reply"
  | "overdue"
  | "replied"
  | "appeal_pending"
  | "appeal_overdue";

export const STATUS_COPY: Record<
  CaseStatus,
  { plain: string; official: string; tone: "neutral" | "info" | "danger" | "good" | "warn" }
> = {
  filed: { plain: "Just filed", official: "REGISTERED", tone: "neutral" },
  awaiting_reply: {
    plain: "Waiting for their reply",
    official: "PENDING WITH CPIO",
    tone: "info",
  },
  overdue: {
    plain: "They are late",
    official: "DEEMED REFUSAL — S.7(2)",
    tone: "danger",
  },
  replied: { plain: "They replied", official: "DISPOSED OF", tone: "good" },
  appeal_pending: {
    plain: "Appeal in progress",
    official: "FIRST APPEAL — PENDING",
    tone: "warn",
  },
  appeal_overdue: {
    plain: "Appeal ignored too",
    official: "FIRST APPEAL — NO DECISION",
    tone: "danger",
  },
};

export type EventKind =
  | "filed"
  | "routed"
  | "cpio"
  | "split"
  | "deadline"
  | "penalty"
  | "reply"
  | "appeal"
  | "escalation";

export interface CaseEvent {
  day: number;
  kind: EventKind;
  plain: string;
  official?: string;
}

/** One office's share of a request that was split across several CPIOs. */
export interface CasePart {
  id: string;
  registrationNumber: string;
  office: string;
  /** Day this office replied. Undefined means it never does. */
  replyDay?: number;
  reply?: string;
}

/**
 * Something the department did that needs the citizen's attention but is
 * not a reply — the events that make people miss deadlines because the
 * old portal buries them in a status code.
 */
export type NoticeKind =
  | "transferred"
  | "document_requested"
  | "hearing_scheduled";

export interface CaseNotice {
  day: number;
  kind: NoticeKind;
  plain: string;
  official?: string;
  /** Day the hearing sits on, for hearing_scheduled. */
  hearingDay?: number;
}

export interface RtiCase {
  id: string;
  registrationNumber: string;
  plainTitle: string;
  /** One-line subject, the way a citizen would name it in conversation. */
  subject: string;
  question: string;
  authority: { ministry: string; office: string; cpio: string };
  feeLabel: string;
  /** ISO date the request was submitted. Day offsets render against this. */
  submittedOn: string;
  notices?: CaseNotice[];
  /** Authored events that are part of this case's story. */
  events: CaseEvent[];
  /** Day the CPIO replied. Undefined means they never do. */
  replyDay?: number;
  reply?: string;
  parts?: CasePart[];
  /** Where the time machine starts, and how far it can run. */
  startDay: number;
  maxDay: number;
  /** Short label explaining what this case demonstrates. */
  demoNote: string;
}

export interface GroundForAppeal {
  official: string;
  plain: string;
}

/** The five real options from the portal's Ground For Appeal dropdown. */
export const GROUNDS_FOR_APPEAL: GroundForAppeal[] = [
  {
    official: "No Response Within the Time Limit",
    plain: "They never replied in time",
  },
  {
    official: "Refused access to Information Requested",
    plain: "They refused to give me the information",
  },
  {
    official: "Provided Incomplete,Misleading or False Information",
    plain: "What they sent was incomplete or misleading",
  },
  {
    official: "Unreasonable amount of Fee required to Pay",
    plain: "They are demanding an unreasonable fee",
  },
  { official: "Any Other ground", plain: "Something else" },
];
