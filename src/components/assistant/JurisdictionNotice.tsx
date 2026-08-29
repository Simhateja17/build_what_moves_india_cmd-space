"use client";

import { GovLevel } from "@/lib/assistant/types";
import { useLocale } from "@/lib/i18n";

/* ------------------------------------------------------------------
   The warning that has to arrive before the form, not after it.

   The RTI Online manual is explicit: an application filed on the
   central portal for a State public authority is returned to the
   citizen "without refund of amount". Validating that on submit would
   mean the citizen has already lost the fee and the weeks. So the gate
   sits on the authority screen, before a single form field exists —
   and it never dead-ends: the draft is still worth having on paper.
------------------------------------------------------------------- */

export function JurisdictionNotice({
  level,
  authorityName,
  stateName,
}: {
  level: GovLevel;
  authorityName: string;
  stateName: string;
}) {
  const { t } = useLocale();
  const state = stateName || "your state";

  if (level === "central") {
    return (
      <div className="rounded-xl border border-govgreen-600/30 bg-govgreen-50 px-4 py-3.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-govgreen-700/80">
          {t("This portal accepts this application")}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-govgreen-700">
          {authorityName} is a Central Government public authority, so this
          portal is the right place for it.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-saffron-400/50 bg-saffron-50 px-4 py-3.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-600/90">
        {t("⚠ Important notice")}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-saffron-600">
        {level === "state"
          ? "This is a State Government matter."
          : "This is not a Central Government office."}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-saffron-600">
        {level === "state"
          ? "This portal only accepts requests for Central Government offices."
          : `Municipal corporations, panchayats and city water boards come under ${state}'s RTI rules, not this portal.`}{" "}
        If filed here, the application will be returned, and the fee is
        not refunded.
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-saffron-600">
        File it with the Public Information Officer of {authorityName} instead,
        under {state}&apos;s own RTI rules.
      </p>
    </div>
  );
}

/** The slim version that follows the citizen through the later steps. */
export function JurisdictionBanner({
  level,
  stateName,
  onWhy,
}: {
  level: GovLevel;
  stateName: string;
  onWhy: () => void;
}) {
  const { t } = useLocale();
  if (level === "central") return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-saffron-400/40 bg-saffron-50 px-3 py-2 text-[13px] text-saffron-600">
      <span>
        ⚠ {stateName || "State"} matter. Not filed through this portal.
      </span>
      <button
        type="button"
        onClick={onWhy}
        className="font-semibold underline underline-offset-2"
      >
        {t("Why?")}
      </button>
    </div>
  );
}
