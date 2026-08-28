"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import {
  Notification,
  Overview,
  Tone,
  caseRows,
  relativeAge,
} from "@/lib/dashboard";
import { CaseList } from "@/components/CaseList";
import { ActionGrid } from "@/components/ActionCard";
import { formatDate } from "@/lib/dates";

/**
 * How many actions the home page leads with. Two, because the point of
 * this section is "here is your next thing", not "here is everything".
 */
const DASHBOARD_ACTIONS = 2;

export default function DashboardPage() {
  const { citizenName } = useStore();
  const { views, actions, overview, notifications, actionCaseIds } =
    useDashboard();

  // Same rows, same order, same status wording as My requests — this is
  // that list at a lower density, not a second implementation of it.
  const recent = caseRows(views, actionCaseIds).slice(0, 5);

  return (
    <div className="dashboard-canvas space-y-8 sm:space-y-10">
      <WelcomeBar name={citizenName} overview={overview} />

      {/* Needs your attention — the thing this redesign exists for.
          The two most urgent, then a door to the rest. Six cards filled
          the fold and pushed the requests list off the screen entirely,
          which made a long list of tasks read as a wall rather than as a
          queue with a next item. The rest are one click away, not gone —
          and they are sorted by urgency, so the two on top are the two
          that matter. */}
      {actions.length > 0 ? (
        <section aria-labelledby="attention-title">
          <SectionHead id="attention-title" title="Requires your attention" />
          <ActionGrid items={actions} limit={DASHBOARD_ACTIONS} />
          {actions.length > DASHBOARD_ACTIONS ? (
            <Link
              href="/actions"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-navy-600/40 bg-white px-5 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50"
            >
              View {actions.length - DASHBOARD_ACTIONS} more
              <span aria-hidden>→</span>
            </Link>
          ) : null}
        </section>
      ) : (
        <section
          aria-labelledby="attention-title"
          className="flex items-center gap-4 rounded-2xl border border-govgreen-600/20 bg-govgreen-50 px-5 py-4"
        >
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-govgreen-600 font-bold text-white"
          >
            ✓
          </span>
          <p id="attention-title" className="text-sm font-bold text-ink">
            There are no pending actions on your requests.
          </p>
        </section>
      )}

      {/* min-w-0 on both columns: without it a grid child defaults to
          min-width:auto, the 720px table forces the column open and the
          whole page scrolls sideways on a phone. */}
      {/* items-start, not stretch: the two columns are never the same
          length, and stretching left the shorter card with a slab of
          empty white below its last row. */}
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-7">
        <section className="flex min-w-0 flex-col lg:col-span-8">
          <SectionHead
            title="Recent requests"
            href="/my-rtis"
            cta="View all requests"
          />
          <div className="gov-card overflow-hidden">
            <CaseList rows={recent} density="compact" />
          </div>
        </section>

        <aside className="flex min-w-0 flex-col lg:col-span-4">
          <SectionHead
            title="Recent activity"
            href="/notifications"
            cta="View all activity"
          />
          <ActivityPanel notifications={notifications} />
        </aside>
      </div>

      {/* The demo-provenance chips used to sit in this strip, where they
          competed with a real call to action. They belong with the rest of
          the disclaimer, in the footer. */}
      <section className="dashboard-trust-strip flex flex-col gap-3 rounded-2xl border border-navy-600/15 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-7">
        <p className="text-[13px] text-ink-2">
          Need help wording a request?
        </p>
        <Link
          href="/assistant"
          className="inline-flex w-fit items-center rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700"
        >
          Get assistance →
        </Link>
      </section>
    </div>
  );
}

/* ---------------- Welcome ---------------- */

/**
 * Carries the counts that used to sit in a four-tile row of their own.
 * Six records never needed four dashboard tiles; they needed one line
 * that says where things stand, with each number still a filter link.
 */
function WelcomeBar({ name, overview }: { name: string; overview: Overview }) {
  // The same five words the badges and chips use. These three used to read
  // "filed / in progress / answered" — a fourth vocabulary for the same set.
  const counts: Array<{ value: number; label: string; href: string }> = [
    { value: overview.total, label: "in total", href: "/my-rtis?filter=all" },
    {
      value: overview.withDepartment,
      label: "with the department",
      href: "/my-rtis?filter=with_department",
    },
    {
      value: overview.answered,
      label: "answered",
      href: "/my-rtis?filter=answered",
    },
  ];

  return (
    <section className="dashboard-welcome-bar flex flex-col gap-5 rounded-2xl border border-navy-600/15 px-5 py-5 shadow-[var(--shadow-panel)] sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-[26px]">
          Namaste, {name.split(" ")[0]}
        </h1>

        {/* The count used to be stated here as well, in the attention cards
            below, and again in the table badges — three times on one screen.
            The cards are the count; this line is gone. */}

        {/* Styled as chips so they read as controls. They were already
            links, but rendered as plain numerals they looked like decoration
            and nobody would think to click them. */}
        <dl className="mt-4 flex flex-wrap items-center gap-2">
          {counts.map((count) => (
            <Link
              key={count.label}
              href={count.href}
              className="group flex items-baseline gap-1.5 rounded-full border border-navy-600/20 bg-white/70 px-3 py-1.5 transition hover:border-navy-600/50 hover:bg-white"
            >
              <dt className="sr-only">{count.label}</dt>
              <dd className="text-base font-bold tabular-nums leading-none text-navy-900">
                {count.value}
              </dd>
              <span className="text-[12px] font-semibold text-ink-2 group-hover:text-navy-700">
                {count.label}
              </span>
              <span aria-hidden className="text-[11px] text-muted group-hover:text-navy-700">
                →
              </span>
            </Link>
          ))}
        </dl>
      </div>

      <Link
        href="/start-rti"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-navy-700 px-5 py-3 text-[14px] font-bold text-white shadow-[0_10px_22px_rgba(61,111,179,0.22)] transition hover:-translate-y-0.5 hover:bg-navy-800"
      >
        <span aria-hidden className="text-lg leading-none">+</span>
        File a request
      </Link>
    </section>
  );
}

/* ---------------- Activity ---------------- */

const DOT: Record<Tone, string> = {
  good: "bg-govgreen-600",
  warn: "bg-saffron-500",
  danger: "bg-govred-600",
  info: "bg-navy-600",
  neutral: "bg-muted",
  muted: "bg-line",
};

/** What the dot colours mean. Unlabelled colour is not information. */
const DOT_LEGEND: Array<{ tone: Tone; label: string }> = [
  { tone: "danger", label: "Action needed" },
  { tone: "warn", label: "Deadline" },
  { tone: "good", label: "Reply" },
];

function ActivityPanel({ notifications }: { notifications: Notification[] }) {
  // Three, not five. The column used to run ~250px past the bottom of the
  // requests table beside it, leaving a dead corner on the page.
  const shown = notifications.slice(0, 3);

  return (
    <div className="gov-card flex flex-col px-5 py-4 sm:px-6">
      <ul className="flex flex-col">
      {shown.map((notification, index) => (
        <li key={notification.id} className="relative flex gap-4 py-3">
          {index < shown.length - 1 ? (
            <span
              aria-hidden
              className="absolute left-[5px] top-5 h-[calc(100%-0.75rem)] w-px bg-line"
            />
          ) : null}
          {/* A plain tone dot: the old numbered circles read as a ranking
              or a step order, and these events are neither. */}
          <span
            className={`relative z-[1] mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[notification.tone]}`}
          >
            <span className="sr-only">
              {DOT_LEGEND.find((d) => d.tone === notification.tone)?.label ??
                "Update"}
              :{" "}
            </span>
          </span>
          <Link href={notification.href} className="group min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-ink group-hover:text-navy-700">
              {notification.title}
            </span>
            <span className="mt-0.5 block line-clamp-2 text-[11.5px] leading-relaxed text-ink-2">
              {notification.body}
            </span>
            {/* Days-ago leads, the calendar date follows. Each case runs on
                its own clock here, so absolute dates across cases are not
                comparable and used to order the feed misleadingly. */}
            <span className="mt-1 block text-[11px] text-muted">
              {relativeAge(notification.age)} · {formatDate(notification.date)}
            </span>
          </Link>
        </li>
      ))}
      </ul>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line-2 pt-3">
        {DOT_LEGEND.map((item) => (
          <li key={item.tone} className="flex items-center gap-1.5">
            <span aria-hidden className={`h-2 w-2 rounded-full ${DOT[item.tone]}`} />
            <span className="text-[11px] text-ink-2">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Shared ---------------- */

function SectionHead({
  id,
  title,
  href,
  cta,
}: {
  id?: string;
  title: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 id={id} className="text-lg font-bold tracking-tight text-navy-900">
        {title}
      </h2>
      {href && cta ? (
        <Link
          href={href}
          className="shrink-0 text-[13px] font-semibold text-navy-700 hover:underline"
        >
          {cta} →
        </Link>
      ) : null}
    </div>
  );
}
