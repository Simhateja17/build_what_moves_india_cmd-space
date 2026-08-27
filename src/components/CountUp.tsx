"use client";

import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Counts from the previous value to the current one.
 *
 * The penalty figure is the one number on this site that people are meant
 * to feel rather than read, so it climbs instead of appearing. It always
 * lands exactly on `value`, and jumps straight there when the reader has
 * asked for reduced motion.
 */
export function CountUp({
  value,
  format,
  durationMs = 650,
  className = "",
}: {
  value: number;
  format: (n: number) => string;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;

    if (from === to) return;

    if (prefersReducedMotion()) {
      fromRef.current = to;
      setDisplay(to);
      return;
    }

    const start = performance.now();
    // Ease-out cubic: quick off the mark, settles gently on the figure.
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.round(from + (to - from) * ease(t)));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
      fromRef.current = to;
    };
  }, [value, durationMs]);

  return (
    <span className={`tabular-nums ${className}`.trim()}>{format(display)}</span>
  );
}
