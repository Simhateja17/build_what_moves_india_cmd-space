"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { deriveCase, formatInr } from "@/lib/derive";
import { addDays, formatDate } from "@/lib/dates";
import { APPEAL_DECISION_DAYS, SECOND_APPEAL_FILING_DAYS } from "@/lib/types";
import { GroundRealityNote } from "@/components/GroundRealityNote";
import { useLocale } from "@/lib/i18n";

/**
 * The grounds a Second Appeal actually runs on. These are not the s.19(1)
 * grounds reused — a Second Appeal is against what the *Appellate
 * Authority* did or failed to do, which is a different complaint from the
 * one made against the CPIO.
 */
const SECOND_APPEAL_GROUNDS = [
  {
    official: "No decision by the First Appellate Authority within 45 days",
    plain: "The Appellate Authority never decided my appeal",
  },
  {
    official: "Aggrieved by the decision of the First Appellate Authority",
    plain: "They decided, but the decision still denies me the information",
  },
  {
    official: "Information still not provided after the appeal was allowed",
    plain: "The appeal was allowed in my favour, but nothing was given to me",
  },
];

export default function SecondAppealPage() {
  const { t } = useLocale();
  const { id } = useParams<{ id: string }>();
  const { getCase, dayOf, appealOf, fileSecondAppeal, citizenName } = useStore();
  const router = useRouter();

  const c = getCase(id);
  const [groundIndex, setGroundIndex] = useState(0);
  const [extra, setExtra] = useState("");
  const [relief, setRelief] = useState(
    "Direct the Public Authority to provide the complete information sought in my original RTI application, and consider penalty proceedings under section 20 against the officer responsible.",
  );
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
  const appeal = appealOf(c.id);
  const d = deriveCase(c, day, appeal);
  const ground = SECOND_APPEAL_GROUNDS[groundIndex];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = [
      ground.official,
      extra.trim() ? `Explanation: ${extra.trim()}` : "",
      `Relief requested: ${relief.trim()}`,
    ]
      .filter(Boolean)
      .join(" · ");
    fileSecondAppeal(c!.id, text, day);
    router.push(`/requests/${c!.id}`);
  }

  /* A Second Appeal that has not been reached yet is not a page to hide —
     a citizen should be able to read what it is and when it becomes
     theirs, the same way the First Appeal button names its own date. */
  if (!d.canFileSecondAppeal && !d.secondAppealFiled) {
    const availableOn =
      appeal.filedOnDay !== undefined
        ? addDays(c.submittedOn, appeal.filedOnDay + APPEAL_DECISION_DAYS)
        : undefined;
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/requests/${c.id}`}
          className="text-sm font-medium text-navy-700 hover:underline"
        >
          {t("← Back to this request")}
        </Link>
        <section className="mt-5 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">
            {t("A Second Appeal is not open on this request yet")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-2">
            The Central Information Commission hears an appeal only after the
            department has had its own chance to put things right. That means a
            First Appeal has to have been filed, and the Appellate Authority
            has to have either decided it against you or let the{" "}
            {APPEAL_DECISION_DAYS} days run out.
          </p>
          {availableOn ? (
            <p className="mt-3 text-sm leading-6 text-ink-2">
              Your First Appeal{appeal.number ? ` (${appeal.number})` : ""} is
              still within that period. If no decision arrives, this becomes
              available on{" "}
              <strong className="font-semibold text-ink">
                {formatDate(availableOn)}
              </strong>
              .
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-ink-2">
              {t("No First Appeal has been filed on this request yet.")}
            </p>
          )}
          <Link
            href={`/requests/${c.id}`}
            className="mt-6 inline-flex items-center rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700"
          >
            {t("Back to this request")}
          </Link>
        </section>
      </div>
    );
  }

  if (d.secondAppealFiled) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/requests/${c.id}`}
          className="text-sm font-medium text-navy-700 hover:underline"
        >
          {t("← Back to this request")}
        </Link>
        <section className="mt-5 rounded-2xl border border-saffron-400/35 bg-white p-6 shadow-[var(--shadow-panel)] sm:p-8">
          <span className="inline-flex rounded-md bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-800">
            {t("With the Commission")}
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-900">
            {t("Your Second Appeal has been filed")}
          </h1>
          <dl className="mt-6 divide-y divide-line-2 border-y border-line-2">
            <AppealDetail
              label={t("Appeal number")}
              value={appeal.secondNumber ?? "Being generated"}
            />
            <AppealDetail
              label={t("First Appeal")}
              value={appeal.number ?? "On record"}
            />
            <AppealDetail label={t("RTI application")} value={c.registrationNumber} />
            <AppealDetail
              label={t("Ground")}
              value={appeal.secondGround ?? "Second Appeal"}
            />
            <AppealDetail label={t("Public Authority")} value={c.authority.office} />
            <AppealDetail
              label={t("Heard by")}
              value="Central Information Commission, New Delhi"
            />
          </dl>
          <p className="mt-5 text-sm leading-6 text-ink-2">
            {t("The Commission sits outside the department, and no time limit binds it. Hearings are commonly held by video link from a facility near you, so appearing in Delhi is usually not necessary. You will be sent a notice when your appeal is listed.")}
          </p>
        </section>
      </div>
    );
  }

  const appealDecisionWasDue =
    appeal.filedOnDay !== undefined
      ? addDays(c.submittedOn, appeal.filedOnDay + APPEAL_DECISION_DAYS)
      : undefined;
  const daysWaiting =
    appeal.filedOnDay !== undefined
      ? day - (appeal.filedOnDay + APPEAL_DECISION_DAYS)
      : 0;

  return (
    <div className="w-full">
      <Link
        href={`/requests/${c.id}`}
        className="text-sm font-medium text-navy-700 hover:underline"
      >
        {t("← Back to this request")}
      </Link>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900">
        {t("File a Second Appeal")}
      </h1>
      <p className="mt-2 max-w-3xl text-ink-2">
        {t("This appeal leaves the department. It is addressed to the Central Information Commission, an independent body with the power to order the information released and to fine the officer responsible. It is filed free of cost, and the details below have been carried over from your application and your First Appeal.")}
      </p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:gap-8">
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

          {appealDecisionWasDue ? (
            <p className="mt-3 rounded-md bg-govred-50 px-3 py-2 text-sm leading-5 text-govred-700">
              First Appeal {appeal.number} was due for decision by{" "}
              {formatDate(appealDecisionWasDue)}.{" "}
              {daysWaiting > 0
                ? `${daysWaiting} day${daysWaiting === 1 ? "" : "s"} have passed since, with no decision.`
                : "No decision has been received."}
            </p>
          ) : null}

          {d.penalty.active ? (
            <p className="mt-3 rounded-md bg-govred-50 px-3 py-2 text-sm leading-5 text-govred-700">
              {d.daysLate} days overdue · {formatInr(d.penalty.accruedInr)}{" "}
              penalty accrued against {c.authority.cpio.name}
              {d.penalty.atCap ? " (at the ₹25,000 statutory ceiling)" : ""}
            </p>
          ) : null}

          <GroundRealityNote>
            {t("The Commission is the only body in this chain that can actually fine an officer. The current portal keeps the Second Appeal on a separate site with its own login, which is where most citizens give up.")}
          </GroundRealityNote>
        </div>

        <form id="second-appeal-form" onSubmit={submit}>
          <div className="gov-card p-5">
            <h2 className="text-lg font-bold text-navy-900">
              {t("Applicant and appeal details")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {t("These details are filled from your account, your application and your First Appeal.")}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="field-label">
                Applicant name
                <input
                  value={citizenName}
                  readOnly
                  className="field-input bg-canvas/60 text-ink-2"
                />
              </label>
              <label className="field-label">
                RTI application number
                <input
                  value={c.registrationNumber}
                  readOnly
                  className="field-input bg-canvas/60 font-mono text-ink-2"
                />
              </label>
              <label className="field-label">
                First Appeal number
                <input
                  value={appeal.number ?? "On record"}
                  readOnly
                  className="field-input bg-canvas/60 font-mono text-ink-2"
                />
              </label>
              <label className="field-label">
                Date of First Appeal
                <input
                  value={
                    appeal.filedOnDay !== undefined
                      ? formatDate(addDays(c.submittedOn, appeal.filedOnDay))
                      : "—"
                  }
                  readOnly
                  className="field-input bg-canvas/60 text-ink-2"
                />
              </label>
              <label className="field-label sm:col-span-2">
                Public Authority
                <input
                  value={c.authority.office}
                  readOnly
                  className="field-input bg-canvas/60 text-ink-2"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 gov-card p-5">
            <p className="field-label">{t("Ground for the Second Appeal")}</p>
            <p className="mt-1 text-sm text-muted">
              {t("This appeal is against what the Appellate Authority did, not against the original officer. Select the option that applies.")}
            </p>

            <div className="mt-4 space-y-2.5">
              {SECOND_APPEAL_GROUNDS.map((g, i) => {
                const selected = i === groundIndex;
                const applies =
                  d.canFileSecondAppeal &&
                  g.official.startsWith("No decision by the First");
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
                      name="second-ground"
                      checked={selected}
                      onChange={() => setGroundIndex(i)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium text-ink">
                        {g.plain}
                        {applies ? (
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
            <label htmlFor="sa-extra" className="field-label">
              Explain your appeal{" "}
              <span className="font-normal text-muted">{t("(optional)")}</span>
            </label>
            <textarea
              id="sa-extra"
              rows={4}
              value={extra}
              onChange={(event) => setExtra(event.target.value)}
              placeholder={t("This field may be left blank. Your application, the lack of a reply and the undecided First Appeal are attached and form the basis of this appeal.")}
              className="field-input"
            />

            <label htmlFor="sa-relief" className="mt-5 field-label">
              {t("Relief sought from the Commission")}
            </label>
            <textarea
              id="sa-relief"
              rows={3}
              required
              value={relief}
              onChange={(event) => setRelief(event.target.value)}
              className="field-input"
            />

            <label htmlFor="sa-attachment" className="mt-5 field-label">
              Supporting document{" "}
              <span className="font-normal text-muted">{t("(optional)")}</span>
            </label>
            <input
              id="sa-attachment"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="field-input file:mr-3 file:rounded-md file:border-0 file:bg-navy-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-navy-700"
            />
            <p className="mt-1.5 text-xs text-muted">
              {t("PDF, JPG or PNG. Your original RTI application and your First Appeal are attached automatically — the Commission requires both, and this is the step people are most often sent back for.")}
            </p>

            <label className="mt-5 flex cursor-pointer gap-3 rounded-xl border border-line bg-canvas/40 p-4 text-sm leading-5 text-ink-2">
              <input
                type="checkbox"
                required
                checked={declared}
                onChange={(event) => setDeclared(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                {t("I confirm that the information given in this appeal is true, that it relates to the RTI application and First Appeal shown above, and that the matter is not pending before any court.")}
              </span>
            </label>

            <GroundRealityNote>
              A Second Appeal is ordinarily filed within{" "}
              {SECOND_APPEAL_FILING_DAYS} days. The Commission may still accept
              a later one if the delay is explained, and no time limit binds
              the Commission&rsquo;s own decision.
            </GroundRealityNote>
          </div>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-5">
        <p className="text-sm text-ink-2">
          <strong className="text-ink">{t("No fee.")}</strong> {t("A Second Appeal to the Information Commission is free under the RTI Act.")}
        </p>
        <button
          type="submit"
          form="second-appeal-form"
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
