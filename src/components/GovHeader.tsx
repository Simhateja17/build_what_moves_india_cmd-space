"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RtiLogo } from "./RtiLogo";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import { useLocale } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";

/**
 * Four destinations, because this app does three things: file a request,
 * watch the ones you have, and get help when you are stuck.
 *
 * It used to be seven, in a sidebar. Three of those seven ("File a new
 * RTI", "Guided help", "Find department") were the same filing flow
 * entered at three different depths; two more ("My RTIs", "My appeals")
 * were the same list, and "My appeals" did not even filter to appeals.
 */
const NAV = [
  { href: "/dashboard", key: "nav.home" },
  { href: "/start-rti", key: "nav.file" },
  { href: "/my-rtis", key: "nav.requests" },
  { href: "/faq", key: "nav.help" },
];

export function GovHeader() {
  const { isAuthenticated, citizenName, logout } = useStore();
  const { unreadNotifications } = useDashboard();
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // The filing flow spans several routes; all of them keep "File a request"
  // lit, so the citizen never loses their place mid-form.
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/start-rti") {
      return ["/start-rti", "/assistant", "/file-request", "/find-department"].some(
        (p) => pathname.startsWith(p),
      );
    }
    if (href === "/my-rtis") {
      return pathname.startsWith("/my-rtis") || pathname.startsWith("/requests");
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="gov-header-surface sticky top-0 z-40 border-b border-line text-navy-900 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-5 px-4 py-2 sm:px-8 lg:gap-8 lg:px-10 xl:px-12">
        <Link
          href="/"
          aria-label="Right to Information home"
          className="-my-1 block shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
        >
          <RtiLogo priority />
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto hidden min-w-0 items-center gap-1 md:flex"
        >
          {isAuthenticated
            ? NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-semibold transition ${
                      active
                        ? "text-navy-900"
                        : "text-ink-2 hover:bg-navy-50 hover:text-navy-900"
                    }`}
                  >
                    {t(item.key)}
                    {/* An underline, not a size change: the sidebar used to
                        grow its active item, so the nav reflowed on every
                        page change. */}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-navy-800"
                      />
                    ) : null}
                  </Link>
                );
              })
            : null}

          <span className="ml-2">
            <LanguageToggle />
          </span>

          {isAuthenticated ? (
            <>
              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition hover:bg-navy-50 hover:text-navy-900"
              >
                <BellIcon />
                {unreadNotifications > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-govred-600 px-1 text-[10px] font-bold text-white">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                ) : null}
              </Link>

              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-[13px] font-medium text-ink-2 transition hover:bg-navy-50 hover:text-navy-900"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-100 text-[12px] font-bold text-navy-700">
                    {citizenName.charAt(0)}
                  </span>
                  <span className="max-w-[110px] truncate">{citizenName}</span>
                </button>

                {menuOpen ? (
                  <>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-[var(--shadow-panel-lg)]"
                    >
                      <Link
                        href="/profile"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-[13px] font-medium text-ink hover:bg-navy-50"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                          router.push("/");
                        }}
                        className="block w-full px-4 py-2.5 text-left text-[13px] font-medium text-ink hover:bg-navy-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-1 shrink-0 whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-medium text-ink-2 transition hover:bg-navy-50 hover:text-navy-900"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Compact action for narrow screens */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <LanguageToggle />
          {isAuthenticated ? (
            <Link
              href="/start-rti"
              className="rounded-xl bg-navy-900 px-3.5 py-2.5 text-sm font-bold text-white shadow-sm"
            >
              + File RTI
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-navy-900 px-3.5 py-2.5 text-sm font-semibold text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="tricolour-rule opacity-80" />
    </header>
  );
}

function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
