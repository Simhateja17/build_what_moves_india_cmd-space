import { RequestStatus, STATUS_COPY } from "@/lib/types";

const TONE: Record<RequestStatus, string> = {
  filed: "bg-slate-100 text-slate-700",
  awaiting_reply: "bg-blue-50 text-blue-700",
  no_response_overdue: "bg-red-50 text-red-700",
  replied: "bg-emerald-50 text-emerald-700",
  appeal_eligible: "bg-amber-50 text-amber-800",
  appeal_filed: "bg-indigo-50 text-indigo-700",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const copy = STATUS_COPY[status];
  return (
    <span
      className={`inline-flex flex-col items-start rounded-lg px-2.5 py-1 ${TONE[status]}`}
      title={copy.official}
    >
      <span className="text-sm font-semibold leading-tight">{copy.plain}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">
        {copy.official}
      </span>
    </span>
  );
}
