'use client';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView, useMotionValue } from 'framer-motion';
import styles from './OrbitalCarousel.module.css';

const OrbitalCarousel = dynamic(
  () => import('./OrbitalCarousel'),
  { ssr: false },
);


export default function Constellation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: false, margin: '-15%' });
  // static zero progress. carousel is scroll-velocity driven via wheel events
  const staticProgress = useMotionValue(0);

  return (
    <section
      id="insights"
      ref={sectionRef}
      aria-label="Data Constellation — Order from Chaos"
      className={styles.constellationSection}
    >
      {/* ── background noise texture ───*/}
      <div aria-hidden="true" className={styles.constellationBackdrop} />

      <div className={`content-width ${styles.constellationContent}`}>
        {/* ── text description ─── */}
        <div className={styles.constellationIntro}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`text-mono-label ${styles.constellationEyebrow}`}
          >
            The Proven Path
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display text-section text-primary ${styles.constellationTitle}`}
          >
            Order, from chaos.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.10, ease: [0.22, 1, 0.36, 1] }}
            className={`text-body text-muted ${styles.constellationBody}`}
          >
            This is what Xai does to your data — every second.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`font-mono ${styles.constellationMeta}`}
          >
            Stories from the field
          </motion.p>
        </div>

        {/* ── 3D Canvas ─ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className={styles.constellationStage}
        >
          {/* Subtle background rotating compass ring */}
          <div
            aria-hidden="true"
            className={`animate-spin-slow ${styles.constellationCompass}`}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none">
              <circle cx="400" cy="400" r="380" stroke="rgba(124,92,255,0.12)" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="400" cy="400" r="300" stroke="rgba(45,212,191,0.06)" strokeWidth="1.5" />
              <circle cx="400" cy="400" r="220" stroke="rgba(124,92,255,0.04)" strokeWidth="1" strokeDasharray="40 2" />
              <path d="M400 10v12M400 778v12M10 400h12M778 400h12" stroke="rgba(124,92,255,0.22)" strokeWidth="1.5" />
            </svg>
          </div>

          {/* subtle inner vignette */}
          <div
            aria-hidden="true"
            className={styles.constellationVignette}
          />

          <div className={styles.constellationCanvasLayer}>
            <OrbitalCarousel progress={staticProgress} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

