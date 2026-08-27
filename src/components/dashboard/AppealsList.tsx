import Link from "next/link";
import { CaseView } from "@/lib/dashboard";
import { addDays, formatDate } from "@/lib/dates";
import { APPEAL_DECISION_DAYS } from "@/lib/types";
import { StatusDot } from "./StatusDot";

/**
 * An appeal is never a standalone thing — it is always *an appeal
 * against a particular RTI*. The portal loses that link and makes people
 * track two numbers separately, so here the pair is the headline.
 */
export function AppealsList({ views }: { views: CaseView[] }) {
  const appeals = views.filter(
    (v) => v.d.appealFiled || v.d.canFileFirstAppeal || v.d.canFileSecondAppeal,
  );

  if (appeals.length === 0) {
    return (
      <p className="gov-card p-5 text-sm text-ink-2">
        No appeals. You only need one if a department stays silent past 30
        days, or answers in a way that falls short.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {appeals.map((v) => {
        const { c, d } = v;
        const serial = c.registrationNumber.split("/").pop();
        const decideBy =
          v.appeal.filedOnDay !== undefined
            ? addDays(c.submittedOn, v.appeal.filedOnDay + APPEAL_DECISION_DAYS)
            : undefined;

        const status = d.canFileSecondAppeal
          ? { tone: "danger" as const, label: "No decision — escalate to CIC", official: "S.19(3)" }
          : d.appealFiled
            ? { tone: "warn" as const, label: "Under review", official: "FIRST APPEAL — PENDING" }
            : { tone: "danger" as const, label: "Available to file", official: "ELIGIBLE — S.19(1)" };

        return (
          <li key={c.id} className="gov-card overflow-hidden">
            <div className="p-4">
              {/* The pairing, stated as a relationship rather than two rows */}
              <p className="flex flex-wrap items-center gap-1.5 font-mono text-[12px] font-semibold">
                <span className="rounded bg-navy-50 px-2 py-1 text-navy-800">
                  RTI #{serial}
                </span>
                <span aria-hidden className="text-muted">
                  →
                </span>
                {v.appeal.number ? (
                  <span className="rounded bg-saffron-50 px-2 py-1 text-saffron-600">
                    {v.appeal.number}
                  </span>
                ) : (
                  <span className="rounded bg-line-2 px-2 py-1 text-muted">
                    Not filed yet
                  </span>
                )}
              </p>

              <p className="mt-2 text-[15px] font-bold leading-snug text-ink">
                {c.subject}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-2">
                {c.authority.office}
              </p>

              <div className="mt-3">
                <StatusDot {...status} />
              </div>

              {decideBy && d.appealFiled && !d.canFileSecondAppeal ? (
                <p className="mt-2 text-[13px] text-ink-2">
                  <span className="text-muted">Decision due by</span>{" "}
                  <span className="font-semibold text-ink">
                    {formatDate(decideBy)}
                  </span>
                </p>
              ) : null}

              {v.appeal.ground ? (
                <p className="mt-2 rounded-md bg-canvas px-3 py-2 text-[12px] leading-relaxed text-ink-2">
                  <span className="text-muted">Ground:</span> {v.appeal.ground}
                </p>
              ) : null}
            </div>

            <div className="flex gap-2 border-t border-line-2 bg-canvas/40 p-3">
              <Link
                href={`/requests/${c.id}`}
                className="flex-1 rounded-lg border border-line bg-surface px-3 py-2.5 text-center text-[13px] font-semibold text-navy-800 transition hover:border-navy-600/50"
              >
                Open original RTI
              </Link>
              <Link
                href={`/requests/${c.id}#appeal`}
                className="flex-1 rounded-lg bg-navy-800 px-3 py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-navy-700"
              >
                {d.appealFiled ? "View appeal" : "File appeal"}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
