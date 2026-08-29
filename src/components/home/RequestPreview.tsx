"use client";

import { PreviewCard } from "./PreviewCard";
import {
  COL,
  Mini,
  MiniButton,
  MINI_H,
  MINI_W,
  Pill,
  StepPlayer,
  T,
  Tick,
} from "./Storyboard";

/* ------------------------------------------------------------------
   My requests, and every screen a row opens onto.

   The filing form is shown on another slide. This one starts where a
   citizen spends the rest of the year: the list that keeps the clock,
   and the screens a row leads to — the status of one request, the reply
   when it comes, the appeal when the reply falls short, and the Second
   Appeal to the Commission when the department lets that one lapse too.

   The list is drawn full width because it is the screen the others
   hang off; the five screens under it are the row opened.
------------------------------------------------------------------- */

const LIST_H = 140;
const ROW_Y = [LIST_H + 12, LIST_H + 122, LIST_H + 232];
const HEIGHT = ROW_Y[2] + MINI_H + 2;

/* Played one at a time, a screen is enlarged but not blown up to the full
   380-unit width: at that scale every label was twice the size it is in
   the app. It sits centred in the canvas the list already needs. */
const MINI_SCALE = 1.62;
const PLAY_H = Math.round(MINI_H * MINI_SCALE);
const MINI_X = (380 - MINI_W * MINI_SCALE) / 2;

/** One pass through the list and the five screens it opens onto. */
const STEP_MS = 2200;
export const REQUEST_CYCLE_MS = 6 * STEP_MS + 500;

const LABEL =
  "My requests and the screens behind a row: the list of seven requests with their deadlines, the status of one overdue request, the response and the exemption it relies on, the first appeal form, the filed appeal with its appellate authority, and the second appeal to the Information Commission";

/** The row's own header: what the screen is, and which request it is. */
function MiniHead({ title, right }: { title: string; right: string }) {
  return (
    <g>
      <text
        x="7"
        y="11.5"
        fontSize="5.6"
        fontWeight="700"
        fill={T.navy}
        letterSpacing="0.3"
      >
        {title.toUpperCase()}
      </text>
      <text
        x={MINI_W - 7}
        y="11.5"
        fontSize="4.8"
        textAnchor="end"
        fill={T.muted}
      >
        {right}
      </text>
      <line x1="0.5" y1="17.5" x2={MINI_W - 0.5} y2="17.5" stroke={T.line2} />
    </g>
  );
}

/* ---- The list ---------------------------------------------------- */

const CHIPS = [
  ["All", "7"],
  ["With the department", "2"],
  ["Action needed", "3"],
  ["Answered", "2"],
  ["In appeal", "1"],
];

type Row = {
  ref: string;
  office: string;
  status: string;
  tone: "action" | "with" | "answered" | "closed";
  due: string;
  late?: boolean;
  appeal?: boolean;
};

const ROWS: Row[] = [
  {
    ref: "MORTH/R/E/26/01193",
    office: "Public Works Division, Ward 14",
    status: "Action needed",
    tone: "action",
    due: "4 days overdue",
    late: true,
  },
  {
    ref: "MOEAF/R/E/26/01764",
    office: "Regional Passport Office",
    status: "Action needed",
    tone: "action",
    due: "Partly denied",
  },
  {
    ref: "MORDV/R/E/26/00915",
    office: "Department of Land Resources",
    status: "Action needed",
    tone: "action",
    due: "With appellate authority",
    appeal: true,
  },
  {
    ref: "DOPPW/R/E/26/00842",
    office: "Dept of Pension & Pensioners’ Welfare",
    status: "With the department",
    tone: "with",
    due: "34 days left",
  },
  {
    ref: "MOEDU/R/E/26/00267",
    office: "Dept of School Education & Literacy",
    status: "With the department",
    tone: "with",
    due: "10 days left",
  },
  {
    ref: "DOFPD/R/E/26/03310",
    office: "Dept of Food & Public Distribution",
    status: "Answered",
    tone: "answered",
    due: "Closed",
  },
  {
    ref: "MOHFW/R/E/26/02048",
    office: "National Health Mission",
    status: "Answered",
    tone: "answered",
    due: "Closed",
  },
];

const TONE = {
  action: { fill: T.amber50, stroke: T.amber, text: T.red700 },
  with: { fill: T.pale, stroke: T.blue, text: T.blue },
  answered: { fill: T.green50, stroke: T.green, text: T.green },
  closed: { fill: "#fff", stroke: T.line, text: T.muted },
};

function RequestList() {
  return (
    <g>
      <rect
        x="0.5"
        y="0.5"
        width="379"
        height={LIST_H - 1}
        rx="6"
        fill="#fff"
        stroke={T.line}
      />

      <text x="10" y="17" fontSize="8.5" fontWeight="700" fill={T.navy}>
        My requests
      </text>
      <text x="10" y="26.5" fontSize="5.2" fill={T.ink2}>
        3 of your 7 requests require your attention.
      </text>
      <rect
        x="248"
        y="8"
        width="122"
        height="12"
        rx="6"
        fill="#fff"
        stroke={T.line}
      />
      <circle
        cx="256"
        cy="14"
        r="2.6"
        fill="none"
        stroke={T.muted}
        strokeWidth="0.9"
      />
      <path
        d="M258 16 l2 2"
        stroke={T.muted}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <text x="263" y="16.2" fontSize="5" fill={T.muted}>
        Search number, department or subject
      </text>

      {/* Filter chips — the five stages, plus the appeal flag. */}
      {CHIPS.map(([label, count], i) => {
        const w = label.length * 2.7 + count.length * 2.7 + 12;
        const x =
          10 +
          CHIPS.slice(0, i).reduce(
            (n, [l, c]) => n + l.length * 2.7 + c.length * 2.7 + 16,
            0,
          );
        const on = i === 0;
        return (
          <g key={label}>
            <rect
              x={x}
              y="32"
              width={w}
              height="10"
              rx="5"
              fill={on ? T.blue : "#fff"}
              stroke={on ? T.blue : T.line}
            />
            <text
              x={x + w / 2}
              y="39"
              fontSize="5"
              fontWeight="700"
              textAnchor="middle"
              fill={on ? "#fff" : T.ink2}
            >
              {`${label}  ${count}`}
            </text>
          </g>
        );
      })}

      <text
        x="10"
        y="56"
        fontSize="4.6"
        fontWeight="700"
        fill={T.muted}
        letterSpacing="0.3"
      >
        APPLICATION NO.
      </text>
      <text
        x="112"
        y="56"
        fontSize="4.6"
        fontWeight="700"
        fill={T.muted}
        letterSpacing="0.3"
      >
        PUBLIC AUTHORITY
      </text>
      <text
        x="228"
        y="56"
        fontSize="4.6"
        fontWeight="700"
        fill={T.muted}
        letterSpacing="0.3"
      >
        STATUS
      </text>
      <text
        x="300"
        y="56"
        fontSize="4.6"
        fontWeight="700"
        fill={T.muted}
        letterSpacing="0.3"
      >
        DEADLINE
      </text>
      <line x1="10" y1="59.5" x2="370" y2="59.5" stroke={T.line2} />

      {ROWS.map((r, i) => {
        const y = 60 + i * 10.4;
        const tone = TONE[r.tone];
        return (
          <g key={r.ref}>
            {/* The bar every case needing the citizen carries in the app. */}
            {r.tone === "action" ? (
              <rect
                x="10"
                y={y + 1}
                width="1.8"
                height="8.4"
                rx="0.9"
                fill={T.amber}
              />
            ) : null}
            <text
              x="15"
              y={y + 7.4}
              fontSize="4.9"
              fontWeight="700"
              fill={T.ink}
            >
              {r.ref}
            </text>
            {r.appeal ? (
              <Pill
                x={82}
                y={y + 1.4}
                text="IN APPEAL"
                fill={T.amber50}
                stroke={T.amber}
                color={T.red700}
                size={3.6}
              />
            ) : null}
            <text x="112" y={y + 7.4} fontSize="4.9" fill={T.ink2}>
              {r.office}
            </text>
            <Pill
              x={228}
              y={y + 1.4}
              text={r.status}
              fill={tone.fill}
              stroke={tone.stroke}
              color={tone.text}
              size={4.2}
            />
            <text
              x="300"
              y={y + 7.4}
              fontSize="4.9"
              fontWeight={r.late ? 700 : 400}
              fill={r.late ? T.red : T.ink2}
            >
              {r.due}
            </text>
            <line
              x1="10"
              y1={y + 10.2}
              x2="370"
              y2={y + 10.2}
              stroke={T.line2}
            />
          </g>
        );
      })}

      <text x="10" y={LIST_H - 6} fontSize="4.6" fill={T.muted}>
        Showing 7 of 7 requests
      </text>
      <text
        x="370"
        y={LIST_H - 6}
        fontSize="4.6"
        textAnchor="end"
        fill={T.blue}
        fontWeight="700"
      >
        Open any row to see where it stands →
      </text>
    </g>
  );
}

/* ---- The screens a row opens ------------------------------------- */

const TIMELINE = [
  ["Filed", "24 Jul"],
  ["Forwarded", "27 Jul"],
  ["Reply due", "23 Aug"],
  ["Overdue", "4 days"],
  ["Appeal", "Open"],
];

const SCREENS: { id: string; art: React.ReactNode }[] = [
  // 1 — One request, and the clock the whole screen is built around.
  {
    id: "status",
    art: (
      <>
        <MiniHead
          title="Where this request stands"
          right="MORTH/R/E/26/01193"
        />
        <text x="7" y="27" fontSize="6.4" fontWeight="700" fill={T.navy}>
          Public Works Division, Ward 14
        </text>
        <text x="7" y="34.5" fontSize="4.8" fill={T.ink2}>
          How ₹4.2 crore of road repair money was spent in my ward
        </text>

        <rect
          x="7"
          y="39"
          width={MINI_W - 14}
          height="16"
          rx="3.5"
          fill={T.red50}
          stroke={T.red}
        />
        <text x="11" y="46.5" fontSize="5.4" fontWeight="700" fill={T.red700}>
          30 days have passed · 4 days overdue
        </text>
        <text x="11" y="52.5" fontSize="4.6" fill={T.red700}>
          Silence is a refusal in law — s.7(2). ₹1,000 penalty accruing, s.20.
        </text>

        {/* The five stages, in the order the app prints them. */}
        <line
          x1="16"
          y1="62"
          x2={MINI_W - 16}
          y2="62"
          stroke={T.line2}
          strokeWidth="1.2"
        />
        {TIMELINE.map(([label, when], i) => {
          const x = 16 + i * ((MINI_W - 32) / 4);
          const done = i < 2;
          const now = i === 3;
          return (
            <g key={label}>
              <circle
                cx={x}
                cy="62"
                r={now ? 4 : 3.2}
                fill={done ? T.green : now ? T.red : "#fff"}
                stroke={done ? T.green : now ? T.red : T.line}
                strokeWidth="1.1"
              />
              <text
                x={x}
                y="75"
                fontSize="4.3"
                fontWeight="700"
                textAnchor="middle"
                fill={now ? T.red700 : T.ink}
              >
                {label}
              </text>
              <text
                x={x}
                y="81"
                fontSize="4.1"
                textAnchor="middle"
                fill={T.muted}
              >
                {when}
              </text>
            </g>
          );
        })}
        <MiniButton text="File a First Appeal" />
      </>
    ),
  },

  // 2 — The reply, printed against the clause it relies on.
  {
    id: "response",
    art: (
      <>
        <MiniHead title="The response" right="MOEAF/R/E/26/01764" />
        <Pill
          x={7}
          y={22}
          text="Disposed of — partly denied"
          fill={T.amber50}
          stroke={T.amber}
          color={T.red700}
          size={4.6}
        />
        <text
          x={MINI_W - 7}
          y="29"
          fontSize="4.6"
          textAnchor="end"
          fill={T.muted}
        >
          Replied 14 Aug 2026
        </text>
        <text x="7" y="41" fontSize="4.8" fill={T.ink2}>
          “The information sought is exempt under section 8(1)(g) of the
        </text>
        <text x="7" y="47" fontSize="4.8" fill={T.ink2}>
          RTI Act, 2005. The application is accordingly disposed of.”
        </text>

        <rect
          x="7"
          y="51"
          width={MINI_W - 14}
          height="27"
          rx="3"
          fill="#fff"
          stroke={T.line}
        />
        <text
          x="11"
          y="58"
          fontSize="4.2"
          fontWeight="700"
          fill={T.muted}
          letterSpacing="0.3"
        >
          THE PROVISION RELIED ON
        </text>
        <text x="11" y="65" fontSize="4.8" fontWeight="700" fill={T.ink}>
          8(1)(g) — Safety of persons who inform in confidence
        </text>
        <text x="11" y="72.5" fontSize="4.4" fill={T.ink2}>
          Nothing on the record shows the public interest was weighed
        </text>
        <text x="11" y="77" fontSize="4.4" fill={T.ink2}>
          against the harm claimed, as s.8(2) requires. That is a ground.
        </text>
        <MiniButton text="File a First Appeal" />
      </>
    ),
  },

  // 3 — The appeal, filled in from the request it appeals against.
  {
    id: "appeal",
    art: (
      <>
        <MiniHead title="File a First Appeal" right="Free · s.19(1)" />
        <text x="7" y="27" fontSize="4.8" fill={T.ink2}>
          Filled in from your application. No lawyer, no fee, no CAPTCHA.
        </text>
        <text
          x="7"
          y="36.5"
          fontSize="4.2"
          fontWeight="700"
          fill={T.muted}
          letterSpacing="0.3"
        >
          GROUND FOR APPEAL
        </text>
        {[
          ["No reply within the time limit", true],
          ["Information refused without valid reason", false],
          ["The reply was incomplete or misleading", false],
        ].map(([label, on], i) => (
          <g key={String(label)}>
            <rect
              x="7"
              y={40 + i * 13}
              width={MINI_W - 14}
              height="11"
              rx="3"
              fill={on ? T.pale : "#fff"}
              stroke={on ? T.blue : T.line}
            />
            <circle
              cx="14"
              cy={45.5 + i * 13}
              r="2.6"
              fill="#fff"
              stroke={on ? T.blue : T.line}
              strokeWidth="1.1"
            />
            {on ? (
              <circle cx="14" cy={45.5 + i * 13} r="1.3" fill={T.blue} />
            ) : null}
            <text
              x="20"
              y={47.4 + i * 13}
              fontSize="4.8"
              fontWeight={on ? 700 : 400}
              fill={on ? T.navy : T.ink2}
            >
              {label}
            </text>
            {on ? (
              <text
                x={MINI_W - 11}
                y={47.4 + i * 13}
                fontSize="4.2"
                fontWeight="700"
                textAnchor="end"
                fill={T.blue}
              >
                RECOMMENDED
              </text>
            ) : null}
          </g>
        ))}
        <MiniButton text="Submit appeal" />
      </>
    ),
  },

  // 4 — Filed, with the officer who now has to decide it.
  {
    id: "filed",
    art: (
      <>
        <MiniHead title="First Appeal filed" right="MORTH/R/E/26/01193" />
        <rect
          x="7"
          y="23"
          width={MINI_W - 14}
          height="22"
          rx="3.5"
          fill={T.green50}
          stroke={T.green}
        />
        <Tick cx={18} cy={34} r={6} />
        <text
          x="29"
          y="31.5"
          fontSize="4.2"
          fontWeight="700"
          fill={T.muted}
          letterSpacing="0.3"
        >
          APPEAL NUMBER
        </text>
        <text x="29" y="40.5" fontSize="6.6" fontWeight="700" fill={T.navy}>
          MORTH/A/E/26/00214
        </text>
        {[
          ["Ground", "No reply within the time limit"],
          ["Appellate Authority", "Shri G. Mohan Raj, Superintending Engineer"],
          ["Address", "Highways Circle Office, Chepauk, Chennai 600005"],
        ].map(([k, v], i) => (
          <g key={k}>
            <text
              x="7"
              y={54 + i * 10}
              fontSize="4.2"
              fontWeight="700"
              fill={T.muted}
              letterSpacing="0.3"
            >
              {k.toUpperCase()}
            </text>
            <text x="7" y={60 + i * 10} fontSize="4.7" fill={T.ink}>
              {v}
            </text>
            <line
              x1="7"
              y1={62.5 + i * 10}
              x2={MINI_W - 7}
              y2={62.5 + i * 10}
              stroke={T.line2}
            />
          </g>
        ))}
        <text x="7" y="90" fontSize="4.5" fill={T.ink2}>
          30 days to decide — 45 only with reasons recorded, s.19(6).
        </text>
      </>
    ),
  },

  // 5 — When the department's own appeal runs out of time, the Commission.
  {
    id: "second",
    art: (
      <>
        <MiniHead title="Second Appeal" right="Free · s.19(3)" />
        <text x="7" y="26" fontSize="4.8" fill={T.ink2}>
          This one leaves the department. It is heard by the Commission,
        </text>
        <text x="7" y="32" fontSize="4.8" fill={T.ink2}>
          which can order the record released and fine the officer.
        </text>

        <rect
          x="7"
          y="36"
          width={MINI_W - 14}
          height="15"
          rx="3.5"
          fill={T.red50}
          stroke={T.red}
        />
        <text x="11" y="43" fontSize="4.8" fontWeight="700" fill={T.red700}>
          First Appeal MORTH/A/E/26/00214 · undecided
        </text>
        <text x="11" y="48.5" fontSize="4.4" fill={T.red700}>
          45 days have passed with no decision — s.19(3) is open.
        </text>

        {[
          ["Appeal lies to", "Central Information Commission, New Delhi"],
          ["Carried over", "Application, First Appeal and the reply"],
          ["Relief sought", "Release of the record, and costs"],
        ].map(([k, v], i) => (
          <g key={k}>
            <text
              x="7"
              y={59 + i * 10}
              fontSize="4.2"
              fontWeight="700"
              fill={T.muted}
              letterSpacing="0.3"
            >
              {k.toUpperCase()}
            </text>
            <text x="7" y={65 + i * 10} fontSize="4.7" fill={T.ink}>
              {v}
            </text>
            <line
              x1="7"
              y1={67.5 + i * 10}
              x2={MINI_W - 7}
              y2={67.5 + i * 10}
              stroke={T.line2}
            />
          </g>
        ))}
        <MiniButton text="Submit second appeal" />
      </>
    ),
  },
];

export function RequestPreview() {
  return (
    <PreviewCard
      eyebrow="After it is filed"
      title="My requests, and every screen a row opens"
      footer="The list keeps the clock on all seven requests at once, and every row opens onto the same three screens: where the request stands, the reply when it arrives — printed against the clause it relies on — and the free first appeal, filled in from the application it appeals against. When the department lets that appeal lapse too, the Second Appeal to the Information Commission is on the same screen rather than a separate site. The day the deadline passes you are told that silence is a refusal in law, and shown the penalty running against the officer."
    >
      {(mode) =>
        mode === "full" ? (
          // Expanded, the list and the five screens it opens onto are worth
          // seeing together — that relationship is the point of the drawing.
          <svg
            viewBox={`0 0 380 ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label={LABEL}
          >
            <RequestList />
            {SCREENS.map((s, i) => (
              <Mini key={s.id} x={COL[i % 2]} y={ROW_Y[Math.floor(i / 2)]}>
                {s.art}
              </Mini>
            ))}
          </svg>
        ) : (
          // In the hero card they play through instead: the list first,
          // then each screen a row opens onto, one at a time and full width.
          <StepPlayer
            width={380}
            height={PLAY_H}
            stepMs={STEP_MS}
            label={LABEL}
            steps={[
              {
                id: "list",
                // The list is wider than it is tall, so it sits centred in
                // the taller canvas the other screens need.
                art: (
                  <g transform={`translate(0 ${(PLAY_H - LIST_H) / 2})`}>
                    <RequestList />
                  </g>
                ),
              },
              ...SCREENS.map((s) => ({
                id: s.id,
                art: (
                  <g transform={`translate(${MINI_X} 0) scale(${MINI_SCALE})`}>
                    <Mini x={0} y={0}>
                      {s.art}
                    </Mini>
                  </g>
                ),
              })),
            ]}
          />
        )
      }
    </PreviewCard>
  );
}
