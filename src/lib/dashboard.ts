/* ------------------------------------------------------------------
   Everything the dashboard shows is derived from the cases themselves.

   No screen keeps its own list of "things to do" — if an action, a
   notification and a status badge disagree, the citizen stops trusting
   all three. So they are all computed here, from one pass over the
   cases, and the time machine moves them together.
------------------------------------------------------------------- */

import { AppealState, DerivedCase, deriveCase } from "./derive";
import { addDays } from "./dates";
import { PaymentRecord, PAYMENT_COPY } from "./payment";
import {
  CaseNotice,
  FIRST_APPEAL_FILING_DAYS,
  REPLY_DEADLINE_DAYS,
  RtiCase,
} from "./types";

export type Tone = "good" | "warn" | "danger" | "info" | "neutral";

export interface CaseView {
  c: RtiCase;
  d: DerivedCase;
  day: number;
  appeal: AppealState;
  /** Calendar dates, because nobody thinks in day counters. */
  submittedOn: Date;
  today: Date;
  expectedBy: Date;
  repliedOn?: Date;
  /** First Appeal is ordinarily filed within 30 days of reply or expiry. */
  firstAppealDueDay?: number;
  firstAppealDue?: Date;
  firstAppealDaysLeft?: number;
  firstAppealWindowExpired: boolean;
  /** The citizen has opened the response. */
  responseRead: boolean;
  /** Notices that have landed by the current day. */
  notices: CaseNotice[];
}

export function buildView(
  c: RtiCase,
  day: number,
  appeal: AppealState,
  responseRead: boolean,
): CaseView {
  const d = deriveCase(c, day, appeal);
  const firstAppealStartsOn = d.hasReply
    ? c.replyDay
    : day >= REPLY_DEADLINE_DAYS
      ? REPLY_DEADLINE_DAYS
      : undefined;
  const firstAppealDueDay =
    firstAppealStartsOn === undefined
      ? undefined
      : firstAppealStartsOn + FIRST_APPEAL_FILING_DAYS;

  return {
    c,
    d,
    day,
    appeal,
    submittedOn: addDays(c.submittedOn, 0),
    today: addDays(c.submittedOn, day),
    expectedBy: addDays(c.submittedOn, REPLY_DEADLINE_DAYS),
    repliedOn:
      d.hasReply && c.replyDay !== undefined
        ? addDays(c.submittedOn, c.replyDay)
        : undefined,
    firstAppealDueDay,
    firstAppealDue:
      firstAppealDueDay === undefined
        ? undefined
        : addDays(c.submittedOn, firstAppealDueDay),
    firstAppealDaysLeft:
      firstAppealDueDay === undefined
        ? undefined
        : Math.max(0, firstAppealDueDay - day),
    firstAppealWindowExpired:
      firstAppealDueDay !== undefined && day > firstAppealDueDay,
    responseRead,
    notices: (c.notices ?? []).filter((n) => n.day <= day),
  };
}

/* ---------------- Status shown on the card ---------------- */

export interface CardStatus {
  label: string;
  official: string;
  tone: Tone;
}

export function cardStatus(v: CaseView): CardStatus {
  const { d } = v;
  if (d.canFileSecondAppeal)
    return {
      label: "Appeal ignored too",
      official: "FIRST APPEAL — NO DECISION",
      tone: "danger",
    };
  if (d.appealFiled)
    return { label: "Appeal under review", official: "FIRST APPEAL — PENDING", tone: "warn" };
  if (d.hasReply && !v.responseRead)
    return { label: "Response received", official: "DISPOSED OF", tone: "good" };
  if (d.hasReply)
    return { label: "Completed", official: "DISPOSED OF", tone: "neutral" };
  if (d.isOverdue)
    return { label: "Overdue — they are late", official: "DEEMED REFUSAL — S.7(2)", tone: "danger" };
  return { label: "Awaiting response", official: "PENDING WITH CPIO", tone: "info" };
}

/* ---------------- Overview ---------------- */

export interface Overview {
  total: number;
  active: number;
  responses: number;
  appeals: number;
  actions: number;
}

export function overview(views: CaseView[], actionCount: number): Overview {
  return {
    total: views.length,
    active: views.filter((v) => !v.d.hasReply || v.d.appealFiled).length,
    responses: views.filter((v) => v.d.hasReply).length,
    appeals: views.filter(
      (v) => v.d.appealFiled || v.d.canFileFirstAppeal || v.d.canFileSecondAppeal,
    ).length,
    actions: actionCount,
  };
}

/* ---------------- Actions required ---------------- */

export type ActionKind =
  | "payment"
  | "document"
  | "response"
  | "first_appeal"
  | "second_appeal"
  | "hearing";

export interface ActionItem {
  id: string;
  kind: ActionKind;
  tone: Tone;
  title: string;
  detail: string;
  cta: string;
  href: string;
  /** Which RTI this belongs to, for the small print. */
  ref?: string;
}

export function actionsFor(
  views: CaseView[],
  payments: PaymentRecord[],
): ActionItem[] {
  const out: ActionItem[] = [];

  // Money the citizen has parted with that has not become an RTI yet.
  for (const p of payments) {
    const copy = PAYMENT_COPY[p.state];
    if (!copy.isWorking || p.state === "processing" || p.state === "paid") continue;
    out.push({
      id: `pay-${p.ref}`,
      kind: "payment",
      tone: "danger",
      title: "Payment needs confirmation",
      detail:
        "₹10 left your account but no registration number came back yet. Do not pay again — check where it stands.",
      cta: "Check payment",
      href: `/pay/${p.ref}`,
      ref: p.ref,
    });
  }

  for (const v of views) {
    const { c, d } = v;

    for (const n of v.notices) {
      if (n.kind === "document_requested") {
        out.push({
          id: `doc-${c.id}`,
          kind: "document",
          tone: "warn",
          title: "Supporting document requested",
          detail: n.plain,
          cta: "Upload document",
          href: `/requests/${c.id}`,
          ref: c.registrationNumber,
        });
      }
      if (n.kind === "hearing_scheduled" && n.hearingDay !== undefined) {
        out.push({
          id: `hearing-${c.id}`,
          kind: "hearing",
          tone: "warn",
          title: "Hearing scheduled",
          detail: `Your appeal will be heard on ${addDays(c.submittedOn, n.hearingDay).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. Attending is your choice, not an obligation.`,
          cta: "See details",
          href: `/requests/${c.id}`,
          ref: c.registrationNumber,
        });
      }
    }

    if (d.hasReply && !v.responseRead) {
      out.push({
        id: `resp-${c.id}`,
        kind: "response",
        tone: "good",
        title: "Response received — review it",
        detail: `${c.authority.office} answered your request about ${c.subject.toLowerCase()}.`,
        cta: "Read response",
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    }

    if (d.canFileSecondAppeal) {
      out.push({
        id: `sa-${c.id}`,
        kind: "second_appeal",
        tone: "danger",
        title: "Second Appeal available",
        detail:
          "45 days passed with no decision on your first appeal. You can take this to the Central Information Commission, free of cost.",
        cta: "File Second Appeal",
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    } else if (d.canFileFirstAppeal) {
      const deadline = v.firstAppealDue
        ? v.firstAppealWindowExpired
          ? "The usual 30-day filing period has passed, but a delayed appeal can still be accepted if you explain the delay."
          : `File by ${v.firstAppealDue.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} — ${v.firstAppealDaysLeft} day${v.firstAppealDaysLeft === 1 ? "" : "s"} left.`
        : "";
      out.push({
        id: `fa-${c.id}`,
        kind: "first_appeal",
        tone: "danger",
        title: "First Appeal available",
        detail: `They are ${d.daysLate} days past the legal deadline. In law that silence is already a refusal, and appealing costs nothing. ${deadline}`,
        cta: "File First Appeal",
        href: `/requests/${c.id}#appeal`,
        ref: c.registrationNumber,
      });
    }
  }

  return out;
}

/* ---------------- Notifications ---------------- */

export type NotificationKind =
  | ActionKind
  | "transferred"
  | "deadline"
  | "appeal_deadline"
  | "appeal_filed";

export interface Notification {
  id: string;
  kind: NotificationKind;
  tone: Tone;
  title: string;
  body: string;
  date: Date;
  /** Days before the case's current day — used for ordering. */
  age: number;
  href: string;
  ref?: string;
}

export function notificationsFor(
  views: CaseView[],
  payments: PaymentRecord[],
): Notification[] {
  const out: Notification[] = [];

  for (const p of payments) {
    const copy = PAYMENT_COPY[p.state];
    if (!copy.isWorking) continue;
    out.push({
      id: `n-pay-${p.ref}`,
      kind: "payment",
      tone: "danger",
      title: "Payment not yet matched to an RTI",
      body: `₹${p.amountInr} was debited on reference ${p.ref}. Your registration is still being confirmed — do not pay again.`,
      date: new Date(p.settledAt ?? p.startedAt),
      age: 0,
      href: `/pay/${p.ref}`,
      ref: p.ref,
    });
  }

  for (const v of views) {
    const { c, d, day } = v;
    const at = (dayOffset: number) => addDays(c.submittedOn, dayOffset);

    if (d.hasReply && c.replyDay !== undefined) {
      out.push({
        id: `n-resp-${c.id}`,
        kind: "response",
        tone: "good",
        title: "Response received",
        body: `${c.authority.office} answered your request about ${c.subject.toLowerCase()}.`,
        date: at(c.replyDay),
        age: day - c.replyDay,
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    }

    for (const n of v.notices) {
      const kind: NotificationKind =
        n.kind === "document_requested"
          ? "document"
          : n.kind === "hearing_scheduled"
            ? "hearing"
            : "transferred";
      out.push({
        id: `n-${n.kind}-${c.id}`,
        kind,
        tone: n.kind === "transferred" ? "info" : "warn",
        title:
          n.kind === "transferred"
            ? "RTI transferred to another office"
            : n.kind === "document_requested"
              ? "Additional document requested"
              : "Hearing scheduled",
        body: n.plain,
        date: at(n.day),
        age: day - n.day,
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    }

    if (d.appealFiled && v.appeal.filedOnDay !== undefined) {
      out.push({
        id: `n-appeal-${c.id}`,
        kind: "appeal_filed",
        tone: "warn",
        title: "First Appeal registered",
        body: `Your appeal against ${c.authority.office} was registered. They have 45 days to decide.`,
        date: at(v.appeal.filedOnDay),
        age: day - v.appeal.filedOnDay,
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    }

    if (d.canFileFirstAppeal) {
      out.push({
        id: `n-fa-${c.id}`,
        kind: "first_appeal",
        tone: "danger",
        title: "Appeal now available",
        body: `The 30-day deadline passed with no reply about ${c.subject.toLowerCase()}. You can appeal free of cost.`,
        date: at(REPLY_DEADLINE_DAYS),
        age: day - REPLY_DEADLINE_DAYS,
        href: `/requests/${c.id}#appeal`,
        ref: c.registrationNumber,
      });
    }

    if (
      !d.appealFiled &&
      v.firstAppealDueDay !== undefined &&
      v.firstAppealDue &&
      v.firstAppealDaysLeft !== undefined
    ) {
      if (v.firstAppealWindowExpired) {
        out.push({
          id: `n-appeal-expired-${c.id}`,
          kind: "appeal_deadline",
          tone: "danger",
          title: "Appeal filing date passed",
          body:
            "The usual 30-day period has passed. You may still file a delayed First Appeal, but include the reason for the delay.",
          date: at(v.firstAppealDueDay),
          age: day - v.firstAppealDueDay,
          href: `/requests/${c.id}#appeal`,
          ref: c.registrationNumber,
        });
      } else if (v.firstAppealDaysLeft <= 7) {
        out.push({
          id: `n-appeal-due-${c.id}`,
          kind: "appeal_deadline",
          tone: "warn",
          title: "Appeal deadline approaching",
          body: `File a First Appeal by ${v.firstAppealDue.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} — ${v.firstAppealDaysLeft} day${v.firstAppealDaysLeft === 1 ? "" : "s"} left.`,
          date: at(day),
          age: 0,
          href: `/requests/${c.id}#appeal`,
          ref: c.registrationNumber,
        });
      }
    }

    // A warning while it is still useful — not after the deadline has gone.
    const daysLeft = REPLY_DEADLINE_DAYS - day;
    if (!d.hasReply && daysLeft > 0 && daysLeft <= 7) {
      out.push({
        id: `n-dl-${c.id}`,
        kind: "deadline",
        tone: "warn",
        title: "Deadline approaching",
        body: `${c.authority.office} has ${daysLeft} day${daysLeft === 1 ? "" : "s"} left to answer you.`,
        date: at(day),
        age: 0,
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    }
  }

  return out.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/* ---------------- Search and filters ---------------- */

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "action", label: "Action required" },
  { id: "active", label: "Active" },
  { id: "response", label: "Response received" },
  { id: "appeal", label: "Appeal" },
  { id: "completed", label: "Completed" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

export function matchesFilter(
  v: CaseView,
  filter: FilterId,
  actionCaseIds: Set<string>,
): boolean {
  const { d } = v;
  switch (filter) {
    case "action":
      return actionCaseIds.has(v.c.id);
    case "active":
      return !d.hasReply || d.appealFiled;
    case "response":
      return d.hasReply;
    case "appeal":
      return d.appealFiled || d.canFileFirstAppeal || d.canFileSecondAppeal;
    case "completed":
      return d.hasReply && v.responseRead && !d.appealFiled && !d.canFileSecondAppeal;
    default:
      return true;
  }
}

export function matchesQuery(v: CaseView, q: string): boolean {
  if (!q.trim()) return true;
  const hay = [
    v.c.plainTitle,
    v.c.subject,
    v.c.registrationNumber,
    v.c.authority.office,
    v.c.authority.ministry,
    v.c.question,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.trim().toLowerCase());
}
