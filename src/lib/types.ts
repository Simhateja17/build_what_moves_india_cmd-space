export type RequestStatus =
  | "filed"
  | "awaiting_reply"
  | "no_response_overdue"
  | "replied"
  | "appeal_eligible"
  | "appeal_filed";

export const STATUS_COPY: Record<
  RequestStatus,
  { plain: string; official: string }
> = {
  filed: { plain: "Just filed", official: "REGISTERED" },
  awaiting_reply: {
    plain: "Waiting for a reply",
    official: "PENDING WITH CPIO",
  },
  no_response_overdue: {
    plain: "They're late",
    official: "NO REPLY RECEIVED — DEEMED REFUSAL",
  },
  replied: { plain: "They replied", official: "DISPOSED OF" },
  appeal_eligible: {
    plain: "You can escalate this now",
    official: "ELIGIBLE FOR FIRST APPEAL",
  },
  appeal_filed: {
    plain: "Appeal sent",
    official: "FIRST APPEAL — PENDING",
  },
};

export interface HistoryEvent {
  day: string;
  plainLabel: string;
  officialLabel?: string;
}

export interface PenaltyState {
  active: boolean;
  ratePerDayInr: number;
  capInr: number;
  daysOverdue: number;
  accruedInr: number;
}

export interface RtiRequestPart {
  id: string;
  registrationNumber: string;
  plainLabel: string;
  status: RequestStatus;
  reply?: string;
}

export interface RtiRequest {
  id: string;
  registrationNumber: string;
  plainTitle: string;
  officialSummary: string;
  authority: { ministry: string; department: string; nodalOfficer?: string };
  filedDayLabel: string;
  daysElapsed: number;
  deadlineDays: number;
  status: RequestStatus;
  history: HistoryEvent[];
  penalty?: PenaltyState;
  parts?: RtiRequestPart[];
}

export interface GroundForAppealOption {
  official: string;
  plain: string;
}

export const GROUNDS_FOR_APPEAL: GroundForAppealOption[] = [
  {
    official: "Refused access to Information Requested",
    plain: "They refused to give me the information",
  },
  {
    official: "No Response Within the Time Limit",
    plain: "They didn't respond in time",
  },
  {
    official: "Unreasonable amount of Fee required to Pay",
    plain: "They're charging me an unreasonable fee",
  },
  {
    official: "Provided Incomplete,Misleading or False Information",
    plain: "What they gave me was incomplete or misleading",
  },
  { official: "Any Other ground", plain: "Something else" },
];
