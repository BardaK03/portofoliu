"use client";

/**
 * Overlays — HTML text layered over the 3D scene.
 *
 * Each section's card fades in while its scroll range is active. Opacity is
 * written directly to DOM refs inside a rAF loop that reads the mutable
 * `scrollState`, so scrolling never triggers a React re-render.
 */
import { useEffect, useRef } from "react";
import { scrollState } from "@/lib/scroll";
import { SECTIONS, sectionAt } from "@/lib/journey";

const COPY: Record<string, { title: string; body: string }> = {
  hero: { title: "Skyward", body: "A portfolio you fly through. Scroll to take off." },
  about: { title: "About", body: "Who I am, and what I like to build." },
  skills: { title: "Skills", body: "The tools I reach for, drifting past on balloons." },
  projects: { title: "Projects", body: "Selected work, orbiting the sky archipelago." },
  work: { title: "Experience", body: "Where I've flown so far." },
  contact: { title: "Contact", body: "Climb into the sun — let's talk." },
};

export function Overlays() {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const active = sectionAt(scrollState.progress).id;
      for (const s of SECTIONS) {
        const el = refs.current[s.id];
        if (el) el.style.opacity = s.id === active ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {SECTIONS.map((s) => (
        <div
          key={s.id}
          ref={(el) => {
            refs.current[s.id] = el;
          }}
          className="absolute inset-x-0 bottom-24 flex flex-col items-center px-6 text-center opacity-0 transition-opacity duration-700 sm:bottom-32"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-[#3a2a12] drop-shadow-sm sm:text-6xl">
            {COPY[s.id].title}
          </h2>
          <p className="mt-3 max-w-md text-base text-[#5a4526] sm:text-lg">
            {COPY[s.id].body}
          </p>
        </div>
      ))}
    </div>
  );
}
