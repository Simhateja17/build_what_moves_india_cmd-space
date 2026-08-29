"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   A short sequence of screens with a caption, for showing how a part
   of the app actually works rather than photographing it.

   It plays through once and then stops on the last scene, with the
   dots left live so any step can be revisited. Looping made an earlier
   version restart under anyone still reading it; stopping dead with no
   way back was no better. Touching a dot cancels the autoplay for
   good — once someone is steering, the timer must not fight them.
------------------------------------------------------------------- */

export const T = {
  navy: "var(--navy-900)",
  blue: "var(--navy-700)",
  ink: "var(--ink)",
  ink2: "var(--ink-2)",
  muted: "var(--muted)",
  line: "var(--line)",
  line2: "var(--line-2)",
  pale: "var(--navy-50)",
  red: "var(--red-600)",
  red700: "var(--red-700)",
  red50: "var(--red-50)",
  amber: "var(--saffron-500)",
  amber50: "var(--saffron-50)",
  green: "var(--green-600)",
  green50: "var(--green-50)",
};

/**
 * A process shown whole, built one step at a time.
 *
 * Every step stays on screen once it lands. An earlier version stepped
 * through the same material one panel at a time, which meant the process
 * was never visible as a process — you saw a screen, then a different
 * screen, and had to hold the sequence in your head. Here the panels
 * accumulate down the card, so by the end the whole route is in front of
 * you and the animation has only made the order legible.
 *
 * It builds once and stops. Looping restarted it under anyone reading.
 */
const STEP_MS = 620;

export function Sequence({
  steps,
  height,
  label,
  /** The dialog opens finished: it was opened to study, not to watch. */
  instant = false,
}: {
  steps: React.ReactNode[];
  height: number;
  label: string;
  instant?: boolean;
}) {
  const [shown, setShown] = useState(steps.length);

  useEffect(() => {
    if (instant) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    // Seeded past the end, which is what the first render already shows, so
    // the first tick wraps to nothing and the build begins. Nothing is set
    // synchronously here; the finished state holds until the timer starts.
    let count = -1;
    const tick = () => {
      count += 1;
      setShown(count);
      if (count < steps.length) timer = setTimeout(tick, STEP_MS);
    };
    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, [instant, steps.length]);

  return (
    <svg
      viewBox={`0 0 380 ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={label}
    >
      {steps.map((art, i) => (
        <g
          key={i}
          opacity={i < shown ? 1 : 0}
          style={{
            transition: "opacity 300ms ease-out, transform 300ms ease-out",
            transform: i < shown ? "none" : "translateY(-4px)",
          }}
        >
          {art}
        </g>
      ))}
    </svg>
  );
}

/** One numbered panel in a sequence, full width, with the arrow into it. */
export function Step({
  n,
  y,
  h,
  title,
  children,
  tone = "plain",
}: {
  n: number;
  y: number;
  h: number;
  title: string;
  children?: React.ReactNode;
  tone?: "plain" | "good" | "bad";
}) {
  const border = tone === "good" ? T.green : tone === "bad" ? T.red : T.line;
  const fill = tone === "good" ? T.green50 : tone === "bad" ? T.red50 : "#fff";
  return (
    <g>
      {n > 1 ? (
        <g>
          <path d={`M190 ${y - 13} V${y - 4}`} stroke={T.line} strokeWidth="1.3" />
          <path d={`M186.5 ${y - 5} 190 ${y - 0.5} 193.5 ${y - 5}`} fill={T.line} />
        </g>
      ) : null}
      <rect x="0.6" y={y + 0.6} width="378.8" height={h} rx="6" fill={fill} stroke={border} />
      <circle cx="17" cy={y + 15} r="7.5" fill={T.blue} />
      <text x="17" y={y + 17.8} fontSize="8" fontWeight="700" textAnchor="middle" fill="#fff">
        {n}
      </text>
      <text x="31" y={y + 18} fontSize="8.5" fontWeight="700" fill={T.navy}>
        {title}
      </text>
      {children}
    </g>
  );
}

/* ---- Drawing parts shared by the storyboards/* ---- Drawing parts shared by the storyboards ---------------------- */

/**
 * A window with a titled chrome bar.
 *
 * Children are translated to sit under that bar, so a scene positions its
 * contents from the top of the *content area* rather than from the top of
 * the canvas. Absolute coordinates meant every scene had to remember to
 * clear the chrome by hand, and the ones that forgot drew straight through
 * the window title.
 */
export const SCREEN_CHROME = 21;

export function Screen({
  y = 0,
  h,
  title,
  right,
  children,
}: {
  y?: number;
  h: number;
  title: string;
  right?: string;
  children: React.ReactNode;
}) {
  return (
    <g>
      <rect x="0.6" y={y + 0.6} width="378.8" height={h} rx="7" fill="#fff" stroke={T.line} />
      <path
        d={`M0.6 ${y + 7.6} a7 7 0 0 1 7-7 h364.8 a7 7 0 0 1 7 7 v13 h-378.8 z`}
        fill={T.pale}
      />
      <line x1="0.6" y1={y + SCREEN_CHROME - 0.4} x2="379.4" y2={y + SCREEN_CHROME - 0.4} stroke={T.line} />
      <text x="12" y={y + 14} fontSize="9" fontWeight="700" fill={T.navy}>
        {title}
      </text>
      {right ? (
        <text x="368" y={y + 14} fontSize="7.5" fontWeight="600" textAnchor="end" fill={T.muted}>
          {right}
        </text>
      ) : null}
      <g transform={`translate(0 ${y + SCREEN_CHROME})`}>{children}</g>
    </g>
  );
}

export function Pill({
  x,
  y,
  text,
  fill,
  stroke,
  color = "#fff",
  size = 6.5,
}: {
  x: number;
  y: number;
  text: string;
  fill: string;
  stroke?: string;
  color?: string;
  size?: number;
}) {
  const w = text.length * size * 0.56 + 12;
  return (
    <g>
      <rect x={x} y={y} width={w} height={size + 5.5} rx={(size + 5.5) / 2} fill={fill} stroke={stroke} />
      <text
        x={x + w / 2}
        y={y + size + 0.6}
        fontSize={size}
        fontWeight="700"
        textAnchor="middle"
        fill={color}
      >
        {text}
      </text>
    </g>
  );
}

export function Button({
  x,
  y,
  text,
  w,
  tone = "solid",
}: {
  x: number;
  y: number;
  text: string;
  w?: number;
  tone?: "solid" | "ghost";
}) {
  const width = w ?? text.length * 4.4 + 22;
  const solid = tone === "solid";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={16}
        rx={5}
        fill={solid ? T.blue : "#fff"}
        stroke={solid ? undefined : T.line}
      />
      <text
        x={x + width / 2}
        y={y + 10.8}
        fontSize="7.5"
        fontWeight="700"
        textAnchor="middle"
        fill={solid ? "#fff" : T.blue}
      >
        {text}
      </text>
    </g>
  );
}

/** The green tick used wherever something has been settled. */
export function Tick({ cx, cy, r = 5 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={T.green} />
      <path
        d={`M${cx - r * 0.48} ${cy + 0.04} l${r * 0.36} ${r * 0.36} l${r * 0.64} ${-r * 0.72}`}
        stroke="#fff"
        strokeWidth={r * 0.28}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/* ---- Miniature screens ------------------------------------------- */

/** Grid: two columns of 184 units with a 12-unit gutter, rows 110 apart. */
export const MINI_W = 184;
export const MINI_H = 98;
export const COL = [0, 196];
export const ROW3 = [0, 110, 220];

/**
 * One screen from the app, at contact-sheet size. Children are drawn in the
 * screen's own coordinates, 0,0 at its top-left corner.
 */
export function Mini({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0.5" y="0.5" width={MINI_W - 1} height={MINI_H - 1} rx="5" fill="#fff" stroke={T.line} />
      {children}
    </g>
  );
}

/** The assistant's own header: step count, step name, six segments. */
export function StepHeader({ n, of, label }: { n: number; of: number; label: string }) {
  return (
    <g>
      <text x="7" y="11" fontSize="5.2" fontWeight="700" fill={T.navy} letterSpacing="0.4">
        {`STEP ${n} OF ${of}`}
      </text>
      <text x={MINI_W - 7} y="11" fontSize="5.2" textAnchor="end" fill={T.muted}>
        {label}
      </text>
      {Array.from({ length: of }).map((_, i) => {
        const w = (MINI_W - 14 - (of - 1) * 2) / of;
        return (
          <rect
            key={i}
            x={7 + i * (w + 2)}
            y="15"
            width={w}
            height="2.4"
            rx="1.2"
            fill={i < n ? T.blue : T.line2}
          />
        );
      })}
      <line x1="0.5" y1="22.5" x2={MINI_W - 0.5} y2="22.5" stroke={T.line2} />
    </g>
  );
}

/** Title and optional subtitle inside a mini screen. */
export function MiniTitle({ title, sub }: { title: string; sub?: string[] }) {
  return (
    <g>
      <text x="7" y="33" fontSize="6.6" fontWeight="700" fill={T.ink}>
        {title}
      </text>
      {sub?.map((l, i) => (
        <text key={l} x="7" y={42 + i * 7} fontSize="5.2" fill={T.ink2}>
          {l}
        </text>
      ))}
    </g>
  );
}

/** The primary action, bottom-right, where every step of the app puts it. */
export function MiniButton({ text, y = MINI_H - 16 }: { text: string; y?: number }) {
  const w = text.length * 2.9 + 12;
  return (
    <g>
      <rect x={MINI_W - 7 - w} y={y} width={w} height="11" rx="3.5" fill={T.blue} />
      <text
        x={MINI_W - 7 - w / 2}
        y={y + 7.4}
        fontSize="5.2"
        fontWeight="700"
        textAnchor="middle"
        fill="#fff"
      >
        {text}
      </text>
    </g>
  );
}

/** A form field with its label above it, as the app draws them. */
export function MiniField({
  y,
  label,
  value,
  w = MINI_W - 14,
  x = 7,
  h = 11,
  muted = true,
}: {
  y: number;
  label?: string;
  value: string;
  w?: number;
  x?: number;
  h?: number;
  muted?: boolean;
}) {
  return (
    <g>
      {label ? (
        <text x={x} y={y - 2} fontSize="4.6" fontWeight="700" fill={T.muted}>
          {label.toUpperCase()}
        </text>
      ) : null}
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#fff" stroke={T.line} />
      <text x={x + 4} y={y + h / 2 + 1.9} fontSize="5" fill={muted ? T.muted : T.ink}>
        {value}
      </text>
    </g>
  );
}
