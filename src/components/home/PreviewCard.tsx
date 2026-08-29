"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   The framed panel the hero slides carry, and the full-size dialog
   behind its expand button.

   The body is a render prop taking the mode, so a card can show one
   thing at hero size and another at full size — the flowchart animates
   in the card but opens finished, because someone who has clicked
   expand wants to read it, not watch it.
------------------------------------------------------------------- */

export function PreviewCard({
  eyebrow,
  title,
  footer,
  children,
}: {
  eyebrow: string;
  title: string;
  /** Shown only in the expanded view, where there is room for it. */
  footer?: string;
  children: (mode: "card" | "full") => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-[10px] border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line bg-navy-50/50 px-4 py-1.5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {eyebrow}
            </p>
            <p className="text-[14px] font-semibold text-ink">{title}</p>
          </div>

          {/* At hero size the type inside is small. This opens the same
              drawing at full size for anyone who wants to read it properly. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Open “${title}” at full size`}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-2 transition hover:bg-white hover:text-navy-800"
          >
            <ExpandIcon />
          </button>
        </div>

        <div className="px-3 py-2.5">{children("card")}</div>
      </div>

      {open ? (
        <PreviewDialog
          eyebrow={eyebrow}
          title={title}
          footer={footer}
          onClose={() => setOpen(false)}
        >
          {children("full")}
        </PreviewDialog>
      ) : null}
    </>
  );
}

/**
 * Escape and the backdrop both close it, focus moves to the close button on
 * open and back to the trigger on the way out, and the page behind cannot
 * scroll while it is up.
 */
function PreviewDialog({
  eyebrow,
  title,
  footer,
  onClose,
  children,
}: {
  eyebrow: string;
  title: string;
  footer?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        // The backdrop closes on click; the panel must not pass its own
        // clicks up to it.
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-[1240px] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-panel-lg)]"
      >
        <div className="flex items-center gap-4 border-b border-line px-5 py-3.5 sm:px-7">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {eyebrow}
            </p>
            <p className="text-lg font-bold text-navy-900">{title}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition hover:bg-navy-50 hover:text-navy-900"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-auto p-4 sm:p-7">{children}</div>

        {footer ? (
          <div className="border-t border-line px-5 py-3 sm:px-7">
            <p className="text-[13px] text-ink-2">{footer}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
