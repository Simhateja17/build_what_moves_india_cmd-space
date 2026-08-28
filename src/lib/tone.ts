/* ------------------------------------------------------------------
   Tone → classes. The one place a status colour is decided.

   Colour alone was never enough vocabulary. Five tones had to carry
   seven payment states, five case stages and a cross-cutting appeal
   flag, so distinct things collided: "Filed" and "Closed" were the same
   grey, "Needs you" and "In appeal" the same orange — sitting side by
   side in the same row — and "Paid" and "Registered" the same green.

   So there are two axes now, and both mean something:

     hue      — how urgent it is (neutral → info → good → warn → danger)
     variant  — what kind of thing it is
                  tint    a live state, the ordinary case
                  solid   finished, or a flag pinned to a row
                  hollow  over, and no longer asking anything of you

   Two states may share a hue only if they differ in variant.
------------------------------------------------------------------- */

import { Tone } from "./types";

export type ToneVariant = "tint" | "solid" | "hollow";

/** A live state: soft fill, readable text, a ring to hold its edge. */
const TINT: Record<Tone, string> = {
  neutral: "bg-slate-100 text-ink-2 ring-slate-200",
  muted: "bg-transparent text-muted ring-line",
  info: "bg-navy-50 text-navy-800 ring-navy-100",
  good: "bg-govgreen-50 text-govgreen-700 ring-green-200",
  warn: "bg-saffron-50 text-saffron-600 ring-orange-200",
  danger: "bg-govred-50 text-govred-700 ring-red-200",
};

/**
 * Reserved for two things: a state nothing will change on its own, and a
 * flag pinned beside a status rather than replacing it. Solid reads as a
 * label, which is why it can never be confused with the pill next to it.
 */
const SOLID: Record<Tone, string> = {
  neutral: "bg-ink-2 text-white ring-ink-2",
  muted: "bg-muted text-white ring-muted",
  info: "bg-navy-800 text-white ring-navy-800",
  good: "bg-govgreen-600 text-white ring-govgreen-600",
  warn: "bg-saffron-500 text-white ring-saffron-500",
  danger: "bg-govred-600 text-white ring-govred-600",
};

/** Spent. Present on the page, but visibly not asking for anything. */
const HOLLOW: Record<Tone, string> = {
  neutral: "bg-transparent text-ink-2 ring-slate-300",
  muted: "bg-transparent text-muted ring-line",
  info: "bg-transparent text-navy-800 ring-navy-600/40",
  good: "bg-transparent text-govgreen-700 ring-govgreen-600/40",
  warn: "bg-transparent text-saffron-600 ring-saffron-400/60",
  danger: "bg-transparent text-govred-700 ring-govred-600/40",
};

const VARIANTS = { tint: TINT, solid: SOLID, hollow: HOLLOW };

/** Background, text and ring colour for a chip. Ring width is the caller's. */
export function toneChip(tone: Tone, variant: ToneVariant = "tint"): string {
  return VARIANTS[variant][tone];
}

/** Text-only tone, for labels that carry no fill of their own. */
export const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-ink-2",
  muted: "text-muted",
  info: "text-navy-800",
  good: "text-govgreen-700",
  warn: "text-saffron-600",
  danger: "text-govred-700",
};

/** A solid dot or rail in the tone's colour. */
export const TONE_FILL: Record<Tone, string> = {
  neutral: "bg-slate-300",
  muted: "bg-line",
  info: "bg-navy-600",
  good: "bg-govgreen-600",
  warn: "bg-saffron-500",
  danger: "bg-govred-600",
};
