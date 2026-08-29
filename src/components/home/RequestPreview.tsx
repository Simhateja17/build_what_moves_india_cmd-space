"use client";

import { PreviewCard } from "./PreviewCard";
import {
  COL,
  Mini,
  MiniButton,
  MiniField,
  MiniTitle,
  MINI_W,
  Sequence,
  StepHeader,
  T,
  Tick,
} from "./Storyboard";

/* ------------------------------------------------------------------
   Filing by hand, and then tracking — the real screens.

   The four steps of the form, the acknowledgement that returns the
   registration number, and My requests given the whole width, because
   the list is where this redesign does its work and a two-column
   thumbnail could only ever show one kind of row.

   Every status in the list is a real one, taken from the vocabulary in
   lib/dashboard.ts and lib/derive.ts: the plain wording on top and the
   statutory term underneath, never the other way round. Between them
   the seven rows cover every state a request can be in — deemed
   refusal, action required, partly denied, in appeal, disposed of,
   pending with the CPIO, closed.
------------------------------------------------------------------- */

const ROW = [0, 110];
const ACK_Y = 220;
const LIST_Y = 276;
const LIST_H = 162;
const HEIGHT = LIST_Y + LIST_H + 2;

const CHIPS = ["All", "With the department", "Action needed", "Answered", "In appeal"];

interface Case {
  ref: string;
  filed: string;
  dept: string;
  plain: string;
  official: string;
  tone: "warn" | "good" | "info" | "muted";
  when: string;
  whenTone: "danger" | "good" | "warn" | "ink";
  /** Fraction of the reply window used, where one is still running. */
  bar?: number;
  appeal?: boolean;
  unread?: boolean;
}

const CASES: Case[] = [
  { ref: "MORTH/R/E/26/01193", filed: "24 Jul 2026", dept: "Public Works Division, Ward 14", plain: "Action needed", official: "DEEMED REFUSAL — S.7(2)", tone: "warn", when: "4 days overdue", whenTone: "danger" },
  { ref: "DOPPW/R/E/26/00842", filed: "21 Aug 2026", dept: "Dept of Pension & Pensioners’ Welfare", plain: "Action needed", official: "ACTION REQUIRED", tone: "warn", when: "34 days left", whenTone: "ink", bar: 0.2 },
  { ref: "MOEAF/R/E/26/01764", filed: "19 Jul 2026", dept: "Regional Passport Office", plain: "Action needed", official: "DISPOSED OF — PARTLY DENIED", tone: "warn", when: "Answered", whenTone: "good", unread: true },
  { ref: "MORDV/R/E/26/00915", filed: "6 Jul 2026", dept: "Department of Land Resources", plain: "Action needed", official: "ACTION REQUIRED", tone: "warn", when: "With appellate authority", whenTone: "warn", appeal: true },
  { ref: "DOFPD/R/E/26/03310", filed: "9 Aug 2026", dept: "Dept of Food & Public Distribution", plain: "Answered", official: "DISPOSED OF", tone: "good", when: "Answered", whenTone: "good", unread: true },
  { ref: "MOEDU/R/E/26/00267", filed: "7 Aug 2026", dept: "Dept of School Education & Literacy", plain: "With the department", official: "PENDING WITH CPIO", tone: "info", when: "10 days left", whenTone: "ink", bar: 0.66 },
  { ref: "MOHFW/R/E/26/02048", filed: "1 Aug 2026", dept: "National Health Mission", plain: "Closed", official: "DISPOSED OF", tone: "muted", when: "Answered", whenTone: "good" },
];

const CHIP_FILL: Record<Case["tone"], { bg: string; ring: string; ink: string }> = {
  warn: { bg: T.amber50, ring: "var(--saffron-400)", ink: "var(--saffron-600)" },
  good: { bg: T.green50, ring: T.green, ink: "var(--green-700)" },
  info: { bg: T.pale, ring: T.blue, ink: T.navy },
  muted: { bg: "#fff", ring: T.line, ink: T.muted },
};

const WHEN_INK: Record<Case["whenTone"], string> = {
  danger: T.red700,
  good: "var(--green-700)",
  warn: "var(--saffron-600)",
  ink: T.ink,
};

const ROW_H = 15;

const SCREENS = [
  <Mini key="authority" x={COL[0]} y={ROW[0]}>
    <StepHeader n={1} of={4} label="Authority" />
    <MiniTitle title="Select the authority" sub={["If you are unsure, select your best estimate."]} />
    <MiniField y={50} label="Ministry / department" value="Public Works Department" muted={false} />
    <MiniField y={71} label="Office" value="Municipal Corporation, Pune" muted={false} />
    <MiniButton text="Continue" />
  </Mini>,

  <Mini key="describe" x={COL[1]} y={ROW[0]}>
    <StepHeader n={2} of={4} label="Request" />
    <MiniTitle
      title="Describe your request"
      sub={["You are entitled to records already held, and are not", "required to give a reason."]}
    />
    {["Provide a copy of…", "How much was spent…", "What is the status of…"].map((c, i) => (
      <g key={c}>
        <rect x={7 + i * 58} y="53" width="54" height="8" rx="4" fill={T.pale} stroke={T.line} />
        <text x={34 + i * 58} y="58.8" fontSize="4.4" fontWeight="700" textAnchor="middle" fill={T.blue}>
          {c}
        </text>
      </g>
    ))}
    <rect x="7" y="65" width={MINI_W - 14} height="15" rx="3" fill="#fff" stroke={T.line} />
    <text x="11" y="71" fontSize="4.8" fill={T.ink}>
      Under section 6 of the Right to Information Act, 2005, please
    </text>
    <text x="11" y="77.5" fontSize="4.8" fill={T.ink}>
      provide: 1. the sanction order and cost estimate for the work;
    </text>
    <MiniButton text="Continue" />
  </Mini>,

  <Mini key="applicant" x={COL[0]} y={ROW[1]}>
    <StepHeader n={3} of={4} label="Applicant" />
    <MiniTitle title="Applicant details" sub={["Only what the Act requires — no gender, no literacy."]} />
    <MiniField y={50} label="Full name" value="Ananya Sharma" w={80} muted={false} />
    <MiniField y={50} x={97} label="Mobile" value="For SMS updates" w={80} />
    <MiniField y={71} label="Address" value="Ward 14, Pune 411001" w={80} muted={false} />
    <rect x="97" y="71" width="80" height="11" rx="3" fill={T.pale} stroke={T.line} />
    <text x="101" y="78.4" fontSize="4.8" fontWeight="700" fill={T.blue}>
      Fee ₹10 · waived for BPL
    </text>
    <MiniButton text="Continue" />
  </Mini>,

  <Mini key="review" x={COL[1]} y={ROW[1]}>
    <StepHeader n={4} of={4} label="Review" />
    <MiniTitle title="Review and submit" />
    {[
      ["Addressed to", "Public Works Dept, Pune"],
      ["Information sought", "3 numbered points"],
      ["Applicant", "Ananya Sharma · Ward 14"],
      ["Fee", "₹10 by UPI"],
    ].map(([k, v], i) => (
      <g key={k}>
        <text x="7" y={42 + i * 10} fontSize="4.6" fontWeight="700" fill={T.muted}>
          {k.toUpperCase()}
        </text>
        <text x="62" y={42 + i * 10} fontSize="5" fill={T.ink}>
          {v}
        </text>
        <text x={MINI_W - 7} y={42 + i * 10} fontSize="4.6" fontWeight="700" textAnchor="end" fill={T.blue}>
          Edit
        </text>
        <line x1="7" y1={45 + i * 10} x2={MINI_W - 7} y2={45 + i * 10} stroke={T.line2} />
      </g>
    ))}
    <text x="7" y="90" fontSize="4.6" fill={T.muted}>
      Nothing is submitted without this confirmation.
    </text>
    <MiniButton text="Submit request" y={78} />
  </Mini>,

  // The acknowledgement, given the full width because it is one line of news.
  <g key="ack">
    <rect x="0.5" y={ACK_Y + 0.5} width="379" height="44" rx="5" fill={T.green50} stroke={T.green} />
    <Tick cx={18} cy={ACK_Y + 22} r={8} />
    <text x="33" y={ACK_Y + 17} fontSize="4.6" fontWeight="700" fill={T.muted}>
      REGISTRATION NUMBER
    </text>
    <text x="33" y={ACK_Y + 30} fontSize="9" fontWeight="700" fill={T.navy}>
      PWD/R/E/26/01207
    </text>
    <text x="150" y={ACK_Y + 20} fontSize="5.4" fill={T.ink2}>
      The office has 30 days to reply — s.7(1). The deadline is counted
    </text>
    <text x="150" y={ACK_Y + 30} fontSize="5.4" fill={T.ink2}>
      for you from here on. Quote this number in any appeal.
    </text>
    <rect x="308" y={ACK_Y + 14} width="64" height="14" rx="4" fill={T.blue} />
    <text x="340" y={ACK_Y + 23.4} fontSize="5.4" fontWeight="700" textAnchor="middle" fill="#fff">
      Track this request
    </text>
  </g>,

  // My requests, full width — every status the list can show.
  <g key="list">
    <rect x="0.5" y={LIST_Y + 0.5} width="379" height={LIST_H} rx="5" fill="#fff" stroke={T.line} />
    <text x="9" y={LIST_Y + 15} fontSize="8" fontWeight="700" fill={T.navy}>
      My requests
    </text>
    <rect x="268" y={LIST_Y + 6} width="104" height="11" rx="5.5" fill="#fff" stroke={T.line} />
    <text x="274" y={LIST_Y + 13.6} fontSize="4.8" fill={T.muted}>
      Search requests…
    </text>
    {CHIPS.map((c, i) => {
      const w = c.length * 2.5 + 9;
      const x = 9 + CHIPS.slice(0, i).reduce((n, p) => n + p.length * 2.5 + 12, 0);
      const on = i === 0;
      return (
        <g key={c}>
          <rect x={x} y={LIST_Y + 22} width={w} height="9" rx="4.5" fill={on ? T.blue : "#fff"} stroke={on ? T.blue : T.line} />
          <text x={x + w / 2} y={LIST_Y + 28.4} fontSize="4.6" fontWeight="700" textAnchor="middle" fill={on ? "#fff" : T.ink2}>
            {c}
          </text>
        </g>
      );
    })}

    <text x="9" y={LIST_Y + 41} fontSize="4.2" fontWeight="700" fill={T.muted}>APPLICATION NO.</text>
    <text x="88" y={LIST_Y + 41} fontSize="4.2" fontWeight="700" fill={T.muted}>PUBLIC AUTHORITY</text>
    <text x="176" y={LIST_Y + 41} fontSize="4.2" fontWeight="700" fill={T.muted}>STATUS</text>
    <text x="272" y={LIST_Y + 41} fontSize="4.2" fontWeight="700" fill={T.muted}>DEADLINE</text>
    <line x1="6" y1={LIST_Y + 44} x2="374" y2={LIST_Y + 44} stroke={T.line2} />

    {CASES.map((c, i) => {
      const y = LIST_Y + 44 + i * ROW_H;
      const chip = CHIP_FILL[c.tone];
      const chipW = Math.max(c.plain.length * 2.4, c.official.length * 1.85) + 9;
      return (
        <g key={c.ref}>
          {/* The rail the real list runs down rows that want something from you. */}
          {c.tone === "warn" ? (
            <rect x="1.5" y={y + 1} width="2.5" height={ROW_H - 2} rx="1.25" fill={T.amber} />
          ) : null}
          {c.unread ? <circle cx="8" cy={y + 6.5} r="1.8" fill={T.blue} /> : null}
          <text x={c.unread ? 12 : 9} y={y + 8} fontSize="4.4" fontWeight="700" fill={T.ink}>
            {c.ref}
          </text>
          {c.appeal ? (
            <g>
              <rect x="63" y={y + 3} width="21" height="6.5" rx="3.25" fill={T.navy} />
              <text x="73.5" y={y + 7.7} fontSize="3.4" fontWeight="700" textAnchor="middle" fill="#fff">
                IN APPEAL
              </text>
            </g>
          ) : null}
          <text x="9" y={y + 13} fontSize="3.6" fill={T.muted}>
            Filed {c.filed}
          </text>

          <text x="88" y={y + 10} fontSize="4.4" fill={T.ink}>
            {c.dept}
          </text>

          <rect x="176" y={y + 1.5} width={chipW} height={ROW_H - 3.5} rx="3" fill={chip.bg} stroke={chip.ring} />
          <text x="180" y={y + 7} fontSize="4.2" fontWeight="700" fill={chip.ink}>
            {c.plain}
          </text>
          <text x="180" y={y + 11.6} fontSize="3.2" fontWeight="600" fill={chip.ink} opacity="0.72">
            {c.official}
          </text>

          <text x="272" y={y + 8} fontSize="4.2" fontWeight="700" fill={WHEN_INK[c.whenTone]}>
            {c.when}
          </text>
          {c.whenTone === "danger" ? (
            <rect x="272" y={y + 10} width="34" height="1.4" rx="0.7" fill={T.red} />
          ) : null}
          {c.bar !== undefined ? (
            <g>
              <rect x="272" y={y + 10} width="34" height="1.6" rx="0.8" fill={T.line2} />
              <rect x="272" y={y + 10} width={34 * c.bar} height="1.6" rx="0.8" fill={T.blue} />
            </g>
          ) : null}

          <text x="348" y={y + 9} fontSize="4.2" fontWeight="700" fill={T.blue}>
            View →
          </text>
          <line x1="6" y1={y + ROW_H} x2="374" y2={y + ROW_H} stroke={T.line2} />
        </g>
      );
    })}

    <text x="9" y={LIST_Y + LIST_H - 5} fontSize="4.2" fill={T.muted}>
      Showing {CASES.length} of {CASES.length} requests
    </text>
  </g>,
];

export function RequestPreview() {
  return (
    <PreviewCard
      eyebrow="Filing by hand, then tracking it"
      title="The form’s four steps, and the list that keeps the clock"
      footer="Every field on the form is one the Act requires, and nothing is submitted without explicit confirmation. Afterwards the list carries the whole vocabulary of the Act — deemed refusal, partly denied, pending with the CPIO, in appeal — with the plain wording on top and the statutory term underneath, and the deadline counted for you on every row."
    >
      {(mode) => (
        <Sequence
          steps={SCREENS}
          height={HEIGHT}
          instant={mode === "full"}
          label="Filing by hand and tracking: the form's four steps, the acknowledgement with its registration number, and My requests showing every status a request can be in"
        />
      )}
    </PreviewCard>
  );
}
