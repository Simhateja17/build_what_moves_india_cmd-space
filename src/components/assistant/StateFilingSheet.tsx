"use client";

import { fillPlaces } from "@/lib/assistant/authorities";
import { filingFor } from "@/lib/assistant/places";
import { AuthorityMatch } from "@/lib/assistant/types";
import { useLocale } from "@/lib/i18n";

/**
 * The other half of a warning. Telling a citizen "this belongs to your
 * state" and stopping there just moves the dead end — the point of
 * knowing the state is being able to say what to do in it.
 */
export function StateFilingSheet({
  authority,
  stateName,
  city,
}: {
  authority: AuthorityMatch;
  stateName: string;
  city: string;
}) {
  const { t } = useLocale();
  const filing = filingFor(stateName);
  const place = { city, state: stateName };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {t("Address it to")}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {authority.pioTitle}
        </p>
        <p className="text-sm text-ink-2">
          {fillPlaces(authority.wing, place)}
        </p>
        <p className="text-sm text-ink-2">
          {fillPlaces(authority.name, place)}
        </p>
      </div>

      {filing.portal ? (
        <div className="rounded-xl border border-navy-600/20 bg-navy-50 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-navy-800/75">
            {stateName} has its own RTI portal
          </p>
          <p className="mt-1 font-mono text-sm text-navy-800">{filing.portal}</p>
        </div>
      ) : null}

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {t("Filing method")}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{filing.how}</p>
      </div>

      <div className="rounded-xl border border-line bg-canvas px-4 py-3">
        <p className="text-[13px] leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">{t("Keep the receipt.")}</span> {t("The thirty-day clock starts from the date the office received your application, and the receipt is what proves that date.")}
        </p>
      </div>
    </div>
  );
}
