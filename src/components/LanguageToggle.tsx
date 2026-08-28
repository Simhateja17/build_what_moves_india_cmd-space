"use client";

import { LOCALES, useLocale } from "@/lib/i18n";

/**
 * Language, in the header where a citizen can find it before they are lost.
 *
 * Two languages fit as a segmented control, which is better than a select
 * here: the alternative is visible without a click, so someone who cannot
 * read the current language can still see the other option.
 */
export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className="flex shrink-0 items-center rounded-full border border-line bg-white/70 p-0.5"
    >
      {LOCALES.map((item) => {
        const active = locale === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id)}
            aria-pressed={active}
            // The full language name is the accessible name; the short form
            // is what fits in a masthead.
            aria-label={item.label}
            title={item.label}
            className={`rounded-full px-2.5 py-1 text-[12px] font-bold transition ${
              active
                ? "bg-navy-800 text-white"
                : "text-ink-2 hover:bg-navy-50 hover:text-navy-900"
            }`}
          >
            <span aria-hidden>{item.short}</span>
          </button>
        );
      })}
    </div>
  );
}
