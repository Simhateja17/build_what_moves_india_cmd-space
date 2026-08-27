import Link from "next/link";

export default function StartRtiPage() {
  return (
    <div className="mx-auto w-full max-w-6xl py-2 sm:py-6">
      <p className="text-sm font-semibold text-navy-700">New RTI</p>
      <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-navy-900 sm:text-5xl">
        How would you like to begin?
      </h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-2">
        Choose the path that matches what you already know. Both lead to the
        same review and submission process.
      </p>

      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        <Link
          href="/assistant"
          className="dashboard-hero lift group min-h-72 rounded-[28px] p-7 text-white shadow-[var(--shadow-panel-lg)] transition hover:bg-navy-700"
        >
          <span className="inline-flex rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white/80">
            Recommended
          </span>
          <h2 className="mt-5 text-xl font-bold">Help me prepare my RTI</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/72">
            Answer simple questions to find the authority and prepare a clear
            request.
          </p>
          <p className="mt-6 text-sm font-bold text-white">
            Start with my problem <span aria-hidden>→</span>
          </p>
        </Link>

        <Link
          href="/file-request"
          className="lift gov-card group min-h-72 p-7 transition hover:border-navy-600/40"
        >
          <span className="inline-flex rounded-full bg-canvas px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            Manual filing
          </span>
          <h2 className="mt-5 text-xl font-bold text-navy-900">
            I know the authority
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            Select the department and write or paste the request yourself.
          </p>
          <p className="mt-6 text-sm font-bold text-navy-700">
            Open the form <span aria-hidden>→</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
