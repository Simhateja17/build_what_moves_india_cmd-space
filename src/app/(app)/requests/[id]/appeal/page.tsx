"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { deriveCase, formatInr } from "@/lib/derive";
import { GROUNDS_FOR_APPEAL } from "@/lib/types";
import { GroundRealityNote } from "@/components/GroundRealityNote";
import { useLocale } from "@/lib/i18n";

export default function FirstAppealPage() {
  const { t } = useLocale();
  const { id } = useParams<{ id: string }>();
  const { getCase, dayOf, appealOf, fileAppeal, citizenName } = useStore();
  const router = useRouter();

  const c = getCase(id);
  const [groundIndex, setGroundIndex] = useState(0);
  const [extra, setExtra] = useState("");
  const [relief, setRelief] = useState("Provide the complete information requested in my original RTI application.");
  const [declared, setDeclared] = useState(false);

  if (!c) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="font-semibold text-ink">{t("This request could not be found.")}</p>
        <Link
          href="/dashboard"
          className="mt-3 inline-block font-medium text-navy-700 hover:underline"
        >
          {t("Back to your requests")}
        </Link>
      </div>
    );
  }

  const day = dayOf(c.id);
  const d = deriveCase(c, day, appealOf(c.id));
  const ground = GROUNDS_FOR_APPEAL[groundIndex];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const appealText = [
      ground.official,
      extra.trim() ? `Explanation: ${extra.trim()}` : "",
      `Relief requested: ${relief.trim()}`,
    ].filter(Boolean).join(" · ");
    fileAppeal(c!.id, appealText, day);
    router.push(`/requests/${c!.id}`);
  }

  if (d.appealFiled) {
    const filedAppeal = appealOf(c.id);
    return (
      <div className="mx-auto max-w-3xl">
        <Link href={`/requests/${c.id}`} className="text-sm font-medium text-navy-700 hover:underline">
          {t("← Back to this request")}
        </Link>
        <section className="mt-5 rounded-2xl border border-saffron-400/35 bg-white p-6 shadow-[var(--shadow-panel)] sm:p-8">
          {/* The stage words the rest of the app uses, not a private label.
              The "In appeal" flag that used to sit beside this is gone: the
              headline below says the appeal was filed, so repeating it as a
              second chip only made the citizen choose between two tags. */}
          <span className="inline-flex rounded-md bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-800">
            {t("With the department")}
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-900">{t("Your First Appeal has been filed")}</h1>
          <dl className="mt-6 divide-y divide-line-2 border-y border-line-2">
            <AppealDetail label={t("Appeal number")} value={filedAppeal.number ?? "Being generated"} />
            <AppealDetail label={t("RTI application")} value={c.registrationNumber} />
            <AppealDetail label={t("Ground")} value={filedAppeal.ground ?? "First Appeal"} />
            <AppealDetail label={t("Public Authority")} value={c.authority.office} />
            {/* Who is actually deciding it. The confirmation named the
                office and the ground and then never said whose desk the
                appeal had landed on — the one particular s.7(8)(iii)
                makes mandatory. */}
            <AppealDetail
              label={t("Appellate Authority")}
              value={`${c.authority.appellateAuthority.name}, ${c.authority.appellateAuthority.designation}`}
            />
            <AppealDetail
              label={t("Address for correspondence")}
              value={c.authority.appellateAuthority.address}
            />
            {c.authority.appellateAuthority.email ? (
              <AppealDetail label={t("Email")} value={c.authority.appellateAuthority.email} />
            ) : null}
          </dl>
          <p className="mt-5 text-sm leading-6 text-ink-2">
            {t("The Appellate Authority has 30 days to decide, and 45 at the very outside — the longer period is open to it only where it records its reasons for taking it. The decision will appear on your status screen.")}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link
        href={`/requests/${c.id}`}
        className="text-sm font-medium text-navy-700 hover:underline"
      >
        {t("← Back to this request")}
      </Link>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900">
        {t("File a First Appeal")}
      </h1>
      <p className="mt-2 text-ink-2">
        {t("This appeal is addressed to a senior officer within the same department, the Appellate Authority. It is filed free of cost, and the details below have been filled in from your original application.")}
      </p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:gap-8">
      {/* Pre-filled context — no registration numbers to look up */}
      <div className="gov-card p-5 lg:sticky lg:top-32">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {t("Appealing against")}
        </p>
        <p className="mt-1.5 font-semibold text-ink">{c.plainTitle}</p>
        <p className="mt-1 text-sm text-ink-2">
          {c.authority.office} · filed {day} days ago
        </p>
        <p className="mt-1 font-mono text-[12px] text-muted">
          {c.registrationNumber}
        </p>
        {d.penalty.active ? (
          <p className="mt-3 rounded-md bg-govred-50 px-3 py-2 text-sm text-govred-700">
            {d.daysLate} days overdue · {formatInr(d.penalty.accruedInr)}{" "}
            penalty accrued against {c.authority.cpio.name}
          </p>
        ) : null}
        <GroundRealityNote>
          {t("The current portal makes you type this registration number and your email from memory, then solve a CAPTCHA, before it will even show you the appeal form.")}
        </GroundRealityNote>
      </div>

      <form id="first-appeal-form" onSubmit={submit}>
      <div className="gov-card p-5">
        <h2 className="text-lg font-bold text-navy-900">{t("Applicant and RTI details")}</h2>
        <p className="mt-1 text-sm text-muted">{t("These details are filled from your account and original application.")}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Applicant name
            <input value={citizenName} readOnly className="field-input bg-canvas/60 text-ink-2" />
          </label>
          <label className="field-label">
            RTI application number
            <input value={c.registrationNumber} readOnly className="field-input bg-canvas/60 font-mono text-ink-2" />
          </label>
          <label className="field-label sm:col-span-2">
            Public Authority
            <input value={c.authority.office} readOnly className="field-input bg-canvas/60 text-ink-2" />
          </label>
        </div>
      </div>

      {/* Ground for appeal — plain language leads, official term follows */}
      <div className="mt-5 gov-card p-5">
        <p className="field-label">{t("Ground for appeal")}</p>
        <p className="mt-1 text-sm text-muted">
          {t("Select the option that applies. The official wording will be sent to the department.")}
        </p>

        <div className="mt-4 space-y-2.5">
          {GROUNDS_FOR_APPEAL.map((g, i) => {
            const selected = i === groundIndex;
            const recommended =
              d.isOverdue && g.official === "No Response Within the Time Limit";
            return (
              <label
                key={g.official}
                className={`flex cursor-pointer gap-3 rounded-lg border p-3.5 transition ${
                  selected
                    ? "border-navy-600 bg-navy-50"
                    : "border-line bg-white hover:border-navy-600/40"
                }`}
              >
                <input
                  type="radio"
                  name="ground"
                  checked={selected}
                  onChange={() => setGroundIndex(i)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-ink">
                    {g.plain}
                    {recommended ? (
                      <span className="ml-2 rounded bg-govred-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-govred-700">
                        {t("Applies to you")}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-[11px] uppercase tracking-wider text-muted">
                    {g.official}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-5 gov-card p-5">
        <label htmlFor="extra" className="field-label">
          Explain your appeal <span className="font-normal text-muted">{t("(optional)")}</span>
        </label>
        <textarea
          id="extra"
          rows={4}
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder={t("This field may be left blank. Your original application and the lack of a response form the basis of this appeal.")}
          className="field-input"
        />
        <label htmlFor="relief" className="mt-5 field-label">
          {t("Relief sought from the Appellate Authority")}
        </label>
        <textarea
          id="relief"
          rows={3}
          required
          value={relief}
          onChange={(event) => setRelief(event.target.value)}
          className="field-input"
        />

        <label htmlFor="appeal-attachment" className="mt-5 field-label">
          Supporting document <span className="font-normal text-muted">{t("(optional)")}</span>
        </label>
        <input
          id="appeal-attachment"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="field-input file:mr-3 file:rounded-md file:border-0 file:bg-navy-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-navy-700"
        />
        <p className="mt-1.5 text-xs text-muted">{t("PDF, JPG or PNG. Your original RTI is attached automatically.")}</p>

        <label className="mt-5 flex cursor-pointer gap-3 rounded-xl border border-line bg-canvas/40 p-4 text-sm leading-5 text-ink-2">
          <input
            type="checkbox"
            required
            checked={declared}
            onChange={(event) => setDeclared(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <span>{t("I confirm that the information given in this appeal is true and relates to the RTI application shown above.")}</span>
        </label>
        <GroundRealityNote>
          {t("Your appeal reaches the Appellate Authority through the same Nodal Officer. They have 30 days to decide, and 45 at the outside if they record why — after that you can go to the Central Information Commission, which is the body that can impose the Section 20 penalty.")}
        </GroundRealityNote>
      </div>
      </form>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-5">
        <p className="text-sm text-ink-2">
          <strong className="text-ink">{t("No fee.")}</strong> {t("A First Appeal is free under the RTI Act.")}
        </p>
        <button
          type="submit"
          form="first-appeal-form"
          disabled={!declared}
          className="rounded-lg bg-navy-800 px-6 py-3 font-semibold text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {t("Review and submit appeal")}
        </button>
      </div>
    </div>
  );
}

function AppealDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-[150px_1fr] sm:gap-5">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-ink-2">{value}</dd>
    </div>
  );
}
