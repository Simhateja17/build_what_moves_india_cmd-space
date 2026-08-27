"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Emblem } from "./Emblem";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/dashboard", label: "My requests" },
  { href: "/file-request", label: "File a request" },
  { href: "/about", label: "How this works" },
];

export function GovHeader() {
  const { isAuthenticated, citizenName, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="bg-white">
      {/* Utility strip — the small print real government sites carry. */}
      <div className="bg-navy-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px]">
          <p className="tracking-wide">
            भारत सरकार <span className="opacity-50">|</span> Government of India
            <span className="ml-2 rounded bg-saffron-400/20 px-1.5 py-0.5 font-semibold uppercase tracking-wider text-saffron-400">
              Redesign concept
            </span>
          </p>
          <div className="flex items-center gap-3 opacity-80">
            <a href="#main" className="hover:underline">
              Skip to content
            </a>
            <span aria-hidden>·</span>
            <span>A A+ A−</span>
            <span aria-hidden>·</span>
            <span>English / हिन्दी</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-navy-800">
            <Emblem />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-tight text-navy-800">
              RTI Saral
            </span>
            <span className="block text-[11px] uppercase tracking-wider text-muted">
              Right to Information, made plain
            </span>
          </span>
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
                      ? "bg-navy-50 text-navy-800"
                      : "text-ink-2 hover:bg-navy-50/60 hover:text-navy-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          {isAuthenticated ? (
            <div className="ml-3 flex items-center gap-3 border-l border-line pl-3">
              <span className="text-sm text-ink-2">{citizenName}</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-sm font-medium text-navy-700 hover:underline"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Sign in
            </Link>
          )}
        </nav>

        {/* Compact action for narrow screens */}
        <div className="md:hidden">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-navy-800 px-3 py-2 text-sm font-semibold text-white"
            >
              My requests
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-navy-800 px-3 py-2 text-sm font-semibold text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="tricolour-rule" />
    </header>
  );
}
