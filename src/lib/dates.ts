/* ------------------------------------------------------------------
   Real calendar dates.

   The demo runs on a day counter so the time machine can move a case
   through its life. Citizens do not think in day counters — they think
   in dates. Every case carries the date it was submitted, and every
   day offset is rendered against it.
------------------------------------------------------------------- */

export function addDays(iso: string, days: number): Date {
  const d = new Date(`${iso}T09:30:00`);
  d.setDate(d.getDate() + days);
  return d;
}

/** "12 Aug 2026" */
export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "12 Aug" — for dense lists where the year is obvious. */
export function formatShort(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * How a date reads relative to the case's current day: "today",
 * "yesterday", "in 4 days", "12 days ago".
 */
export function relativeDay(offsetDays: number): string {
  if (offsetDays === 0) return "today";
  if (offsetDays === 1) return "tomorrow";
  if (offsetDays === -1) return "yesterday";
  if (offsetDays > 0) return `in ${offsetDays} days`;
  return `${Math.abs(offsetDays)} days ago`;
}
