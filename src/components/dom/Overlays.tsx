"use client";

/**
 * Overlays — HTML content layered over the 3D scene.
 *
 * Each section's card fades in while its scroll range is active. Opacity is
 * written directly to DOM refs inside a rAF loop that reads the mutable
 * `scrollState`, so scrolling never triggers a React re-render. Interactive
 * bits (links) opt back into pointer events.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { scrollState } from "@/lib/scroll";
import { SECTIONS, sectionAt, type SectionId } from "@/lib/journey";
import {
  PROFILE,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  SKILLS,
  CERTIFICATIONS,
} from "@/lib/data";

const cardClass =
  "absolute inset-x-0 bottom-16 mx-auto flex max-w-2xl flex-col items-center px-6 text-center opacity-0 transition-opacity duration-700 sm:bottom-24";
const titleClass =
  "text-4xl font-semibold tracking-tight text-[#3a2a12] drop-shadow-sm sm:text-6xl";
const bodyClass = "mt-3 max-w-md text-base text-[#5a4526] sm:text-lg";
const chipClass =
  "rounded-full bg-white/50 px-3 py-1 text-xs font-medium text-[#5a4526] backdrop-blur-sm";

function Chips({ items }: { items: readonly string[] }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {items.map((i) => (
        <span key={i} className={chipClass}>
          {i}
        </span>
      ))}
    </div>
  );
}

const CONTENT: Record<SectionId, ReactNode> = {
  hero: (
    <>
      <h1 className={titleClass}>{PROFILE.name}</h1>
      <p className={bodyClass}>{PROFILE.tagline}</p>
      <p className="mt-6 text-sm tracking-[0.3em] text-[#7a5a2e] uppercase">
        Scroll to take off ↓
      </p>
    </>
  ),
  about: (
    <>
      <h2 className={titleClass}>About</h2>
      <p className={bodyClass}>{PROFILE.about}</p>
      <div className="mt-4 space-y-1 text-sm text-[#5a4526]">
        {EDUCATION.map((e) => (
          <p key={e.school}>
            <span className="font-medium">{e.school}</span> — {e.detail} ({e.period})
          </p>
        ))}
      </div>
    </>
  ),
  skills: (
    <>
      <h2 className={titleClass}>Skills</h2>
      <div className="mt-5 space-y-3">
        {SKILLS.map((g) => (
          <div key={g.label}>
            <p className="text-xs font-semibold tracking-widest text-[#7a5a2e] uppercase">
              {g.label}
            </p>
            <Chips items={g.items} />
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#5a4526]">
        Certifications: {CERTIFICATIONS.join(", ")}
      </p>
    </>
  ),
  projects: (
    <>
      <h2 className={titleClass}>Projects</h2>
      <div className="pointer-events-auto mt-5 grid w-full gap-3 sm:grid-cols-3">
        {PROJECTS.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-white/45 p-4 text-left backdrop-blur-sm transition hover:bg-white/70"
          >
            <h3 className="text-lg font-semibold text-[#3a2a12]">{p.title}</h3>
            <p className="mt-1 text-xs text-[#5a4526]">{p.tagline}</p>
            <p className="mt-2 text-[11px] text-[#7a5a2e]">{p.tech.join(" · ")}</p>
          </a>
        ))}
      </div>
    </>
  ),
  work: (
    <>
      <h2 className={titleClass}>Experience</h2>
      <div className="mt-5 w-full space-y-3 text-left">
        {EXPERIENCE.map((e) => (
          <div key={`${e.org}-${e.period}`} className="rounded-xl bg-white/40 p-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-[#3a2a12]">
                {e.role} · {e.org}
              </p>
              <p className="text-xs text-[#7a5a2e]">{e.period}</p>
            </div>
            <ul className="mt-1 list-disc pl-5 text-sm text-[#5a4526]">
              {e.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  ),
  contact: (
    <>
      <h2 className={titleClass}>Contact</h2>
      <p className={bodyClass}>Climb into the sun — let&apos;s build something.</p>
      <div className="pointer-events-auto mt-5 flex gap-3">
        <a
          href={`mailto:${PROFILE.email}`}
          className="rounded-full bg-[#3a2a12] px-5 py-2 text-sm font-medium text-[#f4e3c8] transition hover:bg-[#5a4526]"
        >
          {PROFILE.email}
        </a>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/50 px-5 py-2 text-sm font-medium text-[#3a2a12] backdrop-blur-sm transition hover:bg-white/80"
        >
          GitHub
        </a>
      </div>
    </>
  ),
};

export function Overlays() {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const active = sectionAt(scrollState.progress).id;
      for (const s of SECTIONS) {
        const el = refs.current[s.id];
        if (el) {
          el.style.opacity = s.id === active ? "1" : "0";
          el.style.pointerEvents = s.id === active ? "auto" : "none";
        }
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
          className={cardClass}
        >
          {CONTENT[s.id]}
        </div>
      ))}
    </div>
  );
}
