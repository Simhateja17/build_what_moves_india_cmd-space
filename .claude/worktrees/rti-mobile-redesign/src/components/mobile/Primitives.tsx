"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIcon, TickIcon } from "./icons";

/* ------------------------------------------------------------------
   The small parts every mobile screen is assembled from.
------------------------------------------------------------------- */

/** A whole-card radio or checkbox. The card is the hit area, not the dot. */
export function ChoiceCard({
  checked,
  onChange,
  title,
  detail,
  kind = "radio",
}: {
  checked: boolean;
  onChange: () => void;
  title: React.ReactNode;
  detail?: React.ReactNode;
  kind?: "radio" | "check";
}) {
  return (
    <button
      type="button"
      role={kind === "radio" ? "radio" : "checkbox"}
      aria-checked={checked}
      onClick={onChange}
      className="m-choice"
    >
      {kind === "radio" ? (
        <span className="m-dot" aria-hidden />
      ) : (
        <span className="m-box" aria-hidden>
          {checked ? "✓" : ""}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold leading-snug text-ink">
          {title}
        </span>
        {detail && (
          <span className="mt-0.5 block text-[15px] leading-snug text-ink-2">
            {detail}
          </span>
        )}
      </span>
    </button>
  );
}

/** Label, input, helper — and the error replaces the helper, on blur. */
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="m-label">{label}</span>
      {children}
      {error ? (
        <p className="m-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="m-fine mt-1.5">{hint}</p>
      )}
    </div>
  );
}

/**
 * A registration number. It is the one string a citizen must keep, so it
 * is set in tabular mono, selectable whole, and copyable with a control
 * big enough to hit while walking.
 */
export function RegNumber({
  value,
  label = "Your RTI number",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the number is still selectable on screen */
    }
  }

  return (
    <div className="m-card m-card--stripe">
      <p className="m-eyebrow">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="m-mono min-w-0 flex-1 select-all break-all text-[17px] font-semibold text-navy-900">
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          className="m-tap -mr-2 shrink-0 rounded-lg text-navy-800"
          aria-label={copied ? "Number copied" : "Copy this number"}
        >
          {copied ? (
            <TickIcon className="h-5 w-5 text-govgreen-700" />
          ) : (
            <CopyIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <p className="m-fine mt-1" aria-live="polite">
        {copied ? "Number copied." : "Keep this. You need it to track and to appeal."}
      </p>
    </div>
  );
}

/**
 * A bottom sheet. Help has to arrive without costing the citizen their
 * draft or their scroll position, so it is never a new page.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    // Back closes the sheet only — it is never a navigation step.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="m-sheet-scrim" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="m-sheet"
      >
        <div className="m-sheet__grab" aria-hidden />
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3">
          <h2 className="m-h2">{title}</h2>
          {children}
        </div>
      </div>
    </>
  );
}

/** Skeletons in the shape of what is loading, never a lone spinner. */
export function CardSkeleton() {
  return (
    <div className="m-card m-card--stripe flex flex-col gap-2.5">
      <div className="m-skel h-4 w-24" />
      <div className="m-skel h-4 w-full" />
      <div className="m-skel h-4 w-2/3" />
      <div className="m-skel h-2 w-full" />
    </div>
  );
}

/** Full-width strip under the top bar. Never a modal, never blocking. */
export function Banner({
  tone = "warn",
  children,
  action,
}: {
  tone?: "warn" | "bad" | "good";
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const cls = {
    warn: "bg-saffron-50 text-[#7c3a06] border-b border-[#f5d9b8]",
    bad: "bg-govred-50 text-[#912018] border-b border-[#f3c7c3]",
    good: "bg-govgreen-50 text-govgreen-700 border-b border-[#c9ecc5]",
  }[tone];

  return (
    <div className={cls} role="status">
      <div className="m-col flex items-center gap-3 py-2.5 text-[15px] leading-snug">
        <span className="flex-1">{children}</span>
        {action}
      </div>
    </div>
  );
}

/** Watches the connection so cached content can stay on screen. */
export function useOnline(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  return online;
}
