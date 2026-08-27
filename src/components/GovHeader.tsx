"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RtiLogo } from "./RtiLogo";
import { useStore } from "@/lib/store";

const NAV = [
  // Product decision: the text navigation labelled Home opens the citizen
  // dashboard; the RTI brand mark below returns to the public home screen.
  { href: "/dashboard", label: "Home" },
  { href: "/start-rti", label: "Submit Request" },
  { href: "/my-rtis?filter=appeal", label: "Submit First Appeal" },
  { href: "/view-status", label: "View Status" },
  { href: "/my-rtis", label: "View History" },
  { href: "/login", label: "Login" },
  { href: "/about", label: "User Manual" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
];

export function GovHeader() {
  const { isAuthenticated, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();

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

        <nav className="ml-auto hidden min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] md:flex">
          {NAV.map((item) => {
              const itemPath = item.href.split("?")[0];
              const active = pathname.startsWith(itemPath);
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={`shrink-0 whitespace-nowrap rounded-md px-2 py-2 text-[12px] font-medium transition xl:px-2.5 xl:text-[13px] ${
                    active
                      ? "bg-navy-50 text-navy-900"
                      : "text-ink-2 hover:bg-navy-50 hover:text-navy-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          {isAuthenticated ? (
            <div className="ml-2 flex items-center border-l border-line pl-3">
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="whitespace-nowrap text-[13px] font-medium text-ink-2 hover:text-navy-900 hover:underline"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </nav>

        {/* Compact action for narrow screens */}
        <div className="ml-auto md:hidden">
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
