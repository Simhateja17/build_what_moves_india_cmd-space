/* ------------------------------------------------------------------
   The RTI Assistant's vocabulary.

   The whole feature is static data plus a reducer — no network call,
   no model call at runtime. That keeps it deterministic, demoable
   offline, and auditable: every line that ends up in a citizen's
   request can be traced back to a row in topics.ts.
------------------------------------------------------------------- */

/** Which government actually holds the record. Drives the warning gate. */
export type GovLevel = "central" | "state" | "local";

export type BodyType = "urban" | "rural";

export const LEVEL_COPY: Record<
  GovLevel,
  { label: string; tone: "navy" | "amber" | "green" }
> = {
  central: { label: "Central Government", tone: "navy" },
  state: { label: "State Government", tone: "amber" },
  local: { label: "Local body", tone: "green" },
};

export interface ClarifierOption {
  value: string;
  label: string;
  /** Optional one-liner shown under the option. */
  note?: string;
}

/**
 * A question worth asking. The rule the whole flow obeys: ask it only
 * if the answer changes the authority, or fills a token inside an ask
 * the citizen has actually ticked. Everything else is noise.
 */
export interface Clarifier {
  id: string;
  question: string;
  help?: string;
  kind: "choice" | "text" | "period";
  options?: ClarifierOption[];
  placeholder?: string;
  skipLabel: string;
  /** The amber blank left in the draft when this is skipped. */
  blankLabel: string;
}

export interface AskTemplate {
  id: string;
  /** May carry {place}, {period}, {ref} and {problem} tokens. */
  text: string;
  /** Why a citizen would want this. Visible text, never a tooltip. */
  why: string;
  defaultOn: boolean;
}

export interface ProblemTopic {
  id: string;
  label: string;
  icon: string;
  /** Words scored against whatever the citizen typed. */
  aliases: string[];
  /** Goes into the draft's subject line: "repair of {subject}". */
  subject: string;
  /** Asked on the location step, because it decides the authority. */
  authorityClarifier?: Clarifier;
  /** Asked on the asks step. These only fill tokens in the draft. */
  draftClarifiers: Clarifier[];
  asks: AskTemplate[];
  exampleId?: string;
}

export interface AuthorityMatch {
  id: string;
  /** Short enough for a headline: "Municipal Corporation". */
  shortName: string;
  /** Display name. {city} and {state} are filled from the location. */
  name: string;
  wing: string;
  pioTitle: string;
  level: GovLevel;
  /**
   * Three lines, and the third is the one that teaches: it names the
   * office a citizen would plausibly have picked, and says why it is
   * the wrong one.
   */
  why: { work: string; records: string; notThem: string };
  /** Set on central authorities only — these feed the existing form. */
  ministry?: string;
  office?: string;
  /** Shown when this appears as an alternative: "pick me if…". */
  condition?: string;
}

/** One rule in a topic's routing table. Order matters; first match wins. */
export interface RouteRule {
  /** Matches the authority clarifier's answer. Omit for "any". */
  answer?: string;
  /** Matches the urban/rural choice. Omit for "any". */
  bodyType?: BodyType;
  authorityId: string;
}

export type AssistantStep =
  | "problem"
  | "location"
  | "authority"
  | "asks"
  | "draft"
  | "review";

export const STEP_ORDER: AssistantStep[] = [
  "problem",
  "location",
  "authority",
  "asks",
  "draft",
  "review",
];

export const STEP_LABEL: Record<AssistantStep, string> = {
  problem: "Describe the problem",
  location: "Location",
  authority: "Authority",
  asks: "Information sought",
  draft: "Draft",
  review: "Review",
};

export interface AssistantState {
  step: AssistantStep;
  rawProblem: string;
  topicId?: string;
  stateName: string;
  city: string;
  bodyType: BodyType;
  /** Clarifier id → answer. */
  answers: Record<string, string>;
  /** Clarifier ids the citizen explicitly skipped. */
  skipped: string[];
  selectedAskIds: string[];
  customAsks: string[];
  /** Set when the citizen overrides the suggested authority. */
  authorityOverrideId?: string;
  /** Only set once the citizen has edited the text themselves. */
  editedDraft?: string;
  format: DraftFormat;
}

export type DraftFormat = "letter" | "portal";

/**
 * What the assistant hands to the existing file-request form.
 *
 * Every match comes through here now, central or not. `ministry` and
 * `office` carry the two dropdown values for a central match; for a
 * state or local one they carry the authority and its wing verbatim,
 * because those offices are not in the central lists and never will be.
 * `level` is what tells the form which of the two it is holding.
 */
export interface AssistantHandoff {
  ministry: string;
  office: string;
  question: string;
  authorityName: string;
  level: GovLevel;
  /** Who the application is addressed to. State and local matches only. */
  pioTitle?: string;
  stateName?: string;
}

export const HANDOFF_KEY = "rti_saral_assistant_handoff";
export const STATE_KEY = "rti_saral_assistant_state";
