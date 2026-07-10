"use client";

/**
 * Landmarks — Phase-2 placeholders.
 *
 * One colored, gently bobbing box per section anchor so we can tune the flight
 * choreography before real art exists. Phase 4 swaps these for floating
 * islands / balloons / airship / sun meshes at the same anchors.
 */
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { SECTIONS } from "@/lib/journey";

const COLORS: Record<string, string> = {
  hero: "#ffd9a0",
  about: "#8fd6a8",
  skills: "#f6a5c0",
  projects: "#9ec5ff",
  work: "#c9b8ff",
  contact: "#ffcf6b",
};

function Landmark({
  anchor,
  color,
  seed,
}: {
  anchor: [number, number, number];
  color: string;
  seed: number;
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + seed;
    ref.current.position.y = anchor[1] + Math.sin(t * 0.6) * 0.4;
    ref.current.rotation.y = t * 0.2;
  });
  return (
    <group ref={ref} position={anchor}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Landmarks() {
  return (
    <>
      {SECTIONS.filter((s) => s.id !== "hero").map((s, i) => (
        <Landmark
          key={s.id}
          anchor={s.anchor}
          color={COLORS[s.id]}
          seed={i * 1.7}
        />
      ))}
    </>
  );
}
