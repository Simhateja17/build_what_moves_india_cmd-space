"use client";

import { useLocale } from "@/lib/i18n";
import { toneChip } from "@/lib/tone";
import { StatusBadge } from "@/lib/types";

/**
 * The only status badge in the app.
 *
 * Plain language leads, the statutory term sits underneath — never the
 * reverse, and never the statutory term alone. `compact` drops the second
 * line for dense tables, where the official wording would be noise.
 *
 * One pill, one status, and nothing else in the slot. The "In appeal"
 * flag used to render here too, so a case in appeal showed two tags side
 * by side and the citizen had to decide which one was the status. It is
 * `AppealTag` now, and it sits with the application number instead.
 */
export function StatusPill({
  badge,
  size = "md",
  compact = false,
}: {
  badge: StatusBadge;
  size?: "sm" | "md";
  compact?: boolean;
}) {
  // The stage is a key, so the one status vocabulary translates in one
  // place. The statutory term underneath stays in its own language — it is
  // a citation, and changing it would make it uncheckable.
  const { t } = useLocale();

  return (
    // Keyed on the stage so the pill re-enters whenever the case changes
    // state — the clearest signal that moving the clock did something.
    // "Closed" renders hollow rather than filled: it was the same grey as
    // "Filed", so a finished request and a brand-new one looked alike.
    <span
      key={badge.stage}
      className={`animate-pop inline-flex flex-col items-start rounded-xl px-3 py-2 ring-1 transition-colors duration-300 ${toneChip(badge.tone, badge.stage === "closed" ? "hollow" : "tint")}`}
    >
      <span
        className={`font-semibold leading-none ${size === "sm" ? "text-xs" : "text-sm"}`}
      >
        {t(`stage.${badge.stage}`, badge.plain)}
      </span>
      {!compact ? (
        <span className="mt-1 text-[10px] font-medium uppercase leading-none tracking-wider opacity-65">
          {badge.official}
        </span>
      ) : null}
    </span>
  );
}
