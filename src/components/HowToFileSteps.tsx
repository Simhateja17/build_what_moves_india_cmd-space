import { Reveal } from "./Reveal";
import { STEP_ART } from "./StepIllustrations";

/* ------------------------------------------------------------------
   How to file an RTI online, in ten steps.

   Laid out as the familiar government-guide infographic: five across,
   two rows, each step a numbered card with a picture of the screen the
   citizen will actually be looking at, and an arrow to the next.

   The numbering is load-bearing rather than decorative — this is a
   statutory process that runs in a fixed order on a fixed clock, and
   step 10 only makes sense once you know step 7 gave you a number.
------------------------------------------------------------------- */

const STEPS = [
  {
    title: "Go to the RTI Online Portal",
    body: "Visit the official RTI Online Portal at rtionline.gov.in. Only central ministries and departments can be asked here.",
  },
  {
    title: "Register yourself",
    body: "Create an account using your email ID and mobile number. Your registration number and every alert will come to both.",
  },
  {
    title: "Login to your account",
    body: "Sign in with the email ID and password you registered. Everything you file stays listed under this account.",
  },
  {
    title: "Select the public authority",
    body: "Choose the ministry, department and public authority that holds the record. Picking the wrong one gets the request returned.",
  },
  {
    title: "Fill the RTI application form",
    body: "Give your details and write your request clearly. Ask for records — files, orders, dates, amounts — not opinions.",
  },
  {
    title: "Pay the application fee",
    body: "The fee is ₹10, by UPI, net banking, card or wallet. Nothing at all if you hold a BPL card and attach a copy.",
  },
  {
    title: "Submit your application",
    body: "Check the details and submit. A unique registration number is issued — keep it, as tracking and appeals both need it.",
  },
  {
    title: "Receive acknowledgement",
    body: "An acknowledgement with your registration number arrives by email, and by SMS if you gave a mobile number.",
  },
  {
    title: "Track your application",
    body: "Use the registration number to see where the request has reached and what the officer has done with it.",
  },
  {
    title: "Receive information, or appeal",
    body: "The officer must reply within 30 days — 48 hours where life or liberty is concerned. If they don't, a first appeal is free.",
  },
];

export function HowToFileSteps() {
  return (
    // No panel around this one. The ten step cards are already floating
    // white on the canvas; wrapping them in a second white panel put a
    // card inside a card and flattened the whole block.
    <Reveal className="py-2">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-navy-900">
          How to file an RTI online
        </h2>
        <p className="mx-auto mt-2.5 max-w-2xl text-ink-2">
          A step-by-step guide to requesting information from a public
          authority — the ten screens you will actually see, in order.
        </p>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {STEPS.map(({ title, body }, i) => {
          const Art = STEP_ART[i];
          // No arrow after the last card, nor at the end of a full row.
          const endOfRow = (i + 1) % 5 === 0;
          return (
            <li key={title} className="relative h-full">
              <Reveal
                delay={i * 60}
                className="flex h-full flex-col rounded-[12px] border border-line bg-surface p-4 transition hover:border-navy-600 hover:shadow-[var(--shadow-panel)]"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[15px] font-bold leading-tight tracking-tight text-navy-900">
                    {title}
                  </p>
                </div>

                <div className="my-4 flex flex-1 items-center justify-center">
                  <Art className="h-auto w-full" />
                </div>

                <p className="text-[13px] leading-relaxed text-ink-2">{body}</p>
              </Reveal>

              {/* The thread between steps. Hidden at the end of each row
                  and on stacked layouts, where reading order already
                  carries the sequence. */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute -right-3 top-1/2 hidden -translate-y-1/2 text-xl font-bold text-navy-600 ${
                    endOfRow ? "" : "xl:block"
                  }`}
                >
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}
