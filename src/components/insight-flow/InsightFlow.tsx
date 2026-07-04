'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';
import { insightFlowStages } from '@/lib/mock-data';
import InsightFlowCanvas from './InsightFlowCanvas';
import InsightFlowStageBlock from './InsightFlowStage';
import styles from './InsightFlow.module.css';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function InsightFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  // track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Drive active stage from scroll position
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p < 0.40) {
      setActiveStage(0);
    } else if (p < 0.72) {
      setActiveStage(1);
    } else {
      setActiveStage(2);
    }
  });

  return (
    <section
      id="product"
      ref={containerRef}
      aria-label="Insight Flow — three-stage data narrative"
      className={styles.sectionShell}
    >
      {/* ── sticky inner panel ────────── */}
      <div className={styles.stickyPanel}>
        {/* ── Section header — pinned at top of sticky panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className={styles.header}
        >
          <p className={`text-mono-label ${styles.headerLabel}`}>
            How it works
          </p>
          <h2 className={`font-display text-section text-primary ${styles.heading}`}>
            Raw data to decisions —{' '}
            <span className={styles.highlight}>
              in three steps.
            </span>
          </h2>
        </motion.div>

        {/* ── main two-column content ──────────────────────── */}
        <div className={styles.contentGrid}>
          {/* ── left: Stage text blocks ─────────────────── */}
          <div className={styles.stagesColumn}>
            {/* vertical progress connector */}
            <div className={styles.progressConnector}>
              {insightFlowStages.map((stage, idx) => (
                <InsightFlowStageBlock
                  key={stage.id}
                  stage={stage}
                  isActive={activeStage === idx}
                  isPast={activeStage > idx}
                  isLast={idx === insightFlowStages.length - 1}
                />
              ))}
            </div>
          </div>

          {/* ── right: canvas visualization ────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
            className={styles.canvasPanel}
          >
            {/* Instrument grid background */}
            <div aria-hidden="true" className={`instrument-grid ${styles.instrumentGrid}`} />

            {/* Radial vignette over the grid so center is darker */}
            <div aria-hidden="true" className={styles.vignette} />

            {/* Stage indicator tag — no timer-based animation */}
            <div className={styles.stageTag}>
              {/* Static dot — color driven by JS state, no CSS animation loop */}
              <div
                className={styles.stageDot}
                style={{
                  backgroundColor: activeStage === 2 ? '#2DD4BF' : '#7C5CFF',
                  boxShadow: activeStage === 2
                    ? '0 0 5px rgba(45,212,191,0.8)'
                    : '0 0 5px rgba(124,92,255,0.8)',
                }}
              />
              <span className={`font-mono ${styles.stageLabel}`}>
                {insightFlowStages[activeStage].label}
              </span>
            </div>

            {/* Stage counter — top right */}
            <div className={styles.stageCounter}>
              {insightFlowStages.map((_, idx) => (
                <div
                  key={idx}
                  className={`${styles.stageCounterBar} ${idx === activeStage ? styles.activeCounterBar : ''}`}
                  style={{
                    backgroundColor: idx === activeStage
                      ? (activeStage === 2 ? '#2DD4BF' : '#7C5CFF')
                      : 'rgba(38,39,44,0.8)',
                  }}
                />
              ))}
            </div>

            {/* actual visualization canvas */}
            <div className={styles.canvasFrame}>
              <InsightFlowCanvas progress={scrollYProgress} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
