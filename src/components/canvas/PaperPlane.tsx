"use client";

/**
 * PaperPlane — the traveler, built procedurally (no external model).
 *
 * Two folded triangular wings + a keel, following the plane path from
 * `journey.ts`. Orientation aligns the nose to the path tangent and banks
 * (rolls) into turns based on horizontal change of direction.
 */
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { samplePlane } from "@/lib/journey";

const POS_DAMP = 4;

function usePaperGeometry(): THREE.BufferGeometry {
  return useMemo(() => {
    // Nose at +Z (local), tail at -Z. Two wings folded up from a central keel.
    const v = new Float32Array([
      // left wing
      0, 0, 1, 0, 0.18, -1, -1.1, -0.05, -1,
      // right wing
      0, 0, 1, 1.1, -0.05, -1, 0, 0.18, -1,
      // left keel underside
      0, 0, 1, 0, -0.28, -1, 0, 0.18, -1,
      // right keel underside
      0, 0, 1, 0, 0.18, -1, 0, -0.28, -1,
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(v, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);
}

export function PaperPlane() {
  const group = useRef<THREE.Group>(null);
  const smoothP = useRef(0);
  const prevDir = useRef(new THREE.Vector3(0, 0, -1));

  const pos = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const lookMat = useMemo(() => new THREE.Matrix4(), []);
  const geometry = usePaperGeometry();

  useFrame((_, dt) => {
    const clampedDt = Math.min(dt, 1 / 30);
    smoothP.current = THREE.MathUtils.damp(
      smoothP.current,
      scrollState.progress,
      POS_DAMP,
      clampedDt,
    );

    samplePlane(smoothP.current, pos, dir);
    if (!group.current) return;

    group.current.position.copy(pos);

    // Face along travel direction.
    lookMat.lookAt(pos, pos.clone().add(dir), up);
    quat.setFromRotationMatrix(lookMat);

    // Bank: roll proportional to horizontal turn rate.
    const turn = dir.x - prevDir.current.x;
    const bank = THREE.MathUtils.clamp(-turn * 8, -0.7, 0.7);
    const bankQuat = new THREE.Quaternion().setFromAxisAngle(dir, bank);
    quat.premultiply(bankQuat);
    prevDir.current.copy(dir);

    group.current.quaternion.slerp(quat, 0.15);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#fbf6ec"
          side={THREE.DoubleSide}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
