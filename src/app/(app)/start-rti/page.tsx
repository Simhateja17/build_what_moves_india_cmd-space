"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useLocale } from "@/lib/i18n";

/**
 * Step 0 of filing: which door you come in by.
 *
 * Both doors lead to the same review and submission, so this is one flow
 * with a fork at the top — not the two separate nav destinations it used
 * to be advertised as.
 *
 * Both doors also pass through the portal's guidelines the first time, as on
 * the official site. Once accepted the detour disappears, so it costs a
 * returning applicant nothing.
 */
export default function StartRtiPage() {
  const { prefs } = useStore();
  const { t } = useLocale();
  const gate = (href: string) =>
    prefs.acceptedGuidelines
      ? href
      : `/guidelines?next=${encodeURIComponent(href)}`;

  return (
    // Capped and centred. Two cards on a 2560px canvas left ~700px of empty
    // height below them and read as an unfinished page.
    <div className="mx-auto w-full max-w-[1100px] py-2 sm:py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-navy-700">{t("New request")}</p>
        {/* Says what you are committing to before you commit to it. */}
        <p className="text-xs font-semibold text-muted">
          {t("Step 1 of 4 · about 5 minutes")}
        </p>
      </div>

      <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-navy-900 sm:text-5xl">
        {t("Select a filing method")}
      </h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-2">
        {t("Select the option that matches what you already know. Both lead to the same review and submission.")}
      </p>

      <div className="mt-9 grid items-stretch gap-5 sm:grid-cols-2">
        <Link
          href={gate("/assistant")}
          className="lift gov-card group flex min-h-72 flex-col p-7 transition hover:border-navy-600/40"
        >
          <span className="inline-flex w-fit rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-700">
            {t("Recommended")}
          </span>
          <h2 className="mt-5 text-xl font-bold text-navy-900">
            {t("Get assistance preparing this request")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            {t("Answer a series of questions to identify the authority and prepare a clear request.")}
          </p>

          <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
            <ListItem>You describe the problem in your own words</ListItem>
            <ListItem>The responsible office is identified automatically</ListItem>
            <ListItem>The request is drafted for you</ListItem>
          </ul>

          {/* A solid button, not a text link. The recommended path used to
              be the visually weaker of the two controls. */}
          <span className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 rounded-xl bg-navy-700 px-5 py-3 text-sm font-bold text-white transition group-hover:bg-navy-800">
              {t("Get assistance")} <span aria-hidden>→</span>
            </span>
          </span>
        </Link>

        <Link
          href={gate("/file-request")}
          className="lift gov-card group flex min-h-72 flex-col p-7 transition hover:border-navy-600/40"
        >
          <span className="inline-flex w-fit rounded-full bg-canvas px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            {t("Manual filing")}
          </span>
          <h2 className="mt-5 text-xl font-bold text-navy-900">
            {t("File directly")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            {t("Select the department and enter the request text directly.")}
          </p>

          {/* This card carried three lines against the other card's six and
              looked broken. What you need to have ready is the useful thing
              to say here, and it sets expectations before the form opens. */}
          <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-muted">
            {t("Required information")}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
            <ListItem>The ministry and office that holds the record</ListItem>
            <ListItem>Your question, in your own words</ListItem>
            <ListItem>₹10 by UPI (waived for BPL cardholders)</ListItem>
          </ul>

          <span className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 rounded-xl border border-navy-600/40 px-5 py-3 text-sm font-bold text-navy-700 transition group-hover:bg-navy-50">
              {t("Open the form")} <span aria-hidden>→</span>
            </span>
          </span>
        </Link>
      </div>

      <p className="mt-6 text-sm text-ink-2">
        {t("Read the")} {" "}
        <Link href="/guidelines" className="font-bold text-navy-700 hover:underline">
          {t("portal guidelines")}
        </Link>
        . {t("To view a request already in progress, see")} {" "}
        <Link href="/my-rtis" className="font-bold text-navy-700 hover:underline">
          {t("My requests")}
        </Link>
        .
      </p>
    </div>
  );
}

function ListItem({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const { t } = useLocale();
  return (
    <li className="flex gap-2">
      <span
        aria-hidden
        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${tone === "light" ? "bg-white/50" : "bg-navy-600/50"}`}
      />
      <span>{typeof children === "string" ? t(children) : children}</span>
    </li>
  );
}
