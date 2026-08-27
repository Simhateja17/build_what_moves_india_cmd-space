import Link from "next/link";
import { CaseView, cardStatus } from "@/lib/dashboard";
import { formatDate } from "@/lib/dates";
import { StatusDot } from "./StatusDot";

/**
 * The unit the whole dashboard is built from. A citizen should be able
 * to answer "what is happening with this one?" without opening it —
 * which is why the status line and the date they are owed an answer by
 * sit on the card, not behind a tap.
 */
export function RtiCard({ v }: { v: CaseView }) {
  const s = cardStatus(v);
  const { c, d } = v;

  const appealNumber = v.appeal.number;
  const canAppeal = d.canFileFirstAppeal || d.canFileSecondAppeal;

  return (
    <article className="case-card gov-card overflow-hidden">
      <Link
        href={`/requests/${c.id}`}
        className="block p-4 transition hover:bg-canvas/50 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {c.registrationNumber}
          </p>
          <StatusDot tone={s.tone} label={s.label} official={s.official} />
        </div>
        <h3 className="mt-3 text-[17px] font-bold leading-snug text-ink">
          {c.subject}
        </h3>
        <p className="mt-1 text-sm leading-snug text-ink-2">{c.plainTitle}</p>

        <dl className="mt-4 grid grid-cols-2 gap-2.5 text-[12px]">
          <div className="col-span-2 rounded-lg bg-canvas/65 px-3 py-2.5 sm:col-span-1">
            <dt className="text-muted">Department</dt>
            <dd className="mt-0.5 min-w-0 truncate font-semibold text-ink-2">
              {c.authority.office}
            </dd>
          </div>
          <div className="rounded-lg bg-canvas/65 px-3 py-2.5">
            <dt className="text-muted">Submitted</dt>
            <dd className="mt-0.5 font-semibold text-ink-2">{formatDate(v.submittedOn)}</dd>
          </div>
        </dl>

        <div className="mt-3.5 border-t border-line-2 pt-3.5">
          {/* The single most useful fact on the card: the date they owe you. */}
          <p className="text-[13px] text-ink-2">
            {d.hasReply && v.repliedOn ? (
              <>
                <span className="text-muted">Answered on</span>{" "}
                <span className="font-semibold text-ink">
                  {formatDate(v.repliedOn)}
                </span>
              </>
            ) : d.isOverdue ? (
              <>
                <span className="text-muted">Was due</span>{" "}
                <span className="font-semibold text-govred-700">
                  {formatDate(v.expectedBy)}
                </span>{" "}
                <span className="text-govred-700">· {d.daysLate} days late</span>
              </>
            ) : (
              <>
                <span className="text-muted">Expected response</span>{" "}
                <span className="font-semibold text-ink">
                  {formatDate(v.expectedBy)}
                </span>{" "}
                <span className="text-muted">· {d.daysLeft} days left</span>
              </>
            )}
          </p>

          {appealNumber ? (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-saffron-50 px-2 py-1 font-mono text-[11px] font-semibold text-saffron-600">
              {c.registrationNumber.split("/").pop()} → {appealNumber}
            </p>
          ) : null}
        </div>
      </Link>

      {/* Actions live outside the card link so each is its own target. */}
      <div className="flex gap-2 border-t border-line-2 bg-canvas/40 p-3">
        <Link
          href={`/requests/${c.id}`}
          className="flex-1 rounded-lg border border-line bg-surface px-3 py-2.5 text-center text-[13px] font-semibold text-navy-800 transition hover:border-navy-600/50"
        >
          View details
        </Link>

        {d.hasReply ? (
          <Link
            href={`/requests/${c.id}#response`}
            className="flex-1 rounded-lg bg-navy-800 px-3 py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-navy-700"
          >
            View response
          </Link>
        ) : null}

        {canAppeal ? (
          <Link
            href={`/requests/${c.id}#appeal`}
            className="flex-1 rounded-lg bg-govred-600 px-3 py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-govred-700"
          >
            Appeal
          </Link>
        ) : null}
      </div>
    </article>
  );
}
