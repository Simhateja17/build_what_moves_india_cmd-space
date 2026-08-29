"use client";

import { useStore } from "@/lib/store";
import { Stage, StageState } from "@/lib/stages";
import { useLocale } from "@/lib/i18n";

const DOT: Record<StageState, string> = {
  done: "bg-govgreen-600 text-white",
  current: "bg-navy-800 text-white",
  overdue: "bg-govred-600 text-white",
  attention: "bg-saffron-500 text-white",
  pending: "bg-line text-muted",
  skipped: "bg-line-2 text-muted",
};

const MARK: Record<StageState, string> = {
  done: "✓",
  current: "●",
  overdue: "!",
  attention: "!",
  pending: "",
  skipped: "–",
};

const LABEL: Record<StageState, string> = {
  done: "text-ink",
  current: "text-navy-800",
  overdue: "text-govred-700",
  attention: "text-saffron-600",
  pending: "text-muted",
  skipped: "text-muted",
};

const RAIL: Record<StageState, string> = {
  done: "bg-govgreen-600",
  current: "bg-navy-800",
  overdue: "bg-govred-600",
  attention: "bg-saffron-500",
  pending: "bg-line",
  skipped: "bg-line-2",
};

/**
 * Six stages, vertical on every screen size. A horizontal stepper forces
 * six labels into a phone's width and they end up abbreviated into the
 * same jargon this redesign is trying to remove — so it stays vertical
 * and each stage keeps room for a sentence explaining itself.
 */
export function StageTimeline({ stages }: { stages: Stage[] }) {
  const { prefs } = useStore();
  const { t } = useLocale();

  return (
    <ol className="relative">
      {stages.map((s, i) => {
        const last = i === stages.length - 1;
        return (
          <li key={s.key} className="relative flex gap-3.5 pb-5 last:pb-0">
            {/* Rail joining this stage to the next */}
            {!last ? (
              <span
                aria-hidden
                className={`absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 ${RAIL[stages[i + 1].state === "pending" || stages[i + 1].state === "skipped" ? "pending" : s.state]}`}
              />
            ) : null}

            <span
              key={s.state}
              className={`animate-pop relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${DOT[s.state]}`}
            >
              {MARK[s.state] || i + 1}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className={`text-[15px] font-semibold leading-tight ${LABEL[s.state]}`}>
                {t(s.label)}
                {s.state === "current" ? (
                  <span className="ml-2 rounded bg-navy-50 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-navy-800">
                    {t("Now")}
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                {t(s.note)}
              </p>
              {prefs.showOfficialTerms ? (
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted">
                  {s.official}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
