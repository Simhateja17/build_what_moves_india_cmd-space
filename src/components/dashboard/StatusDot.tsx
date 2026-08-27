import { Tone } from "@/lib/dashboard";

const DOT: Record<Tone, string> = {
  good: "bg-govgreen-600",
  warn: "bg-saffron-500",
  danger: "bg-govred-600",
  info: "bg-navy-600",
  neutral: "bg-muted",
};

const TEXT: Record<Tone, string> = {
  good: "text-govgreen-700",
  warn: "text-saffron-600",
  danger: "text-govred-700",
  info: "text-navy-800",
  neutral: "text-ink-2",
};

/**
 * Status reads as colour *and* words. Colour alone fails for the large
 * share of citizens who cannot distinguish these hues, and on the cheap
 * screens a lot of this portal is opened on.
 */
export function StatusDot({
  tone,
  label,
  official,
}: {
  tone: Tone;
  label: string;
  official?: string;
}) {
  return (
    <span className="inline-flex items-start gap-2">
      <span
        aria-hidden
        className={`mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full ${DOT[tone]}`}
      />
      <span>
        <span className={`block text-[15px] font-semibold leading-tight ${TEXT[tone]}`}>
          {label}
        </span>
        {official ? (
          <span className="mt-0.5 block text-[10px] font-medium uppercase leading-tight tracking-wider text-muted">
            {official}
          </span>
        ) : null}
      </span>
    </span>
  );
}
