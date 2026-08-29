"use client";

import { useState } from "react";
import { EXAMPLES } from "@/lib/assistant/examples";
import { useLocale } from "@/lib/i18n";

/**
 * Worked examples, readable on their own. A blank box is intimidating
 * in a way a filled one is not, so a first-time filer can read a whole
 * finished request before writing a word of their own.
 */
export function ExampleList({
  onUse,
}: {
  onUse?: (text: string) => void;
}) {
  const { t } = useLocale();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {EXAMPLES.map((e) => {
        const open = openId === e.id;
        return (
          <div key={e.id} className="rounded-xl border border-line">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : e.id)}
              className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
            >
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {e.title}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {e.blurb}
                </span>
              </span>
              <span aria-hidden className="mt-1 text-xs text-muted">
                {open ? "▲" : "▼"}
              </span>
            </button>
            {open ? (
              <div className="border-t border-line-2 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Sent to {e.authority}
                </p>
                <pre className="mt-2.5 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-ink">
                  {e.text}
                </pre>
                {onUse ? (
                  <button
                    type="button"
                    onClick={() => onUse(e.text)}
                    className="btn-secondary mt-3 w-full text-sm"
                  >
                    {t("Use this as a starting point")}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
