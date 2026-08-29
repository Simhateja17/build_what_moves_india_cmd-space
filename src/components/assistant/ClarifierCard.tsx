"use client";

import { Clarifier } from "@/lib/assistant/types";
import { useLocale } from "@/lib/i18n";

/**
 * One question, and always a way past it.
 *
 * The rule the flow obeys: ask this only if the answer changes the
 * authority, or fills a token in an ask the citizen has ticked.
 * Skipping is a first-class outcome — it leaves a visible blank in the
 * draft rather than letting us invent a detail on their behalf.
 */
export function ClarifierCard({
  clarifier,
  value,
  skipped,
  onAnswer,
  onSkip,
  tone = "plain",
}: {
  clarifier: Clarifier;
  value?: string;
  skipped: boolean;
  onAnswer: (value: string) => void;
  onSkip: () => void;
  tone?: "plain" | "amber";
}) {
  const { t } = useLocale();
  return (
    <div
      className={`rounded-xl border p-4 ${
        tone === "amber"
          ? "border-saffron-400/40 bg-saffron-50/60"
          : "border-line bg-surface"
      }`}
    >
      <p className="text-[15px] font-semibold text-ink">{t(clarifier.question)}</p>
      {clarifier.help ? (
        <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
          {t(clarifier.help)}
        </p>
      ) : null}

      {clarifier.kind === "text" ? (
        <input
          value={value ?? ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder={clarifier.placeholder ? t(clarifier.placeholder) : undefined}
          className="field-input mt-3"
        />
      ) : (
        <div className="mt-3 space-y-2">
          {clarifier.options?.map((o) => {
            const on = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onAnswer(o.value)}
                className={`flex w-full items-start gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition ${
                  on
                    ? "border-navy-600 bg-navy-50 font-semibold text-navy-800"
                    : "border-line bg-white text-ink hover:border-navy-600/40"
                }`}
              >
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    on ? "border-navy-700" : "border-line"
                  }`}
                >
                  {on ? (
                    <span className="h-2 w-2 rounded-full bg-navy-700" />
                  ) : null}
                </span>
                <span>
                  {t(o.label)}
                  {o.note ? (
                    <span className="mt-0.5 block text-xs font-normal text-muted">
                      {t(o.note)}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
          {clarifier.kind === "period" ? (
            <input
              value={
                value && !["6m", "1y", "3y"].includes(value) ? value : ""
              }
              onChange={(e) => onAnswer(e.target.value)}
              placeholder={t("Or type exact dates, e.g. 01/01/2026 to 30/06/2026")}
              className="field-input"
            />
          ) : null}
        </div>
      )}

      <button
        type="button"
        onClick={onSkip}
        className={`mt-3 text-[13px] font-medium underline ${
          skipped ? "text-saffron-600" : "text-navy-700"
        }`}
      >
        {skipped ? t("Skipped: {label}", undefined, { label: t(clarifier.skipLabel).toLowerCase() }) : t(clarifier.skipLabel)}
      </button>
      {skipped ? (
        <p className="mt-1 text-[13px] leading-relaxed text-saffron-600">
          {t("A blank has been left in this request. It may be completed on the draft screen.")}
        </p>
      ) : null}
    </div>
  );
}
