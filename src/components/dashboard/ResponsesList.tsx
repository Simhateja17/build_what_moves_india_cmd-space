import Link from "next/link";
import { CaseView } from "@/lib/dashboard";
import { formatDate, relativeDay } from "@/lib/dates";

/**
 * Responses get their own home. On the current portal an answer is
 * buried behind "View Status" → a table → a row → a link, and citizens
 * routinely never find the reply they were waiting months for.
 */
export function ResponsesList({
  views,
  limit,
}: {
  views: CaseView[];
  limit?: number;
}) {
  const answered = views
    .filter((v) => v.d.hasReply && v.repliedOn)
    .sort((a, b) => (b.c.replyDay ?? 0) - (a.c.replyDay ?? 0));

  const shown = limit ? answered.slice(0, limit) : answered;

  if (shown.length === 0) {
    return (
      <p className="gov-card p-5 text-sm text-ink-2">
        No responses yet. When a department answers, the reply lands here —
        you will never have to go looking for it.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {shown.map((v) => {
        const age = v.day - (v.c.replyDay ?? 0);
        return (
          <li key={v.c.id} className="gov-card overflow-hidden">
            <div className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {v.c.registrationNumber}
                </p>
                {!v.responseRead ? (
                  <span className="rounded-full bg-govgreen-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    New
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[15px] font-bold leading-snug text-ink">
                {v.c.subject}
              </p>
              <p className="mt-1 text-[13px] text-ink-2">
                Response received {relativeDay(-age)} ·{" "}
                {v.repliedOn ? formatDate(v.repliedOn) : null}
              </p>
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
                {v.d.reply}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-line-2 bg-canvas/40 p-3">
              <Link
                href={`/requests/${v.c.id}#response`}
                className="flex-1 rounded-lg bg-navy-800 px-3 py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-navy-700"
              >
                View response
              </Link>
              <Link
                href={`/requests/${v.c.id}#response`}
                className="flex-1 rounded-lg border border-line bg-surface px-3 py-2.5 text-center text-[13px] font-semibold text-navy-800 transition hover:border-navy-600/50"
              >
                Download PDF
              </Link>
              <Link
                href={`/requests/${v.c.id}#appeal`}
                className="flex-1 rounded-lg border border-line bg-surface px-3 py-2.5 text-center text-[13px] font-semibold text-navy-800 transition hover:border-navy-600/50"
              >
                File appeal
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
