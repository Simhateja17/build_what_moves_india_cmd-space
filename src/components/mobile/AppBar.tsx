"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackIcon } from "./icons";
import { useLocale } from "@/lib/i18n";

/* ------------------------------------------------------------------
   Three top-bar patterns and nothing else.

   root   — screen name, no back button. Tab destinations.
   task   — back, "Step n of N", Save & exit. Filing and appeal.
   detail — back that names its parent, so the citizen knows where the
            arrow goes before they press it.
------------------------------------------------------------------- */

function Bar({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-navy-800 text-white">
      <div className="m-col flex min-h-[52px] items-center gap-2 py-2">
        {children}
      </div>
      <div className="tricolour-rule" />
    </header>
  );
}

export function RootBar({ title }: { title: string }) {
  const { locale } = useLocale();
  return (
    <Bar>
      <h1 className="truncate text-[17px] font-bold tracking-tight">{title}</h1>
      <span className="ml-auto text-[13px] font-medium text-white/70">
        {locale === "hi" ? "हिन्दी" : "EN"}
      </span>
    </Bar>
  );
}

/** Back that names where it goes — "← My RTIs", not a bare arrow. */
export function DetailBar({
  backHref,
  backLabel,
  action,
}: {
  backHref: string;
  backLabel: string;
  action?: React.ReactNode;
}) {
  return (
    <Bar>
      <Link
        href={backHref}
        className="m-tap -ml-3 justify-start gap-1 pr-2 text-[15px] font-semibold"
      >
        <BackIcon className="h-5 w-5" />
        <span className="truncate">{backLabel}</span>
      </Link>
      {action && <div className="ml-auto">{action}</div>}
    </Bar>
  );
}

export function TaskBar({
  step,
  total,
  onBack,
  exitHref = "/dashboard",
  exitLabel = "Save & exit",
}: {
  step: number;
  total: number;
  onBack?: () => void;
  exitHref?: string;
  exitLabel?: string;
}) {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <>
      <Bar>
        <button
          type="button"
          onClick={() => (onBack ? onBack() : router.back())}
          className="m-tap -ml-3 justify-start"
          aria-label={t("Go back one step")}
        >
          <BackIcon className="h-5 w-5" />
        </button>
        <p className="text-[15px] font-semibold" aria-live="polite">
          {t("Step {step} of {total}", undefined, { step, total })}
        </p>
        <Link
          href={exitHref}
          className="m-tap -mr-3 ml-auto justify-end text-[13px] font-medium text-white/75"
        >
          {exitLabel}
        </Link>
      </Bar>
      {/* The progress rule replaces the desktop sidebar stepper. It says
          how far along you are without spending a third of the screen. */}
      <div
        className="m-progress sticky top-[55px] z-30"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-valuetext={t("Step {step} of {total}", undefined, { step, total })}
      >
        <i style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </>
  );
}
