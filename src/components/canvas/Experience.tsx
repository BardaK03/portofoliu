"use client";

/**
 * Experience — the fixed 3D scene rendered behind the DOM overlays.
 *
 * Sets up the Canvas, the warm PureSky HDRI environment + skybox, volumetric
 * clouds the plane threads through, distance fog for depth, and the flight
 * rig. Signals `ready` after the first committed frame so the loader fades.
 */
import { Canvas } from "@react-three/fiber";
import { Cloud, Clouds, Environment } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { useUIStore } from "@/lib/store";
import { CameraRig } from "./CameraRig";
import { PaperPlane } from "./PaperPlane";
import { Landmarks } from "./Landmarks";

const HDRI = "/hdri/citrus_orchard_road_puresky_1k.hdr";
const FOG_COLOR = "#efd9bd";

function ReadySignal() {
  const setReady = useUIStore((s) => s.setReady);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [setReady]);
  return null;
}

function SkyClouds() {
  // A few large, soft clouds distributed along the flight path (-Z).
  return (
    <Clouds material={THREE.MeshBasicMaterial} limit={200}>
      <Cloud seed={1} bounds={[18, 4, 18]} volume={9} position={[-6, 4, -22]} opacity={0.5} speed={0.1} color="#fff6e8" />
      <Cloud seed={2} bounds={[22, 5, 22]} volume={11} position={[8, 8, -55]} opacity={0.45} speed={0.12} color="#ffe9cf" />
      <Cloud seed={3} bounds={[26, 6, 26]} volume={12} position={[-4, 6, -95]} opacity={0.4} speed={0.1} color="#ffe7cc" />
      <Cloud seed={4} bounds={[24, 6, 24]} volume={12} position={[-10, 12, -135]} opacity={0.4} speed={0.09} color="#ffe3c2" />
      <Cloud seed={5} bounds={[20, 5, 20]} volume={10} position={[6, 15, -160]} opacity={0.55} speed={0.08} color="#ffd9a8" />
    </Clouds>
  );
}

export function Experience() {
  return (
    <Canvas
      className="!fixed inset-0"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.5, 8], fov: 55, near: 0.1, far: 400 }}
    >
      <color attach="background" args={[FOG_COLOR]} />
      <fog attach="fog" args={[FOG_COLOR, 40, 220]} />

      <Suspense fallback={null}>
        <Environment files={HDRI} background />
        <SkyClouds />
        <Landmarks />
        <PaperPlane />
      </Suspense>

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 18, -40]}
        intensity={2.2}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <CameraRig />
      <ReadySignal />
    </Canvas>
  );
}
