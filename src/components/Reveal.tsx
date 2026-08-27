"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades a block up as it scrolls into view, once.
 *
 * The hidden state lives in CSS behind [data-js], so if scripting or the
 * observer is unavailable the content simply renders as normal.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Stagger within a group, in ms. Keep small — this is pacing, not theatre. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      // Start a little before the block reaches the fold so it has settled
      // by the time the reader's eye arrives.
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);

    // Last resort: if the observer never reports (an odd layout, a browser
    // quirk), show the content anyway — nothing on a government portal may
    // stay invisible because an animation did not run. Deliberately long, so
    // it never pre-empts a normal scroll and flattens the effect.
    const failsafe = window.setTimeout(() => {
      setVisible(true);
      observer.disconnect();
    }, 8000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
