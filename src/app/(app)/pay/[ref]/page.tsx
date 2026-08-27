"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  PAYMENT_COPY,
  PaymentState,
  RTI_FEE_INR,
} from "@/lib/payment";
import { PaymentStatusPanel } from "@/components/payment/PaymentStatusPanel";
import { MoneyTrail } from "@/components/payment/MoneyTrail";

const METHODS = [
  { id: "upi", label: "UPI", hint: "ananya@okhdfc", detail: "UPI · ananya@okhdfc" },
  { id: "card", label: "Debit card", hint: "•••• 4412", detail: "Debit card · •••• 4412" },
  { id: "net", label: "Net banking", hint: "SBI", detail: "Net banking · SBI" },
];

/** What the demo should do once the bank "answers". */
const OUTCOMES: Array<{ state: PaymentState; label: string }> = [
  { state: "pending_registration", label: "Money taken, no number" },
  { state: "paid", label: "Clean success" },
  { state: "failed", label: "Payment failed" },
  { state: "unknown", label: "No answer from bank" },
];

export default function PayPage() {
  const { ref } = useParams<{ ref: string }>();
  const router = useRouter();
  const {
    getPayment,
    setPaymentMethod,
    advancePayment,
    completeRegistration,
  } = useStore();

  const payment = getPayment(ref);

  const [outcome, setOutcome] = useState<PaymentState>("pending_registration");
  const [elapsed, setElapsed] = useState(0);
  const [checking, setChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const state = payment?.state;

  // A visible clock during processing. Silence is what makes people panic,
  // so we always show that something is still happening. Derived from a
  // start stamp rather than reset on exit, so the timer owns no stale state.
  useEffect(() => {
    if (state !== "processing") return;
    const start = Date.now();
    const t = setInterval(() => setElapsed(Date.now() - start), 250);
    return () => clearInterval(t);
  }, [state]);

  if (!payment) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="font-semibold text-ink">
          We could not find that payment.
        </p>
        <Link
          href="/check-payment"
          className="mt-3 inline-block font-medium text-navy-700 hover:underline"
        >
          Check payment status
        </Link>
      </div>
    );
  }

  const copy = PAYMENT_COPY[payment.state];

  function pay() {
    advancePayment(ref, "processing");
    later(() => {
      advancePayment(ref, outcome);
      // A clean success still passes through "paid" — the citizen sees the
      // money confirmed before the registration lands.
      if (outcome === "paid") {
        later(() => {
          const id = completeRegistration(ref);
          if (id) router.prefetch(`/requests/${id}`);
        }, 1800);
      }
    }, 2600);
  }

  /** The manual "is it done yet" check, for a citizen who cannot wait. */
  function checkNow() {
    setChecking(true);
    later(() => {
      setChecking(false);
      const n = checkCount + 1;
      setCheckCount(n);
      // Second check resolves — long enough to feel real, short enough to demo.
      if (n >= 2) {
        if (payment?.state === "unknown") {
          advancePayment(ref, "pending_registration");
        } else {
          completeRegistration(ref);
        }
      }
    }, 1600);
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <p className="text-[11px] uppercase tracking-wider text-muted">
        Step 4 of 4 · Payment
      </p>

      {payment.state === "payment" ? (
        <PayForm
          amount={payment.amountInr}
          method={payment.method}
          onMethod={(m) => setPaymentMethod(ref, m)}
          outcome={outcome}
          onOutcome={setOutcome}
          onPay={pay}
          office={payment.draft.office}
        />
      ) : (
        <div className="mt-3 space-y-4">
          <PaymentStatusPanel record={payment}>
            <Actions
              state={payment.state}
              elapsed={
                payment.state === "processing" ? Math.floor(elapsed / 1000) : 0
              }
              checking={checking}
              onCheck={checkNow}
              onRetry={() => advancePayment(ref, "payment")}
              caseId={payment.caseId}
            />
          </PaymentStatusPanel>

          {payment.state !== "processing" ? (
            <MoneyTrail record={payment} />
          ) : null}

          {/* Where to go when you have had enough of waiting. */}
          {copy.isWorking && payment.state !== "processing" ? (
            <p className="text-center text-sm text-muted">
              You can safely leave this page.{" "}
              <Link
                href="/check-payment"
                className="font-medium text-navy-700 hover:underline"
              >
                Check Payment Status
              </Link>{" "}
              any time, or{" "}
              <Link
                href="/dashboard"
                className="font-medium text-navy-700 hover:underline"
              >
                go to your requests
              </Link>
              .
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   State 1 — Payment
------------------------------------------------------------------- */

function PayForm({
  amount,
  method,
  onMethod,
  outcome,
  onOutcome,
  onPay,
  office,
}: {
  amount: number;
  method: string;
  onMethod: (m: string) => void;
  outcome: PaymentState;
  onOutcome: (s: PaymentState) => void;
  onPay: () => void;
  office: string;
}) {
  return (
    <div className="mt-3 space-y-4">
      <div className="gov-card p-5 sm:p-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">
          Pay ₹{amount} to send this request
        </h1>
        <p className="mt-1.5 text-[15px] text-ink-2">
          The RTI application fee is ₹{RTI_FEE_INR}. That is the whole cost —
          there is nothing else to pay later.
        </p>

        <div className="mt-5 flex items-baseline justify-between rounded-[10px] border border-line bg-canvas px-4 py-3.5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Paying for
            </p>
            <p className="mt-0.5 text-sm font-medium text-ink">
              RTI application fee
            </p>
            <p className="text-xs text-muted">{office}</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-navy-900">
            ₹{amount}
          </p>
        </div>

        <fieldset className="mt-5">
          <legend className="field-label">Pay using</legend>
          <div className="mt-2 space-y-2">
            {METHODS.map((m) => {
              const active = method === m.detail;
              return (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-[10px] border p-3.5 transition ${
                    active
                      ? "border-navy-600 bg-navy-50"
                      : "border-line hover:border-navy-600/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={active}
                    onChange={() => onMethod(m.detail)}
                    className="accent-navy-800"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {m.label}
                    </span>
                    <span className="block text-xs text-muted">{m.hint}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Said before anything can go wrong, so it is already believed
            by the time it matters. */}
        <div className="mt-5 rounded-[10px] border border-govgreen-600/25 bg-govgreen-50 px-4 py-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-govgreen-700/80">
            Before you pay
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-govgreen-700">
            If anything goes wrong, we will tell you exactly what happened and
            whether your money was taken.{" "}
            <strong>You will never be asked to pay twice for one request.</strong>{" "}
            Any payment we cannot turn into an RTI is refunded automatically.
          </p>
        </div>

        <button
          type="button"
          onClick={onPay}
          className="mt-5 w-full rounded-lg bg-navy-800 px-4 py-4 text-[15px] font-bold text-white transition hover:bg-navy-700"
        >
          Pay ₹{amount} and send my request
        </button>
      </div>

      {/* Demo control, in the same navy livery as the time machine. */}
      <section
        aria-label="Demo control"
        className="rounded-xl border border-navy-600/20 bg-navy-800 p-4 text-white"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-saffron-400">
          Demo control · what the bank does next
        </p>
        <p className="mt-0.5 text-sm text-white/70">
          Choose the outcome to walk through. The default is the one that
          breaks people on the real portal.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {OUTCOMES.map((o) => (
            <button
              key={o.state}
              type="button"
              onClick={() => onOutcome(o.state)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                outcome === o.state
                  ? "bg-saffron-400 text-navy-900"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------
   Per-state actions
------------------------------------------------------------------- */

function Actions({
  state,
  elapsed,
  checking,
  onCheck,
  onRetry,
  caseId,
}: {
  state: PaymentState;
  elapsed: number;
  checking: boolean;
  onCheck: () => void;
  onRetry: () => void;
  caseId?: string;
}) {
  if (state === "processing") {
    return (
      <div className="rounded-[10px] border border-navy-600/20 bg-surface px-4 py-3.5 text-center">
        <p className="text-sm font-semibold text-navy-800">
          Talking to your bank… {elapsed}s
        </p>
        <p className="mt-1 text-[13px] text-ink-2">
          {elapsed < 10
            ? "This usually takes about ten seconds."
            : "Taking longer than usual — your money is still safe. Do not close this page."}
        </p>
      </div>
    );
  }

  if (state === "registered" && caseId) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/requests/${caseId}`}
          className="flex-1 rounded-lg bg-navy-800 px-4 py-3.5 text-center text-sm font-bold text-white transition hover:bg-navy-700"
        >
          Track this request
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 rounded-lg border border-line bg-surface px-4 py-3.5 text-center text-sm font-semibold text-navy-800 transition hover:bg-navy-50"
        >
          All my requests
        </Link>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-lg bg-navy-800 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-navy-700"
        >
          Try payment again
        </button>
        <Link
          href="/check-payment"
          className="flex-1 rounded-lg border border-line bg-surface px-4 py-3.5 text-center text-sm font-semibold text-navy-800 transition hover:bg-navy-50"
        >
          Check payment status
        </Link>
      </div>
    );
  }

  // pending_registration, unknown and paid all wait on the portal, so the
  // only useful control is "look again" — never "pay".
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={onCheck}
        disabled={checking}
        className="flex-1 rounded-lg bg-navy-800 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        {checking ? "Checking…" : "Check status now"}
      </button>
      <Link
        href="/dashboard"
        className="flex-1 rounded-lg border border-line bg-surface px-4 py-3.5 text-center text-sm font-semibold text-navy-800 transition hover:bg-navy-50"
      >
        Go to my requests
      </Link>
    </div>
  );
}
