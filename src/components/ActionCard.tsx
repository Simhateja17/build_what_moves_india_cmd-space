"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { translateDashboardCopy } from "@/lib/localize-dashboard";
import { ActionItem, Tone } from "@/lib/dashboard";

/**
 * One thing the citizen has to do.
 *
 * Lifted out of the dashboard so the home page and the full Actions page
 * render the identical card. When this was inlined in the dashboard, any
 * second list of actions would have been a second implementation of the
 * same card — which is how two screens start disagreeing about what a
 * task is called.
 */
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

export function ActionCard({ item }: { item: ActionItem }) {
  const accent = ACCENT[item.tone];
  const { t } = useLocale();
  return (
    <div className="gov-card relative flex h-full flex-col gap-3 p-5 pl-6">
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
            {t(item.title, item.title)}
          </p>
          {item.ref ? (
            <p className="mt-0.5 truncate font-mono text-[10px] text-muted">
              {item.ref}
            </p>
          ) : null}
        </div>
      </div>
      <p className="text-[12.5px] leading-relaxed text-ink-2">
        {translateDashboardCopy(item.detail, t)}
      </p>
      <Link
        href={item.href}
        className="mt-auto inline-flex w-fit rounded-lg border border-navy-600/25 bg-white px-3 py-2 text-[12px] font-bold text-navy-700 transition hover:bg-navy-50"
      >
        {t(item.cta, item.cta)} →
      </Link>
    </div>
  );
}

export function ActionGrid({
  items,
  limit,
}: {
  items: ActionItem[];
  limit?: number;
}) {
  const shown = limit === undefined ? items : items.slice(0, limit);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {shown.map((item) => (
        <ActionCard key={item.id} item={item} />
      ))}
    </div>
  );
}
