import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";
import { HowToFileSteps } from "@/components/HowToFileSteps";
import { HeroCarousel, HeroSlide } from "@/components/home/HeroCarousel";
import { AssistantArt, RoutingArt } from "@/components/home/HeroArt";
import { GeneralInformation } from "@/components/home/GeneralInformation";

/**
 * Three things a visitor could be here for: the argument for the
 * redesign, help wording a request, or help working out whose problem
 * it even is. The last one is where most first-time filers actually
 * are, so it gets a slide of its own rather than a link buried below.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    id: "pitch",
    eyebrow: "Right to Information Act, 2005",
    title: (
      <>
        You have the right to ask.
        <br />
        <span className="text-navy-600">The law requires an answer.</span>
      </>
    ),
    body: "Any citizen of India may request records held by a public authority, and the law requires a reply within 30 days. RTI Saral is built to make that right straightforward to exercise.",
    primary: { label: "Try the demo", href: "/login" },
    secondary: { label: "How it works", href: "/about" },
    note: "No signup is required. A demonstration account is provided.",
    art: <PenaltyPreview />,
  },
  {
    id: "assistant",
    eyebrow: "Uncertain how to word your request?",
    title: (
      <>
        Describe the problem.
        <br />
        <span className="text-navy-600">This will be phrased as a formal request.</span>
      </>
    ),
    body: "Describe the problem in everyday language, and it will be converted into a formal request for records, not opinions, addressed to the officer required to respond. Every word may be reviewed before submission.",
    primary: { label: "Get assistance", href: "/assistant" },
    secondary: { label: "See an example", href: "/assistant" },
    note: "Nothing is submitted without explicit confirmation.",
    art: <AssistantArt />,
  },
  {
    id: "department",
    eyebrow: "Uncertain which office to approach?",
    title: (
      <>
        Uncertain which office is responsible?
        <br />
        <span className="text-navy-600">The correct authority will be identified.</span>
      </>
    ),
    body: "A request sent to the wrong office is returned, fee included. Describe the issue, and the responsible office will be identified, along with the reason for that determination.",
    primary: { label: "Find the right department", href: "/find-department" },
    secondary: { label: "How it works", href: "/about" },
    note: "Road, sewage, water, school, hospital and nine more.",
    art: <RoutingArt />,
  },
];

export default function HomePage() {
  return (
    <>
      <GovHeader />

      <main id="main" className="flex-1">
        {/* Hero — a full-bleed band directly under the masthead. */}
        <HeroCarousel slides={HERO_SLIDES} />

        {/* How it works, before what is wrong with it — a visitor who
            has never filed needs the shape of the process first. */}
        <section className="mx-auto w-full max-w-[1600px] px-4 pt-10 sm:px-8 lg:px-10 xl:px-12">
          <HowToFileSteps />
        </section>

        <section className="mx-auto w-full max-w-[1600px] px-4 pt-8 sm:px-8 lg:px-10 xl:px-12">
          <GeneralInformation />
        </section>

      </main>

      <GovFooter />
    </>
  );
}

/** The accountability idea in one card: a real penalty, already running. */
function PenaltyPreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-surface">
      <div className="border-b border-line bg-navy-50/50 px-5 py-3">
        <p className="text-[11px] uppercase tracking-wider text-muted">
          MORTH/R/E/26/01193
        </p>
        <p className="mt-0.5 font-semibold text-ink">
          How ₹4.2 crore of road repair money was spent in my ward
        </p>
      </div>
      <div className="bg-govred-50 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-govred-700/80">
          Penalty accruing against the officer
        </p>
        <p className="mt-1 text-4xl font-bold tabular-nums text-govred-700">
          ₹1,000
        </p>
        <p className="mt-1 text-sm text-govred-700">
          4 days late · ₹250/day · RTI Act s.20
        </p>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm leading-relaxed text-ink-2">
          The legal deadline was missed on this request. A free appeal to a
          senior officer may be filed.
        </p>
        <span className="mt-3 inline-block rounded-lg bg-saffron-500 px-4 py-2 text-sm font-semibold text-white">
          File a First Appeal
        </span>
      </div>
    </div>
  );
}
