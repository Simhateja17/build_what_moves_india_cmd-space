"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";

export default function ProfilePage() {
  const { citizenName, logout } = useStore();
  const { overview } = useDashboard();
  const router = useRouter();

  const initials = citizenName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
        Profile
      </h1>

      <div className="gov-card flex items-center gap-4 p-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-800 text-lg font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-lg font-bold text-ink">{citizenName}</p>
          <p className="truncate text-sm text-ink-2">ananya.sharma@example.in</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted">
            Citizen account
          </p>
        </div>
      </div>

      {/* Their record at a glance — the same numbers as Home, not new ones */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "RTIs filed", value: overview.total },
          { label: "Answered", value: overview.responses },
          { label: "Appeals", value: overview.appeals },
        ].map((s) => (
          <div key={s.label} className="gov-card px-4 py-3.5 text-center">
            <p className="text-2xl font-bold tabular-nums leading-none text-navy-900">
              {s.value}
            </p>
            <p className="mt-1.5 text-[12px] leading-tight text-ink-2">{s.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
          Your account
        </h2>
        <div className="gov-card divide-y divide-line-2">
          <Row href="/check-payment" label="Payments" hint="Fees paid and their status" />
          <Row href="/my-rtis?filter=response" label="Saved responses" hint="Every answer you have received" />
          <Row href="/about" label="How this works" hint="What the law gives you, in plain words" />
        </div>
      </section>

      <section>
        <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
          Preferences
        </h2>
        <div className="gov-card divide-y divide-line-2">
          <Toggle label="Email me updates" hint="ananya.sharma@example.in" on />
          <Toggle label="SMS me deadline reminders" hint="Three days before each deadline" on />
          <Toggle label="Show official terms" hint="Department wording under every status" on />
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="w-full rounded-xl border border-govred-600/30 bg-surface px-5 py-3.5 text-[15px] font-semibold text-govred-700 transition hover:bg-govred-50"
      >
        Sign out
      </button>

      <p className="pb-2 text-center text-xs leading-relaxed text-muted">
        This is a redesign concept. Nothing here reaches a real government
        system, and no data leaves your browser.
      </p>
    </div>
  );
}

function Row({
  href,
  label,
  hint,
}: {
  href: string;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-canvas/50"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{label}</span>
        <span className="block text-[13px] text-ink-2">{hint}</span>
      </span>
      <span aria-hidden className="text-muted">
        →
      </span>
    </Link>
  );
}

/** Presentational only — the prototype has no backend to persist to. */
function Toggle({
  label,
  hint,
  on,
}: {
  label: string;
  hint: string;
  on?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{label}</span>
        <span className="block text-[13px] text-ink-2">{hint}</span>
      </span>
      <input type="checkbox" defaultChecked={on} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-govgreen-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-saffron-400 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5"
      />
    </label>
  );
}
