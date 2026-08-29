"use client";

import { useStore } from "@/lib/store";
import { CaseEvent, EventKind, REPLY_DEADLINE_DAYS } from "@/lib/types";
import { useLocale } from "@/lib/i18n";

const DOT: Record<EventKind, string> = {
  filed: "bg-navy-700",
  routed: "bg-navy-600",
  cpio: "bg-navy-600",
  split: "bg-saffron-500",
  deadline: "bg-govred-600",
  penalty: "bg-govred-600",
  reply: "bg-govgreen-600",
  appeal: "bg-saffron-500",
  escalation: "bg-saffron-500",
};

export function CaseTimeline({
  events,
  day,
  hasReply,
}: {
  events: CaseEvent[];
  day: number;
  hasReply: boolean;
}) {
  const { prefs } = useStore();
  const { t } = useLocale();

  const overdue = !hasReply && day > REPLY_DEADLINE_DAYS;

  return (
    <div>
      <div className="mb-5">
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span className="font-semibold text-ink">
            {hasReply
              ? t("Answered")
              : overdue
                ? t("{count} days past the legal deadline", undefined, { count: day - REPLY_DEADLINE_DAYS })
                : t("{count} days left before they must reply", undefined, { count: REPLY_DEADLINE_DAYS - day })}
          </span>
          <span className="text-muted">
            {t("Day {day} of the {limit}-day limit", undefined, { day, limit: REPLY_DEADLINE_DAYS })}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-line-2">
          <div
            className={`meter-fill h-full rounded-full ${
              hasReply
                ? "bg-govgreen-600"
                : overdue
                  ? "bg-govred-600"
                  : "bg-navy-600"
            }`}
            style={{
              width: `${Math.min(100, (day / REPLY_DEADLINE_DAYS) * 100)}%`,
            }}
          />
        </div>
      </div>

      <ol className="space-y-0">
        {events.map((event, i) => (
          <li
            key={`${event.day}-${event.kind}-${i}`}
            className="animate-slide flex gap-3"
            // Each entry lands a beat after the one above, so the case reads
            // as a sequence of things that happened rather than a block.
            style={{ ["--reveal-delay" as string]: `${Math.min(i, 8) * 55}ms` }}
          >
            <div className="flex flex-col items-center">
              <span
                className={`animate-pop mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[event.kind]}`}
                style={{
                  animationDelay: `${Math.min(i, 8) * 55 + 60}ms`,
                }}
              />
              {i < events.length - 1 && (
                <span className="w-px flex-1 bg-line" />
              )}
            </div>
            <div className={i < events.length - 1 ? "pb-5" : ""}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {t("Day {day}", undefined, { day: event.day })}
              </p>
              <p className="mt-0.5 text-[15px] leading-snug text-ink">
                {t(event.plain)}
              </p>
              {event.official && prefs.showOfficialTerms ? (
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted">
                  {event.official}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
