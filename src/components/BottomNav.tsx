"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/my-rtis", label: "My RTIs", icon: FilesIcon },
  { href: "/notifications", label: "Alerts", icon: BellIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

/**
 * Mobile only. Four destinations, thumb-reachable, each a 56px target
 * with a label — icon-only navigation fails badly for first-time users
 * of a government service, which is most of them.
 */
export function BottomNav({ alerts = 0 }: { alerts?: number }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-3 z-40 overflow-hidden rounded-2xl border border-line bg-surface/94 shadow-[0_16px_50px_rgba(19,36,61,0.2)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-lg">
        {TABS.map((t) => {
          const active =
            t.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(t.href);
          const Icon = t.icon;
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-[60px] flex-col items-center justify-center gap-0.5 transition ${
                  active ? "text-navy-800" : "text-muted"
                }`}
              >
                <span className="relative">
                  <Icon filled={active} />
                  {t.href === "/notifications" && alerts > 0 ? (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-govred-600 px-1 text-[10px] font-bold text-white">
                      {alerts > 9 ? "9+" : alerts}
                    </span>
                  ) : null}
                </span>
                <span className={`text-[11px] ${active ? "font-bold" : "font-medium"}`}>
                  {t.label}
                </span>
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-4 top-0 h-[3px] rounded-b-full bg-navy-800"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* Inline icons — no icon library, so nothing loads over the network. */

function HomeIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.14 : 0}
      />
    </svg>
  );
}

function FilesIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.14 : 0}
      />
      <path d="M13.5 4v5.5H19" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.14 : 0}
      />
      <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="8.5"
        r="3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.14 : 0}
      />
      <path
        d="M4.5 20c1.2-3.7 4-5.5 7.5-5.5s6.3 1.8 7.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
