"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export function Header() {
  const { logout } = useStore();
  const router = useRouter();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="flex flex-col leading-none">
          <span className="text-lg font-bold text-slate-900">RTI, plainly</span>
          <span className="text-[11px] uppercase tracking-wide text-slate-400">
            An unofficial redesign concept for RTI Online
          </span>
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
