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
  APPEAL_DECISION_DAYS,
  CaseNotice,
  CaseStage,
  FIRST_APPEAL_FILING_DAYS,
  RtiCase,
  STAGE_COPY,
  StatusBadge,
  Tone,
} from "./types";

export type { Tone };

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
    : day >= d.clock.dueDay
      ? d.clock.dueDay
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
    expectedBy: addDays(c.submittedOn, d.clock.dueDay),
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

/* ---------------- The one status function ---------------- */

/** Days after a reply lands before a read case is treated as finished. */
const SETTLES_AFTER_DAYS = 10;

/**
 * The single place a case's status is decided. Every badge, chip, tab and
 * tile in the app calls this — that is the whole point of it existing.
 *
 * `needsAction` comes from the same action derivation the dashboard cards
 * use, so a case can never show "Needs you" in one place and "With the
 * department" in another. Reading an unread reply is deliberately NOT an
 * action: that is a read receipt, not a stage, and it renders as weight on
 * the row instead.
 */
export function caseStage(v: CaseView, needsAction: boolean): StatusBadge {
  const { d } = v;
  const inAppeal = d.appealFiled || d.canFileSecondAppeal || d.secondAppealFiled;

  const badge = (stage: CaseStage, official: string): StatusBadge => ({
    ...STAGE_COPY[stage],
    stage,
    official,
    inAppeal,
  });

  if (needsAction) {
    if (d.canFileSecondAppeal) return badge("needs_you", "FIRST APPEAL — NO DECISION");
    if (d.canFileFirstAppeal)
      return badge(
        "needs_you",
        d.firstAppealOnRefusal ? "DISPOSED OF — PARTLY DENIED" : "DEEMED REFUSAL — S.7(2)",
      );
    return badge("needs_you", "ACTION REQUIRED");
  }

  // Once it reaches the Commission the case has left the department, so
  // "With the department" would be the wrong place to send a citizen looking.
  if (d.secondAppealFiled)
    return badge("with_department", "SECOND APPEAL — PENDING BEFORE CIC");
  if (d.appealFiled) return badge("with_department", "FIRST APPEAL — PENDING");

  if (d.hasReply) {
    const settled =
      v.responseRead &&
      v.c.replyDay !== undefined &&
      v.day - v.c.replyDay >= SETTLES_AFTER_DAYS;
    return badge(settled ? "closed" : "answered", "DISPOSED OF");
  }

  if (d.isOverdue) return badge("needs_you", "DEEMED REFUSAL — S.7(2)");
  if (v.day === 0) return badge("filed", "REGISTERED");
  return badge("with_department", "PENDING WITH CPIO");
}

/** True when the citizen has a reply they have not opened yet. */
export function hasUnreadReply(v: CaseView): boolean {
  return v.d.hasReply && !v.responseRead;
}

/* ---------------- Rows, and the order they come in ---------------- */

export interface RowClock {
  /** Short enough to sit in a table cell. */
  label: string;
  /** How much of the 30 days is spent, 0–100. Null when the clock is done. */
  pct: number | null;
  tone: Tone;
}

export interface CaseRow {
  view: CaseView;
  badge: StatusBadge;
  unread: boolean;
  lastUpdated: Date;
  clock: RowClock;
}

/**
 * Deadline pressure, per row.
 *
 * The single most useful fact in an RTI is how long the department has
 * left, and it appeared nowhere in either list — a citizen had to open
 * each request to find out which one was about to lapse.
 */
export function rowClock(v: CaseView): RowClock {
  const { d } = v;
  if (d.appealFiled) return { label: "With appellate authority", pct: null, tone: "warn" };
  if (d.hasReply) return { label: "Answered", pct: null, tone: "good" };
  if (d.isOverdue)
    return {
      label: `${d.daysLate} day${d.daysLate === 1 ? "" : "s"} overdue`,
      pct: 100,
      tone: "danger",
    };

  if (d.clock.stopped) {
    return { label: "Clock stopped — fee due", pct: null, tone: "warn" };
  }

  const total = d.clock.dueDay;
  const elapsed = total - d.daysLeft;
  return {
    label: `${d.daysLeft} day${d.daysLeft === 1 ? "" : "s"} left`,
    pct: Math.round((elapsed / total) * 100),
    // The last week is when a citizen still has time to chase it.
    tone: d.daysLeft <= 7 ? "warn" : "info",
  };
}

/** The most recent thing that actually happened on a case. */
function lastUpdatedOf(v: CaseView): Date {
  const latestDay = v.d.events.reduce((latest, e) => Math.max(latest, e.day), 0);
  return addDays(v.c.submittedOn, latestDay);
}

/**
 * Build the rows every list renders, in the order they should appear.
 *
 * Sorting by submission date — the old default — buried the one case that
 * needed the citizen at the bottom of the table, because it was the oldest.
 * A request that needs you outranks a request that is merely recent.
 */
export function caseRows(
  views: CaseView[],
  actionCaseIds: Set<string>,
): CaseRow[] {
  const rank = (r: CaseRow) =>
    r.badge.stage === "needs_you" ? 0 : r.unread ? 1 : r.badge.stage === "closed" ? 3 : 2;

  return views
    .map((view) => {
      const needsAction = actionCaseIds.has(view.c.id);
      return {
        view,
        badge: caseStage(view, needsAction),
        unread: hasUnreadReply(view),
        lastUpdated: lastUpdatedOf(view),
        clock: rowClock(view),
      };
    })
    .sort(
      (a, b) =>
        rank(a) - rank(b) || b.lastUpdated.getTime() - a.lastUpdated.getTime(),
    );
}

/* ---------------- Overview ---------------- */

export interface Overview {
  total: number;
  withDepartment: number;
  answered: number;
  closed: number;
  appeals: number;
  /** Outstanding actions, which is a count of tasks, not of cases. */
  actions: number;
  /** Cases sitting in the "Needs you" stage. */
  needsYou: number;
}

/**
 * Counted off the same stage function the badges use, so the hero numbers
 * and the filter chips can never disagree. They used to: "in progress"
 * counted appeals and overdue cases that the list showed under other tabs.
 */
export function overview(
  views: CaseView[],
  actionCount: number,
  actionCaseIds: Set<string>,
): Overview {
  const stages = views.map((v) => caseStage(v, actionCaseIds.has(v.c.id)));
  const count = (stage: CaseStage) =>
    stages.filter((s) => s.stage === stage).length;

  return {
    total: views.length,
    withDepartment: count("with_department") + count("filed"),
    answered: count("answered"),
    closed: count("closed"),
    appeals: stages.filter((s) => s.inAppeal).length,
    actions: actionCount,
    needsYou: count("needs_you"),
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
  /** Case ids that already have a document sent — their ask is done. */
  documentsSent: ReadonlySet<string> = new Set(),
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
        "₹10 was debited but a registration number has not yet been received. Do not make another payment; check the status of this payment.",
      cta: "Check payment",
      href: `/pay/${p.ref}`,
      ref: p.ref,
    });
  }

  for (const v of views) {
    const { c, d } = v;

    for (const n of v.notices) {
      if (n.kind === "document_requested" && !documentsSent.has(c.id)) {
        out.push({
          id: `doc-${c.id}`,
          kind: "document",
          tone: "warn",
          title: "Supporting document requested",
          detail: n.plain,
          cta: "Upload document",
          href: `/requests/${c.id}#documents`,
          ref: c.registrationNumber,
        });
      }
      if (n.kind === "hearing_scheduled" && n.hearingDay !== undefined) {
        out.push({
          id: `hearing-${c.id}`,
          kind: "hearing",
          tone: "warn",
          title: "Hearing scheduled",
          detail: `A hearing for your appeal has been fixed for ${addDays(c.submittedOn, n.hearingDay).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. You may attend in person, send a representative, or ask that the appeal be decided on your written submission alone.`,
          cta: "See details",
          href: `/requests/${c.id}#hearing`,
          ref: c.registrationNumber,
        });
      }
    }

    if (d.hasReply && !v.responseRead) {
      out.push({
        id: `resp-${c.id}`,
        kind: "response",
        tone: "good",
        title: "Response received",
        detail: `A reply has been received from ${c.authority.office} regarding ${c.subject.toLowerCase()}.`,
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
          "The Appellate Authority had 30 days to decide, and 45 at the very outside. Both have passed with no decision. A Second Appeal may be filed before the Central Information Commission, free of cost.",
        cta: "File Second Appeal",
        href: `/requests/${c.id}/second-appeal`,
        ref: c.registrationNumber,
      });
    } else if (d.canFileFirstAppeal) {
      const deadline = v.firstAppealDue
        ? v.firstAppealWindowExpired
          ? "The usual 30-day filing period has passed. A delayed appeal may still be accepted, provided the delay is explained."
          : `File by ${v.firstAppealDue.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. ${v.firstAppealDaysLeft} day${v.firstAppealDaysLeft === 1 ? "" : "s"} remaining.`
        : "";
      out.push({
        id: `fa-${c.id}`,
        kind: "first_appeal",
        tone: "danger",
        title: d.firstAppealOnRefusal
          ? "Their answer fell short — you can appeal"
          : "First Appeal available",
        detail: d.firstAppealOnRefusal
          ? `${c.authority.office} replied, but withheld what you asked for. A refusal is a decision you are entitled to challenge, and filing an appeal is free of cost. ${deadline}`
          : `The Public Authority is ${d.daysLate} days past the legal deadline. Under the Act, this silence is deemed a refusal, and filing an appeal is free of cost. ${deadline}`,
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
      body: `₹${p.amountInr} was debited under reference ${p.ref}. Registration is still being confirmed. Do not make another payment.`,
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
        body: `A reply has been received from ${c.authority.office} regarding ${c.subject.toLowerCase()}.`,
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
        body: `Your appeal against ${c.authority.office} has been registered. The Appellate Authority is required to decide within 30 days, and within 45 at the outside where it records its reasons for taking longer.`,
        date: at(v.appeal.filedOnDay),
        age: day - v.appeal.filedOnDay,
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    }

    if (d.canFileSecondAppeal && v.appeal.filedOnDay !== undefined) {
      const dueOn = v.appeal.filedOnDay + APPEAL_DECISION_DAYS;
      out.push({
        id: `n-sa-${c.id}`,
        kind: "second_appeal",
        tone: "danger",
        title: "Second Appeal now available",
        body: `The Appellate Authority's 45 days lapsed with no decision on your appeal regarding ${c.subject.toLowerCase()}. The Central Information Commission can now be approached, free of cost.`,
        date: at(dueOn),
        age: day - dueOn,
        href: `/requests/${c.id}/second-appeal`,
        ref: c.registrationNumber,
      });
    }

    if (d.secondAppealFiled && v.appeal.secondFiledOnDay !== undefined) {
      out.push({
        id: `n-sa-filed-${c.id}`,
        kind: "second_appeal",
        tone: "warn",
        title: "Second Appeal registered",
        body: `Your appeal against ${c.authority.office} is now before the Central Information Commission, which sits outside the department.`,
        date: at(v.appeal.secondFiledOnDay),
        age: day - v.appeal.secondFiledOnDay,
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    }

    if (d.canFileFirstAppeal) {
      // A refusal has its own date — the day the reply landed. Dating this
      // from the 30-day expiry would put the notice before the event.
      const from =
        d.firstAppealOnRefusal && c.replyDay !== undefined
          ? c.replyDay
          : d.clock.dueDay;
      out.push({
        id: `n-fa-${c.id}`,
        kind: "first_appeal",
        tone: "danger",
        title: d.firstAppealOnRefusal ? "Their answer fell short" : "Appeal now available",
        body: d.firstAppealOnRefusal
          ? `${c.authority.office} claimed an exemption over your request regarding ${c.subject.toLowerCase()} instead of answering it. An appeal may be filed free of cost.`
          : `The ${d.clock.spec.label} the law allows has passed with no reply regarding ${c.subject.toLowerCase()}. An appeal may be filed free of cost.`,
        date: at(from),
        age: day - from,
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
            "The usual 30-day period has passed. You may still file a delayed First Appeal, provided the reason for the delay is included.",
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
          body: `File a First Appeal by ${v.firstAppealDue.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. ${v.firstAppealDaysLeft} day${v.firstAppealDaysLeft === 1 ? "" : "s"} remaining.`,
          date: at(day),
          age: 0,
          href: `/requests/${c.id}#appeal`,
          ref: c.registrationNumber,
        });
      }
    }

    // A warning while it is still useful — not after the deadline has gone.
    const daysLeft = d.clock.dueDay - day;
    if (!d.hasReply && daysLeft > 0 && daysLeft <= 7) {
      out.push({
        id: `n-dl-${c.id}`,
        kind: "deadline",
        tone: "warn",
        title: "Deadline approaching",
        body: `${c.authority.office} has ${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining to respond.`,
        date: at(day),
        age: 0,
        href: `/requests/${c.id}`,
        ref: c.registrationNumber,
      });
    }
  }

  // Sorted by age, not by calendar date.
  //
  // Each case runs on its own clock in this demo, so two cases can be at
  // different points in their own 30 days and produce absolute dates that
  // are not comparable — which is how a 26 Sept item ended up sitting above
  // 27 Aug items and looking like a future event. `age` is days-ago on the
  // case's own clock, which is comparable and is what "recent" means here.
  return out.sort((a, b) => a.age - b.age || b.date.getTime() - a.date.getTime());
}

/** "Today", "Yesterday", "6 days ago" — the label the feed leads with. */
export function relativeAge(age: number): string {
  if (age <= 0) return "Today";
  if (age === 1) return "Yesterday";
  return `${age} days ago`;
}

/* ---------------- Search and filters ---------------- */

/**
 * The filter chips are the five stages, plus "In appeal" — which is a tag,
 * not a stage, so it cuts across the others rather than sitting among them.
 *
 * They deliberately match STAGE_COPY word for word. The old list had its own
 * sixth vocabulary ("Active", "Completed"), so a chip could be selected and
 * every badge underneath it would read something else.
 */
export const FILTERS = [
  { id: "all", label: "All" },
  { id: "needs_you", label: STAGE_COPY.needs_you.plain },
  { id: "with_department", label: STAGE_COPY.with_department.plain },
  { id: "answered", label: STAGE_COPY.answered.plain },
  { id: "closed", label: STAGE_COPY.closed.plain },
  { id: "appeal", label: "In appeal" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

export function matchesFilter(
  v: CaseView,
  filter: FilterId,
  needsAction: boolean,
): boolean {
  if (filter === "all") return true;

  const badge = caseStage(v, needsAction);
  if (filter === "appeal") return badge.inAppeal;
  // "Filed" is a day-zero flicker, not a state worth a chip of its own —
  // it lives under "With the department" so no case is ever unreachable.
  if (filter === "with_department") {
    return badge.stage === "with_department" || badge.stage === "filed";
  }
  return badge.stage === filter;
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
