"use client";

import { AssistantStep, STEP_LABEL, STEP_ORDER } from "@/lib/assistant/types";

/**
 * The frame every step renders inside. Mobile-first by construction:
 * one clear column on phones and a step rail beside the working area on
 * larger screens, with a sticky bar holding the single primary action.
 */
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
  const pct = ((index + 1) / totalSteps) * 100;

  return (
    <div className="w-full pb-32">
      {banner}

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <div className="mt-4 rounded-2xl border border-line bg-surface px-4 py-4 shadow-[var(--shadow-panel)] lg:sticky lg:top-32 lg:p-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-2">
            <div
              className="meter-fill h-full rounded-full bg-navy-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            Step {index + 1} of {totalSteps} · {STEP_LABEL[step]}
          </p>
        </div>

        {/* Keyed on the step so each panel enters on its own — the flow
            should feel like moving forward, not like a redraw. */}
        <div key={step} className="animate-slide mt-1 lg:mt-4">
          <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-navy-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-2">{subtitle}</p>
          ) : null}

          <div className="mt-6 space-y-4">{children}</div>
        </div>
      </div>

      {/* The one primary action, always within thumb reach. */}
      <div className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-line bg-surface/95 shadow-[0_16px_50px_rgba(45,87,143,0.2)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)] sm:inset-x-0 sm:bottom-0 sm:rounded-none sm:border-x-0 sm:border-b-0">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-3 px-3 py-3 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 lg:px-10 xl:px-12">
          <span className="hidden lg:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back a step"
              className="rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink-2 transition hover:bg-canvas"
            >
              ←
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={onPrimary}
              disabled={primaryDisabled}
              className={`w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-line disabled:text-muted ${
                primaryTone === "amber"
                  ? "bg-saffron-600 hover:bg-saffron-600/90"
                  : "bg-navy-800 hover:bg-navy-700"
              }`}
            >
              {primaryLabel}
            </button>
            {primaryHint ? (
              <p className="mt-1 text-center text-[11px] text-muted">{primaryHint}</p>
            ) : null}
          </div>
          </div>
        </div>
        {secondary ? (
          <div className="mx-auto w-full max-w-[1600px] px-4 pb-3 text-center lg:pl-[370px] lg:pr-12">
            {secondary}
          </div>
        ) : null}
      </div>
    </div>
  );
}
