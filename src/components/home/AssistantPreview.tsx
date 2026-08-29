"use client";

import { PreviewCard } from "./PreviewCard";
import {
  COL,
  Mini,
  MiniButton,
  MiniField,
  MiniTitle,
  MINI_W,
  ROW3,
  Sequence,
  StepHeader,
  T,
  Tick,
} from "./Storyboard";

/* ------------------------------------------------------------------
   The assistant's six steps, reproduced.

   Every screen is the real one: the shell's "STEP n OF 6" header with
   its six segments and the step's own name, the real page titles and
   subtitles ("What do you need information about?", "The same problem
   is handled by different offices in different places."), and the real
   primary button at each stage — Continue to location, Find the
   department, Continue to draft the request, Draft the request, Check
   and finish, Continue to the form.

   Contact-sheet size in the hero card, where the shape of the flow is
   the point; the expand button opens the same six large enough to read.
------------------------------------------------------------------- */

const HEIGHT = ROW3[2] + 98 + 2;

const SCREENS = [
  // 1 — Problem
  <Mini key="problem" x={COL[0]} y={ROW3[0]}>
    <StepHeader n={1} of={6} label="Describe the problem" />
    <MiniTitle
      title="What do you need information about?"
      sub={["Tell us what happened in your own words. We’ll turn it", "into a request for records."]}
    />
    <rect x="7" y="58" width={MINI_W - 14} height="22" rx="3" fill="#fff" stroke={T.line} />
    <text x="11" y="66" fontSize="5" fill={T.ink}>
      The road outside my house has been dug up for five months
    </text>
    <text x="11" y="74" fontSize="5" fill={T.ink}>
      and nobody will tell me who is meant to be fixing it.
    </text>
    <MiniButton text="Continue to location" />
  </Mini>,

  // 2 — Location
  <Mini key="location" x={COL[1]} y={ROW3[0]}>
    <StepHeader n={2} of={6} label="Location" />
    <MiniTitle
      title="Location"
      sub={["The same problem is handled by different offices in", "different places."]}
    />
    <MiniField y={58} label="Your state" value="Maharashtra" w={80} muted={false} />
    <MiniField y={58} x={97} label="City / town" value="Pune" w={80} muted={false} />
    <MiniButton text="Find the department" />
  </Mini>,

  // 3 — Authority
  <Mini key="authority" x={COL[0]} y={ROW3[1]}>
    <StepHeader n={3} of={6} label="Authority" />
    <MiniTitle title="This is most likely with the Public Works Dept" />
    <rect x="7" y="42" width={MINI_W - 14} height="26" rx="3.5" fill={T.green50} stroke={T.green} />
    <Tick cx={16} cy={55} r={5} />
    <text x="25" y="52" fontSize="5.4" fontWeight="700" fill={T.navy}>
      Public Works Department, Municipal Corporation
    </text>
    <text x="25" y="60" fontSize="4.8" fill={T.ink2}>
      Roads inside a ward are municipal, not state.
    </text>
    <text x="7" y="76" fontSize="4.8" fill={T.muted}>
      Also considered: State PWD (highways only), District Collectorate.
    </text>
    <MiniButton text="Continue to draft the request" />
  </Mini>,

  // 4 — Asks
  <Mini key="asks" x={COL[1]} y={ROW3[1]}>
    <StepHeader n={4} of={6} label="Information sought" />
    <MiniTitle
      title="Select the information sought"
      sub={["Each selection becomes a numbered point in the request."]}
    />
    {[
      "The sanction order and cost estimate for the work",
      "The contractor’s name and the date of award",
      "The scheduled completion date and any extension",
    ].map((a, i) => (
      <g key={a}>
        <rect x="7" y={49 + i * 11} width="6.5" height="6.5" rx="1.6" fill={T.blue} />
        <path
          d={`M8.8 ${52.4 + i * 11} 10.2 ${53.8 + i * 11} 12.7 ${50.9 + i * 11}`}
          stroke="#fff"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="18" y={54.6 + i * 11} fontSize="5" fill={T.ink}>
          {a}
        </text>
      </g>
    ))}
    <text x="7" y="90" fontSize="4.8" fill={T.muted}>
      + Add a custom point
    </text>
    <MiniButton text="Draft the request" />
  </Mini>,

  // 5 — Draft
  <Mini key="draft" x={COL[0]} y={ROW3[2]}>
    <StepHeader n={5} of={6} label="Draft" />
    <MiniTitle title="Your request is ready" sub={["This text may be edited freely."]} />
    <rect x="7" y="46" width={MINI_W - 14} height="34" rx="3" fill="#fff" stroke={T.line} />
    <text x="11" y="54" fontSize="4.8" fill={T.ink}>
      Under section 6 of the Right to Information Act, 2005, please
    </text>
    <text x="11" y="61" fontSize="4.8" fill={T.ink}>
      provide: 1. the sanction order and cost estimate for the work;
    </text>
    <text x="11" y="68" fontSize="4.8" fill={T.ink}>
      2. the contractor’s name and the date of award; 3. the
    </text>
    <text x="11" y="75" fontSize="4.8" fill={T.ink}>
      scheduled completion date and any extension granted.
    </text>
    <MiniButton text="Check and finish" />
  </Mini>,

  // 6 — Review
  <Mini key="review" x={COL[1]} y={ROW3[2]}>
    <StepHeader n={6} of={6} label="Review" />
    <MiniTitle title="Review before submission" />
    {[
      ["Addressed to", "Public Works Dept, Municipal Corporation"],
      ["Information sought", "3 numbered points"],
      ["Period covered", "The last year"],
      ["Your state", "Maharashtra · Pune"],
    ].map(([k, v], i) => (
      <g key={k}>
        <text x="7" y={45 + i * 11} fontSize="4.6" fontWeight="700" fill={T.muted}>
          {k.toUpperCase()}
        </text>
        <text x="62" y={45 + i * 11} fontSize="5" fill={T.ink}>
          {v}
        </text>
        <line x1="7" y1={48.5 + i * 11} x2={MINI_W - 7} y2={48.5 + i * 11} stroke={T.line2} />
      </g>
    ))}
    <MiniButton text="Continue to the form" />
  </Mini>,
];

export function AssistantPreview() {
  return (
    <PreviewCard
      eyebrow="Uncertain how to word your request?"
      title="The assistant, all six steps"
      footer="Describe the problem in your own words; the assistant identifies the office required to answer and why, turns your selections into numbered points, drafts the request in the wording the Act expects, and hands that draft to the filing form. Every word can be edited, and nothing is submitted without explicit confirmation."
    >
      {(mode) => (
        <Sequence
          steps={SCREENS}
          height={HEIGHT}
          instant={mode === "full"}
          label="The assistant's six steps: describe the problem, location, the responsible authority, select the information sought, the drafted request, and review before submission"
        />
      )}
    </PreviewCard>
  );
}
