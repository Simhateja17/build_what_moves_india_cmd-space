import Link from "next/link";

export function GovFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-navy-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-sm font-bold">RTI Saral</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            A redesign concept for the Government of India&apos;s RTI Online
            portal, built for the Build What Moves India hackathon.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">The law behind it</p>
          <ul className="mt-2 space-y-1.5 text-sm text-white/70">
            <li>Right to Information Act, 2005</li>
            <li>s.7(1) — 30 days to reply</li>
            <li>s.19 — appeals and time limits</li>
            <li>s.20 — penalty on the officer</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">In this demo</p>
          <ul className="mt-2 space-y-1.5 text-sm text-white/70">
            <li>
              <Link href="/about" className="hover:underline">
                How this works
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Demo sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/50">
          This is an independent design concept and is not an official
          Government of India website. All data shown is fictional and created
          for demonstration. The real portal is at rtionline.gov.in.
        </p>
      </div>
    </footer>
  );
}
