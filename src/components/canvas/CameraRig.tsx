"use client";

/**
 * CameraRig — drives the camera along the journey keyframes.
 *
 * Reads the mutable `scrollState` every frame (no React re-render) and uses
 * critically-damped smoothing so the camera TRAILS the scrollbar rather than
 * snapping — that lag is what makes the flight feel cinematic. Adds mouse
 * parallax (stronger near the hero) and velocity-based shake.
 */
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { sampleCamera } from "@/lib/journey";

const SCROLL_DAMP = 3.2;
const MOUSE_DAMP = 4;
const FOV_DAMP = 6;

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  const smoothP = useRef(0);
  const pos = useRef(new THREE.Vector3(0, 1.5, 8));
  const tgt = useRef(new THREE.Vector3(0, 1, 0));
  const mouse = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  useFrame((state, dt) => {
    const clampedDt = Math.min(dt, 1 / 30); // guard against tab-switch jumps

    // Trail the scrollbar with critical damping.
    smoothP.current = THREE.MathUtils.damp(
      smoothP.current,
      scrollState.progress,
      SCROLL_DAMP,
      clampedDt,
    );

    const { fov } = sampleCamera(smoothP.current, pos.current, tgt.current);

    // Mouse parallax — fades out past the hero section.
    mouse.current.set(state.pointer.x, state.pointer.y);
    smoothMouse.current.x = THREE.MathUtils.damp(
      smoothMouse.current.x,
      mouse.current.x,
      MOUSE_DAMP,
      clampedDt,
    );
    smoothMouse.current.y = THREE.MathUtils.damp(
      smoothMouse.current.y,
      mouse.current.y,
      MOUSE_DAMP,
      clampedDt,
    );
    const parallax = THREE.MathUtils.lerp(1.2, 0.35, smoothP.current);

    // Velocity shake — a subtle jitter when scrolling fast.
    const speed = Math.min(Math.abs(scrollState.velocity), 4);
    const shake = speed * 0.02;
    const t = state.clock.elapsedTime;

    camera.position.set(
      pos.current.x + smoothMouse.current.x * parallax + Math.sin(t * 30) * shake,
      pos.current.y + smoothMouse.current.y * parallax + Math.cos(t * 27) * shake,
      pos.current.z,
    );
    camera.lookAt(tgt.current);

    // Dynamic FOV (widens slightly with shake for a speed feel).
    const targetFov = fov + shake * 40;
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, FOV_DAMP, clampedDt);
    camera.updateProjectionMatrix();
  });

  return null;
}
