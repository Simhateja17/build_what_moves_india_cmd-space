"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n";
import {
  PaymentRecord,
  formatTime,
  moneyIsGone,
} from "@/lib/payment";

/**
 * Proof. The moment money leaves an account the citizen must have
 * something they can screenshot, read down a phone, or take to a bank —
 * even when no registration number exists yet.
 */
export function MoneyTrail({ record }: { record: PaymentRecord }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const gone = moneyIsGone(record.state);

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(record.ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the number is on screen anyway */
    }
  }

  return (
    <section className="gov-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {t("Your payment record")}
        </p>
        <button
          type="button"
          onClick={copyRef}
          className="text-xs font-semibold text-navy-700 hover:underline"
        >
          {copied ? "Copied ✓" : "Copy reference"}
        </button>
      </div>

      <dl className="divide-y divide-line-2">
        <Row label={t("Reference number")}>
          <span className="font-mono text-[15px] font-semibold text-ink">
            {record.ref}
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            {t("Quote this reference when contacting the department or the bank.")}
          </span>
        </Row>

        <Row label={t("Amount")}>
          <span className="tabular-nums">₹{record.amountInr}</span>
          <span className="ml-2 text-sm text-muted">{record.method}</span>
        </Row>

        <Row label={t("Amount debited")}>
          {gone ? (
            <span className="text-govgreen-700">
              Yes. {record.settledAt ? formatTime(record.settledAt) : "Confirmed"}
            </span>
          ) : record.state === "failed" ? (
            <span className="text-govred-700">{t("No. Nothing was charged.")}</span>
          ) : (
            <span className="text-saffron-600">{t("Confirmation pending with the bank")}</span>
          )}
        </Row>

        {record.bankRef ? (
          <Row label={t("Bank reference")}>
            <span className="font-mono text-sm">{record.bankRef}</span>
            <span className="mt-0.5 block text-xs text-muted">
              {t("This number will be recognised by the bank.")}
            </span>
          </Row>
        ) : null}

        <Row label={t("Started")}>
          <span className="text-[15px] font-normal text-ink-2">
            {formatTime(record.startedAt)}
          </span>
        </Row>

        {record.registrationNumber ? (
          <Row label={t("RTI registration number")}>
            <span className="font-mono text-[15px] font-semibold text-govgreen-700">
              {record.registrationNumber}
            </span>
          </Row>
        ) : null}
      </dl>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-ink">{children}</dd>
    </div>
  );
}
