"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { deriveCase } from "@/lib/derive";
import { FileIcon, HelpIcon, HomeIcon } from "./icons";

/* ------------------------------------------------------------------
   Three tabs, fixed to the bottom, never hidden on a tab destination.
   There is no hamburger and no drawer: on a phone a menu you have to
   open is a menu most citizens never find.
------------------------------------------------------------------- */

const TABS = [
  { href: "/dashboard", label: "My RTIs", Icon: FileIcon },
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/faq", label: "Help", Icon: HelpIcon },
] as const;

export function TabBar() {
  const pathname = usePathname();
  const { cases, dayOf, appealOf } = useStore();

  // The badge counts things the citizen must *do*, not things they have
  // not read. It clears when the action is done, not when the screen is
  // opened — an unread badge would train people to ignore it.
  const needsYou = cases.filter((c) => {
    const d = deriveCase(c, dayOf(c.id), appealOf(c.id));
    return d.status === "overdue" || d.status === "appeal_overdue";
  }).length;

  return (
    <nav className="m-tabbar" aria-label="Main">
      {/* Home sits in the middle because the two tabs a returning citizen
          actually uses are their RTIs and help — not the front page. */}
      {[TABS[1], TABS[0], TABS[2]].map(({ href, label, Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        const badge = href === "/dashboard" ? needsYou : 0;
        return (
          <Link
            key={href}
            href={href}
            className="m-tab"
            aria-current={active ? "page" : undefined}
          >
            <span className="relative">
              <Icon className="h-[22px] w-[22px]" />
              {badge > 0 && (
                <span
                  className="absolute -right-2.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-govred-600 px-1 text-[10px] font-bold text-white"
                  aria-hidden
                >
                  {badge}
                </span>
              )}
            </span>
            {label}
            {badge > 0 && (
              <span className="sr-only">, {badge} need your attention</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
