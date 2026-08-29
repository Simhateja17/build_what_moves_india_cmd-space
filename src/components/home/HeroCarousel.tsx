"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";

/* ------------------------------------------------------------------
   The banner at the top of the landing page.

   Three slides sharing one panel rather than three panels with
   different backgrounds: during a drag the visitor sees the outgoing
   and incoming slide at once, and a colour flip halfway through that
   gesture reads as a rendering fault rather than a transition.

   Auto-advance is a convenience, never a hijack — it stops the moment
   a pointer, a finger or the keyboard touches the banner, and it never
   starts at all for someone who has asked for reduced motion.
------------------------------------------------------------------- */

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  note?: string;
  art: React.ReactNode;
  /**
   * How long this slide holds before the next one. A slide whose artwork
   * animates sets it to the length of that animation, so the banner never
   * takes a drawing away halfway through building it.
   */
  holdMs?: number;
}

/** Used only by a slide that has no animation of its own to wait for. */
const AUTOPLAY_MS = 12000;
const DRAG_THRESHOLD = 60;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [height, setHeight] = useState<number>();
  const startX = useRef<number | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const count = slides.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Without this every slide is as tall as the tallest one, which left
  // the two shorter slides floating in a panel sized for the first —
  // most visible on a phone, where the stacked artwork makes slide one
  // very tall. The panel now grows and shrinks to the slide on screen.
  useLayoutEffect(() => {
    const el = slideRefs.current[index];
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index]);

  useEffect(() => {
    if (paused || reduced || count < 2) return;
    // A timeout per slide rather than one interval for all of them: each
    // slide waits out its own artwork before handing over.
    const t = window.setTimeout(
      () => go(index + 1),
      slides[index]?.holdMs ?? AUTOPLAY_MS,
    );
    return () => window.clearTimeout(t);
  }, [index, paused, reduced, count, go, slides]);

  function onPointerDown(e: React.PointerEvent) {
    // Let a link take its own click; only bare panel area starts a drag.
    if ((e.target as HTMLElement).closest("a,button")) return;
    startX.current = e.clientX;
    setDragging(true);
    setPaused(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    // Resist at the ends so the banner feels bounded rather than broken.
    const atEdge = (index === 0 && dx > 0) || (index === count - 1 && dx < 0);
    setDrag(atEdge ? dx * 0.25 : dx);
  }

  function endDrag() {
    if (startX.current === null) return;
    if (drag <= -DRAG_THRESHOLD) go(index + 1);
    else if (drag >= DRAG_THRESHOLD) go(index - 1);
    startX.current = null;
    setDragging(false);
    setDrag(0);
    setPaused(false);
  }

  // A band running the full width of the page, flush under the masthead —
  // not a card floating on the canvas. The content inside still lines up
  // with every section below it.
  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("What RTI Saral does")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      className="home-hero home-carousel-surface w-full overflow-hidden border-b border-line"
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="flex touch-pan-y items-start"
        style={{
          height,
          // Offsetting in pixels rather than a percentage of a measured
          // width keeps the track from having to read its own size mid-render.
          transform: `translateX(calc(${-index * 100}% + ${drag}px))`,
          transition:
            dragging || reduced
              ? "none"
              : "transform 550ms cubic-bezier(0.22, 0.61, 0.36, 1), height 450ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="w-full shrink-0"
            aria-roledescription="slide"
            aria-label={t("Slide {index} of {count}", undefined, {
              index: i + 1,
              count,
            })}
            aria-hidden={i !== index}
            inert={i !== index}
          >
            <div className="mx-auto grid w-full max-w-[1600px] items-center gap-8 px-4 py-10 sm:gap-10 sm:px-8 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-14 xl:px-12">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-navy-600/20 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-800">
                  {s.eyebrow}
                </p>
                <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
                  {s.title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2 sm:mt-5 sm:text-lg">
                  {s.body}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={s.primary.href}
                    draggable={false}
                    className="btn-primary"
                  >
                    {s.primary.label}
                  </Link>
                  {s.secondary ? (
                    <Link
                      href={s.secondary.href}
                      draggable={false}
                      className="btn-secondary"
                    >
                      {s.secondary.label}
                    </Link>
                  ) : null}
                </div>

                {s.note ? (
                  <p className="mt-4 text-sm text-muted">{s.note}</p>
                ) : null}
              </div>

              <div className="mx-auto w-full max-w-md select-none lg:max-w-none">
                {s.art}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots sit under the copy, bottom-left, clear of the artwork. */}
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-2 px-4 pb-8 sm:px-8 lg:px-10 lg:pb-10 xl:px-12">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={t("Show slide {index}: {eyebrow}", undefined, {
              index: i + 1,
              eyebrow: s.eyebrow,
            })}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-9 bg-navy-800"
                : "w-5 bg-line hover:bg-navy-600/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
