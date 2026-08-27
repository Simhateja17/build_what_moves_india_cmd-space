import Link from "next/link";
import { ActionItem, Tone } from "@/lib/dashboard";

const BORDER: Record<Tone, string> = {
  danger: "border-l-govred-600",
  warn: "border-l-saffron-500",
  good: "border-l-govgreen-600",
  info: "border-l-navy-600",
  neutral: "border-l-line",
};

const BUTTON: Record<Tone, string> = {
  danger: "bg-govred-600 hover:bg-govred-700 text-white",
  warn: "bg-saffron-500 hover:bg-saffron-600 text-white",
  good: "bg-govgreen-600 hover:bg-govgreen-700 text-white",
  info: "bg-navy-800 hover:bg-navy-700 text-white",
  neutral: "bg-navy-800 hover:bg-navy-700 text-white",
};

/**
 * The only section allowed to shout. Everything here is something the
 * citizen must do — one item, one sentence, one button. If it cannot be
 * acted on, it belongs in Notifications instead.
 */
export function ActionRequired({ items }: { items: ActionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="gov-card flex items-start gap-3 p-5">
        <span
          aria-hidden
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-govgreen-50 text-sm text-govgreen-700"
        >
          ✓
        </span>
        <div>
          <p className="font-semibold text-ink">Nothing needs you right now</p>
          <p className="mt-0.5 text-sm text-ink-2">
            Every clock is running on the government&apos;s side. We will tell
            you the moment that changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section aria-labelledby="actions-heading">
      <div className="mb-3 flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-full bg-govred-50 text-sm"
        >
          ⚠️
        </span>
        <h2
          id="actions-heading"
          className="text-lg font-bold tracking-tight text-navy-900"
        >
          Action required
        </h2>
        <span className="rounded-full bg-govred-600 px-2 py-0.5 text-[11px] font-bold text-white">
          {items.length}
        </span>
      </div>

      <ul className="space-y-2.5">
        {items.map((a) => (
          <li
            key={a.id}
            className={`gov-card border-l-4 p-4 ${BORDER[a.tone]}`}
          >
            <p className="text-[15px] font-bold leading-snug text-ink">
              {a.title}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
              {a.detail}
            </p>
            {a.ref ? (
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                {a.ref}
              </p>
            ) : null}
            <Link
              href={a.href}
              className={`mt-3 block rounded-lg px-4 py-2.5 text-center text-[13px] font-bold transition sm:inline-block ${BUTTON[a.tone]}`}
            >
              {a.cta}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
