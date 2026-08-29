import { LanguageToggle } from "./LanguageToggle";
import { useLocale } from "@/lib/i18n";

/**
 * The thin strip above the masthead — the row a government portal uses for
 * the things that are not navigation: the skip link, who publishes the site,
 * and the language it is read in.
 */
export function GovUtilityBar() {
  const { t } = useLocale();
  return (
    <div className="gov-utility-bar text-white">
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-4 sm:px-8 lg:px-10 xl:px-12">
        <a
          href="#main"
          className="sr-only rounded-b-md bg-white px-3 py-1.5 text-[12px] font-bold text-navy-900 focus:not-sr-only focus:absolute focus:left-4 focus:top-0 focus:z-50"
        >
          {t("Skip to main content")}
        </a>

        {/* An honest publisher line. This is a redesign concept, so the strip
            names the Act it implements rather than claiming a ministry. */}
        <p className="min-w-0 truncate py-1.5 text-[11.5px] font-medium tracking-[0.02em] text-white/80">
          {t("Right to Information Act, 2005")}
          <span aria-hidden className="mx-2 text-white/30">
            |
          </span>
          <span className="text-white/60">
            {t("An independent redesign concept, not an official Government of India site")}
          </span>
        </p>

        <div className="ml-auto shrink-0">
          <LanguageToggle tone="dark" />
        </div>
      </div>
    </div>
  );
}
