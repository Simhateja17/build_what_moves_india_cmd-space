"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import {
  Notification,
  Tone,
  groupNotifications,
  notificationNeedsAction,
} from "@/lib/dashboard";
import { formatDate } from "@/lib/dates";
import { useLocale } from "@/lib/i18n";
import { translateDashboardCopy } from "@/lib/localize-dashboard";

const ICON: Record<string, string> = {
  response: "📩",
  document: "📎",
  hearing: "⚖️",
  transferred: "↪️",
  deadline: "⏳",
  appeal_deadline: "⏳",
  first_appeal: "⚠️",
  second_appeal: "⚠️",
  appeal_filed: "📤",
  payment: "💳",
};

const RING: Record<Tone, string> = {
  good: "bg-govgreen-50",
  warn: "bg-saffron-50",
  danger: "bg-govred-50",
  info: "bg-navy-50",
  neutral: "bg-canvas",
  muted: "bg-canvas",
};

/**
 * The left edge, which is the only thing carrying urgency at a glance.
 * Every item already knows its tone; the old feed spent that tone on a
 * 36px icon circle and nothing else.
 */
const EDGE: Record<Tone, string> = {
  good: "border-l-govgreen-600",
  warn: "border-l-saffron-400",
  danger: "border-l-govred-600",
  info: "border-l-navy-600",
  neutral: "border-l-line",
  muted: "border-l-line",
};

/**
 * A feed sorted by recency answers "what happened". It does not answer
 * "what do I have to do", and that is the only question a citizen with
 * money in limbo is actually asking.
 *
 * So the page splits: everything that is a to-do lifts out of the
 * chronology into one block at the top, and the rest stays chronological
 * underneath, grouped so a long tail of old bulletins does not read as
 * one undifferentiated wall.
 */
export default function NotificationsPage() {
  const { readNotifications, markNotificationsRead } = useStore();
  const { notifications, unreadNotifications } = useDashboard();
  const { t } = useLocale();

  const { attention, rest } = useMemo(() => {
    const attention: Notification[] = [];
    const rest: Notification[] = [];
    for (const n of notifications) {
      (notificationNeedsAction(n) ? attention : rest).push(n);
    }
    return { attention, rest };
  }, [notifications]);

  const groups = useMemo(() => groupNotifications(rest), [rest]);

  const subtitle =
    unreadNotifications > 0
      ? t("{count} new", undefined, { count: unreadNotifications })
      : attention.length > 0
        ? t(
            attention.length === 1
              ? "{count} item needs your attention"
              : "{count} items need your attention",
            undefined,
            { count: attention.length },
          )
        : t("You are up to date");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {t("Updates")}
          </h1>
          <p className="mt-1 text-[15px] text-ink-2">{subtitle}</p>
        </div>
        {unreadNotifications > 0 ? (
          <button
            type="button"
            onClick={() =>
              markNotificationsRead(notifications.map((n) => n.id))
            }
            className="rounded-lg border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-navy-800 transition hover:border-navy-600/50"
          >
            {t("Mark all as read")}
          </button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <p className="mt-5 gov-card p-8 text-center text-sm text-ink-2">
          {t(
            "No updates yet. Actions taken by a department on your requests will appear here.",
          )}
        </p>
      ) : (
        <>
          {attention.length > 0 ? (
            <section className="mt-6" aria-labelledby="needs-attention">
              <div className="flex items-baseline gap-2">
                <h2
                  id="needs-attention"
                  className="text-[11px] font-bold uppercase tracking-wider text-govred-700"
                >
                  {t("Needs your attention")}
                </h2>
                <span className="text-[11px] font-bold text-govred-700/70">
                  {attention.length}
                </span>
              </div>
              {/* Single column, whatever the width. Two columns would put
                  a to-do out at the right edge where the eye lands last. */}
              <ul className="mt-2.5 grid gap-2.5">
                {attention.map((n) => (
                  <Card
                    key={n.id}
                    n={n}
                    unread={!readNotifications.includes(n.id)}
                    onOpen={markNotificationsRead}
                    urgent
                  />
                ))}
              </ul>
            </section>
          ) : null}

          {groups.map((g) => (
            <section key={g.label} className="mt-6" aria-labelledby={g.label}>
              <h2
                id={g.label}
                className="text-[11px] font-bold uppercase tracking-wider text-muted"
              >
                {t(g.label, g.label)}
              </h2>
              <ul className="mt-2.5 grid gap-2.5 xl:grid-cols-2">
                {g.items.map((n) => (
                  <Card
                    key={n.id}
                    n={n}
                    unread={!readNotifications.includes(n.id)}
                    onOpen={markNotificationsRead}
                  />
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

function Card({
  n,
  unread,
  onOpen,
  urgent = false,
}: {
  n: Notification;
  unread: boolean;
  onOpen: (ids: string[]) => void;
  urgent?: boolean;
}) {
  const { t, locale } = useLocale();

  return (
    <li>
      <Link
        href={n.href}
        onClick={() => onOpen([n.id])}
        // h-full so cards in a row square off against each other rather
        // than leaving a ragged edge wherever a body runs to three lines.
        className={`lift flex h-full gap-3.5 rounded-[var(--radius-panel)] border border-l-4 p-4 shadow-[var(--shadow-panel)] transition ${EDGE[n.tone]} ${
          unread ? "border-navy-600/30 bg-surface" : "border-line bg-surface/70"
        }`}
      >
        <span
          aria-hidden
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] ${RING[n.tone]}`}
        >
          {ICON[n.kind] ?? "•"}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-start gap-2">
            <span
              className={`text-[14px] leading-snug ${
                unread || urgent
                  ? "font-bold text-ink"
                  : "font-semibold text-ink-2"
              }`}
            >
              {t(n.title, n.title)}
            </span>
            {unread ? (
              <span
                aria-label={t("Unread")}
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-navy-700"
              />
            ) : null}
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-ink-2">
            {translateDashboardCopy(n.body, t)}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            <span>{formatDate(n.date, locale)}</span>
            {n.ref ? <span>· {n.ref}</span> : null}
            {/* The one place the card says what tapping it does. Without
                it, an urgent row was a dead end you had to guess at. */}
            {urgent ? (
              <span className="font-sans font-semibold normal-case tracking-normal text-navy-700">
                · {t("Open →")}
              </span>
            ) : null}
          </span>
        </span>
      </Link>
    </li>
  );
}
