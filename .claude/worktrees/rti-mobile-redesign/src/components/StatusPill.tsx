import { CaseStatus, STATUS_COPY } from "@/lib/types";

const TONE: Record<string, string> = {
  neutral: "bg-slate-100 text-ink-2 ring-slate-200",
  info: "bg-navy-50 text-navy-800 ring-navy-100",
  danger: "bg-govred-50 text-govred-700 ring-red-200",
  good: "bg-govgreen-50 text-govgreen-700 ring-green-200",
  warn: "bg-saffron-50 text-saffron-600 ring-orange-200",
};

export function StatusPill({
  status,
  size = "md",
}: {
  status: CaseStatus;
  size?: "sm" | "md";
}) {
  const copy = STATUS_COPY[status];
  return (
    <span
      className={`inline-flex flex-col items-start rounded-lg px-2.5 py-1.5 ring-1 ${TONE[copy.tone]}`}
    >
      <span
        className={`font-semibold leading-none ${size === "sm" ? "text-xs" : "text-sm"}`}
      >
        {copy.plain}
      </span>
      <span className="mt-1 text-[10px] font-medium uppercase leading-none tracking-wider opacity-65">
        {copy.official}
      </span>
    </span>
  );
}
