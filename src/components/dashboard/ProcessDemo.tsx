const STEPS = [
  { number: "1", label: "Request filed" },
  { number: "2", label: "Department review" },
  { number: "3", label: "Response received" },
  { number: "4", label: "Appeal if needed" },
];

export function ProcessDemo() {
  return (
    <section
      aria-labelledby="process-demo-title"
      className="grid gap-6 overflow-hidden rounded-[28px] border border-navy-600/15 bg-navy-50 px-5 py-6 sm:px-7 lg:grid-cols-[240px_1fr] lg:items-center lg:gap-10"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="process-demo__live-dot" aria-hidden />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-600">
            Process demo
          </p>
        </div>
        <h2
          id="process-demo-title"
          className="mt-2 text-lg font-bold tracking-tight text-navy-900"
        >
          How your RTI moves
        </h2>
      </div>

      <div className="process-demo" aria-label="RTI process animation">
        <div className="process-demo__rail" aria-hidden>
          <span className="process-demo__progress" />
          <span className="process-demo__marker" />
        </div>
        <ol className="relative z-10 grid grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.label}
              className="process-demo__step"
              style={{ ["--process-delay" as string]: `${index * 2}s` }}
            >
              <span className="process-demo__node" aria-hidden>
                {step.number}
              </span>
              <span className="mt-2 block max-w-[8rem] text-[11px] font-semibold leading-tight text-navy-800 sm:text-[13px]">
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
