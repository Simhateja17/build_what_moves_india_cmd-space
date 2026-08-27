import Link from "next/link";
import { Overview } from "@/lib/dashboard";

type OverviewKind = "total" | "active" | "response" | "action";

export function OverviewStats({ o }: { o: Overview }) {
  const tiles: Array<{
    label: string;
    detail: string;
    value: number;
    href: string;
    kind: OverviewKind;
    surface: string;
    icon: string;
    valueTone: string;
  }> = [
    {
      label: "Total applications",
      detail: "All RTI applications you have filed",
      value: o.total,
      href: "/my-rtis?filter=all",
      kind: "total",
      surface: "border-navy-600/20 bg-navy-50/60",
      icon: "bg-[#dfeaff] text-navy-700",
      valueTone: "text-navy-900",
    },
    {
      label: "Under process",
      detail: "Applications currently being processed",
      value: o.active,
      href: "/my-rtis?filter=active",
      kind: "active",
      surface: "border-govgreen-600/20 bg-govgreen-50/55",
      icon: "bg-[#dff3e5] text-govgreen-700",
      valueTone: "text-govgreen-700",
    },
    {
      label: "Information received",
      detail: "Applications with a response received",
      value: o.responses,
      href: "/my-rtis?filter=response",
      kind: "response",
      surface: "border-[#7447b8]/15 bg-[#faf7ff]",
      icon: "bg-[#eee5ff] text-[#7447b8]",
      valueTone: "text-[#7447b8]",
    },
    {
      label: o.actions > 0 ? "Action required" : "Nothing needs you",
      detail:
        o.actions > 0
          ? "Applications that need your action"
          : "Every clock is running on the government’s side",
      value: o.actions,
      href: o.actions > 0 ? "/my-rtis?filter=action" : "/my-rtis",
      kind: "action",
      surface:
        o.actions > 0
          ? "border-saffron-500/25 bg-saffron-50/60"
          : "border-line bg-surface",
      icon:
        o.actions > 0
          ? "bg-[#fff0d8] text-saffron-600"
          : "bg-navy-50 text-navy-700",
      valueTone: o.actions > 0 ? "text-saffron-600" : "text-navy-900",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <Link
          key={tile.label}
          href={tile.href}
          className={`lift flex min-h-[132px] items-start gap-4 rounded-[var(--radius-panel)] border p-5 shadow-[var(--shadow-panel)] transition hover:-translate-y-0.5 ${tile.surface}`}
        >
          <span
            aria-hidden
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tile.icon}`}
          >
            <OverviewIcon kind={tile.kind} />
          </span>
          <span className="min-w-0">
            <span className={`block text-2xl font-bold tabular-nums leading-none ${tile.valueTone}`}>
              {tile.value}
            </span>
            <span className="mt-1.5 block text-[12px] font-bold leading-tight text-ink">
              {tile.label}
            </span>
            <span className="mt-1.5 block text-[11px] leading-relaxed text-ink-2">
              {tile.detail}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function OverviewIcon({ kind }: { kind: OverviewKind }) {
  if (kind === "active") {
    return (
      <svg viewBox="0 0 28 28" className="h-6 w-6" fill="none">
        <path d="M8 4h12M8 24h12M9 5c0 5 2 7 5 9-3 2-5 4-5 9m10-18c0 5-2 7-5 9 3 2 5 4 5 9" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === "response") {
    return (
      <svg viewBox="0 0 28 28" className="h-6 w-6" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="m9 14 3 3 7-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === "action") {
    return (
      <svg viewBox="0 0 28 28" className="h-6 w-6" fill="none">
        <path d="M8 20h12l-1.5-2.5V12a4.5 4.5 0 0 0-9 0v5.5L8 20Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="M12 23h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" className="h-6 w-6" fill="none">
      <path d="M7 4h12l3 3v17H7V4Z" stroke="currentColor" strokeWidth="2" />
      <path d="M11 10h7M11 14h7M11 18h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
