 import { PaymentState } from "@/lib/payment";

type StepState = "pending" | "active" | "done" | "failed" | "stuck";

/** Two steps, because a citizen's money and their RTI are two different things. */
const STEPS: Record<PaymentState, [StepState, StepState]> = {
  payment: ["pending", "pending"],
  processing: ["active", "pending"],
  paid: ["done", "active"],
  pending_registration: ["done", "stuck"],
  failed: ["failed", "pending"],
  unknown: ["stuck", "pending"],
  registered: ["done", "done"],
};

const DOT: Record<StepState, string> = {
  pending: "bg-line text-muted",
  active: "bg-navy-800 text-white",
  done: "bg-govgreen-600 text-white",
  failed: "bg-govred-600 text-white",
  stuck: "bg-saffron-500 text-white",
};

const LABEL: Record<StepState, string> = {
  pending: "text-muted",
  active: "text-navy-800",
  done: "text-govgreen-700",
  failed: "text-govred-700",
  stuck: "text-saffron-600",
};

const MARK: Record<StepState, string> = {
  pending: "",
  active: "…",
  done: "✓",
  failed: "✕",
  stuck: "!",
};

const NOTE: Record<StepState, string> = {
  pending: "Not started",
  active: "In progress",
  done: "Complete",
  failed: "Not completed",
  stuck: "Delayed",
};

export function PaymentProgress({ state }: { state: PaymentState }) {
  const [feeStep, regStep] = STEPS[state];
  const steps: Array<{ title: string; s: StepState }> = [
    { title: "Fee paid", s: feeStep },
    { title: "RTI registered", s: regStep },
  ];

  return (
    <ol className="flex gap-3">
      {steps.map((step, i) => (
        <li key={step.title} className="flex flex-1 items-start gap-2.5">
          <span
            key={step.s}
            className={`animate-pop mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${DOT[step.s]}`}
          >
            {MARK[step.s] || i + 1}
          </span>
          <span className="min-w-0">
            <span className={`block text-sm font-semibold ${LABEL[step.s]}`}>
              {step.title}
            </span>
            <span className="block text-xs text-muted">{NOTE[step.s]}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
