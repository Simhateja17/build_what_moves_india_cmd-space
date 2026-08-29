import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";
import { HowToFileSteps } from "@/components/HowToFileSteps";
import { HeroCarousel, HeroSlide } from "@/components/home/HeroCarousel";
import { GeneralInformation } from "@/components/home/GeneralInformation";
import { FlowPreview } from "@/components/home/FlowPreview";
import { AssistantPreview } from "@/components/home/AssistantPreview";
import { RequestPreview } from "@/components/home/RequestPreview";

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
    secondary: { label: "How it works", href: "/faq" },
    note: "No signup is required. A demonstration account is provided.",
    art: <FlowPreview />,
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
    art: <AssistantPreview />,
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
    secondary: { label: "How it works", href: "/faq" },
    note: "Road, sewage, water, school, hospital and nine more.",
    art: <RequestPreview />,
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
