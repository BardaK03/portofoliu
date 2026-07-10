"use client";

/**
 * Landmarks — places the procedural models at each section's anchor.
 *
 * Each landmark bobs and slowly rotates. The Projects section scatters a small
 * archipelago of islands around its orbit center so the camera's fly-around
 * has things to sweep past.
 */
import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import { SECTIONS, PROJECTS_ORBIT } from "@/lib/journey";
import {
  FloatingIsland,
  Balloons,
  Airship,
  SunFinale,
} from "./LandmarkModels";

function Bob({
  anchor,
  seed = 0,
  spin = 0.1,
  children,
}: {
  anchor: readonly [number, number, number];
  seed?: number;
  spin?: number;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + seed;
    ref.current.position.y = anchor[1] + Math.sin(t * 0.5) * 0.4;
    ref.current.rotation.y = t * spin;
  });
  return (
    <group ref={ref} position={[anchor[0], anchor[1], anchor[2]]}>
      {children}
    </group>
  );
}

function ProjectsArchipelago() {
  const { center, radius } = PROJECTS_ORBIT;
  const isles = [0, 1, 2, 3, 4];
  return (
    <>
      {isles.map((i) => {
        const a = (i / isles.length) * Math.PI * 2;
        const anchor = [
          center.x + Math.cos(a) * radius * 0.6,
          center.y + (i % 2 === 0 ? 1.5 : -2),
          center.z + Math.sin(a) * radius * 0.6,
        ] as const;
        return (
          <Bob key={i} anchor={anchor} seed={i * 1.3} spin={0.05}>
            <FloatingIsland scale={0.8 + (i % 3) * 0.25} />
          </Bob>
        );
      })}
    </>
  );
}

export function Landmarks() {
  const about = SECTIONS.find((s) => s.id === "about")!;
  const skills = SECTIONS.find((s) => s.id === "skills")!;
  const work = SECTIONS.find((s) => s.id === "work")!;
  const contact = SECTIONS.find((s) => s.id === "contact")!;

  return (
    <>
      <Bob anchor={about.anchor} seed={0.5}>
        <FloatingIsland scale={1.3} withHouse />
      </Bob>

      <Bob anchor={skills.anchor} seed={1.5} spin={0.04}>
        <Balloons />
      </Bob>

      <ProjectsArchipelago />

      <Bob anchor={work.anchor} seed={2.5} spin={0.03}>
        <Airship />
      </Bob>

      <group position={contact.anchor}>
        <SunFinale />
      </group>
    </>
  );
}
