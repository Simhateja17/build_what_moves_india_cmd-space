import { HistoryEvent } from "@/lib/types";

export function StatusTimeline({
  history,
  daysElapsed,
  deadlineDays,
}: {
  history: HistoryEvent[];
  daysElapsed: number;
  deadlineDays: number;
}) {
  const overdue = daysElapsed > deadlineDays;
  const pct = Math.min(100, Math.round((daysElapsed / deadlineDays) * 100));

  return (
    <div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="font-medium text-slate-700">
            Day {daysElapsed} of {deadlineDays}
          </span>
          <span className={overdue ? "font-semibold text-red-600" : "text-slate-500"}>
            {overdue
              ? `${daysElapsed - deadlineDays} day${daysElapsed - deadlineDays === 1 ? "" : "s"} past the legal deadline`
              : `${deadlineDays - daysElapsed} days left before they must reply`}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${overdue ? "bg-red-500" : "bg-indigo-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ol className="space-y-5">
        {history.map((event, i) => (
          <li key={i} className="relative flex gap-3 pl-1">
            <div className="flex flex-col items-center">
              <span
                className={`z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                  i === history.length - 1
                    ? overdue
                      ? "bg-red-500"
                      : "bg-indigo-500"
                    : "bg-slate-300"
                }`}
              />
              {i < history.length - 1 && (
                <span className="w-px flex-1 bg-slate-200" />
              )}
            </div>
            <div className="pb-1">
              <p className="text-xs font-medium text-slate-400">{event.day}</p>
              <p className="font-medium text-slate-900">{event.plainLabel}</p>
              {event.officialLabel ? (
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {event.officialLabel}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
