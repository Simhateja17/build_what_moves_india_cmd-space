"use client";

import { AssistantStep, STEP_LABEL, STEP_ORDER } from "@/lib/assistant/types";
import { useLocale } from "@/lib/i18n";

/** A quiet, centred frame for every step of the guided filing flow. */
export function AssistantShell({
  step,
  title,
  subtitle,
  banner,
  children,
  onBack,
  primaryLabel,
  onPrimary,
  primaryDisabled,
  primaryTone = "navy",
  primaryHint,
  secondary,
  totalSteps = STEP_ORDER.length,
}: {
  step: AssistantStep;
  title: string;
  subtitle?: string;
  banner?: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryTone?: "navy" | "amber";
  primaryHint?: string;
  secondary?: React.ReactNode;
  totalSteps?: number;
}) {
  const index = STEP_ORDER.indexOf(step);
  const { t } = useLocale();

  return (
    <div className="mx-auto w-full max-w-[980px] pb-8">
      {banner}

      <div className="mb-7 rounded-2xl border border-line bg-surface px-4 py-4 shadow-[var(--shadow-panel)] sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.11em] text-navy-800">
            {t("Step {step} of {total}", undefined, { step: index + 1, total: totalSteps })}
          </p>
          <p className="text-xs font-medium text-muted">{t(STEP_LABEL[step])}</p>
        </div>
        <div className="mt-3 grid grid-cols-6 gap-1.5" aria-label={t("Step {step} of {total}", undefined, { step: index + 1, total: totalSteps })}>
          {STEP_ORDER.slice(0, totalSteps).map((item, itemIndex) => (
            <span
              key={item}
              className={`h-1.5 rounded-full transition-colors ${
                itemIndex <= index ? "bg-navy-700" : "bg-line-2"
              }`}
            />
          ))}
        </div>
        <ol className="mt-2.5 hidden grid-cols-6 gap-1.5 sm:grid">
          {STEP_ORDER.slice(0, totalSteps).map((item, itemIndex) => (
            <li
              key={item}
              className={`truncate text-[10px] font-medium ${
                itemIndex === index ? "text-navy-800" : "text-muted"
              }`}
            >
              {t(STEP_LABEL[item])}
            </li>
          ))}
        </ol>
      </div>

      <section key={step} className="animate-slide mx-auto max-w-[860px]">
        <header>
          <h1 className="text-[2rem] font-bold leading-[1.08] tracking-[-0.035em] text-navy-900 sm:text-[2.65rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2.5 max-w-3xl text-[15px] leading-7 text-ink-2 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </header>

        <div className="mt-7 space-y-5">{children}</div>

        <div className="mt-8 border-t border-line pt-5">
          <div className="flex items-start gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                aria-label={t("Go back a step")}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-line bg-white text-lg font-semibold text-ink-2 transition hover:border-navy-600/40 hover:bg-navy-50"
              >
                ←
              </button>
            ) : null}
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={onPrimary}
                disabled={primaryDisabled}
                className={`min-h-[50px] w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none ${
                  primaryTone === "amber"
                    ? "bg-saffron-600 hover:bg-saffron-600/90"
                    : "bg-navy-800 hover:bg-navy-700"
                }`}
              >
                {primaryLabel}
              </button>
              {primaryHint ? (
                <p className="mt-1.5 text-center text-xs text-muted">{primaryHint}</p>
              ) : null}
            </div>
          </div>
          {secondary ? <div className="mt-3 text-center">{secondary}</div> : null}
        </div>
      </section>
    </div>
  );
}
