'use client';

import { useRef, useEffect } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';

// ── Node positions (centered at 0,0) ───────

// stage 1: Scattered, asymmetric — raw data fragments
const STAGE_1: Array<[number, number]> = [
  [-220, -130], [110, -190], [-170,  60], [210, -70], [-60,  175],
  [155, 125], [-260, -40], [40, -110], [265,  55], [-115, 190],
  [75, -230], [-195, 130], [230,  185], [-70, -180], [175, -150],
  [-290,  90],  [55,  240], [-140, -250],
];

// Stage 2: Hub-and-spoke network
const STAGE_2: Array<[number, number]> = [
  [0, 0],  // center hub
  [0,  -90],  [ 85, -45], [ 85,  45], [  0,  90], [-85,  45], [-85, -45], // inner ring (6)
  [0, -175],  [152, -88], [175,   0], [152,  88], [ 76, 165],  // outer ring right
  [-76,  165], [-152, 88], [-175,  0], [-152, -88], [-76, -165], [76, -165], // outer ring left
];

// Stage 3: Clean 6×3 grid — resolved structure
const STAGE_3: Array<[number, number]> = [
  [-225, -80], [-135, -80], [-45, -80], [45, -80], [135, -80], [225, -80],
  [-225, 0], [-135, 0], [-45, 0], [45,   0], [135, 0], [225, 0],
  [-225,  80], [-135,  80], [-45,  80], [45,  80], [135,  80], [225,  80],
];

// ── Edge definitions for each stage ──────────────────────────

// Stage 1 edges: all fragments loosely connected — flowing toward center
const EDGES_1: Array<[number, number]> = [
  [0,7], [1,7], [2,7], [3,7], [4,7], [5,7], [6,7],
  [8,7], [9,7], [10,7], [11,7], [12,7], [13,7], [14,7], [15,7], [16,7], [17,7],
];

// Stage 2 edges: hub to inner ring; inner ring to outer
const EDGES_2: Array<[number, number]> = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],             // hub → inner
  [1,7],[2,8],[3,9],[3,10],[4,11],[4,12],           // inner → outer
  [5,13],[5,14],[6,15],[6,16],[1,17],[2,7],[3,8],  // more outer
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,1],              // inner ring closed
];

// Stage 3 edges: grid adjacency (horizontal + vertical)
const EDGES_3: Array<[number, number]> = [
  // Horizontal
  [0,1],[1,2],[2,3],[3,4],[4,5],
  [6,7],[7,8],[8,9],[9,10],[10,11],
  [12,13],[13,14],[14,15],[15,16],[16,17],
  // Vertical
  [0,6],[1,7],[2,8],[3,9],[4,10],[5,11],
  [6,12],[7,13],[8,14],[9,15],[10,16],[11,17],
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerpNodes(
  a: Array<[number, number]>,
  b: Array<[number, number]>,
  t: number,
): Array<[number, number]> {
  const et = easeInOut(t);
  return a.map(([ax, ay], i) => [
    lerp(ax, b[i][0], et),
    lerp(ay, b[i][1], et),
  ]);
}

function lerpEdges(
  a: Array<[number, number]>,
  b: Array<[number, number]>,
  t: number,
): Array<[number, number]> {
  // Interpolate opacity of each edge set
  return t < 0.5 ? a : b;
}

interface InsightFlowCanvasProps {
  progress: MotionValue<number>;
}

export default function InsightFlowCanvas({ progress }: InsightFlowCanvasProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const progressRef  = useRef(0);
  const timeRef      = useRef(0);
  const rafRef       = useRef<number | null>(null);

  useMotionValueEvent(progress, 'change', (v) => {
    progressRef.current = v;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resolve canvas DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W   = canvas.clientWidth || canvas.offsetWidth || 1;
    const H   = canvas.clientHeight || canvas.offsetHeight || 1;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = W / 2;
    const cy = H / 2;

    const draw = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const time = timeRef.current;
      const p    = progressRef.current;

      ctx.clearRect(0, 0, W, H);

      // ── compute current node positions ─────────────────
      let nodes: Array<[number, number]>;
      let edges: Array<[number, number]>;
      let edgeOpacityBase: number;
      let stageLabel: string;

      if (p < 0.45) {
        const t = p / 0.45;
        nodes = lerpNodes(STAGE_1, STAGE_2, t);
        edges = t < 0.5 ? EDGES_1 : EDGES_2;
        edgeOpacityBase = 0.25 + t * 0.35;
        stageLabel = '01';
      } else if (p < 0.75) {
        const t = (p - 0.45) / 0.30;
        nodes = lerpNodes(STAGE_2, STAGE_3, t);
        edges = t < 0.5 ? EDGES_2 : EDGES_3;
        edgeOpacityBase = 0.55 + t * 0.2;
        stageLabel = '02';
      } else {
        nodes = STAGE_3;
        edges = EDGES_3;
        edgeOpacityBase = 0.75;
        stageLabel = '03';
      }

      // ── draw edges ───────────────
      edges.forEach(([ai, bi], idx) => {
        const [ax, ay] = nodes[ai];
        const [bx, by] = nodes[bi];

        // Stage 2 pulse effect
        const pulse = p > 0.3 && p < 0.75
          ? 0.3 + 0.7 * Math.abs(Math.sin(time * 1.8 + idx * 0.45))
          : edgeOpacityBase;

        const grad = ctx.createLinearGradient(cx + ax, cy + ay, cx + bx, cy + by);
        grad.addColorStop(0, `rgba(124,92,255,${pulse * 0.7})`);
        grad.addColorStop(1, `rgba(45,212,191,${pulse * 0.7})`);

        ctx.beginPath();
        ctx.moveTo(cx + ax, cy + ay);
        ctx.lineTo(cx + bx, cy + by);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 0.9;
        ctx.stroke();
      });

      // ── Draw nodes ──────────────────────────────────────
      nodes.forEach(([nx, ny], idx) => {
        const screenX = cx + nx;
        const screenY = cy + ny;

        // Outer glow
        const glowR  = 10 + 4 * Math.sin(time * 1.2 + idx * 0.7);
        const glow   = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, glowR);
        const isHub  = idx === 0 && p > 0.3;
        const color  = isHub ? '45,212,191' : '124,92,255';
        glow.addColorStop(0, `rgba(${color}, 0.35)`);
        glow.addColorStop(1, `rgba(${color}, 0)`);

        ctx.beginPath();
        ctx.arc(screenX, screenY, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Inner dot
        const dotR = isHub ? 4 : 2.5 + 0.5 * Math.sin(time + idx);
        ctx.beginPath();
        ctx.arc(screenX, screenY, dotR, 0, Math.PI * 2);
        ctx.fillStyle = isHub
          ? 'rgba(45,212,191,0.9)'
          : 'rgba(124,92,255,0.85)';
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        width:  '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
