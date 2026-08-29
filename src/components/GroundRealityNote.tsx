"use client";

import { useLocale } from "@/lib/i18n";

export function GroundRealityNote({
  children,
  tone = "info",
}: {
  children: React.ReactNode;
  tone?: "info" | "warn";
}) {
  const { t } = useLocale();
  const styles =
    tone === "warn"
      ? "border-saffron-400/40 bg-saffron-50 text-saffron-600"
      : "border-navy-600/15 bg-navy-50 text-navy-800";

  return (
    <div className={`mt-2.5 rounded-lg border px-3 py-2.5 ${styles}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
        {t("What actually happens")}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed">{children}</p>
    </div>
  );
}
