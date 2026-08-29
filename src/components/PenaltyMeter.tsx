"use client";

import { PenaltyView, formatInr } from "@/lib/derive";
import { PENALTY_CAP_INR, PENALTY_PER_DAY_INR } from "@/lib/types";
import { CountUp } from "./CountUp";
import { useLocale } from "@/lib/i18n";

export function PenaltyMeter({
  penalty,
  officer,
}: {
  penalty: PenaltyView;
  officer: string;
}) {
  const { t } = useLocale();
  const pct = Math.min(100, (penalty.accruedInr / PENALTY_CAP_INR) * 100);

  return (
    <section className="overflow-hidden rounded-xl border border-govred-700/25 bg-white">
      <div className="border-b border-govred-700/15 bg-govred-50 px-5 py-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-govred-700/80">
              {t("Penalty accruing against the officer")}
            </p>
            <p className="mt-1 text-4xl font-bold tabular-nums text-govred-700">
              <CountUp value={penalty.accruedInr} format={formatInr} />
            </p>
          </div>
          <p className="text-sm text-govred-700">
            {penalty.daysLate} day{penalty.daysLate === 1 ? "" : "s"} late ·{" "}
            {formatInr(PENALTY_PER_DAY_INR)}/day
            {penalty.atCap ? " · at the legal cap" : ""}
          </p>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/70">
          <div
            className="meter-fill h-full rounded-full bg-govred-600"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-govred-700/70">
          {formatInr(penalty.accruedInr)} of the {formatInr(PENALTY_CAP_INR)}{" "}
          statutory maximum
        </p>
      </div>

      <div className="px-5 py-4">
        <p className="text-sm leading-relaxed text-ink-2">
          Under <strong>{t("Section 20 of the RTI Act, 2005")}</strong>, a Public
          Information Officer who fails to answer within the time limit without
          reasonable cause is liable to a penalty of {formatInr(
            PENALTY_PER_DAY_INR,
          )}{" "}
          per day, up to {formatInr(PENALTY_CAP_INR)} — recoverable from their
          salary, and imposed by the Information Commission.
        </p>
        <p className="mt-2 text-sm text-muted">
          Answerable here: <span className="font-medium text-ink">{officer}</span>
        </p>
        <p className="mt-3 rounded-md bg-canvas px-3 py-2 text-[13px] text-ink-2">
          {t("This right already exists. The current portal never shows it to you — so almost nobody claims it.")}
        </p>
      </div>
    </section>
  );
}
