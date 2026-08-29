"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GUIDELINES } from "@/lib/guidelines";
import { useStore } from "@/lib/store";
import { useLocale } from "@/lib/i18n";

const LETTERS = ["a", "b", "c", "d", "e", "f"];

function withGuidelinesAccepted(path: string) {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const destination = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const separator = destination.includes("?") ? "&" : "?";
  return `${destination}${separator}guidelines=accepted${hash}`;
}

/**
 * The guidelines an applicant accepts before filing, as published on the
 * official portal — same twenty-one points, same wording.
 *
 * The original sets them in red Times New Roman inside a bordered box and
 * gates the filing flow behind a checkbox. The gate is kept, because it is
 * the point of the page; the presentation is the app's own, and the acted-on
 * consequence of each point is stated in plain language beside it where the
 * official wording hides one.
 */
export default function GuidelinesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { prefs, setPref } = useStore();
  const { t } = useLocale();
  const [checked, setChecked] = useState(prefs.acceptedGuidelines);

  // Where the citizen was heading when the gate stopped them.
  const rawNext = params.get("next");
  const next = rawNext && rawNext.startsWith("/") ? rawNext : "/start-rti";

  const submit = () => {
    if (!checked && !prefs.acceptedGuidelines) return;
    setPref("acceptedGuidelines", true);
    router.push(withGuidelinesAccepted(next));
  };

  const acknowledged = checked || prefs.acceptedGuidelines;

  return (
    <div className="mx-auto w-full max-w-[900px] py-2 sm:py-8">
      <p className="text-sm font-semibold text-navy-700">{t("Before you file")}</p>
      <h1 className="mt-2 text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-navy-900 sm:text-4xl">
        {t("Guidelines for use of the RTI Online portal")}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
        {t("These are the twenty-one guidelines published on the official portal at rtionline.gov.in, reproduced word for word. Read them once; this page will not ask again.")}
      </p>

      {prefs.acceptedGuidelines ? (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-govgreen-50 px-3.5 py-1.5 text-[13px] font-semibold text-govgreen-700">
          <span aria-hidden>✓</span> {t("You accepted these guidelines")}
        </p>
      ) : null}

      <ol className="gov-card mt-7 space-y-5 p-6 sm:p-8">
        {GUIDELINES.map((g, i) => (
          <li key={i} className="grid grid-cols-[2rem_1fr] gap-x-2">
            <span className="pt-px text-right text-[15px] font-bold tabular-nums text-navy-700">
              {i + 1}.
            </span>
            <div className="min-w-0">
              <p className="text-[15px] leading-relaxed text-ink">{t(g.text)}</p>

              {/* The original hangs these under the point unnumbered, and
                  several of them are the part that actually bites — the
                  character set, the Aadhaar warning. They keep their own
                  line rather than being folded into the sentence above. */}
              {g.notes?.map((note) => (
                <p
                  key={note}
                  className="mt-1.5 border-l-2 border-line-2 pl-3 text-[14.5px] leading-relaxed text-ink-2"
                >
                  {t(note)}
                </p>
              ))}

              {g.options ? (
                <ul className="mt-2 space-y-1">
                  {g.options.map((opt, j) => (
                    <li key={opt} className="text-[15px] leading-relaxed text-ink-2">
                      <span className="mr-1.5 font-semibold text-navy-700">
                        ({LETTERS[j]})
                      </span>
                      {t(opt)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {/* The acknowledgement, as on the original: a checkbox that gates the
          submit. Clicking the label toggles it, and the button says what it
          is short of rather than being a dead grey rectangle. */}
      <div className="gov-card mt-6 p-6 sm:p-7">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--navy-800)]"
          />
          <span className="text-[15px] font-semibold text-ink">
            {t("I have read and understood the above guidelines.")}
          </span>
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={!acknowledged}
            className="rounded-xl bg-navy-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {acknowledged ? t("Continue") : t("Tick the box to continue")}
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-2 transition hover:bg-navy-50 hover:text-navy-900"
          >
            {t("Cancel")}
          </Link>
        </div>
      </div>
    </div>
  );
}
