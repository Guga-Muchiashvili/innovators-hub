"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { Project } from "@/types";
import { TYPE_COLOR } from "@/lib/constants";
import {
  GEORGIA_BORDER,
  GEORGIA_BOUNDS,
  pointInGeorgia,
} from "@/data/georgiaGeo";

const { minLng, maxLng, minLat, maxLat } = GEORGIA_BOUNDS;
const MEAN_LAT = (minLat + maxLat) / 2;
const COS = Math.cos((MEAN_LAT * Math.PI) / 180);
const UNIT = 160; // px per degree of latitude
const PAD = 30;

const W = (maxLng - minLng) * COS * UNIT;
const H = (maxLat - minLat) * UNIT;
const VB_W = W + PAD * 2;
const VB_H = H + PAD * 2;

const projectX = (lng: number) => (lng - minLng) * COS * UNIT + PAD;
const projectY = (lat: number) => (maxLat - lat) * UNIT + PAD;

// dotted land fill (computed once)
const DOTS: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
  const step = 9.5;
  for (let gx = 0; gx <= W; gx += step) {
    for (let gy = 0; gy <= H; gy += step) {
      const lng = minLng + gx / (COS * UNIT);
      const lat = maxLat - gy / UNIT;
      if (pointInGeorgia(lng, lat)) out.push({ x: gx + PAD, y: gy + PAD });
    }
  }
  return out;
})();

const BORDER_PATH =
  GEORGIA_BORDER.map(
    ([lng, lat], i) =>
      `${i === 0 ? "M" : "L"}${projectX(lng).toFixed(1)} ${projectY(lat).toFixed(1)}`
  ).join(" ") + " Z";

const MIN_K = 1;
const MAX_K = 7;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface Placed {
  project: Project;
  x: number;
  y: number;
}

function Pin({
  placed,
  active,
  k,
  onClick,
  onHover,
}: {
  placed: Placed;
  active: boolean;
  k: number;
  onClick: (p: Project) => void;
  onHover: (id: string | null) => void;
}) {
  const { project, x, y } = placed;
  const color = TYPE_COLOR[project.type] ?? "#64748b";
  const s = (active ? 1.3 : 1) / k; // keep constant on-screen size

  return (
    <g
      transform={`translate(${x} ${y})`}
      style={{ cursor: "pointer" }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick(project);
      }}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
    >
      {active && (
        <circle r={14 / k} fill={color} opacity="0.18">
          <animate attributeName="opacity" values="0.28;0.06;0.28" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <g transform={`scale(${s})`} style={{ transition: "transform 0.15s ease" }} filter="url(#pin-shadow)">
        <path
          d="M0 -19 C-7 -19 -11.5 -14 -11.5 -8.5 C-11.5 -1 0 8 0 8 C0 8 11.5 -1 11.5 -8.5 C11.5 -14 7 -19 0 -19 Z"
          fill={color}
          stroke="#ffffff"
          strokeWidth="1.6"
        />
        <circle cx="0" cy="-9" r="4.2" fill="#ffffff" />
      </g>
    </g>
  );
}

export default function GeorgiaMap({
  projects,
  onSelectProject,
  selectedProject,
}: {
  projects: Project[];
  onSelectProject: (p: Project | null) => void;
  selectedProject: Project | null;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [view, setView] = useState({ k: 1, tx: 0, ty: 0 });
  const [smooth, setSmooth] = useState(false);

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinch = useRef<{ dist: number; mx: number; my: number } | null>(null);
  const moved = useRef(false);

  // Place each pin at its own venue coordinate; only fan out pins that would
  // physically collide (same building / identical coords) so nothing overlaps.
  const placed: Placed[] = useMemo(() => {
    const base = projects.map((p) => ({
      project: p,
      x: projectX(p.lng),
      y: projectY(p.lat),
    }));
    // group by a small spatial cell to detect collisions
    const cells = new Map<string, Placed[]>();
    for (const b of base) {
      const key = `${Math.round(b.x / 13)},${Math.round(b.y / 13)}`;
      const arr = cells.get(key) ?? [];
      arr.push(b);
      cells.set(key, arr);
    }
    const out: Placed[] = [];
    for (const [, arr] of cells) {
      if (arr.length === 1) {
        out.push(arr[0]);
      } else {
        const cx = arr.reduce((s, p) => s + p.x, 0) / arr.length;
        const cy = arr.reduce((s, p) => s + p.y, 0) / arr.length;
        const r = 11 + arr.length * 1.5;
        arr.forEach((p, i) => {
          const a = (2 * Math.PI * i) / arr.length - Math.PI / 2;
          out.push({ project: p.project, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
        });
      }
    }
    return out;
  }, [projects]);

  const screenToVB = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const r = pt.matrixTransform(ctm.inverse());
    return { x: r.x, y: r.y };
  }, []);

  const clampView = useCallback((k: number, tx: number, ty: number) => {
    const kk = clamp(k, MIN_K, MAX_K);
    const minTx = VB_W * (1 - kk);
    const minTy = VB_H * (1 - kk);
    return { k: kk, tx: clamp(tx, minTx, 0), ty: clamp(ty, minTy, 0) };
  }, []);

  const zoomAt = useCallback(
    (vx: number, vy: number, factor: number) => {
      setView((v) => {
        const k2 = clamp(v.k * factor, MIN_K, MAX_K);
        const cx = (vx - v.tx) / v.k;
        const cy = (vy - v.ty) / v.k;
        return clampView(k2, vx - cx * k2, vy - cy * k2);
      });
    },
    [clampView]
  );

  // non-passive wheel zoom
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setSmooth(false);
      const { x, y } = screenToVB(e.clientX, e.clientY);
      zoomAt(x, y, e.deltaY < 0 ? 1.15 : 1 / 1.15);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [screenToVB, zoomAt]);

  // zoom to the selected project (and reset when deselected)
  useEffect(() => {
    if (selectedProject) {
      const pl = placed.find((p) => p.project.id === selectedProject.id);
      if (pl) {
        const kT = 3.6;
        setSmooth(true);
        setView(clampView(kT, VB_W / 2 - pl.x * kT, VB_H / 2 - pl.y * kT));
      }
    } else {
      setSmooth(true);
      setView({ k: 1, tx: 0, ty: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject?.id]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setSmooth(false);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = false;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        mx: (a.x + b.x) / 2,
        my: (a.y + b.y) / 2,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    const prev = pointers.current.get(e.pointerId)!;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = screenToVB((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomAt(mid.x, mid.y, dist / pinch.current.dist);
      pinch.current.dist = dist;
      moved.current = true;
      return;
    }

    // single-pointer pan
    if (pointers.current.size === 1 && (e.buttons === 1 || e.pointerType !== "mouse")) {
      const p0 = screenToVB(prev.x, prev.y);
      const p1 = screenToVB(e.clientX, e.clientY);
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) moved.current = true;
      setView((v) => clampView(v.k, v.tx + dx, v.ty + dy));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const resetView = () => setView({ k: 1, tx: 0, ty: 0 });

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-full"
        style={{ touchAction: "none", cursor: view.k > 1 ? "grab" : "default" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={() => {
          if (!moved.current) onSelectProject(null);
        }}
      >
        <defs>
          <radialGradient id="ge-halo" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ge-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f3effe" />
          </linearGradient>
          <filter id="ge-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#7c3aed" floodOpacity="0.14" />
          </filter>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#4c1d95" floodOpacity="0.35" />
          </filter>
        </defs>

        <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#ge-halo)" />

        <g
          transform={`translate(${view.tx} ${view.ty}) scale(${view.k})`}
          style={{ transition: smooth ? "transform 0.5s ease" : "none" }}
        >
          {/* country shape */}
          <path d={BORDER_PATH} fill="url(#ge-fill)" stroke="#a78bfa" strokeWidth={1.4 / view.k} filter="url(#ge-shadow)" />

          {/* dotted land */}
          <g>
            {DOTS.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={1.9} fill="#a78bfa" opacity="0.5" />
            ))}
          </g>

          {/* pins */}
          {placed.map((pl) => (
            <Pin
              key={pl.project.id}
              placed={pl}
              active={selectedProject?.id === pl.project.id || hovered === pl.project.id}
              k={view.k}
              onClick={onSelectProject}
              onHover={setHovered}
            />
          ))}
        </g>
      </svg>

      {/* zoom controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1.5">
        <ZoomBtn onClick={() => zoomAt(VB_W / 2, VB_H / 2, 1.4)} label="Zoom in">
          <Plus size={16} />
        </ZoomBtn>
        <ZoomBtn onClick={() => zoomAt(VB_W / 2, VB_H / 2, 1 / 1.4)} label="Zoom out">
          <Minus size={16} />
        </ZoomBtn>
        <ZoomBtn onClick={resetView} label="Reset">
          <Maximize2 size={14} />
        </ZoomBtn>
      </div>
    </div>
  );
}

function ZoomBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur border border-violet-100 text-slate-600 hover:text-violet-700 hover:border-violet-300 shadow-sm transition-colors"
    >
      {children}
    </button>
  );
}
