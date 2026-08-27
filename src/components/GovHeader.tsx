"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RtiLogo } from "./RtiLogo";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/my-rtis", label: "My RTIs" },
  { href: "/notifications", label: "Updates" },
  { href: "/profile", label: "Profile" },
];

export function GovHeader() {
  const { isAuthenticated, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/92 text-navy-900 shadow-[0_8px_30px_rgba(19,36,61,0.06)] backdrop-blur-xl">
      {/* Utility strip — the small print real government sites carry. */}
      <div className="bg-navy-900 text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 px-4 py-1.5 text-[10px] sm:px-8 sm:text-[11px] lg:px-10 xl:px-12">
          <p className="truncate tracking-wide text-white/75">
            भारत सरकार <span className="opacity-50">|</span> Government of India
            <span className="ml-2 rounded bg-saffron-400/20 px-1.5 py-0.5 font-semibold uppercase tracking-wider text-saffron-400">
              Redesign concept
            </span>
          </p>
          <div className="hidden items-center gap-3 text-white/70 sm:flex">
            <a href="#main" className="hover:text-white hover:underline">
              Skip to content
            </a>
            <span aria-hidden>·</span>
            <span>A A+ A−</span>
            <span aria-hidden>·</span>
            <span>English / हिन्दी</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-2 sm:px-8 lg:px-10 xl:px-12">
        <Link
          href="/"
          aria-label="Right to Information home"
          className="-my-1 block shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
        >
          <RtiLogo priority />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {isAuthenticated &&
            NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-navy-900 text-white shadow-sm"
                      : "text-ink-2 hover:bg-navy-50 hover:text-navy-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          {isAuthenticated ? (
            <div className="ml-3 flex items-center gap-3 border-l border-line pl-3">
              <Link
                href="/start-rti"
                className="rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-700"
              >
                + File an RTI
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-sm font-medium text-ink-2 hover:text-navy-900 hover:underline"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
            >
              Sign in
            </Link>
          )}
        </nav>

        {/* Compact action for narrow screens */}
        <div className="md:hidden">
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
