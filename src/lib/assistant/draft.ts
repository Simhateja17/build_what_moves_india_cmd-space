import { fillPlaces } from "./authorities";
import { TOPIC_BY_ID } from "./topics";
import {
  AskTemplate,
  AssistantState,
  AuthorityMatch,
  DraftFormat,
} from "./types";

/* ------------------------------------------------------------------
   Composing the request.

   Two rules the composer never breaks:

   1. Nothing is invented. A question the citizen skipped leaves a
      visible blank they must fill, not a plausible guess. Blanks are
      written as [[label]] and the draft screen refuses to continue
      while any remain.

   2. The transfer sentence is always appended and cannot be removed.
      It is what protects a citizen who guessed the office wrong —
      Section 6(3) makes the wrong office pass the request on rather
      than reject it.
------------------------------------------------------------------- */

export const BLANK_RE = /\[\[([^\]]+)\]\]/g;

export function blank(label: string): string {
  return `[[${label}]]`;
}

/**
 * Distinct blanks, not occurrences. {place} appears in four asks but
 * it is one thing the citizen has to tell us, and "4 blanks left" for
 * a single question reads as a much bigger job than it is.
 */
export function countBlanks(text: string): number {
  const found = text.match(BLANK_RE);
  return found ? new Set(found).size : 0;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const PERIOD_MONTHS: Record<string, number> = { "6m": 6, "1y": 12, "3y": 36 };

/** "01/03/2026 to 27/08/2026", or a blank if the citizen skipped it. */
export function resolvePeriod(answer: string | undefined): string {
  if (!answer) return blank("period");
  const months = PERIOD_MONTHS[answer];
  if (!months) return answer; // a custom range typed by the citizen
  const to = new Date();
  const from = new Date(to);
  from.setMonth(from.getMonth() - months);
  return `${formatDate(from)} to ${formatDate(to)}`;
}

export interface DraftContext {
  place: string;
  period: string;
  ref: string;
}

export function buildContext(state: AssistantState): DraftContext {
  const topic = state.topicId ? TOPIC_BY_ID[state.topicId] : undefined;
  const placeClarifier = topic?.draftClarifiers.find((c) => c.id === "place");
  return {
    place: state.answers.place?.trim() || blank(placeClarifier?.blankLabel ?? "name of the place"),
    period: resolvePeriod(state.answers.period),
    ref: state.answers.ref?.trim() ?? "",
  };
}

export function fillTokens(text: string, ctx: DraftContext): string {
  return text
    .replace(/\{place\}/g, ctx.place)
    .replace(/\{period\}/g, ctx.period)
    .replace(/\{ref\}/g, ctx.ref);
}

/** The asks the citizen ticked, in list order, with tokens filled. */
export function selectedAsks(
  state: AssistantState,
  asks: AskTemplate[],
): string[] {
  const ctx = buildContext(state);
  const chosen = asks
    .filter((a) => state.selectedAskIds.includes(a.id))
    .map((a) => fillTokens(a.text, ctx));
  return [...chosen, ...state.customAsks.filter((c) => c.trim())];
}

const CLOSING =
  "I am ready to pay the prescribed fee for the copies. If any part of this information is held by another public authority, kindly transfer that part under Section 6(3) of the Act within five days.";

export function composeDraft(
  state: AssistantState,
  authority: AuthorityMatch,
  citizen: { name: string; address: string },
  format: DraftFormat,
): string {
  const topic = state.topicId ? TOPIC_BY_ID[state.topicId] : undefined;
  const ctx = buildContext(state);
  const subject = topic ? fillTokens(topic.subject, ctx) : "the matter below";
  const place = { city: state.city, state: state.stateName };

  const points = selectedAsks(state, topic?.asks ?? [])
    .map((text, i) => `${i + 1}. ${text}`)
    .join("\n\n");

  const body = [
    `Under the Right to Information Act, 2005, I request the following information about ${subject}${
      ctx.ref ? `, reference ${ctx.ref}` : ""
    }:`,
    points,
    CLOSING,
  ].join("\n\n");

  if (format === "portal") return body;

  return [
    "To",
    "The Public Information Officer,",
    `${fillPlaces(authority.wing, place)},`,
    fillPlaces(authority.name, place),
    "",
    `Subject: Information about ${subject}`,
    "",
    "Sir/Madam,",
    "",
    body,
    "",
    "Yours faithfully,",
    citizen.name,
    citizen.address,
  ].join("\n");
}
