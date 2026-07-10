/**
 * Journey choreography — the "screenplay" of the scroll cinematic.
 *
 * A paper plane glides forward (down the -Z axis) and gently climbs (+Y)
 * through a warm sunrise sky, threading past five floating landmarks. Scroll
 * progress (0→1) is mapped to camera + plane keyframes, interpolated with
 * Catmull-Rom curves so motion is smooth and non-linear.
 *
 * This file is theme-defining but engine-agnostic: reskinning the portfolio
 * mostly means editing the numbers here + swapping landmark meshes.
 */
import * as THREE from "three";

/** Total scroll runway height, in viewport heights. */
export const TOTAL_PAGES = 10;

export type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "work"
  | "contact";

export interface Section {
  id: SectionId;
  label: string;
  /** Inclusive progress range [start, end]. */
  range: [number, number];
  /** World-space anchor of this section's landmark. */
  anchor: [number, number, number];
}

/** Section ranges span the full 0→1 scroll. Projects gets an orbit segment. */
export const SECTIONS: readonly Section[] = [
  { id: "hero", label: "Skyward", range: [0.0, 0.12], anchor: [0, 0, 0] },
  { id: "about", label: "About", range: [0.12, 0.3], anchor: [-6, 2, -30] },
  { id: "skills", label: "Skills", range: [0.3, 0.48], anchor: [7, 5, -60] },
  { id: "projects", label: "Projects", range: [0.48, 0.68], anchor: [0, 3, -95] },
  { id: "work", label: "Experience", range: [0.68, 0.85], anchor: [-8, 8, -130] },
  { id: "contact", label: "Contact", range: [0.85, 1.0], anchor: [4, 14, -165] },
] as const;

/** Circular fly-around of the Projects archipelago. */
export const PROJECTS_ORBIT = {
  range: [0.5, 0.66] as [number, number],
  center: new THREE.Vector3(0, 3, -95),
  radius: 16,
  height: 4,
};

interface CameraKey {
  p: number;
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/** 12 waypoints defining the camera flight. */
const CAMERA_KEYS: readonly CameraKey[] = [
  { p: 0.0, pos: [0, 1.5, 8], target: [0, 1, 0], fov: 55 },
  { p: 0.1, pos: [1, 2, 2], target: [-3, 1.5, -12], fov: 58 },
  { p: 0.2, pos: [-3, 3, -18], target: [-6, 2, -30], fov: 60 },
  { p: 0.3, pos: [-2, 4, -40], target: [4, 5, -58], fov: 60 },
  { p: 0.4, pos: [4, 6, -52], target: [7, 5, -60], fov: 58 },
  { p: 0.5, pos: [10, 7, -84], target: [0, 3, -95], fov: 62 },
  { p: 0.58, pos: [-12, 6, -95], target: [0, 3, -95], fov: 64 }, // orbit far side
  { p: 0.66, pos: [8, 8, -108], target: [0, 3, -95], fov: 62 },
  { p: 0.74, pos: [-4, 9, -118], target: [-8, 8, -130], fov: 58 },
  { p: 0.85, pos: [-6, 11, -142], target: [4, 13, -160], fov: 55 },
  { p: 0.94, pos: [2, 14, -156], target: [4, 15, -168], fov: 50 },
  { p: 1.0, pos: [4, 15.5, -162], target: [4, 16, -172], fov: 42 },
];

interface PlaneKey {
  p: number;
  pos: [number, number, number];
}

/** Plane path — leads the camera, threading between landmarks. */
const PLANE_KEYS: readonly PlaneKey[] = [
  { p: 0.0, pos: [0, 1, -2] },
  { p: 0.1, pos: [-3, 1.6, -14] },
  { p: 0.2, pos: [-5, 2.4, -30] },
  { p: 0.3, pos: [0, 4, -46] },
  { p: 0.4, pos: [6, 5.2, -60] },
  { p: 0.5, pos: [4, 4, -80] },
  { p: 0.58, pos: [-6, 3.5, -95] },
  { p: 0.66, pos: [2, 5, -104] },
  { p: 0.74, pos: [-7, 7.5, -126] },
  { p: 0.85, pos: [-2, 11, -148] },
  { p: 0.94, pos: [3, 14, -160] },
  { p: 1.0, pos: [4, 15.5, -168] },
];

// --- Curve construction (built once) --------------------------------------

function toVectors(pts: readonly { pos: [number, number, number] }[]) {
  return pts.map((k) => new THREE.Vector3(...k.pos));
}

const camPosCurve = new THREE.CatmullRomCurve3(
  CAMERA_KEYS.map((k) => new THREE.Vector3(...k.pos)),
);
const camTargetCurve = new THREE.CatmullRomCurve3(
  CAMERA_KEYS.map((k) => new THREE.Vector3(...k.target)),
);
const planeCurve = new THREE.CatmullRomCurve3(toVectors(PLANE_KEYS));

const camProgresses = CAMERA_KEYS.map((k) => k.p);
const planeProgresses = PLANE_KEYS.map((k) => k.p);

/**
 * Map a global progress `p` to a curve parameter u in [0,1] that respects the
 * non-uniform spacing of keyframe progress values.
 */
function progressToU(progresses: number[], p: number): number {
  const n = progresses.length - 1;
  const clamped = THREE.MathUtils.clamp(p, 0, 1);
  for (let i = 0; i < n; i++) {
    const a = progresses[i];
    const b = progresses[i + 1];
    if (clamped <= b) {
      const localT = b === a ? 0 : (clamped - a) / (b - a);
      return (i + localT) / n;
    }
  }
  return 1;
}

function lerpFov(p: number): number {
  const n = CAMERA_KEYS.length - 1;
  const clamped = THREE.MathUtils.clamp(p, 0, 1);
  for (let i = 0; i < n; i++) {
    const a = CAMERA_KEYS[i];
    const b = CAMERA_KEYS[i + 1];
    if (clamped <= b.p) {
      const t = b.p === a.p ? 0 : (clamped - a.p) / (b.p - a.p);
      return THREE.MathUtils.lerp(a.fov, b.fov, t);
    }
  }
  return CAMERA_KEYS[n].fov;
}

export interface CameraSample {
  fov: number;
}

/** Write camera position + target for progress `p` into the provided vectors. */
export function sampleCamera(
  p: number,
  outPos: THREE.Vector3,
  outTarget: THREE.Vector3,
): CameraSample {
  camPosCurve.getPoint(progressToU(camProgresses, p), outPos);
  camTargetCurve.getPoint(progressToU(camProgresses, p), outTarget);
  return { fov: lerpFov(p) };
}

/** Write plane position for progress `p`; also returns forward (nose) dir. */
export function samplePlane(
  p: number,
  outPos: THREE.Vector3,
  outDir: THREE.Vector3,
): void {
  const u = progressToU(planeProgresses, p);
  planeCurve.getPoint(u, outPos);
  planeCurve.getTangent(u, outDir).normalize();
}

// --- Section helpers -------------------------------------------------------

export function sectionAt(p: number): Section {
  return (
    SECTIONS.find(({ range }) => p >= range[0] && p < range[1]) ??
    SECTIONS[SECTIONS.length - 1]
  );
}

/** Local progress 0→1 within the section containing `p`. */
export function sectionProgress(p: number): number {
  const { range } = sectionAt(p);
  return THREE.MathUtils.clamp((p - range[0]) / (range[1] - range[0]), 0, 1);
}

/** Finale intensity 0→1 as the plane climbs into the sun. */
export function impactProgress(p: number): number {
  const start = SECTIONS[SECTIONS.length - 1].range[0];
  return THREE.MathUtils.clamp((p - start) / (1 - start), 0, 1);
}
