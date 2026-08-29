"use client";

import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";
import { HowToFileSteps } from "@/components/HowToFileSteps";
import { HeroCarousel, HeroSlide } from "@/components/home/HeroCarousel";
import { GeneralInformation } from "@/components/home/GeneralInformation";
import { FlowPreview, FLOW_CYCLE_MS } from "@/components/home/FlowPreview";
import {
  AssistantPreview,
  ASSISTANT_CYCLE_MS,
} from "@/components/home/AssistantPreview";
import {
  RequestPreview,
  REQUEST_CYCLE_MS,
} from "@/components/home/RequestPreview";
import { useLocale } from "@/lib/i18n";

/**
 * Three things a visitor could be here for: the argument for the
 * redesign, help wording a request, or help working out whose problem
 * it even is. The last one is where most first-time filers actually
 * are, so it gets a slide of its own rather than a link buried below.
 */
function buildHeroSlides(t: ReturnType<typeof useLocale>["t"]): HeroSlide[] {
  return [
    {
      id: "pitch",
      eyebrow: t("Right to Information Act, 2005"),
      title: (
        <>
          {t("You have the right to ask.")}
          <br />
          <span className="text-navy-600">
            {t("The law requires an answer.")}
          </span>
        </>
      ),
      body: t(
        "Any citizen of India may request records held by a public authority, and the law requires a reply within 30 days. RTI Saral is built to make that right straightforward to exercise.",
      ),
      primary: { label: t("Try the demo"), href: "/login" },
      secondary: { label: t("How it works"), href: "/faq" },
      note: t("No signup is required. A demonstration account is provided."),
      art: <FlowPreview />,
      holdMs: FLOW_CYCLE_MS,
    },
    {
      id: "assistant",
      eyebrow: t("Uncertain how to word your request?"),
      title: (
        <>
          {t("Describe the problem.")}
          <br />
          <span className="text-navy-600">
            {t("This will be phrased as a formal request.")}
          </span>
        </>
      ),
      body: t(
        "Describe the problem in everyday language, and it will be converted into a formal request for records, not opinions, addressed to the officer required to respond. Every word may be reviewed before submission.",
      ),
      primary: { label: t("Get assistance"), href: "/assistant" },
      secondary: { label: t("See an example"), href: "/assistant" },
      note: t("Nothing is submitted without explicit confirmation."),
      art: <AssistantPreview />,
      holdMs: ASSISTANT_CYCLE_MS,
    },
    {
      id: "department",
      eyebrow: t("Uncertain which office to approach?"),
      title: (
        <>
          {t("Uncertain which office is responsible?")}
          <br />
          <span className="text-navy-600">
            {t("The correct authority will be identified.")}
          </span>
        </>
      ),
      body: t(
        "A request sent to the wrong office is returned, fee included. Describe the issue, and the responsible office will be identified, along with the reason for that determination.",
      ),
      primary: {
        label: t("Find the right department"),
        href: "/find-department",
      },
      secondary: { label: t("How it works"), href: "/faq" },
      note: t("Road, sewage, water, school, hospital and nine more."),
      art: <RequestPreview />,
      holdMs: REQUEST_CYCLE_MS,
    },
  ];
}

export default function HomePage() {
  const { t } = useLocale();
  const heroSlides = buildHeroSlides(t);
  return (
    <>
      <GovHeader />

      <main id="main" className="flex-1">
        {/* Hero — a full-bleed band directly under the masthead. */}
        <HeroCarousel slides={heroSlides} />

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
