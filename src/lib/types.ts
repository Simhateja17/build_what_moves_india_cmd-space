/* ------------------------------------------------------------------
   Statutory constants — RTI Act, 2005.
   These are real provisions of Indian law, not portal settings.
------------------------------------------------------------------- */
export const REPLY_DEADLINE_DAYS = 30; // s.7(1)
export const FIRST_APPEAL_FILING_DAYS = 30; // s.19(1)
export const APPEAL_DECISION_DAYS_ORDINARY = 30; // s.19(6), the ordinary limit
export const APPEAL_DECISION_DAYS = 45; // s.19(6), outer limit, reasons recorded
export const PENALTY_PER_DAY_INR = 250; // s.20(1)
export const PENALTY_CAP_INR = 25000; // s.20(1)
export const SECOND_APPEAL_FILING_DAYS = 90; // s.19(3)

/**
 * How urgent a status is. Paired with a variant in `tone.ts` — colour on
 * its own could not keep distinct states apart, so `muted` exists for the
 * one stage that is over and asks nothing of the citizen.
 */
export type Tone = "neutral" | "info" | "danger" | "good" | "warn" | "muted";

/**
 * The internal state machine. `deriveCase` computes this; nothing renders
 * it directly. It is deliberately finer-grained than what a citizen sees.
 */
export type CaseStatus =
  | "filed"
  | "awaiting_reply"
  | "overdue"
  | "replied"
  | "appeal_pending"
  | "appeal_overdue";

/* ------------------------------------------------------------------
   ONE status vocabulary, for every screen.

   This used to be six: STATUS_COPY here, cardStatus() in dashboard.ts,
   the FILTERS list, a private STATUS_LABELS map inside my-rtis, the six
   stages in stages.ts, and the dashboard hero's own wording. The same
   request read "Awaiting response" on one page and "Under Process" on
   the next, which is exactly how a citizen learns not to trust a status.

   Five stages, because that is how many distinct things a citizen can
   actually do something about. An appeal is not a sixth stage — it is a
   flag on a case that is still running, so it renders as a separate tag.
------------------------------------------------------------------- */

export type CaseStage =
  | "filed"
  | "with_department"
  | "needs_you"
  | "answered"
  | "closed";

export const CASE_STAGES: CaseStage[] = [
  "filed",
  "with_department",
  "needs_you",
  "answered",
  "closed",
];

/** What the citizen reads. The official term always rides underneath. */
export const STAGE_COPY: Record<CaseStage, { plain: string; tone: Tone }> = {
  filed: { plain: "Filed", tone: "neutral" },
  with_department: { plain: "With the department", tone: "info" },
  needs_you: { plain: "Action needed", tone: "warn" },
  answered: { plain: "Answered", tone: "good" },
  // Not "neutral". A brand-new request and a finished one were the same
  // grey pill, on every screen, which made a live case look done.
  closed: { plain: "Closed", tone: "muted" },
};

export interface StatusBadge {
  stage: CaseStage;
  /** What the citizen calls it. */
  plain: string;
  /** What the department calls it — shown small, underneath, never instead. */
  official: string;
  tone: Tone;
  /** An appeal is live on this case. Rendered as a tag beside the stage. */
  inAppeal: boolean;
}

/**
 * Display stage for a bare machine status — used where there is no full
 * CaseView to reason about, such as one office's share of a split request.
 */
export function badgeForStatus(status: CaseStatus): StatusBadge {
  switch (status) {
    case "filed":
      return { ...STAGE_COPY.filed, stage: "filed", official: "REGISTERED", inAppeal: false };
    case "overdue":
      return {
        ...STAGE_COPY.needs_you,
        stage: "needs_you",
        official: "DEEMED REFUSAL — S.7(2)",
        inAppeal: false,
      };
    case "replied":
      return {
        ...STAGE_COPY.answered,
        stage: "answered",
        official: "DISPOSED OF",
        inAppeal: false,
      };
    case "appeal_pending":
      return {
        ...STAGE_COPY.with_department,
        stage: "with_department",
        official: "FIRST APPEAL — PENDING",
        inAppeal: true,
      };
    case "appeal_overdue":
      return {
        ...STAGE_COPY.needs_you,
        stage: "needs_you",
        official: "FIRST APPEAL — NO DECISION",
        inAppeal: true,
      };
    default:
      return {
        ...STAGE_COPY.with_department,
        stage: "with_department",
        official: "PENDING WITH CPIO",
        inAppeal: false,
      };
  }
}

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

/**
 * How the citizen intends to answer a hearing notice. The Act gives all
 * three equal standing — s.19(1) does not require anyone to travel to a
 * government office to be heard.
 */
export type HearingChoice = "attend" | "representative" | "written";

export const HEARING_CHOICES: Array<{
  value: HearingChoice;
  label: string;
  detail: string;
}> = [
  {
    value: "attend",
    label: "Attend in person",
    detail:
      "Appear before the Appellate Authority on the date fixed. A copy of the application and the appeal should be carried.",
  },
  {
    value: "representative",
    label: "Send a representative",
    detail:
      "A relative, friend, or any authorised person may appear on your behalf. No lawyer is required, and no formal power of attorney is needed.",
  },
  {
    value: "written",
    label: "Decide on the written submission alone",
    detail:
      "No attendance is required. The Appellate Authority will decide based on the papers already filed. This option does not weaken the appeal.",
  },
];

export interface CaseNotice {
  day: number;
  kind: NoticeKind;
  plain: string;
  official?: string;
  /** Day the hearing sits on, for hearing_scheduled. */
  hearingDay?: number;
  /* A date is not a notice. A citizen cannot attend a hearing whose
     time, place and manner they were never told. */
  hearingTime?: string;
  hearingMode?: "in_person" | "video" | "hybrid";
  hearingVenue?: string;
  /** Joining link, where the hearing sits by video. */
  hearingLink?: string;
  /** The officer before whom it sits. */
  hearingBefore?: string;
}

/* ------------------------------------------------------------------
   Who is answerable, and where to reach them.

   Section 7(8)(iii) requires an applicant who is refused to be told the
   particulars of the Appellate Authority — name, designation, address.
   In practice a citizen needs the same of the CPIO from the moment the
   request is registered, because that is the officer the clock and the
   penalty run against. A bare name is not a particular.
------------------------------------------------------------------- */

export interface OfficerContact {
  name: string;
  /** The post, not the person — posts outlive the people holding them. */
  designation: string;
  address: string;
  email?: string;
  phone?: string;
  web?: string;
}

export interface Authority {
  ministry: string;
  office: string;
  /** The officer answerable for the reply — s.5(1). */
  cpio: OfficerContact;
  /**
   * The senior officer who hears a First Appeal — s.19(1). The Act
   * requires this to be disclosed to the applicant; the old portal
   * disclosed it nowhere, which is why most appeals are addressed to
   * the wrong desk.
   */
  appellateAuthority: OfficerContact;
}

/**
 * The Commission a Second Appeal goes to — s.19(3). It sits outside the
 * department entirely, which is the whole point of it.
 */
export const INFORMATION_COMMISSION: OfficerContact = {
  name: "Central Information Commission",
  designation: "Registrar, Second Appeals",
  address: "Baba Gangnath Marg, Munirka, New Delhi 110067",
  web: "cic.gov.in",
};

/**
 * The applicant, as the office holds them.
 *
 * Shown back to the citizen because a wrong address on the record is the
 * commonest reason a reply never arrives, and the citizen is the only
 * person who can notice it.
 */
export interface Applicant {
  name: string;
  address: string;
  email: string;
  mobile?: string;
  /** s.6(1) — the right belongs to citizens of India. */
  isCitizen: boolean;
  isBpl: boolean;
}

/**
 * The fee, as a record rather than a sentence. An acknowledgement has to
 * be able to name the amount, the mode, the receipt and the date, and a
 * waiver has to name the basis it was granted on.
 */
export interface FeeRecord {
  amountInr: number;
  waived: boolean;
  /** e.g. "BPL certificate no. TN/BPL/2019/44871". s.7(5) proviso. */
  waiverBasis?: string;
  mode?: string;
  receiptNumber?: string;
  /** ISO date the fee was received. */
  paidOn?: string;
}

export function feeLabelOf(fee: FeeRecord): string {
  if (fee.waived) return "Nil — fee waived";
  return `₹${fee.amountInr} paid${fee.mode ? ` by ${fee.mode}` : ""}`;
}

/**
 * Additional fee for the cost of supplying the information — s.7(3).
 *
 * It matters to the clock, not just to the wallet: s.7(3)(a) excludes
 * the period between the demand and the payment from the 30 days. A
 * portal that shows a deadline without accounting for that shows the
 * wrong date.
 */
export interface AdditionalFee {
  /** Day the demand was intimated. */
  day: number;
  amountInr: number;
  /** How it was worked out — s.7(3) requires the calculation to be given. */
  calculation: string;
  /** Day the citizen paid. Undefined while the clock is still stopped. */
  paidOnDay?: number;
}

/* ------------------------------------------------------------------
   How long they have.

   The Act has more than one clock, and the portal used to show a hard
   30 days for every request — which is wrong in both directions. A
   life-and-liberty request gets 48 hours; an application handed to an
   Assistant PIO gets five days more; a request touching a third party
   gets forty.
------------------------------------------------------------------- */

export type ResponseTrack =
  | "standard"
  | "life_liberty"
  | "via_apio"
  | "third_party";

export interface ResponseTrackSpec {
  days: number;
  /** How the limit reads to a citizen. */
  label: string;
  /** The provision that sets it, and why it applies here. */
  basis: string;
}

export const RESPONSE_TRACKS: Record<ResponseTrack, ResponseTrackSpec> = {
  standard: {
    days: REPLY_DEADLINE_DAYS,
    label: "30 days",
    basis: "Section 7(1) — the ordinary period for a reply.",
  },
  life_liberty: {
    days: 2,
    label: "48 hours",
    basis:
      "Proviso to section 7(1) — the information sought concerns the life or liberty of a person.",
  },
  via_apio: {
    days: 35,
    label: "35 days",
    basis:
      "Proviso to section 5(2) — the application was given to an Assistant Public Information Officer, which adds five days.",
  },
  third_party: {
    days: 40,
    label: "40 days",
    basis:
      "Section 11(3) — information relating to a third party is involved, and the third party must be given notice and heard first.",
  },
};

/* ------------------------------------------------------------------
   Exemptions, with the words of the statute.

   A refusal that cites "8(1)(g)" and stops has told the citizen nothing.
   The clause is only meaningful beside the thing it actually protects,
   which is what lets someone judge whether it fits their request.
------------------------------------------------------------------- */

export interface Exemption {
  clause: string;
  /** Short name for the interest protected. */
  heading: string;
  /** The provision, close to the words of the Act. */
  text: string;
}

export const EXEMPTIONS: Record<string, Exemption> = {
  "8(1)(a)": {
    clause: "Section 8(1)(a)",
    heading: "Sovereignty, security, strategic or foreign relations",
    text: "Information whose disclosure would prejudicially affect the sovereignty and integrity of India, the security, strategic, scientific or economic interests of the State, relations with a foreign State, or lead to incitement of an offence.",
  },
  "8(1)(b)": {
    clause: "Section 8(1)(b)",
    heading: "Expressly forbidden by a court",
    text: "Information which has been expressly forbidden to be published by any court of law or tribunal, or the disclosure of which may constitute contempt of court.",
  },
  "8(1)(c)": {
    clause: "Section 8(1)(c)",
    heading: "Breach of privilege of Parliament or a Legislature",
    text: "Information whose disclosure would cause a breach of privilege of Parliament or the State Legislature.",
  },
  "8(1)(d)": {
    clause: "Section 8(1)(d)",
    heading: "Commercial confidence, trade secrets, intellectual property",
    text: "Information including commercial confidence, trade secrets or intellectual property, the disclosure of which would harm the competitive position of a third party — unless the competent authority is satisfied that the larger public interest warrants disclosure.",
  },
  "8(1)(e)": {
    clause: "Section 8(1)(e)",
    heading: "Held in a fiduciary relationship",
    text: "Information available to a person in a fiduciary relationship — unless the competent authority is satisfied that the larger public interest warrants disclosure.",
  },
  "8(1)(f)": {
    clause: "Section 8(1)(f)",
    heading: "Received in confidence from a foreign government",
    text: "Information received in confidence from a foreign government.",
  },
  "8(1)(g)": {
    clause: "Section 8(1)(g)",
    heading: "Safety of a person, or a source of information",
    text: "Information whose disclosure would endanger the life or physical safety of any person, or identify the source of information or assistance given in confidence for law enforcement or security purposes.",
  },
  "8(1)(h)": {
    clause: "Section 8(1)(h)",
    heading: "Would impede an investigation or prosecution",
    text: "Information which would impede the process of investigation or apprehension or prosecution of offenders.",
  },
  "8(1)(i)": {
    clause: "Section 8(1)(i)",
    heading: "Cabinet papers, before a decision is taken",
    text: "Cabinet papers including records of deliberations of the Council of Ministers, Secretaries and other officers — provided that the decisions, and the material on which they were taken, are made public after the decision has been taken and the matter is complete.",
  },
  "8(1)(j)": {
    clause: "Section 8(1)(j)",
    heading: "Personal information, with no public interest in disclosure",
    text: "Personal information with no relationship to any public activity or interest, or which would cause an unwarranted invasion of privacy — unless the larger public interest justifies disclosure. Information that cannot be denied to Parliament or a State Legislature cannot be denied to any person.",
  },
  "9": {
    clause: "Section 9",
    heading: "Would infringe someone else's copyright",
    text: "A request may be rejected where access would involve an infringement of copyright subsisting in a person other than the State.",
  },
  "11": {
    clause: "Section 11",
    heading: "Third-party information",
    text: "Where information relates to or was supplied by a third party and treated as confidential, the third party must be given notice and an opportunity to be heard before a decision on disclosure is taken.",
  },
};

/** What the CPIO actually decided. Section 7(8) makes each part mandatory. */
export type DecisionOutcome = "provided" | "partial" | "rejected";

export interface CpioDecision {
  outcome: DecisionOutcome;
  /** Clauses relied on — keys into EXEMPTIONS. s.7(8)(i). */
  exemptions?: string[];
  /** The reasons recorded for the refusal. s.7(8)(i). */
  reasons?: string;
  /** What was withheld, in plain words, where only part was refused. */
  withheld?: string;
  /**
   * Whether the officer recorded that the public interest in disclosure
   * was weighed against the harm — s.8(2). Its absence is itself a
   * ground of appeal, so it is shown either way.
   */
  publicInterestConsidered?: boolean;
}

/** The form the information was asked for in — s.7(9). */
export type AccessFormat = "electronic" | "printed" | "inspection";

export const ACCESS_FORMAT_COPY: Record<AccessFormat, string> = {
  electronic: "Electronic copy (email / download)",
  printed: "Printed copy by post",
  inspection: "Inspection of the records in person",
};

export interface RtiCase {
  id: string;
  registrationNumber: string;
  plainTitle: string;
  /** One-line subject, the way a citizen would name it in conversation. */
  subject: string;
  question: string;
  authority: Authority;
  fee: FeeRecord;
  /** Who filed it, as the office holds them. */
  applicant?: Applicant;
  /** Which of the Act's clocks this request runs on. Default: standard. */
  track?: ResponseTrack;
  /** The form the information was asked for in — s.7(9). */
  format?: AccessFormat;
  /** A demand for the cost of supply, which stops the clock — s.7(3). */
  additionalFee?: AdditionalFee;
  /** ISO date the request was submitted. Day offsets render against this. */
  submittedOn: string;
  notices?: CaseNotice[];
  /** Authored events that are part of this case's story. */
  events: CaseEvent[];
  /** Day the CPIO replied. Undefined means they never do. */
  replyDay?: number;
  reply?: string;
  /**
   * The reply arrived but withheld what was asked — an exemption claimed,
   * a question left unanswered, information that does not match the
   * question. This is the *other* ground for a First Appeal, and it is a
   * different situation from silence: the clock for appealing runs from
   * the day the reply landed, not from the 30-day expiry.
   */
  replyIsRefusal?: boolean;
  /**
   * What the officer decided, in the terms s.7(8) requires: the outcome,
   * the clauses relied on, the reasons, and whether the public interest
   * was weighed. The free text of `reply` is the covering letter; this is
   * the decision underneath it.
   */
  decision?: CpioDecision;
  /** Why the reply falls short, in the citizen's own terms. */
  refusalGrounds?: string;
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
    plain: "No response was received within the time limit",
  },
  {
    official: "Refused access to Information Requested",
    plain: "Access to the information requested was refused",
  },
  {
    official: "Provided Incomplete,Misleading or False Information",
    plain: "The information provided was incomplete or misleading",
  },
  {
    official: "Unreasonable amount of Fee required to Pay",
    plain: "An unreasonable fee was demanded",
  },
  { official: "Any Other ground", plain: "Another reason" },
];
