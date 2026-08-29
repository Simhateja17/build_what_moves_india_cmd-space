import {
  AnswerTone,
  PAYMENT_COPY,
  PaymentRecord,
  QUESTION_LABELS,
  addWorkingDays,
  formatDay,
} from "@/lib/payment";
import { PaymentProgress } from "./PaymentProgress";
import { useLocale } from "@/lib/i18n";

const PANEL_TONE: Record<AnswerTone, string> = {
  good: "border-govgreen-600/30 bg-govgreen-50",
  warn: "border-saffron-400/50 bg-saffron-50",
  danger: "border-govred-600/25 bg-govred-50",
  info: "border-navy-600/20 bg-navy-50",
  neutral: "border-line bg-surface",
  muted: "border-line bg-surface",
};

const HEADLINE_TONE: Record<AnswerTone, string> = {
  good: "text-govgreen-700",
  warn: "text-saffron-600",
  danger: "text-govred-700",
  info: "text-navy-800",
  neutral: "text-navy-900",
  muted: "text-ink-2",
};

const ANSWER_TONE: Record<AnswerTone, string> = {
  good: "text-govgreen-700",
  warn: "text-saffron-600",
  danger: "text-govred-700",
  info: "text-navy-800",
  neutral: "text-ink-2",
  muted: "text-muted",
};

const ANSWER_DOT: Record<AnswerTone, string> = {
  good: "bg-govgreen-600",
  warn: "bg-saffron-500",
  danger: "bg-govred-600",
  info: "bg-navy-600",
  neutral: "bg-muted",
  muted: "bg-line",
};

export function PaymentStatusPanel({
  record,
  children,
}: {
  record: PaymentRecord;
  children?: React.ReactNode;
}) {
  const { t } = useLocale();
  const copy = PAYMENT_COPY[record.state];
  const settleBy = record.settledAt
    ? formatDay(addWorkingDays(record.settledAt, 3))
    : null;

  return (
    <section className={`rounded-[var(--radius-panel)] border ${PANEL_TONE[copy.tone]}`}>
      {/* The one instruction that has to survive a panicked skim. */}
      {copy.banner ? (
        <p
          key={copy.banner}
          className="animate-pop flex items-center gap-2.5 rounded-t-[var(--radius-panel)] bg-govred-600 px-5 py-3.5 text-[15px] font-bold text-white"
        >
          <span aria-hidden className="text-lg leading-none">
            ✋
          </span>
          {copy.banner}
        </p>
      ) : null}

      <div className="p-5 sm:p-6">
        <h2
          key={record.state}
          className={`animate-rise text-xl font-bold leading-snug tracking-tight sm:text-2xl ${HEADLINE_TONE[copy.tone]}`}
        >
          {copy.headline}
        </h2>
        <p className={`mt-1.5 text-[15px] font-semibold ${ANSWER_TONE[copy.tone]}`}>
          {copy.lead}
        </p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted">
          {copy.official}
        </p>

        <div className="mt-5 rounded-[10px] border border-line bg-surface p-4">
          <PaymentProgress state={record.state} />
        </div>

        {/* The four questions. Never fewer than four, never unanswered. */}
        <dl className="mt-4 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2">
          {QUESTION_LABELS.map(({ key, question }) => {
            const answer = copy.answers[key];
            return (
              <div key={key} className="bg-surface p-4">
                <dt className="text-[13px] font-bold text-ink">{question}</dt>
                <dd
                  className={`mt-1.5 flex gap-2 text-[13px] leading-relaxed ${ANSWER_TONE[answer.tone]}`}
                >
                  <span
                    aria-hidden
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${ANSWER_DOT[answer.tone]}`}
                  />
                  <span>{answer.value}</span>
                </dd>
              </div>
            );
          })}
        </dl>

        {copy.guarantee ? (
          <div className="mt-4 rounded-[10px] border border-navy-600/15 bg-navy-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-800/70">
              {t("Payment protection")}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-navy-800">
              {copy.guarantee}
              {settleBy && copy.isWorking ? (
                <>
                  {" "}
                  <strong>That deadline is {settleBy}.</strong>
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </section>
  );
}
