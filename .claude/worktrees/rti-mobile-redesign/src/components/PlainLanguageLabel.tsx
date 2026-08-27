export function PlainLanguageLabel({
  plain,
  official,
  plainClassName = "font-medium text-slate-900",
  officialClassName = "text-xs uppercase tracking-wide text-slate-400",
}: {
  plain: string;
  official?: string;
  plainClassName?: string;
  officialClassName?: string;
}) {
  return (
    <span className="inline-flex flex-col">
      <span className={plainClassName}>{plain}</span>
      {official ? <span className={officialClassName}>{official}</span> : null}
    </span>
  );
}
