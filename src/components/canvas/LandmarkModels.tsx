"use client";

/**
 * LandmarkModels — procedural, low-poly landmark meshes.
 *
 * Everything here is built from primitive geometry + flat shading (no external
 * models), so it ships instantly, weighs nothing, and matches the paper
 * plane's folded look. Reskin by editing colors/proportions.
 */
import { useMemo } from "react";
import * as THREE from "three";

const GRASS = "#8fbf7a";
const ROCK = "#8a6b4f";
const TRUNK = "#7a5638";
const LEAF = "#6fae74";

/** A chunk of floating land: inverted rock cone + grass cap + a tree. */
export function FloatingIsland({
  scale = 1,
  grass = GRASS,
  withHouse = false,
}: {
  scale?: number;
  grass?: string;
  withHouse?: boolean;
}) {
  return (
    <group scale={scale}>
      {/* rock underside */}
      <mesh position={[0, -1.6, 0]} castShadow>
        <coneGeometry args={[2, 3.4, 7]} />
        <meshStandardMaterial color={ROCK} flatShading roughness={0.95} />
      </mesh>
      {/* grass cap */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.05, 1.95, 0.6, 7]} />
        <meshStandardMaterial color={grass} flatShading roughness={0.85} />
      </mesh>
      {/* tree */}
      <group position={[0.7, 0.5, 0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.16, 0.9, 5]} />
          <meshStandardMaterial color={TRUNK} flatShading />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <coneGeometry args={[0.6, 1.1, 6]} />
          <meshStandardMaterial color={LEAF} flatShading />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <coneGeometry args={[0.45, 0.9, 6]} />
          <meshStandardMaterial color={LEAF} flatShading />
        </mesh>
      </group>
      {withHouse && (
        <group position={[-0.7, 0.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.7, 0.9]} />
            <meshStandardMaterial color="#f3e2c7" flatShading />
          </mesh>
          <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.8, 0.6, 4]} />
            <meshStandardMaterial color="#c0654a" flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** One hot-air balloon: teardrop envelope + basket + lines. */
function Balloon({ color, y = 0 }: { color: string; y?: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 2, 0]} scale={[1, 1.25, 1]} castShadow>
        <sphereGeometry args={[1.3, 12, 12]} />
        <meshStandardMaterial color={color} flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <coneGeometry args={[1.1, 1, 12, 1, true]} />
        <meshStandardMaterial color={color} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color={TRUNK} flatShading />
      </mesh>
    </group>
  );
}

/** A cluster of balloons at slightly varied offsets. */
export function Balloons() {
  const items = useMemo(
    () => [
      { color: "#f6a5c0", pos: [0, 0, 0] as const },
      { color: "#9ec5ff", pos: [-2.6, -1.2, 1.4] as const },
      { color: "#ffcf6b", pos: [2.4, -0.6, -1] as const },
    ],
    [],
  );
  return (
    <>
      {items.map((b, i) => (
        <group key={i} position={b.pos}>
          <Balloon color={b.color} />
        </group>
      ))}
    </>
  );
}

/** Elongated airship: capsule envelope + tail fins + gondola. */
export function Airship() {
  return (
    <group>
      <mesh scale={[3.4, 1, 1]} castShadow>
        <sphereGeometry args={[1.6, 16, 12]} />
        <meshStandardMaterial color="#efe4d0" flatShading roughness={0.6} />
      </mesh>
      {/* tail fins */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r, i) => (
        <mesh key={i} position={[-5, 0, 0]} rotation={[r, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 1.1, 0.08]} />
          <meshStandardMaterial color="#c0654a" flatShading />
        </mesh>
      ))}
      {/* gondola */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <boxGeometry args={[2, 0.6, 0.7]} />
        <meshStandardMaterial color={TRUNK} flatShading />
      </mesh>
    </group>
  );
}

/** The finale sun: emissive core + soft additive halo + warm light. */
export function SunFinale() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[6, 24, 24]} />
        <meshBasicMaterial color="#ffdf8a" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[9, 24, 24]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#ffd9a0" intensity={80} distance={120} decay={1.6} />
    </group>
  );
}
