import { GovLevel, LEVEL_COPY } from "@/lib/assistant/types";
import { useLocale } from "@/lib/i18n";

/**
 * The colour system that carries the whole feature: navy for central,
 * amber for state, green for local. It appears on the authority card,
 * the review row and every warning, so the level is never something a
 * citizen has to work out from the text.
 */
const TONE: Record<GovLevel, string> = {
  central: "bg-navy-50 text-navy-800",
  state: "bg-saffron-50 text-saffron-600",
  local: "bg-govgreen-50 text-govgreen-700",
};

export function GovLevelBadge({
  level,
  className = "",
}: {
  level: GovLevel;
  className?: string;
}) {
  const { t } = useLocale();
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${TONE[level]} ${className}`}
    >
      {t(LEVEL_COPY[level].label)}
    </span>
  );
}
