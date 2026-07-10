/**
 * Scroll engine.
 *
 * Lenis smooths native scroll and writes normalized progress into a plain,
 * MUTABLE object that the 3D scene reads inside `useFrame`. This deliberately
 * bypasses React state so scrolling never triggers a re-render — the whole
 * cinematic runs off one shared object mutated once per frame.
 */
import Lenis from "lenis";

export interface ScrollState {
  /** Normalized scroll position, 0 (top) → 1 (bottom). */
  progress: number;
  /** Scroll speed in progress-units per second (signed). */
  velocity: number;
  /** Eased variant of progress for the finale (slow in, snappy rewind). */
  impact: number;
}

export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  impact: 0,
};

const IMPACT_EASE_IN = 2.2; // slow build as we climb into the sun
let lenis: Lenis | null = null;
let rafId = 0;

/** Asymmetric ease: gentle forward, immediate on rewind. */
function easeImpact(p: number): number {
  return Math.pow(p, IMPACT_EASE_IN);
}

/**
 * Initialize smooth scroll. Returns a cleanup function that tears down the
 * RAF loop and Lenis instance. Safe to call only in the browser.
 */
export function initSmoothScroll(): () => void {
  if (typeof window === "undefined") return () => {};

  lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on(
    "scroll",
    ({ progress, velocity }: { progress: number; velocity: number }) => {
      scrollState.progress = progress;
      scrollState.velocity = velocity;
      scrollState.impact = easeImpact(progress);
    },
  );

  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
  };
}
