"use client";

import Link from "next/link";
import { useDashboard } from "@/lib/use-dashboard";
import { ActionGrid } from "@/components/ActionCard";
import { useLocale } from "@/lib/i18n";

/**
 * Every open task, in one place.
 *
 * The home page leads with the two most urgent; this is where the rest
 * live. It is deliberately the same card, from the same derivation — the
 * old "View all" pointed at My requests filtered to "Needs you", which is
 * a list of *cases*. A payment that never became an RTI has no case to
 * appear in, so the one task most likely to lose someone ₹10 was the one
 * task that link could not show them.
 */
export default function ActionsPage() {
  const { actions } = useDashboard();
  const { t } = useLocale();

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:underline"
      >
        <span aria-hidden>←</span> {t("Home")}
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {t("Requires your attention")}
          </h1>
          <p className="mt-1 text-[15px] text-ink-2">
            {actions.length === 0
              ? t("Nothing is waiting on you.")
              : t("{count} {unit}, most urgent first.", undefined, {
                  count: actions.length,
                  unit: t(actions.length === 1 ? "task" : "tasks"),
                })}
          </p>
        </div>
      </div>

      {actions.length === 0 ? (
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-govgreen-600/20 bg-govgreen-50 px-5 py-4">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-govgreen-600 font-bold text-white"
          >
            ✓
          </span>
          <p className="text-sm font-bold text-ink">
            {t("There are no pending actions on your requests.")}
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <ActionGrid items={actions} />
        </div>
      )}
    </div>
  );
}
