"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-bold text-slate-900">RTI, plainly</p>
        <p className="mt-1 text-sm text-slate-500">
          A redesign concept for RTI Online. Everything below is mocked for
          this demo — no real government data.
        </p>
        <button
          type="button"
          onClick={() => {
            login();
            router.push("/dashboard");
          }}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500"
        >
          Continue as demo citizen
        </button>
        <p className="mt-3 text-xs text-slate-400">
          No signup, no password — this is a proof of concept.
        </p>
      </div>
    </main>
  );
}
