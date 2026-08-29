"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RtiLogo } from "./RtiLogo";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import { useLocale } from "@/lib/i18n";
import { GovUtilityBar } from "./GovUtilityBar";

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
  const [lifted, setLifted] = useState(false);

  // Flat while the page is at rest, elevated once content slides underneath.
  // A masthead that carries its shadow all the time reads as a heavy bar
  // sitting on top of the page rather than part of it.
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      data-lifted={lifted || undefined}
      className="gov-header-surface sticky top-0 z-40 text-navy-900 backdrop-blur-xl"
    >
      <GovUtilityBar />

      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-4 px-4 py-2.5 sm:px-8 lg:gap-8 lg:px-10 xl:px-12">
        {/* The official lockup as it is drawn — mark beside its own two-line
            wordmark, in the wordmark's own type. Background removed and the
            artwork's padding trimmed, so the height here sizes the ink and
            not the whitespace that used to surround it. */}
        <Link
          href="/"
          aria-label={t("Right to Information home")}
          className="group -my-1 flex shrink-0 items-center rounded-xl py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
        >
          <RtiLogo
            variant="full"
            priority
            className="h-12 w-auto transition-transform duration-200 group-hover:-translate-y-px sm:h-[68px]"
          />
        </Link>

        <nav
          aria-label={t("Main")}
          className="ml-auto hidden min-w-0 items-center gap-2 md:flex"
        >
          {/* One rail, so the four destinations read as a set rather than four
              loose words strung across the bar. The active page is a raised
              white pill inside it — same footprint as the others, so nothing
              reflows on navigation. */}
          {isAuthenticated ? (
            <div className="flex items-center gap-0.5 rounded-full bg-navy-50 p-1">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                      active
                        ? "bg-surface text-navy-900 shadow-[var(--shadow-panel)]"
                        : "text-ink-2 hover:text-navy-900"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
          ) : null}

          {isAuthenticated ? (
            <span aria-hidden className="mx-1 h-6 w-px bg-line" />
          ) : null}
          {isAuthenticated ? (
            <>
              <Link
                href="/notifications"
                aria-label={t("Notifications")}
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition hover:bg-navy-50 hover:text-navy-900"
              >
                <BellIcon />
                {unreadNotifications > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-govred-600 px-1 text-[10px] font-bold text-white ring-2 ring-surface">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                ) : null}
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 text-[13px] font-semibold transition ${
                    menuOpen
                      ? "border-line bg-navy-50 text-navy-900"
                      : "border-transparent text-ink-2 hover:border-line hover:bg-navy-50 hover:text-navy-900"
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-navy-700 to-navy-900 text-[12px] font-bold text-white">
                    {citizenName.charAt(0)}
                  </span>
                  <span className="max-w-[110px] truncate">{citizenName}</span>
                  <ChevronIcon open={menuOpen} />
                </button>

                {menuOpen ? (
                  <>
                    <button
                      type="button"
                      aria-label={t("Close menu")}
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-[var(--shadow-panel-lg)]"
                    >
                      <p className="truncate px-4 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                        {citizenName}
                      </p>
                      <Link
                        href="/profile"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-[13px] font-medium text-ink hover:bg-navy-50"
                      >
                        {t("Profile")}
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                          router.push("/");
                        }}
                        className="block w-full border-t border-line-2 px-4 py-2.5 text-left text-[13px] font-medium text-ink hover:bg-navy-50"
                      >
                        {t("Sign out")}
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="shrink-0 whitespace-nowrap rounded-full bg-navy-900 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-800"
            >
              {t("Login")}
            </Link>
          )}
        </nav>

        {/* Compact action for narrow screens */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <Link
              href="/start-rti"
              className="rounded-xl bg-navy-900 px-3.5 py-2.5 text-sm font-bold text-white shadow-sm"
            >
              {t("+ File RTI")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-navy-900 px-3.5 py-2.5 text-sm font-semibold text-white"
            >
              {t("Sign in")}
            </Link>
          )}
        </div>
      </div>

      <div className="tricolour-rule" />
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
