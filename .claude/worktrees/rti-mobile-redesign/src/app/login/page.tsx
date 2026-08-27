"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { BackIcon } from "@/components/mobile/icons";
import { RtiLogo, RtiMark } from "@/components/mobile/Logo";
import { useStore } from "@/lib/store";

/* ------------------------------------------------------------------
   Sign in.

   The portal's own View History flow already sends an OTP. Making that
   the only way in removes a password, a captcha and an email
   confirmation field from the phone — and a captcha is a particularly
   cruel thing to put in front of a low-literacy user on a 320px screen.

   Two steps, each one question.
------------------------------------------------------------------- */

const DEMO_CODE = "492026";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();

  const [stage, setStage] = useState<"number" | "code">("number");
  const [mobile, setMobile] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  const clean = mobile.replace(/\D/g, "");
  const code = digits.join("");

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  function sendCode() {
    if (clean.length !== 10) {
      setError("That is not a 10-digit number. Check the digits and try again.");
      return;
    }
    setError("");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStage("code");
      setSeconds(30);
      requestAnimationFrame(() => boxes.current[0]?.focus());
    }, 800);
  }

  function verify(value: string) {
    if (value.length !== 6) return;
    if (value !== DEMO_CODE) {
      setError("That code is wrong. Check the SMS and enter it again.");
      setDigits(Array(6).fill(""));
      boxes.current[0]?.focus();
      return;
    }
    setError("");
    login();
    router.replace("/dashboard");
  }

  function setDigit(i: number, v: string) {
    const only = v.replace(/\D/g, "");
    // Pasting six digits fills all six boxes at once.
    if (only.length > 1) {
      const next = only.slice(0, 6).split("");
      const filled = Array(6)
        .fill("")
        .map((_, k) => next[k] ?? "");
      setDigits(filled);
      verify(filled.join(""));
      return;
    }
    const next = [...digits];
    next[i] = only;
    setDigits(next);
    if (only && i < 5) boxes.current[i + 1]?.focus();
    // Verify on the sixth digit; the button is a fallback, not the path.
    if (next.every((x) => x !== "")) verify(next.join(""));
  }

  return (
    <div className="m-shell flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-30 bg-navy-800 text-white">
        <div className="m-col flex min-h-[52px] items-center gap-2 py-2">
          {stage === "code" ? (
            <button
              type="button"
              onClick={() => {
                setStage("number");
                setError("");
              }}
              className="m-tap -ml-3 justify-start"
              aria-label="Change your number"
            >
              <BackIcon className="h-5 w-5" />
            </button>
          ) : (
            <Link href="/" className="m-tap -ml-3 justify-start" aria-label="Home">
              <BackIcon className="h-5 w-5" />
            </Link>
          )}
          <RtiMark className="h-7 w-[13px] shrink-0 text-white" />
          <h1 className="text-[17px] font-bold tracking-tight">Sign in</h1>
        </div>
        <div className="tricolour-rule" />
      </header>

      <main id="main" className="m-col m-page--action flex-1 pt-6">
        {stage === "number" ? (
          <>
            <RtiLogo width={180} priority className="mb-7 h-auto w-[180px]" />
            <h2 className="m-h1">Enter your mobile number</h2>
            <p className="m-body mt-2">
              We send a 6-digit code. There is no password to remember.
            </p>

            <div className="mt-6">
              <span className="m-label">Mobile number</span>
              <div className="flex gap-2">
                <span className="m-field m-mono flex w-[72px] items-center justify-center bg-canvas">
                  +91
                </span>
                <input
                  className="m-field m-mono flex-1 tracking-widest"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={11}
                  placeholder="98765 43210"
                  value={mobile}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => {
                    const n = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(n.length > 5 ? `${n.slice(0, 5)} ${n.slice(5)}` : n);
                    setError("");
                  }}
                />
              </div>
              {error && (
                <p className="m-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="m-note m-note--info mt-5">
              Your number is used to show you your RTIs and to text you when an
              officer replies. It is never shown to the officer unless you add
              it to the form.
            </div>

            <p className="m-fine mt-6 text-center">
              Demo: any 10 digits will do.
            </p>
          </>
        ) : (
          <>
            <h2 className="m-h1">Enter the 6-digit code</h2>
            <p className="m-body mt-2">
              Sent to +91 {mobile} ·{" "}
              <button
                type="button"
                onClick={() => setStage("number")}
                className="font-semibold text-navy-800 underline"
              >
                Change number
              </button>
            </p>

            <div className="mt-6 flex gap-2" role="group" aria-label="6-digit code">
              {digits.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxes.current[i] = el;
                  }}
                  className="m-field m-mono h-[56px] flex-1 px-0 text-center text-[22px] font-semibold"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={6}
                  value={v}
                  aria-label={`Digit ${i + 1}`}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digits[i] && i > 0)
                      boxes.current[i - 1]?.focus();
                  }}
                />
              ))}
            </div>

            {error && (
              <p className="m-error" role="alert">
                {error}
              </p>
            )}

            <p className="m-fine mt-3">
              {seconds > 0 ? (
                `Resend code in 0:${String(seconds).padStart(2, "0")}`
              ) : (
                <button
                  type="button"
                  onClick={() => setSeconds(30)}
                  className="font-semibold text-navy-800 underline"
                >
                  Resend code
                </button>
              )}
            </p>

            <div className="m-note m-note--warn mt-5">
              Didn&rsquo;t get it? Codes can take a minute on a weak signal. Keep
              this screen open — we fill it in for you when the SMS arrives.
            </div>

            <p className="m-fine mt-6 text-center">
              Demo code: <span className="m-mono font-semibold">{DEMO_CODE}</span>
            </p>
          </>
        )}
      </main>

      <ActionBar>
        {stage === "number" ? (
          <PrimaryButton busy={sending} busyLabel="Sending code…" onClick={sendCode}>
            Send code
          </PrimaryButton>
        ) : (
          <PrimaryButton
            disabled={code.length !== 6}
            disabledReason="Enter all six digits from the SMS."
            onClick={() => verify(code)}
          >
            Verify and continue
          </PrimaryButton>
        )}
      </ActionBar>
    </div>
  );
}
