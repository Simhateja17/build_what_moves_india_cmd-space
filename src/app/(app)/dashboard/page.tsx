"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import {
  ActionItem,
  Notification,
  Overview,
  Tone,
  caseRows,
  relativeAge,
} from "@/lib/dashboard";
import { CaseList } from "@/components/CaseList";
import { formatDate } from "@/lib/dates";

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

      {/* Needs your attention — the thing this redesign exists for. Every
          open action, not a sample of two, so nothing is one click further
          away than it has to be. */}
      {actions.length > 0 ? (
        <section aria-labelledby="attention-title">
          <SectionHead
            id="attention-title"
            title="Requires your attention"
            href={actions.length > 6 ? "/my-rtis?filter=needs_you" : undefined}
            cta={`View all ${actions.length}`}
          />
          <AttentionGrid items={actions} />
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

/* ---------------- Attention ---------------- */

/** One surface, one accent. The rail and the icon carry the urgency so
 *  the card itself stays white — five pastel fills side by side read as
 *  noise, not as priority. */
const ACCENT: Record<Tone, { rail: string; icon: string }> = {
  danger: { rail: "bg-govred-600", icon: "bg-govred-50 text-govred-700" },
  warn: { rail: "bg-saffron-500", icon: "bg-saffron-50 text-saffron-600" },
  good: { rail: "bg-govgreen-600", icon: "bg-govgreen-50 text-govgreen-700" },
  info: { rail: "bg-navy-600", icon: "bg-navy-50 text-navy-700" },
  neutral: { rail: "bg-line", icon: "bg-canvas text-ink-2" },
  muted: { rail: "bg-line", icon: "bg-canvas text-muted" },
};

function AttentionGrid({ items }: { items: ActionItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.slice(0, 6).map((item) => {
        const accent = ACCENT[item.tone];
        return (
          <div
            key={item.id}
            className="gov-card relative flex h-full flex-col gap-3 p-5 pl-6"
          >
            <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${accent.rail}`} />
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${accent.icon}`}
              >
                {item.tone === "good" ? "✓" : "!"}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-bold leading-snug text-ink">
                  {item.title}
                </p>
                {item.ref ? (
                  <p className="mt-0.5 truncate font-mono text-[10px] text-muted">
                    {item.ref}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="text-[12.5px] leading-relaxed text-ink-2">{item.detail}</p>
            <Link
              href={item.href}
              className="mt-auto inline-flex w-fit rounded-lg border border-navy-600/25 bg-white px-3 py-2 text-[12px] font-bold text-navy-700 transition hover:bg-navy-50"
            >
              {item.cta} →
            </Link>
          </div>
        );
      })}
    </div>
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
