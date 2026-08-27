/* ------------------------------------------------------------------
   Making a draft survive the portal's text box.

   The RTI Online manual states the rule verbatim:

     "Only alphabets A-Z a-z number 0-9 and special characters
      , . - _ ( ) / @ : & \ % are allowed in Text for RTI Request
      application."   [manual p. 8]

   An ordinary well-written draft breaks this constantly — a rupee
   sign, a curly quote pasted from a phone keyboard, an em dash. The
   portal rejects the submission and the citizen has no idea why. So
   we check before they get there, name the exact characters we found,
   and offer the fix rather than silently rewriting their words.

   The same page's screenshot also shows "?" in the allowed list while
   the prose omits it, so the manual does not settle it. We treat it
   as allowed — flagging every question mark would drown the real hits.
------------------------------------------------------------------- */

export const PORTAL_CHAR_LIMIT = 3000;

/** Everything the manual allows, plus whitespace and the ambiguous "?". */
const ALLOWED = /[A-Za-z0-9,.\-_()/@:&\\%?\s]/;

/** The substitutions that keep the citizen's meaning intact. */
const FIXES: { from: RegExp; to: string; name: string }[] = [
  { from: /₹/g, to: "Rs.", name: "₹" },
  // The allowed set contains no quote mark and no apostrophe at all, so
  // these cannot be swapped for a straight equivalent — they come out.
  // Dropping them leaves the words intact; a space would split them.
  { from: /[‘’']/g, to: "", name: "apostrophe" },
  { from: /[“”"]/g, to: "", name: "quote mark" },
  { from: /[–—]/g, to: "-", name: "dash" },
  { from: /…/g, to: "...", name: "ellipsis" },
  { from: / /g, to: " ", name: "non-breaking space" },
  { from: /[¹²³]/g, to: "", name: "superscript" },
];

export interface CharIssue {
  char: string;
  count: number;
  fixable: boolean;
}

export function findCharIssues(text: string): CharIssue[] {
  const counts = new Map<string, number>();
  for (const ch of text) {
    if (!ALLOWED.test(ch)) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  return [...counts.entries()].map(([char, count]) => ({
    char,
    count,
    fixable: FIXES.some((f) => new RegExp(f.from.source).test(char)),
  }));
}

export function fixForPortal(text: string): string {
  let out = text;
  for (const f of FIXES) out = out.replace(f.from, f.to);
  // Anything still outside the allowed set would be silently rejected
  // by the portal, so drop it rather than let the submission fail.
  return [...out].filter((ch) => ALLOWED.test(ch)).join("");
}

/** "₹ and two curly quotes" — the phrase that goes into the warning. */
export function describeIssues(issues: CharIssue[]): string {
  const names = issues.map((i) =>
    i.count > 1 ? `${i.count} × ${i.char}` : i.char,
  );
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
