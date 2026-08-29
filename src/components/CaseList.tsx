"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { CaseRow, RowClock } from "@/lib/dashboard";
import { formatDate } from "@/lib/dates";
import { Tone } from "@/lib/types";
import { AppealTag } from "./AppealTag";
import { StatusPill } from "./StatusPill";

const CLOCK_TEXT: Record<Tone, string> = {
  danger: "text-govred-700",
  warn: "text-saffron-600",
  info: "text-ink-2",
  good: "text-govgreen-700",
  neutral: "text-muted",
  muted: "text-muted",
};

const CLOCK_BAR: Record<Tone, string> = {
  danger: "bg-govred-600",
  warn: "bg-saffron-500",
  info: "bg-navy-600",
  good: "bg-govgreen-600",
  neutral: "bg-line",
  muted: "bg-line",
};

/** How long the department has left, as a number and a thin track. */
function Clock({ clock, width = "w-24" }: { clock: RowClock; width?: string }) {
  const { t } = useLocale();
  const label = localizeClockLabel(clock.label, t);
  return (
    <span className="block">
      <span className={`block text-xs font-bold tabular-nums ${CLOCK_TEXT[clock.tone]}`}>
        {label}
      </span>
      {clock.pct !== null ? (
        <span
          aria-hidden
          className={`mt-1.5 block h-1 ${width} overflow-hidden rounded-full bg-line-2`}
        >
          <span
            className={`block h-full rounded-full ${CLOCK_BAR[clock.tone]}`}
            style={{ width: `${Math.max(3, clock.pct)}%` }}
          />
        </span>
      ) : null}
    </span>
  );
}

/**
 * The one list of requests.
 *
 * Home and My requests used to render two separate tables with different
 * columns, different status wording and different button labels ("View" vs
 * "View Details"). They are the same list of the same objects, so they are
 * now the same component at two densities.
 *
 * `compact` is the five-row summary on Home: it trades the last-updated
 * column and the official terms for the deadline, which is the column
 * people actually scan.
 */
export function CaseList({
  rows,
  density = "full",
}: {
  rows: CaseRow[];
  density?: "compact" | "full";
}) {
  const compact = density === "compact";
  const { t, locale } = useLocale();

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-canvas text-xs font-semibold text-ink-2">
            <tr>
              <th scope="col" className="border-b border-line-2 px-4 py-3.5">
                {t("list.appNo")}
              </th>
              <th scope="col" className="border-b border-line-2 px-4 py-3.5">
                {t("list.department")}
              </th>
              <th scope="col" className="border-b border-line-2 px-4 py-3.5">
                {t("list.status")}
              </th>
              <th scope="col" className="border-b border-line-2 px-4 py-3.5">
                {t("list.deadline")}
              </th>
              {!compact ? (
                <th scope="col" className="border-b border-line-2 px-4 py-3.5">
                  {t("list.lastUpdated")}
                </th>
              ) : null}
              <th scope="col" className="border-b border-line-2 px-4 py-3.5 text-right">
                <span className="sr-only">Open request</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ view, badge, unread, lastUpdated, clock }) => {
              // The same 4px saffron rail the attention cards and the case
              // page use. It was a one-off on the dashboard; it is now what
              // "needs you" looks like everywhere.
              const needsYou = badge.stage === "needs_you";
              return (
              <tr key={view.c.id} className="group transition hover:bg-navy-50/40">
                <td
                  className={`border-b border-line-2 py-3.5 pr-4 ${needsYou ? "border-l-4 border-l-saffron-500 pl-3" : "pl-4"}`}
                >
                  <span className="flex items-center gap-2">
                    {unread ? (
                      <span
                        aria-label="Unread reply"
                        className="h-2 w-2 shrink-0 rounded-full bg-navy-700"
                      />
                    ) : null}
                    <Link
                      href={`/requests/${view.c.id}`}
                      className={`font-mono text-xs text-ink hover:text-navy-700 hover:underline ${unread ? "font-bold" : "font-semibold"}`}
                    >
                      {view.c.registrationNumber}
                    </Link>
                    {badge.inAppeal ? <AppealTag size="xs" /> : null}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted">
                    {t("list.filed")} {formatDate(view.submittedOn, locale)}
                  </span>
                </td>
                <td
                  className={`max-w-[280px] border-b border-line-2 px-4 py-3.5 text-ink ${unread ? "font-semibold" : "font-medium"}`}
                >
                  {view.c.authority.office}
                </td>
                <td className="border-b border-line-2 px-4 py-3.5">
                  <StatusPill badge={badge} size="sm" compact={compact} />
                </td>
                <td className="border-b border-line-2 px-4 py-3.5">
                  <Clock clock={clock} />
                </td>
                {!compact ? (
                  <td className="whitespace-nowrap border-b border-line-2 px-4 py-3.5 text-ink-2">
                    {formatDate(lastUpdated, locale)}
                  </td>
                ) : null}
                <td className="border-b border-line-2 px-4 py-3.5 text-right">
                  <Link
                    href={`/requests/${view.c.id}`}
                    className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-bold text-navy-700 hover:underline"
                  >
                    {t("list.view")}
                    <span aria-hidden className="transition group-hover:translate-x-0.5">
                      →
                    </span>
                    <span className="sr-only"> request {view.c.registrationNumber}</span>
                  </Link>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="grid gap-3 p-4 lg:hidden">
        {rows.map(({ view, badge, unread, clock }) => (
          <li key={view.c.id}>
            <Link
              href={`/requests/${view.c.id}`}
              className={`block rounded-xl border border-line p-4 shadow-sm transition hover:border-navy-600/40 ${badge.stage === "needs_you" ? "border-l-4 border-l-saffron-500" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="flex items-center gap-2">
                  {unread ? (
                    <span
                      aria-label="Unread reply"
                      className="h-2 w-2 shrink-0 rounded-full bg-navy-700"
                    />
                  ) : null}
                  <span
                    className={`font-mono text-xs text-ink ${unread ? "font-bold" : "font-semibold"}`}
                  >
                    {view.c.registrationNumber}
                  </span>
                  {badge.inAppeal ? <AppealTag size="xs" /> : null}
                </span>
                <StatusPill badge={badge} size="sm" compact />
              </div>

              <p
                className={`mt-3 leading-snug text-ink ${unread ? "font-bold" : "font-semibold"}`}
              >
                {view.c.authority.office}
              </p>

              <div className="mt-3 border-t border-line-2 pt-3">
                <Clock clock={clock} width="w-full max-w-[180px]" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function localizeClockLabel(
  label: string,
  t: (key: string, fallback?: string, values?: Record<string, string | number>) => string,
): string {
  const overdue = label.match(/^(\d+) day(s)? overdue$/);
  if (overdue) {
    return t(overdue[2] ? "{count} days overdue" : "{count} day overdue", undefined, {
      count: overdue[1],
    });
  }
  const left = label.match(/^(\d+) day(s)? left$/);
  if (left) {
    return t(left[2] ? "{count} days left" : "{count} day left", undefined, {
      count: left[1],
    });
  }
  return t(label);
}
