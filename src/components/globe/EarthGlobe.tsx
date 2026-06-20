"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "@/types";
import { TYPE_COLOR } from "@/lib/constants";

// ── constants ─────────────────────────────────────────────────────────────────

const GLOBE_R = 2;
const DOT_R = GLOBE_R + 0.005;
const PIN_R = GLOBE_R + 0.02;

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// ── dotted land sampling from earth image ─────────────────────────────────────

function useLandDots(src: string): Float32Array | null {
  const [dots, setDots] = useState<Float32Array | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      const w = img.width;
      const h = img.height;
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, w, h).data;

      const rows = 100; // latitude bands

      const brightnessAt = (lat: number, lng: number) => {
        const px = Math.min(w - 1, Math.max(0, Math.floor(((lng + 180) / 360) * w)));
        const py = Math.min(h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * h)));
        const idx = (py * w + px) * 4;
        return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      };

      // The specular map is a clean land/ocean mask. Auto-detect polarity:
      // land covers ~29% of Earth, so the minority brightness class is land.
      let dark = 0;
      let total = 0;
      for (let i = 0; i < rows; i++) {
        const lat = -90 + (180 * (i + 0.5)) / rows;
        const count = Math.max(1, Math.round(Math.cos((lat * Math.PI) / 180) * 200));
        for (let j = 0; j < count; j++) {
          const lng = -180 + (360 * (j + 0.5)) / count;
          if (brightnessAt(lat, lng) < 128) dark++;
          total++;
        }
      }
      const landIsDark = dark / total < 0.5;

      const isLand = (lat: number, lng: number) => {
        const b = brightnessAt(lat, lng);
        return landIsDark ? b < 110 : b > 145;
      };

      const pts: number[] = [];
      for (let i = 0; i < rows; i++) {
        const lat = -90 + (180 * (i + 0.5)) / rows;
        const count = Math.max(1, Math.round(Math.cos((lat * Math.PI) / 180) * 200));
        for (let j = 0; j < count; j++) {
          const lng = -180 + (360 * (j + 0.5)) / count;
          // require the sampled point AND a small neighborhood to be land,
          // which trims stray ocean speckles near coastlines
          if (isLand(lat, lng) && isLand(lat, lng + 1) && isLand(lat + 1, lng)) {
            const v = latLngToVec3(lat, lng, DOT_R);
            pts.push(v.x, v.y, v.z);
          }
        }
      }
      setDots(new Float32Array(pts));
    };
    return () => {
      cancelled = true;
    };
  }, [src]);

  return dots;
}

function DottedLand() {
  const dots = useLandDots("/earth/earth_specular.jpg");
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = dots ? dots.length / 3 : 0;

  useEffect(() => {
    if (!ref.current || !dots) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(dots[i * 3], dots[i * 3 + 1], dots[i * 3 + 2]);
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [dots, count]);

  if (!dots) return null;

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <circleGeometry args={[0.015, 8]} />
      <meshBasicMaterial color="#8b7fc4" side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}

// ── base sphere (occludes back-side dots, gives a globe feel) ──────────────────

function BaseSphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[GLOBE_R - 0.02, 64, 64]} />
        <meshStandardMaterial color="#faf8ff" roughness={1} metalness={0} />
      </mesh>
      {/* soft outer halo / rim */}
      <mesh scale={[1.045, 1.045, 1.045]}>
        <sphereGeometry args={[GLOBE_R, 48, 48]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.14} side={THREE.BackSide} />
      </mesh>
    </>
  );
}

// ── location pin marker ───────────────────────────────────────────────────────

function Pin({
  project,
  active,
  onClick,
  onHover,
}: {
  project: Project;
  active: boolean;
  onClick: (p: Project) => void;
  onHover: (id: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const hex = TYPE_COLOR[project.type] ?? "#475569";
  const color = useMemo(() => new THREE.Color(hex), [hex]);

  const { position, quaternion } = useMemo(() => {
    const pos = latLngToVec3(project.lat, project.lng, PIN_R);
    const dir = pos.clone().normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir
    );
    return { position: pos, quaternion: q };
  }, [project.lat, project.lng]);

  useFrame((_, d) => {
    if (group.current) {
      const target = active ? 1.55 : 1;
      const s = THREE.MathUtils.lerp(group.current.scale.x, target, 0.15);
      group.current.scale.setScalar(s);
    }
    if (ring.current && active) {
      ring.current.rotation.z += d * 2;
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.25;
      ring.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position} quaternion={quaternion}>
      <group ref={group}>
        {/* invisible hit area */}
        <mesh
          position={[0, 0.04, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClick(project);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(project.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            onHover(null);
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* pointer cone (tip at surface) */}
        <mesh position={[0, 0.022, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.018, 0.045, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.6 : 0.2} roughness={0.4} />
        </mesh>

        {/* round head */}
        <mesh position={[0, 0.052, 0]}>
          <sphereGeometry args={[0.022, 20, 20]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.9 : 0.35} roughness={0.3} />
        </mesh>

        {/* white dot in head center */}
        <mesh position={[0, 0.052, 0.02]}>
          <circleGeometry args={[0.008, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* pulse ring when active */}
        {active && (
          <mesh ref={ring} position={[0, 0.052, 0]}>
            <torusGeometry args={[0.05, 0.005, 8, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.85} />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ── rotating globe group ──────────────────────────────────────────────────────

function Globe({
  projects,
  onSelect,
  selected,
}: {
  projects: Project[];
  onSelect: (p: Project | null) => void;
  selected: Project | null;
}) {
  const spin = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((_, d) => {
    if (spin.current && !selected && !hovered) {
      spin.current.rotation.y += d * 0.06;
    }
  });

  return (
    <group ref={spin}>
      <BaseSphere />
      <DottedLand />
      {projects.map((p) => (
        <Pin
          key={p.id}
          project={p}
          active={selected?.id === p.id || hovered === p.id}
          onClick={onSelect}
          onHover={setHovered}
        />
      ))}
    </group>
  );
}

// ── export ────────────────────────────────────────────────────────────────────

export default function EarthGlobe({
  projects,
  onSelectProject,
  selectedProject,
}: {
  projects: Project[];
  onSelectProject: (p: Project | null) => void;
  selectedProject: Project | null;
}) {
  // pull the camera back a little on small screens so the globe isn't clipped
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const camZ = isMobile ? 7.6 : 6;

  return (
    <Canvas
      camera={{ position: [0, 0.4, camZ], fov: 42, near: 0.1, far: 1000 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelectProject(null)}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[4, 3, 5]} intensity={0.55} color="#ffffff" />
      <directionalLight position={[-4, -1, -3]} intensity={0.2} color="#cbd5e1" />
      <Globe projects={projects} onSelect={onSelectProject} selected={selectedProject} />
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3.2}
        maxDistance={9}
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.55}
      />
    </Canvas>
  );
}
