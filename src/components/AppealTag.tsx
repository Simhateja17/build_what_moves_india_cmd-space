"use client";

import { useLocale } from "@/lib/i18n";
import { toneChip } from "@/lib/tone";

/**
 * "In appeal" — a flag on the application, not a status.
 *
 * It rides beside the application number, never beside the stage pill.
 * Two tags shoulder to shoulder in the status slot read as two competing
 * statuses however they are coloured: the citizen has to work out which
 * of the two is the answer to "where is my request?". Only one thing
 * belongs in that slot, and the appeal belongs with the identity of the
 * application it was filed against.
 *
 * Solid, so it reads as a label attached to the number rather than as
 * another pill; navy, because an appeal sits with the authority.
 */
export function AppealTag({ size = "sm" }: { size?: "xs" | "sm" }) {
  const { t } = useLocale();

  return (
    <span
      title={t("An appeal is live on this request")}
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded font-bold uppercase tracking-wider ring-1 ${
        size === "xs"
          ? "px-1.5 py-0.5 text-[9px]"
          : "px-2 py-0.5 text-[10px]"
      } ${toneChip("info", "solid")}`}
    >
      {t("stage.in_appeal")}
    </span>
  );
}
