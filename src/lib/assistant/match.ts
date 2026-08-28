import { AUTHORITIES } from "./authorities";
import { ROUTES, TOPICS, TOPIC_BY_ID } from "./topics";
import { AuthorityMatch, BodyType, ProblemTopic } from "./types";

/* ------------------------------------------------------------------
   Turning what a citizen typed into a topic, and a topic into an
   office. Both are deliberately dumb and local: a scoring pass over
   alias words, then a first-match-wins routing table.

   The important behaviour is what happens when scoring fails. It
   shows the full topic list and says so, rather than guessing —
   a confident wrong guess costs a citizen ten rupees and thirty days.
------------------------------------------------------------------- */

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be",
  "been", "for", "of", "to", "in", "on", "at", "my", "our", "we", "i",
  "it", "this", "that", "there", "has", "have", "had", "not", "no", "so",
  "from", "with", "want", "know", "please", "sir", "madam", "since",
  "months", "month", "years", "year", "days", "day", "how", "much", "many",
  "why", "what", "when", "where", "who", "which", "been", "very", "still",
]);

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export interface TopicMatch {
  topic: ProblemTopic;
  score: number;
}

/**
 * Scores every topic against the free text. A two-word alias counts
 * double, because "street light" landing on `street-light` should beat
 * the single word "street" landing on `road-damage`.
 */
export function scoreTopics(text: string): TopicMatch[] {
  const words = tokenise(text);
  if (words.length === 0) return [];
  const lower = text.toLowerCase();

  return TOPICS.map((topic) => {
    let score = 0;
    for (const alias of topic.aliases) {
      if (alias.includes(" ")) {
        if (lower.includes(alias)) score += 2;
      } else if (words.includes(alias)) {
        score += 1;
      }
    }
    return { topic, score };
  })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * The confident match, or nothing. One weak hit is not enough to put a
 * department in front of somebody — below the threshold the caller
 * falls back to showing the whole list.
 */
export function matchTopic(text: string): ProblemTopic | undefined {
  const [best, second] = scoreTopics(text);
  if (!best) return undefined;
  if (best.score < 2 && !second) return best.topic;
  if (best.score < 2) return undefined;
  if (second && second.score === best.score) return undefined;
  return best.topic;
}

/** Top few topics to offer as tiles, padded out with the common ones. */
export function suggestedTopics(text: string, count = 4): ProblemTopic[] {
  const scored = scoreTopics(text).map((m) => m.topic);
  const fallback = [
    "road-damage",
    "sewage",
    "water-supply",
    "govt-school",
    "govt-hospital",
    "other-records",
  ].map((id) => TOPIC_BY_ID[id]);

  const out: ProblemTopic[] = [];
  for (const t of [...scored, ...fallback]) {
    if (t && !out.includes(t)) out.push(t);
    if (out.length === count) break;
  }
  return out;
}

export interface AuthorityResult {
  primary: AuthorityMatch;
  alternatives: AuthorityMatch[];
  /** True when the deciding question was skipped and a default was used. */
  assumed: boolean;
  /** The option label that was assumed, for the "We assumed…" chip. */
  assumedLabel?: string;
}

export function resolveAuthority(
  topicId: string | undefined,
  answers: Record<string, string>,
  bodyType: BodyType,
  overrideId?: string,
): AuthorityResult | undefined {
  if (!topicId) return undefined;
  const topic = TOPIC_BY_ID[topicId];
  const rules = ROUTES[topicId];
  if (!topic || !rules) return undefined;

  const clarifier = topic.authorityClarifier;
  const answer = clarifier ? answers[clarifier.id] : undefined;

  const hit =
    rules.find(
      (r) =>
        (r.answer === undefined || r.answer === answer) &&
        (r.bodyType === undefined || r.bodyType === bodyType),
    ) ?? rules[rules.length - 1];

  const primaryId = overrideId ?? hit.authorityId;
  const primary = AUTHORITIES[primaryId];
  if (!primary) return undefined;

  const alternatives: AuthorityMatch[] = [];
  for (const rule of rules) {
    const a = AUTHORITIES[rule.authorityId];
    if (a && a.id !== primary.id && !alternatives.includes(a)) {
      alternatives.push(a);
    }
  }

  // Only claim an assumption when the question existed and went
  // unanswered — an override is the citizen's own choice, not ours.
  const assumed = Boolean(clarifier) && !answer && !overrideId;
  const assumedLabel = assumed
    ? clarifier?.options?.find((o) => o.value === hit.answer)?.label ??
      (bodyType === "rural" ? "a village area" : "a city area")
    : undefined;

  return { primary, alternatives: alternatives.slice(0, 2), assumed, assumedLabel };
}

/**
 * A period mentioned in passing — "damaged for 6 months" — is a real
 * answer the citizen already gave us. Picking it up here is the
 * difference between a question that feels necessary and one that
 * feels like the form was not listening.
 */
export function guessPeriod(text: string): string | undefined {
  const lower = text.toLowerCase();
  const m = lower.match(/(\d+)\s*(month|months|year|years)/);
  if (m) {
    const n = Number(m[1]);
    const months = m[2].startsWith("year") ? n * 12 : n;
    if (months <= 6) return "6m";
    if (months <= 12) return "1y";
    return "3y";
  }
  if (/last year|past year|one year/.test(lower)) return "1y";
  return undefined;
}
