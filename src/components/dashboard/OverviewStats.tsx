import Link from "next/link";
import { Overview } from "@/lib/dashboard";

/**
 * Five numbers, and only one of them is ever urgent. "Actions required"
 * is the only tile that changes colour, so a glance at the top of the
 * screen answers "is anything waiting on me?" before any reading starts.
 */
export function OverviewStats({ o }: { o: Overview }) {
  const tiles = [
    { label: "Total RTIs", value: o.total, href: "/my-rtis?filter=all" },
    { label: "Active", value: o.active, href: "/my-rtis?filter=active" },
    { label: "Responses", value: o.responses, href: "/my-rtis?filter=response" },
    { label: "Appeals", value: o.appeals, href: "/my-rtis?filter=appeal" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
      {tiles.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          className="lift gov-card px-4 py-3.5 transition hover:border-navy-600/40"
        >
          <p className="text-2xl font-bold tabular-nums leading-none text-navy-900">
            {t.value}
          </p>
          <p className="mt-1.5 text-[12px] font-medium leading-tight text-ink-2">
            {t.label}
          </p>
        </Link>
      ))}

      <Link
        href={o.actions > 0 ? "/my-rtis?filter=action" : "/my-rtis"}
        className={`lift col-span-2 rounded-[var(--radius-panel)] border px-4 py-3.5 shadow-[var(--shadow-panel)] transition sm:col-span-1 ${
          o.actions > 0
            ? "border-govred-600/30 bg-govred-50 hover:border-govred-600/60"
            : "border-line bg-surface hover:border-navy-600/40"
        }`}
      >
        <p
          className={`text-2xl font-bold tabular-nums leading-none ${
            o.actions > 0 ? "text-govred-700" : "text-navy-900"
          }`}
        >
          {o.actions}
        </p>
        <p
          className={`mt-1.5 text-[12px] font-medium leading-tight ${
            o.actions > 0 ? "text-govred-700" : "text-ink-2"
          }`}
        >
          {o.actions > 0 ? "Need your attention" : "Nothing needs you"}
        </p>
      </Link>
    </div>
  );
}
