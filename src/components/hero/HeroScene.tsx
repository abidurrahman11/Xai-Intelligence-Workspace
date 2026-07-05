'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── constants ────
const COUNT= 1800;
const springK = 0.042;  // softer spring
const damping = 0.74;   // lower retention
const mouseStrength = 0.065;  // gentler repulsion from cursor velocity
const repelRadius = 1.6;

// colors tuned to be less vibrant & lighter
const violetColor = new THREE.Color('#938CB4');
const tealColor = new THREE.Color('#7FA8A2');

// ── Easing helper ───────────
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function seededRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

// ── position generators ───
function buildChaosPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (seededRandom(i * 37 + 11) - 0.5) * 11.0;
    pos[i * 3 + 1] = (seededRandom(i * 53 + 17) - 0.5) * 7.5;
    pos[i * 3 + 2] = (seededRandom(i * 71 + 23) - 0.5) * 4.0;
  }
  return pos;
}

function buildHexGrid(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const scale = 0.28; // grid node spacing
  let index = 0;
  
  // Distribute particles across three depth layers to form a 3D matrix
  const layers = [-0.6, 0.0, 0.6];
  const countPerLayer = Math.ceil(count / layers.length);
  
  for (let l = 0; l < layers.length; l++) {
    const baseZ = layers[l];
    let layerCount = 0;
    
    // Center node for each layer
    if (index < count) {
      pos[index * 3] = 0;
      pos[index * 3 + 1] = 0;
      pos[index * 3 + 2] = baseZ;
      index++;
      layerCount++;
    }
    // hexagonal rings around the center
    let ring = 1;
    while (layerCount < countPerLayer && index < count) {
      for (let side = 0; side < 6; side++) {
        const angle1 = (side * Math.PI) / 3;
        const angle2 = (((side + 1) % 6) * Math.PI) / 3;
        
        const x1 = Math.cos(angle1) * ring * scale;
        const y1 = Math.sin(angle1) * ring * scale;
        const x2 = Math.cos(angle2) * ring * scale;
        const y2 = Math.sin(angle2) * ring * scale;
        
        for (let step = 0; step < ring; step++) {
          if (layerCount >= countPerLayer || index >= count) break;
          const t = step / ring;
          const px = x1 * (1 - t) + x2 * t;
          const py = y1 * (1 - t) + y2 * t;
          
          // Apply a contour wave shape based on radial distance
          const r = Math.sqrt(px * px + py * py);
          const pz = baseZ + Math.sin(r * 2.0) * 0.15;
          
          pos[index * 3] = px;
          pos[index * 3 + 1] = py;
          pos[index * 3 + 2] = pz;
          
          index++;
          layerCount++;
        }
      }
      ring++;
    }
  }
  
  // fill remaining particles if needed
  while (index < count) {
    pos[index * 3] = (seededRandom(index * 97 + 29) - 0.5) * 5;
    pos[index * 3 + 1] = (seededRandom(index * 113 + 31) - 0.5) * 3;
    pos[index * 3 + 2] = (seededRandom(index * 131 + 37) - 0.5) * 1.2;
    index++;
  }
  
  return pos;
}

// ── connections generator ─────────────
function buildConnections(hexPos: Float32Array, count: number, scale: number): Int32Array {
  const conn: number[] = [];
  const thresholdSq = (scale * 1.15) * (scale * 1.15);
  
  for (let i = 0; i < count; i++) {
    const xi = hexPos[i * 3];
    const yi = hexPos[i * 3 + 1];
    const zi = hexPos[i * 3 + 2];
    
    for (let j = i + 1; j < count; j++) {
      const xj = hexPos[j * 3];
      const yj = hexPos[j * 3 + 1];
      const zj = hexPos[j * 3 + 2];
      
      const dx = xj - xi;
      const dy = yj - yi;
      const dz = zj - zi;
      const distSq = dx * dx + dy * dy;
      
      // Connect nodes in the same depth layer
      if (Math.abs(dz) < 0.05) {
        if (distSq < thresholdSq) {
          conn.push(i, j);
        }
      }
      // connect vertically aligned nodes between adjacent layers
      else if (Math.abs(Math.abs(dz) - 0.6) < 0.05) {
        if (distSq < 0.001) {
          conn.push(i, j);
        }
      }
    }
    
    // limit connection network segments
    if (conn.length >= 4000) break;
  }
  
  return new Int32Array(conn);
}

// ── Shaders ─────────
const vertexShader = `
  uniform float uProgress;
  
  attribute float aShape;
  attribute float aSize;
  attribute vec3 aRandom;
  
  varying float vShape;
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    vShape = aShape;
    
    // color morph: muted violet (#938CB4) to muted teal (#7FA8A2)
    vec3 colorViolet = vec3(0.576, 0.549, 0.706);
    vec3 colorTeal = vec3(0.498, 0.659, 0.635);
    
    // Personal organic delay offset for wave snapping
    float startOffset = aRandom.x * 0.25;
    float personalProgress = clamp((uProgress - startOffset) / (1.0 - startOffset), 0.0, 1.0);
    
    // Eased personal progress
    float easedPersonal = personalProgress * personalProgress * (3.0 - 2.0 * personalProgress);
    
    vec3 baseColor = mix(colorViolet, colorTeal, easedPersonal);
    
    // shape-specific subtle tint variance for color depth
    if (aShape < 0.5) {
      baseColor = mix(baseColor, vec3(0.498, 0.659, 0.635), 0.15); // Circle extra teal
    } else if (aShape > 1.5) {
      baseColor = mix(baseColor, vec3(0.686, 0.659, 0.816), 0.15); // Triangle extra muted violet
    }
    
    vColor = baseColor;
    
    // Muted opacity range to prevent foreground clashing and improve readability
    vOpacity = mix(0.22, 0.44, easedPersonal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Point size with camera distance attenuation
    gl_PointSize = aSize * (350.0 / -mvPosition.z);
  }
`;

// fragment shader with shape-based alpha and opacity scaling
const fragmentShader = `
  varying float vShape;
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float alpha = 0.0;
    
    if (vShape < 0.5) {
      // Circle
      float d = length(p);
      alpha = smoothstep(0.45, 0.40, d);
    } else if (vShape < 1.5) {
      // Square
      float d = max(abs(p.x), abs(p.y));
      alpha = smoothstep(0.40, 0.35, d);
    } else {
      // Triangle
      float d1 = p.y + 0.38;
      float d2 = 0.38 - p.y - 1.5 * abs(p.x);
      float d = min(d1, d2);
      alpha = smoothstep(-0.02, 0.02, d);
    }
    
    if (alpha <= 0.0) discard;
    
    // Further scale down opacity for seamless integration into the dark background
    gl_FragColor = vec4(vColor, vOpacity * alpha * 0.60);
  }
`;

// ── Particle Component ──────
function Particles({
  scrollRef,
  mouseRef,
}: {
  scrollRef: React.RefObject<number>;
  mouseRef:  React.RefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();

  // generate layouts
  const chaosPos = useMemo(() => buildChaosPositions(COUNT), []);
  const hexPos   = useMemo(() => buildHexGrid(COUNT), []);
  
  // Working position buffer & velocities
  const currentPos = useMemo(() => chaosPos.slice(), [chaosPos]);
  const vx = useMemo(() => new Float32Array(COUNT), []);
  const vy = useMemo(() => new Float32Array(COUNT), []);
  const vz = useMemo(() => new Float32Array(COUNT), []);

  // Set up connection lines
  const connections = useMemo(() => buildConnections(hexPos, COUNT, 0.28), [hexPos]);
  const linePositions = useMemo(() => new Float32Array(connections.length * 3), [connections]);

  // Generate particle shape attributes
  const { shapes, sizes, randoms } = useMemo(() => {
    const shp = new Float32Array(COUNT);
    const sz  = new Float32Array(COUNT);
    const rnd = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      shp[i] = Math.floor(seededRandom(i * 19 + 7) * 3); // 0 = circle, 1 = square, 2 = triangle
      sz[i]  = 0.16 + seededRandom(i * 23 + 13) * 0.16;   // scaling factor
      rnd[i * 3] = seededRandom(i * 29 + 19);
      rnd[i * 3 + 1] = seededRandom(i * 31 + 23) * 2.0 - 1.0;
      rnd[i * 3 + 2] = seededRandom(i * 37 + 29);
    }
    return { shapes: shp, sizes: sz, randoms: rnd };
  }, []);

  // Construct Geometries imperatively to avoid JSX typing issues
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));
    geo.setAttribute('aShape', new THREE.BufferAttribute(shapes, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    return geo;
  }, [currentPos, shapes, sizes, randoms]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
  }), []);

  // Refs for scene mesh links
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const lineRef = useRef<THREE.LineSegments>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  // Time & interactive variables
  const timeRef= useRef(0);
  const accumulatedTime  = useRef(0);
  const lastScroll = useRef(0);
  const lastScrollDir = useRef(1.0);
  const lastMouse = useRef({ x: 0, y: 0 });
  const firstMouseMove= useRef(true);
  const mouseDisruption = useRef(0);
  const scrollDisruption = useRef(0);
  
  const timeStep = 0.016; // 60fps tick step

  // init scroll speed monitoring
  useEffect(() => {
    lastScroll.current = scrollRef.current ?? 0;
  }, [scrollRef]);

  // Cleanup WebGL resources
  useEffect(() => {
    return () => {
      geometry.dispose();
      lineGeometry.dispose();
      materialRef.current?.dispose();
      lineMaterialRef.current?.dispose();
    };
  }, [geometry, lineGeometry]);

  // fixed physics integrator step
  const updatePhysics = (dt: number) => {
    timeRef.current += dt;
    const t = timeRef.current;
    
    // timeline progress calculations
    const introDelay = 0.5;
    const transitionDuration = 2.0;
    let progress = 0;
    if (t > introDelay) {
      progress = Math.min((t - introDelay) / transitionDuration, 1.0);
    }
    const easedProgress = easeInOutCubic(progress);

    // Mouse updates
    const mouse = mouseRef.current ?? { x: 0, y: 0 };
    
    // Project mouse clip coordinates to the grid space
    const mouseWorldX = mouse.x * 6.5;
    const mouseWorldY = -mouse.y * 4.0;
    const mouseWorldZ = 0.0;

    // Combined disruption factor
    const totalDisruption = Math.max(mouseDisruption.current, scrollDisruption.current);
    const morphProgress = easedProgress * (1.0 - totalDisruption);

    // Update material properties
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = easedProgress;
    }
    if (lineMaterialRef.current) {
      // Lower wire opacity for subtle background integration
      const lineOpacity = Math.max(0, (easedProgress - 0.2) / 0.8) * 0.07;
      lineMaterialRef.current.opacity = lineOpacity;
      lineMaterialRef.current.color.lerpColors(violetColor, tealColor, easedProgress);
    }

    // Main particle updates
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const rx = randoms[i3];
      const ry = randoms[i3 + 1];
      const rz = randoms[i3 + 2];

      // 1. Calculate base target coordinates (Chaos float morphing into Organized Hex lattice)
      const fadeDrift = 1.0 - easedProgress;
      const driftX = Math.sin(t * 0.4 + rx * 12.0) * 0.5 * fadeDrift;
      const driftY = Math.cos(t * 0.35 + ry * 12.0) * 0.5 * fadeDrift;
      const driftZ = Math.sin(t * 0.25 + rz * 12.0) * 0.4 * fadeDrift;

      // Ambient Idle Motion State (micro-vibration / organic float in structured state)
      const ambientX = Math.sin(t * 0.8 + rx * 20.0) * 0.05 * easedProgress;
      const ambientY = Math.cos(t * 0.75 + ry * 20.0) * 0.05 * easedProgress;
      const ambientZ = Math.sin(t * 0.5 + rz * 20.0) * 0.04 * easedProgress;

      const cx = chaosPos[i3] + driftX;
      const cy = chaosPos[i3 + 1] + driftY;
      const cz = chaosPos[i3 + 2] + driftZ;

      const ox = hexPos[i3] + ambientX;
      const oy = hexPos[i3 + 1] + ambientY;
      const oz = hexPos[i3 + 2] + ambientZ;

      // When disrupted, we morph back towards the chaos layout
      const targetX = cx * (1.0 - morphProgress) + ox * morphProgress;
      const targetY = cy * (1.0 - morphProgress) + oy * morphProgress;
      const targetZ = cz * (1.0 - morphProgress) + oz * morphProgress;

      // 2. Spring force computation
      const dx = targetX - currentPos[i3];
      const dy = targetY - currentPos[i3 + 1];
      const dz = targetZ - currentPos[i3 + 2];

      let fx = dx * springK;
      let fy = dy * springK;
      let fz = dz * springK;

      // 3. Mouse repel & Global wave ripple (Broad reaction up to 6.0 units, active only on movement)
      if (mouseDisruption.current > 0.001 && easedProgress > 0.1) {
        const mx = currentPos[i3] - mouseWorldX;
        const my = currentPos[i3 + 1] - mouseWorldY;
        const mz = currentPos[i3 + 2] - mouseWorldZ;
        const distSq = mx * mx + my * my + mz * mz;

        if (distSq < 36.0) { // broad radius of 6.0 units
          const dist = Math.sqrt(distSq) || 0.001;
          const decay = 1.0 - dist / 6.0;

          // Strong local repulsion push inside repelRadius
          let pushForce = 0.0;
          if (dist < repelRadius) {
            pushForce = (1.0 - dist / repelRadius) * mouseStrength;
          }

          // Subtle propagating wave ripple
          const wave = Math.sin(dist * 5.0 - t * 10.0) * 0.007 * decay;
          
          const totalForce = (pushForce + wave) * easedProgress * mouseDisruption.current;
          const personalRepelForce = totalForce * (0.8 + 0.4 * rx);
          
          fx += (mx / dist) * personalRepelForce;
          fy += (my / dist) * personalRepelForce;
          fz += (mz / dist) * personalRepelForce * 0.6;
        }
      }

      // 4. Directional scroll wind & recovery
      if (scrollDisruption.current > 0.001 && easedProgress > 0.1) {
        const px = currentPos[i3];
        const py = currentPos[i3 + 1];
        const radDist = Math.sqrt(px * px + py * py) || 0.001;
        
        // Wind force combines vertical directional drag and radial dispersion
        const windX = (px / radDist) * 0.4 * scrollDisruption.current;
        const windY = (lastScrollDir.current * 1.0 + (py / radDist) * 0.4) * scrollDisruption.current;
        
        const windForce = (0.5 + 0.5 * ry) * 0.16 * easedProgress;

        fx += windX * windForce;
        fy += windY * windForce;
        fz += (currentPos[i3 + 2] / 5.0) * scrollDisruption.current * windForce * 0.2;
      }

      // 5. Physics integration update
      vx[i] = (vx[i] + fx) * damping;
      vy[i] = (vy[i] + fy) * damping;
      vz[i] = (vz[i] + fz) * damping;

      currentPos[i3]     += vx[i];
      currentPos[i3 + 1] += vy[i];
      currentPos[i3 + 2] += vz[i];
    }
  };

  useFrame((_, delta) => {
    // 1. Mouse speed & disruption tracking
    const mouse = mouseRef.current ?? { x: 0, y: 0 };
    if (firstMouseMove.current && (mouse.x !== 0 || mouse.y !== 0)) {
      lastMouse.current = { x: mouse.x, y: mouse.y };
      firstMouseMove.current = false;
    }
    const dx = mouse.x - lastMouse.current.x;
    const dy = mouse.y - lastMouse.current.y;
    const mouseSpeed = Math.sqrt(dx * dx + dy * dy);
    lastMouse.current = { x: mouse.x, y: mouse.y };

    let targetMouseDisruption = 0;
    if (mouseSpeed > 0.0001) {
      targetMouseDisruption = Math.min(1.0, mouseSpeed * 15.0);
    }
    const mouseLerpBase = targetMouseDisruption > mouseDisruption.current ? 0.07 : 0.026;
    const mouseLerp = targetMouseDisruption > mouseDisruption.current
      ? mouseLerpBase
      : mouseLerpBase * easeOutCubic(mouseDisruption.current);
    mouseDisruption.current += (targetMouseDisruption - mouseDisruption.current) * mouseLerp;
    if (mouseDisruption.current < 0.001) mouseDisruption.current = 0;

    // 2. Scroll speed & disruption tracking
    const currentScroll = scrollRef.current ?? 0;
    const scrollDiff = currentScroll - lastScroll.current;
    lastScroll.current = currentScroll;
    
    let targetScrollDisruption = 0;
    if (Math.abs(scrollDiff) > 0.0001) {
      lastScrollDir.current = scrollDiff > 0 ? 1.0 : -1.0;
      targetScrollDisruption = Math.min(1.0, Math.abs(scrollDiff) * 12.0);
    }
    const scrollLerp = targetScrollDisruption > scrollDisruption.current ? 0.2 : 0.06;
    scrollDisruption.current += (targetScrollDisruption - scrollDisruption.current) * scrollLerp;
    if (scrollDisruption.current < 0.001) scrollDisruption.current = 0;

    // Prevent lag spiral of death on window unfocus
    const dt = Math.min(delta, 0.1);
    accumulatedTime.current += dt;

    // Run physics updates in step intervals
    while (accumulatedTime.current >= timeStep) {
      updatePhysics(timeStep);
      accumulatedTime.current -= timeStep;
    }

    // Refresh particle position buffers
    if (pointsRef.current) {
      (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // Refresh connection line segments position buffers
    if (lineRef.current) {
      const linePosAttr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as Float32Array;
      let idx = 0;
      for (let i = 0; i < connections.length; i++) {
        const pIdx = connections[i] * 3;
        linePosArray[idx++] = currentPos[pIdx];
        linePosArray[idx++] = currentPos[pIdx + 1];
        linePosArray[idx++] = currentPos[pIdx + 2];
      }
      linePosAttr.needsUpdate = true;
    }

    // Camera parallax tracking
    camera.position.x += (mouse.x * 0.45 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {/* 3D structural lattice wires */}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          ref={lineMaterialRef}
          transparent={true}
          opacity={0.0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Shapes points */}
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ── Exported Canvas wrapper ──────────
interface HeroSceneProps {
  scrollRef: React.RefObject<number>;
  mouseRef:  React.RefObject<{ x: number; y: number }>;
}

export default function HeroScene({ scrollRef, mouseRef }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <Particles scrollRef={scrollRef} mouseRef={mouseRef} />
    </Canvas>
  );
}
