"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n";

/* ------------------------------------------------------------------
   The pinned primary action.

   On the old form the Submit button sat at the bottom of a 23-field
   page, so on a phone it was four screens below the fold. Here it is
   fixed to the bottom of the viewport, in thumb reach, at all times.
   One primary; at most one secondary; an optional line of fine print.
------------------------------------------------------------------- */

export function ActionBar({
  children,
  note,
}: {
  children: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <div className="m-actionbar">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-2">
        {children}
        {note && (
          <p className="m-fine text-center leading-snug">{note}</p>
        )}
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  busyLabel,
  busy = false,
  disabled = false,
  disabledReason,
  onClick,
  variant = "navy",
  type = "button",
}: {
  children: React.ReactNode;
  busyLabel?: string;
  busy?: boolean;
  disabled?: boolean;
  /** Shown when a disabled button is tapped, instead of nothing happening. */
  disabledReason?: string;
  onClick?: () => void;
  variant?: "navy" | "go" | "danger" | "ghost";
  type?: "button" | "submit";
}) {
  const [blocked, setBlocked] = useState(false);
  const { t } = useLocale();

  const cls = {
    navy: "m-btn",
    go: "m-btn m-btn--go",
    danger: "m-btn m-btn--danger",
    ghost: "m-btn m-btn--ghost",
  }[variant];

  // The button stays clickable to the browser and refuses in the handler,
  // so a tap on a greyed-out button can say why it is greyed out. A
  // control that does nothing at all is the worst possible answer.
  return (
    <div className="flex flex-col gap-1.5">
      <button
        type={type}
        className={cls}
        aria-disabled={disabled || busy}
        onClick={() => {
          if (busy) return;
          if (disabled) {
            setBlocked(true);
            return;
          }
          setBlocked(false);
          onClick?.();
        }}
      >
        {busy && <span className="m-btn__spin" aria-hidden />}
        {busy ? busyLabel ?? t("Working…") : children}
      </button>
      {blocked && disabledReason && (
        <p className="m-error text-center" role="alert">
          {disabledReason}
        </p>
      )}
    </div>
  );
}
