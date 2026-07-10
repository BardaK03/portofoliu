"use client";

/**
 * Home — composes the fixed 3D scene with DOM overlays over a tall scroll
 * "runway". The runway provides scroll distance; the Canvas is fixed behind
 * it and animates off scroll progress. Smooth scroll starts after fonts load.
 */
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { initSmoothScroll } from "@/lib/scroll";
import { TOTAL_PAGES } from "@/lib/journey";
import { Loader } from "@/components/dom/Loader";
import { Overlays } from "@/components/dom/Overlays";

const Experience = dynamic(
  () => import("@/components/canvas/Experience").then((m) => m.Experience),
  { ssr: false },
);

export default function Home() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    document.fonts.ready.then(() => {
      cleanup = initSmoothScroll();
    });
    return () => cleanup?.();
  }, []);

  return (
    <>
      <Experience />
      <Overlays />
      <Loader />
      {/* Scroll runway: pure height, no visible content. */}
      <div style={{ height: `${TOTAL_PAGES * 100}vh` }} aria-hidden />

      {/* Hidden semantic content for SEO / screen readers (canvas text is invisible to crawlers). */}
      <main className="sr-only">
        <h1>Skyward — Interactive 3D Portfolio</h1>
        <p>Scroll to fly a paper plane through a sunrise sky past my work.</p>
      </main>
    </>
  );
}
