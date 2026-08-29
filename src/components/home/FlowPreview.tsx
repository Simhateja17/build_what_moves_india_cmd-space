"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * The rewind has to happen before the browser paints, not after.
 *
 * The chart renders finished so that a reader with no scripting, or with
 * reduced motion, gets the whole thing. But an ordinary visitor was then
 * shown that finished chart for a moment before it wound back and built —
 * which put every box on screen at once, endings and refusals together,
 * exactly what the ordering below is for. A layout effect resets it in the
 * same frame, so the flash never reaches the screen.
 */
const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
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

const BOX_H = 18;
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
  /** Which beat of the story reveals it. See PHASES below. */
  phase: number;
}

const NODES: Node[] = [
  {
    id: "request",
    cx: 190,
    level: 0,
    w: 96,
    label: "RTI REQUEST",
    tone: "navy",
    phase: 1,
  },

  // The good outcome first, and alone: a reply arrives and that is the end
  // of it. Everything after is what happens when it does not.
  {
    id: "reply1",
    cx: 58,
    level: 1,
    w: 78,
    label: "REPLY",
    tone: "step",
    phase: 2,
  },
  {
    id: "sat1",
    cx: 45,
    level: 4,
    w: 74,
    label: "SATISFIED",
    tone: "green",
    phase: 3,
  },

  {
    id: "transfer",
    cx: 190,
    level: 1,
    w: 84,
    label: "TRANSFER",
    tone: "step",
    phase: 4,
  },
  {
    id: "noreply1",
    cx: 322,
    level: 1,
    w: 84,
    label: "NO REPLY",
    tone: "step",
    phase: 4,
  },

  {
    id: "reply2",
    cx: 145,
    level: 2,
    w: 74,
    label: "REPLY",
    tone: "step",
    phase: 5,
  },
  {
    id: "noreply2",
    cx: 250,
    level: 2,
    w: 74,
    label: "No REPLY",
    tone: "step",
    phase: 5,
  },

  {
    id: "unsat1",
    cx: 200,
    level: 3,
    w: 80,
    label: "Not Satisfied",
    tone: "red",
    phase: 6,
  },
  {
    id: "notime",
    cx: 322,
    level: 3,
    w: 78,
    label: "NO TIME LIMIT",
    tone: "amber",
    phase: 7,
  },

  {
    id: "appeal1",
    cx: 170,
    level: 4,
    w: 84,
    label: "FIRST APPEAL",
    tone: "step",
    phase: 8,
  },
  {
    id: "s18",
    cx: 302,
    level: 4,
    w: 132,
    label: "SECTION 18 COMPLAINT TO CIC",
    tone: "amber",
    phase: 8,
  },

  {
    id: "decision",
    cx: 150,
    level: 5,
    w: 80,
    label: "DECISION",
    tone: "step",
    phase: 9,
  },
  {
    id: "nodecision",
    cx: 265,
    level: 5,
    w: 86,
    label: "NO DECISION",
    tone: "step",
    phase: 9,
  },

  {
    id: "sat2",
    cx: 42,
    level: 6,
    w: 64,
    label: "SATISFIED",
    tone: "green",
    phase: 10,
  },
  {
    id: "unsat2",
    cx: 130,
    level: 6,
    w: 68,
    label: "Not Satisfied",
    tone: "red",
    phase: 11,
  },
  {
    id: "appeal2",
    cx: 290,
    level: 6,
    w: 156,
    label: "SECOND APPEAL TO CIC / SIC",
    tone: "step",
    phase: 12,
  },
];

interface Edge {
  d: string;
  /** The beat that draws it — the same one that reveals the box it enters. */
  phase: number;
  badges?: { text: string; x: number; y: number }[];
}

const EDGES: Edge[] = [
  // Beat 2 and 3: the request is answered, and that is the end of it.
  {
    d: "M190 18 V28 H58 V35",
    phase: 2,
    badges: [{ text: "30d", x: 58, y: 28 }],
  },
  { d: "M58 53 V133 H45 V140", phase: 3 },

  // Beat 4 onwards: what happens when it is not. 30 / 5 / 30, as on the
  // official chart — a transfer to the right office has its own five-day
  // clock before the thirty starts again.
  { d: "M190 18 V35", phase: 4, badges: [{ text: "5d", x: 190, y: 28 }] },
  {
    d: "M190 18 V28 H322 V35",
    phase: 4,
    badges: [{ text: "30d", x: 322, y: 28 }],
  },

  {
    d: "M190 53 V63 H145 V70",
    phase: 5,
    badges: [{ text: "30d", x: 145, y: 63 }],
  },
  {
    d: "M190 53 V63 H250 V70",
    phase: 5,
    badges: [{ text: "30d", x: 250, y: 63 }],
  },

  // Both replies land on the same Not Satisfied fork.
  { d: "M58 53 V98 H200 V105", phase: 6 },
  { d: "M145 88 V98 H200 V105", phase: 6 },

  // The right-hand silence runs straight past the transfer branch to the
  // complaint route, which has no clock on it at all.
  { d: "M322 53 V105", phase: 7 },

  {
    d: "M200 123 V133 H170 V140",
    phase: 8,
    badges: [{ text: "30d", x: 200, y: 133 }],
  },
  {
    d: "M250 88 V133 H170 V140",
    phase: 8,
    badges: [
      { text: "AND", x: 250, y: 98 },
      { text: "30d", x: 240, y: 133 },
    ],
  },
  { d: "M322 123 V133 H302 V140", phase: 8 },

  {
    d: "M170 158 V168 H150 V175",
    phase: 9,
    badges: [{ text: "45d", x: 150, y: 168 }],
  },
  {
    d: "M170 158 V168 H265 V175",
    phase: 9,
    badges: [{ text: "45d", x: 265, y: 168 }],
  },

  { d: "M150 193 V203 H42 V210", phase: 10 },
  { d: "M150 193 V203 H130 V210", phase: 11 },
  // The bottom row runs sideways, as it does on the original.
  {
    d: "M164 219 H212",
    phase: 12,
    badges: [{ text: "90d", x: 188, y: 219 }],
  },
  {
    d: "M265 193 V203 H290 V210",
    phase: 12,
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

/**
 * Eleven beats, ordered as a story rather than as rows of the diagram.
 *
 * The good outcome comes first and gets time to itself: a request is filed,
 * a reply arrives, and that is the end of it. Only then does the chart show
 * what happens when it does not — the transfer, the silence, the appeals.
 * Built row by row, the SATISFIED box arrived in the middle of the refusal
 * branch and read as one more consequence of things going wrong.
 */
const PHASES = 12;

/**
 * How long each beat holds before the next.
 *
 * Both good endings get their own beat and just under a second after it —
 * beat 3, where a reply settles the request, and beat 10, where the appeal
 * does. The refusal that follows each one waits out that pause: a SATISFIED
 * box and a Not Satisfied box appearing together is the one thing this
 * ordering exists to prevent.
 */
const DWELL: Record<number, number> = {
  0: 500,
  1: 1000,
  2: 1200,
  3: 980,
  10: 980,
};
const DWELL_DEFAULT = 560;

/**
 * How long the chart takes to build, plus a beat on the finished thing.
 * The hero waits for this before moving on: a slide that changes mid-build
 * shows a half-drawn chart and then takes it away.
 */
export const FLOW_CYCLE_MS =
  Array.from({ length: PHASES }, (_, i) => DWELL[i] ?? DWELL_DEFAULT).reduce(
    (a, b) => a + b,
    0,
  ) + 2200;

export function FlowPreview() {
  // Rendered complete, then rewound to build: a reader with reduced motion,
  // or with JS off, gets the whole chart rather than an empty panel.
  const [stage, setStage] = useState<number>(PHASES);

  useBeforePaint(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    // It builds once and then stays built. Looping made the chart restart
    // under anyone still reading it, which is worse than not animating at
    // all — the first render already shows the finished chart, so the only
    // job here is to rewind it once and play it forward.
    let count = 0;
    setStage(0);
    const tick = () => {
      count += 1;
      setStage(count);
      if (count < PHASES) {
        timer = setTimeout(tick, DWELL[count] ?? DWELL_DEFAULT);
      }
    };
    timer = setTimeout(tick, DWELL[0]);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PreviewCard
      eyebrow="Every route a request can take"
      title="The law already says what happens next"
      footer="Deadlines are the ones the Act sets. Every appeal is free, and the officer owes ₹250 a day past the reply deadline under s.20."
    >
      {/* Finished in the dialog: it is opened to be read, not watched. */}
      {(mode) => <FlowChart stage={mode === "full" ? PHASES : stage} />}
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
        const on = stage >= e.phase;
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
        // `phase` is when it is revealed; `level` is only where it sits.
        const on = stage >= n.phase;
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
              rx={BOX_H / 2}
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
            opacity={stage >= e.phase ? 1 : 0}
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
