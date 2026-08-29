"use client";

import { useEffect, useState } from "react";
import { PreviewCard } from "./PreviewCard";

/* ------------------------------------------------------------------
   The official RTI flowchart, box for box.

   Same sixteen boxes and the same clocks as the chart the portal
   publishes — REPLY, TRANSFER, NO REPLY, the AND on the transfer's
   silence branch, the s.18 complaint with no time limit, both
   SATISFIED endings, both Not Satisfied forks — and the 30 / 5 / 30,
   30 / 30, 30, 45 / 45, 90 / 90 day counts exactly as they appear
   there. Only the wording of the deadline badges is shortened to fit
   ("30d" for the original's "30 Days" beside an ellipse).

   Laid out on lanes over seven levels so no line crosses another, and
   built one level at a time.
------------------------------------------------------------------- */

const BOX_H = 21;
// Level tops: seven rows of box-plus-gap inside a 231-unit canvas.
const ROW = [0, 35, 70, 105, 140, 175, 210];

type Tone = "navy" | "step" | "red" | "amber" | "green";

interface Node {
  id: string;
  cx: number;
  level: number;
  w: number;
  label: string;
  tone: Tone;
}

const NODES: Node[] = [
  { id: "request", cx: 190, level: 0, w: 110, label: "RTI REQUEST", tone: "navy" },

  { id: "reply1", cx: 58, level: 1, w: 88, label: "REPLY", tone: "step" },
  { id: "transfer", cx: 190, level: 1, w: 96, label: "TRANSFER", tone: "step" },
  { id: "noreply1", cx: 322, level: 1, w: 96, label: "NO REPLY", tone: "step" },

  { id: "reply2", cx: 145, level: 2, w: 84, label: "REPLY", tone: "step" },
  { id: "noreply2", cx: 250, level: 2, w: 84, label: "No REPLY", tone: "step" },

  { id: "unsat1", cx: 200, level: 3, w: 92, label: "Not Satisfied", tone: "red" },
  { id: "notime", cx: 322, level: 3, w: 88, label: "NO TIME LIMIT", tone: "amber" },

  { id: "sat1", cx: 45, level: 4, w: 84, label: "SATISFIED", tone: "green" },
  { id: "appeal1", cx: 170, level: 4, w: 94, label: "FIRST APPEAL", tone: "step" },
  { id: "s18", cx: 302, level: 4, w: 148, label: "SECTION 18 COMPLAINT TO CIC", tone: "amber" },

  { id: "decision", cx: 150, level: 5, w: 90, label: "DECISION", tone: "step" },
  { id: "nodecision", cx: 265, level: 5, w: 98, label: "NO DECISION", tone: "step" },

  { id: "sat2", cx: 42, level: 6, w: 72, label: "SATISFIED", tone: "green" },
  { id: "unsat2", cx: 130, level: 6, w: 76, label: "Not Satisfied", tone: "red" },
  { id: "appeal2", cx: 290, level: 6, w: 176, label: "SECOND APPEAL TO CIC / SIC", tone: "step" },
];

interface Edge {
  d: string;
  /** The level the arrow arrives at, which is when it is drawn. */
  level: number;
  badges?: { text: string; x: number; y: number }[];
}

const EDGES: Edge[] = [
  // 30 / 5 / 30, as on the official chart: a transfer to the right office
  // has its own five-day clock before the thirty starts again.
  { d: "M190 21 V28 H58 V35", level: 1, badges: [{ text: "30d", x: 58, y: 28 }] },
  { d: "M190 21 V35", level: 1, badges: [{ text: "5d", x: 190, y: 28 }] },
  { d: "M190 21 V28 H322 V35", level: 1, badges: [{ text: "30d", x: 322, y: 28 }] },

  {
    d: "M190 56 V63 H145 V70",
    level: 2,
    badges: [{ text: "30d", x: 145, y: 63 }],
  },
  {
    d: "M190 56 V63 H250 V70",
    level: 2,
    badges: [{ text: "30d", x: 250, y: 63 }],
  },

  // Both replies land on the same Not Satisfied fork.
  { d: "M58 56 V98 H200 V105", level: 3 },
  { d: "M145 91 V98 H200 V105", level: 3 },
  // The right-hand silence runs straight past the transfer branch to the
  // complaint route, which has no clock on it at all.
  { d: "M322 56 V105", level: 3 },

  { d: "M58 56 V133 H45 V140", level: 4 },
  {
    d: "M200 126 V133 H170 V140",
    level: 4,
    badges: [{ text: "30d", x: 200, y: 133 }],
  },
  {
    d: "M250 91 V133 H170 V140",
    level: 4,
    badges: [
      { text: "AND", x: 250, y: 98 },
      { text: "30d", x: 240, y: 133 },
    ],
  },
  { d: "M322 126 V133 H302 V140", level: 4 },

  {
    d: "M170 161 V168 H150 V175",
    level: 5,
    badges: [{ text: "45d", x: 150, y: 168 }],
  },
  {
    d: "M170 161 V168 H265 V175",
    level: 5,
    badges: [{ text: "45d", x: 265, y: 168 }],
  },

  { d: "M150 196 V203 H42 V210", level: 6 },
  { d: "M150 196 V203 H130 V210", level: 6 },
  // The bottom row runs sideways, as it does on the original.
  {
    d: "M168 220 H202",
    level: 6,
    badges: [{ text: "90d", x: 185, y: 220 }],
  },
  {
    d: "M265 196 V203 H290 V210",
    level: 6,
    badges: [{ text: "90d", x: 277, y: 203 }],
  },
];

const FILL: Record<Tone, string> = {
  navy: "var(--navy-900)",
  step: "var(--navy-700)",
  red: "var(--red-600)",
  amber: "var(--saffron-500)",
  green: "var(--green-600)",
};

const LEVELS = ROW.length;
const STAGE_MS = 560;

export function FlowPreview() {
  // Rendered complete, then rewound to build: a reader with reduced motion,
  // or with JS off, gets the whole chart rather than an empty panel.
  const [stage, setStage] = useState<number>(LEVELS);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    // It builds once and then stays built. Looping made the chart restart
    // under anyone still reading it, which is worse than not animating at
    // all — the first render already shows the finished chart, so the only
    // job here is to rewind it once and play it forward.
    let count = -1;
    const tick = () => {
      count += 1;
      setStage(count);
      if (count < LEVELS) timer = setTimeout(tick, STAGE_MS);
    };
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PreviewCard
      eyebrow="Every route a request can take"
      title="The law already says what happens next"
      footer="Deadlines are the ones the Act sets. Every appeal is free, and the officer owes ₹250 a day past the reply deadline under s.20."
    >
      {/* Finished in the dialog: it is opened to be read, not watched. */}
      {(mode) => <FlowChart stage={mode === "full" ? LEVELS : stage} />}
    </PreviewCard>
  );
}

/**
 * The chart itself, so the card and the full-screen dialog draw from one
 * definition rather than two that can drift apart. `stage` is how far the
 * build has got; the dialog passes the finished number, because someone who
 * has opened it to study the process should not have to wait for it.
 */
function FlowChart({ stage }: { stage: number }) {
  return (
      <svg
        viewBox="0 0 380 231"
        className="h-auto w-full"
        role="img"
        aria-label="The official RTI flowchart: a request is replied to, transferred within five days, or ignored; an unsatisfactory reply or silence leads to a first appeal within thirty days, a decision or no decision within forty-five, and a second appeal to the Information Commission within ninety. Silence also allows a section 18 complaint with no time limit."
      >
        {/* Lines first, then boxes, then every badge — in that order and
            in three passes. Drawing each badge beside its own line let a
            later edge's run paint straight through an earlier badge, which
            read as a struck-through number. */}
        {EDGES.map((e) => {
          const on = stage > e.level - 1;
          return (
            <path
              key={e.d}
              d={e.d}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1.3"
              // pathLength normalises every route to 100 units, so one dash
              // offset draws them all at the same rate whatever their real
              // geometry.
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={on ? 0 : 100}
              style={{ transition: "stroke-dashoffset 340ms ease-out" }}
            />
          );
        })}

        {NODES.map((n) => {
          const on = stage > n.level;
          const y = ROW[n.level];
          return (
            <g
              key={n.id}
              opacity={on ? 1 : 0}
              style={{
                transition:
                  "opacity 260ms ease-out 180ms, transform 260ms ease-out 180ms",
                transform: on ? "none" : "translateY(-3px)",
              }}
            >
              <rect
                x={n.cx - n.w / 2}
                y={y}
                width={n.w}
                height={BOX_H}
                rx={5}
                fill={FILL[n.tone]}
              />
              <text
                x={n.cx}
                y={y + BOX_H / 2 + 2.8}
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#fff"
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {EDGES.flatMap((e) =>
          (e.badges ?? []).map((b) => (
            <g
              key={e.d + b.text + b.x + b.y}
              opacity={stage > e.level - 1 ? 1 : 0}
              style={{ transition: "opacity 240ms ease-out 160ms" }}
            >
              <rect
                x={b.x - 10.5}
                y={b.y - 5.5}
                width={21}
                height={11}
                rx={5.5}
                fill="var(--surface)"
                stroke="var(--line)"
              />
              <text
                x={b.x}
                y={b.y + 2.6}
                textAnchor="middle"
                fontSize="7"
                fontWeight="700"
                fill="var(--ink-2)"
              >
                {b.text}
              </text>
            </g>
          )),
        )}
      </svg>
  );
}
