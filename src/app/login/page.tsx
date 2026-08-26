"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";
import { useStore } from "@/lib/store";

const DEMO_EMAIL = "ananya.sharma@example.in";
const DEMO_PASSWORD = "rtidemo2026";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  function signIn(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter both your email and password to continue.");
      return;
    }
    login("Ananya Sharma");
    router.push("/dashboard");
  }

  return (
    <>
      <GovHeader />

      <main id="main" className="flex-1">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1fr] lg:py-20">
          {/* Why this exists — a login page should still tell you where you are */}
          <div className="lg:pr-6">
            <h1 className="text-3xl font-bold tracking-tight text-navy-900">
              Sign in to track your RTI requests
            </h1>
            <p className="mt-3 leading-relaxed text-ink-2">
              Everything in this demo is fictional and runs entirely in your
              browser. No government system is contacted, and nothing you type
              is stored anywhere.
            </p>

            <div className="mt-8 gov-card p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                What you will find inside
              </p>
              <ul className="mt-3 space-y-3 text-sm text-ink-2">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600" />
                  <span>
                    <strong className="text-ink">A pension request</strong> still
                    inside its 30-day window — the normal, working case.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-govred-600" />
                  <span>
                    <strong className="text-ink">A request they ignored</strong>{" "}
                    — move the clock forward and watch the penalty run against
                    the officer.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" />
                  <span>
                    <strong className="text-ink">A split request</strong> —
                    one question quietly scattered across three offices.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* The form */}
          <div>
            <form onSubmit={signIn} className="gov-card p-6 sm:p-8">
              <p className="text-lg font-bold text-ink">Citizen sign in</p>
              <p className="mt-1 text-sm text-muted">
                Test credentials are filled in for you.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="field-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="field-input"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="field-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="field-input"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error ? (
                <p className="mt-3 rounded-md bg-govred-50 px-3 py-2 text-sm text-govred-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-navy-800 px-4 py-3.5 font-semibold text-white transition hover:bg-navy-700"
              >
                Sign in
              </button>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-xs uppercase tracking-wider text-muted">
                  or
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <button
                type="button"
                onClick={() => {
                  login("Ananya Sharma");
                  router.push("/dashboard");
                }}
                className="w-full rounded-lg border border-navy-800 px-4 py-3.5 font-semibold text-navy-800 transition hover:bg-navy-50"
              >
                Continue as demo citizen
              </button>

              <div className="mt-6 rounded-lg bg-canvas px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  Test credentials
                </p>
                <p className="mt-1.5 font-mono text-[13px] text-ink-2">
                  {DEMO_EMAIL}
                  <br />
                  {DEMO_PASSWORD}
                </p>
              </div>
            </form>

            <p className="mt-4 text-center text-sm text-muted">
              New here?{" "}
              <Link href="/about" className="font-medium text-navy-700 hover:underline">
                See how this works first
              </Link>
            </p>
          </div>
        </div>
      </main>

      <GovFooter />
    </>
  );
}
