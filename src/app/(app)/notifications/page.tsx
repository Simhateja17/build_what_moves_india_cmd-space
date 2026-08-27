"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import { Tone } from "@/lib/dashboard";
import { formatDate } from "@/lib/dates";

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
};

export default function NotificationsPage() {
  const { readNotifications, markNotificationsRead } = useStore();
  const { notifications, unreadNotifications } = useDashboard();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            Updates
          </h1>
          <p className="mt-1 text-[15px] text-ink-2">
            {unreadNotifications > 0
              ? `${unreadNotifications} new`
              : "You are up to date"}
          </p>
        </div>
        {unreadNotifications > 0 ? (
          <button
            type="button"
            onClick={() => markNotificationsRead(notifications.map((n) => n.id))}
            className="rounded-lg border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-navy-800 transition hover:border-navy-600/50"
          >
            Mark all as read
          </button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <p className="mt-5 gov-card p-8 text-center text-sm text-ink-2">
          No updates yet. Anything a department does on your requests will
          appear here.
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 xl:grid-cols-2">
          {notifications.map((n) => {
            const unread = !readNotifications.includes(n.id);
            return (
              <li key={n.id}>
                <Link
                  href={n.href}
                  onClick={() => markNotificationsRead([n.id])}
                  className={`lift flex gap-3.5 rounded-[var(--radius-panel)] border p-4 shadow-[var(--shadow-panel)] transition ${
                    unread
                      ? "border-navy-600/30 bg-surface"
                      : "border-line bg-surface/70"
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
                        className={`text-[14px] leading-snug ${unread ? "font-bold text-ink" : "font-semibold text-ink-2"}`}
                      >
                        {n.title}
                      </span>
                      {unread ? (
                        <span
                          aria-label="Unread"
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-navy-700"
                        />
                      ) : null}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-ink-2">
                      {n.body}
                    </span>
                    <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-wider text-muted">
                      {formatDate(n.date)}
                      {n.ref ? ` · ${n.ref}` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
