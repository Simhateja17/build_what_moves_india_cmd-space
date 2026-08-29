"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import { SEED_APPLICANT } from "@/lib/mock-data";
import { useLocale } from "@/lib/i18n";

export default function ProfilePage() {
  const { citizenName, logout, prefs, setPref } = useStore();
  const { overview } = useDashboard();
  const { t } = useLocale();
  const router = useRouter();

  const initials = citizenName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    // A summary rail beside the settings, rather than three columns of
    // unequal height. The old layout nested a grid inside a grid, so the
    // identity card, the stats and the two settings cards each ended
    // where their own content ran out — leaving a block of dead space
    // under the stats and two cards on the right that never lined up.
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
        {t("Profile")}
      </h1>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:items-start">
        {/* Who you are, and the shape of your record. Sticky, so the rail
            keeps pace on a long screen instead of stranding whitespace. */}
        <aside className="space-y-3 lg:sticky lg:top-24">
          <div className="gov-card flex items-center gap-4 p-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-800 text-lg font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold text-ink">{citizenName}</p>
              <p className="truncate text-sm text-ink-2">
                {SEED_APPLICANT.email}
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted">
                {t("Citizen account")}
              </p>
            </div>
          </div>

          {/* Their record at a glance — the same numbers as Home, not new ones */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "RTIs filed", value: overview.total },
              { label: "Answered", value: overview.answered },
              { label: "Appeals", value: overview.appeals },
            ].map((s) => (
              <div key={s.label} className="gov-card px-3 py-3.5 text-center">
                <p className="text-2xl font-bold tabular-nums leading-none text-navy-900">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[12px] leading-tight text-ink-2">
                  {t(s.label)}
                </p>
              </div>
            ))}
          </div>

          {/* Sized to the rail. It was the widest element on the page —
              a destructive action drawn larger than anything it sits
              under. */}
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full rounded-xl border border-govred-600/30 bg-surface px-5 py-3 text-sm font-semibold text-govred-700 transition hover:bg-govred-50"
          >
            {t("Sign out")}
          </button>

          <p className="px-1 pt-1 text-[12px] leading-relaxed text-muted">
            {t(
              "This is a redesign concept. Nothing here reaches a real government system, and no data leaves your browser.",
            )}
          </p>
        </aside>

        <div className="space-y-6">
          <section>
            <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
              {t("Your account")}
            </h2>
            <div className="gov-card divide-y divide-line-2">
              <Row
                href="/check-payment"
                label={t("Payments")}
                hint={t("Fees paid and their status")}
              />
              <Row
                href="/my-rtis?filter=answered"
                label={t("Saved responses")}
                hint={t("Every answer you have received")}
              />
              <Row
                href="/faq"
                label={t("How this works")}
                hint={t("What the law gives you, in plain words")}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
              {t("Preferences")}
            </h2>
            <div className="gov-card divide-y divide-line-2">
              {/* The only preference that changes what the app does, so it
                  leads. The two below describe messages a prototype with no
                  backend cannot send — they are remembered, and say so,
                  rather than presenting a switch that quietly does nothing. */}
              <Toggle
                label={t("Show official terms")}
                hint={t("Department wording under every status")}
                on={prefs.showOfficialTerms}
                onChange={(v) => setPref("showOfficialTerms", v)}
              />
              <Toggle
                label={t("Email updates")}
                hint={`${SEED_APPLICANT.email} · ${t("not sent in this demo")}`}
                on={prefs.emailUpdates}
                onChange={(v) => setPref("emailUpdates", v)}
              />
              <Toggle
                label={t("SMS deadline reminders")}
                hint={`${t("Three days before each deadline")} · ${t("not sent in this demo")}`}
                on={prefs.smsReminders}
                onChange={(v) => setPref("smsReminders", v)}
              />
            </div>
            <p className="mt-2 px-1 text-[12px] leading-relaxed text-muted">
              {t("Preferences are saved on this device.")}
            </p>
          </section>
        </div>
      </div>
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
  const { t } = useLocale();

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-canvas/50"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{t(label)}</span>
        <span className="block text-[13px] text-ink-2">{t(hint)}</span>
      </span>
      <span aria-hidden className="text-muted">
        →
      </span>
    </Link>
  );
}

/**
 * Controlled, and persisted through the store. It used to be
 * `defaultChecked` with no handler — the switch moved, nothing changed,
 * and a reload put it back. A control that cannot be obeyed should not
 * be drawn.
 */
function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (value: boolean) => void;
}) {
  const { t } = useLocale();

  return (
    <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{t(label)}</span>
        <span className="block text-[13px] text-ink-2">{t(hint)}</span>
      </span>
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-govgreen-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-saffron-400 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5"
      />
    </label>
  );
}
