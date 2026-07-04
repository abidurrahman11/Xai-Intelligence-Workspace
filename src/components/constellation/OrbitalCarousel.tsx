'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';
import { clientCards } from '@/lib/mock-data';
import type { ClientCard } from '@/lib/mock-data';
import styles from './OrbitalCarousel.module.css';

// ── orbital constants ─────────────────────
const ORBIT_RX = 5.6;   // utilize canvas width
const ORBIT_RZ = 1.8;   // utilize canvas depth
const TOTAL = clientCards.length;
const BASE_ANGLE_OFFSET = -Math.PI / 2;

// ── depth helpers ──
function depthFactor(angle: number): number {
  return (Math.sin(angle) + 1) / 2;
}

// ── Individual card ──────
interface CardMeshProps {
  card: ClientCard;
  index: number;
  orbitAngle: React.MutableRefObject<number>;
}

function CardMesh({ card, index, orbitAngle }: CardMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const htmlDivRef = useRef<HTMLDivElement>(null);

  const baseAngle = (index / TOTAL) * Math.PI * 2;

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const theta = orbitAngle.current + baseAngle + BASE_ANGLE_OFFSET;
    const x= Math.cos(theta) * ORBIT_RX;
    const z = Math.sin(theta) * ORBIT_RZ;
    const df = depthFactor(theta);

    group.position.set(x, 0, z);
    
    // scale and opacity interpolation
    const scale = 0.72 + df * 0.28;  // Scale from 72% to 100%
    const opacity = 0.22 + df * 0.78;  // Opacity from 22% to 100%
    
    group.scale.setScalar(scale);

    if (htmlDivRef.current) {
      htmlDivRef.current.style.setProperty('--card-opacity', opacity.toString());
      htmlDivRef.current.style.setProperty('--card-scale', scale.toString());
      htmlDivRef.current.style.setProperty('--card-blur', `${Math.round(6 + df * 10)}px`);
      htmlDivRef.current.style.setProperty('--card-z-index', Math.round(df * 100).toString());
    }
  });

  const accent = card.accentColor;

  return (
    <group ref={groupRef}>
      {/* DOM content via Html portal */}
      <Html
        transform={false}
        occlude={false}
        center
        distanceFactor={8.8}
        position={[0, 0, 0]}
        className={styles.orbitHtml}
      >
        <div
          ref={htmlDivRef}
          className={styles.cardShell}
          style={{ ['--accent-color' as string]: accent } as React.CSSProperties}
        >
          <div className={styles.cardAccent} />

          <div className={styles.cardHeader}>
            <div
              className={styles.cardLogo}
              style={{ background: `${accent}22`, border: `1px solid ${accent}55`, color: accent } as React.CSSProperties}
            >
              {card.logoInitials}
            </div>
            <div>
              <div className={styles.cardCompany}>{card.company}</div>
              <div className={styles.cardIndustry}>{card.industry}</div>
            </div>
          </div>

          <div className={styles.cardDivider} />

          <div className={styles.cardStatBlock}>
            <div className={styles.cardStat}>{card.stat}</div>
            <div className={styles.cardStatLabel}>{card.statLabel}</div>
          </div>

          <div className={styles.cardHeadline}>{card.headline}</div>
          <div className={styles.cardBody}>{card.body}</div>
        </div>
      </Html>
    </group>
  );
}

// ── Camera ──────
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.4, 7.6);
    camera.lookAt(0, -0.2, 0);
  }, [camera]);
  return null;
}

// ── Orbit ring ────────────────────────────────
interface OrbitalRingProps {
  orbitAngle: React.MutableRefObject<number>;
  velocityRef: React.MutableRefObject<number>;
  progressRef: React.MutableRefObject<number>;
  prevProgressRef: React.MutableRefObject<number>;
}

function OrbitalRing({ orbitAngle, velocityRef, progressRef, prevProgressRef }: OrbitalRingProps) {
  useFrame(() => {
    orbitAngle.current += velocityRef.current;
    velocityRef.current *= 0.87;

    const delta = progressRef.current - prevProgressRef.current;
    if (Math.abs(delta) > 0.0001) {
      orbitAngle.current += delta * 2.2;
      prevProgressRef.current  = progressRef.current;
    }
  });

  return (
    <>
      {clientCards.map((card, i) => (
        <CardMesh key={card.id} card={card} index={i} orbitAngle={orbitAngle} />
      ))}
    </>
  );
}

// ───────────────── Scroll hint ─────────────────────────
function ScrollHint() {
  return (
    <Html transform={false} center position={[0, -1.6, 0]} className={styles.scrollHint}>
      <div className={styles.scrollHintText}>
        <span className={styles.scrollHintIcon}>↔</span>
        Drag or Scroll to rotate
      </div>
    </Html>
  );
}

// ── Exported component ────────
interface OrbitalCarouselProps {
  progress: MotionValue<number>;
}

export default function OrbitalCarousel({ progress }: OrbitalCarouselProps) {
  const orbitAngle = useRef(0);
  const velocityRef = useRef(0);
  const progressRef = useRef(0);
  const prevProgressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isDragging = useRef(false);
  const dragStartX = useRef(0);

  useMotionValueEvent(progress, 'change', (v) => {
    progressRef.current = v;
  });

  const handleWheel = useCallback((e: WheelEvent) => {
    const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.00025, 0.045);
    velocityRef.current += delta;
    velocityRef.current = Math.max(-0.06, Math.min(0.06, velocityRef.current));
  }, []);

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const dy = touchStartY.current - e.touches[0].clientY;
    const dx =touchStartX.current - e.touches[0].clientX;
    
    // Combine both vertical touch scroll and horizontal swipe gestures (reversed dx for natural drag direction)
    const deltaY = Math.sign(dy) * Math.min(Math.abs(dy) * 0.0005, 0.04);
    const deltaX = -Math.sign(dx) * Math.min(Math.abs(dx) * 0.0008, 0.04);
    
    velocityRef.current += (deltaY + deltaX);
    velocityRef.current = Math.max(-0.06, Math.min(0.06, velocityRef.current));
    
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  // Mouse Drag interaction
  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    // map pixels to rotation velocity
    const delta = -dx * 0.0008; 
    velocityRef.current += delta;
    velocityRef.current  = Math.max(-0.06, Math.min(0.06, velocityRef.current));
    dragStartX.current = e.clientX;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    window.addEventListener('wheel',handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove,  { passive: true });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup',handleMouseUp);

      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, handleTouchStart, handleTouchMove]);

  return (
    <div ref={containerRef} className={styles.orbitalContainer}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        className={styles.canvas}
      >
        <CameraRig />
        <OrbitalRing
          orbitAngle={orbitAngle}
          velocityRef={velocityRef}
          progressRef={progressRef}
          prevProgressRef={prevProgressRef}
        />
        <ScrollHint />
      </Canvas>
    </div>
  );
}