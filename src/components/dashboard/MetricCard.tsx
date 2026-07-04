'use client';

import { motion } from 'framer-motion';
import type { MetricCard } from '@/lib/mock-data';
import styles from './Dashboard.module.css';

interface MetricCardProps {
  card: MetricCard;
  index: number;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function MetricCardBlock({ card, index }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay: index * 0.07 }}
      // consolidate ALL hover to Framer Motion — no onMouseEnter/Leave
      whileHover={{
        y: -3,
        boxShadow: '0 0 0 1px rgba(124,92,255,0.32), 0 4px 24px rgba(124,92,255,0.10)',
        borderColor: 'rgba(124,92,255,0.28)',
        transition: { duration: 0.18, ease: 'easeOut' },
      }}
      className={styles.metricCard}
    >
      {/* subtle violet gradient corner */}
      <div aria-hidden="true" className={styles.metricCardGlow} />

      {/* label */}
      <p className={`font-mono ${styles.metricCardLabel}`}>
        {card.label}
      </p>

      {/* value */}
      <p className={`font-display ${styles.metricCardValue}`}>
        {card.value}
      </p>

      {/* delta badge */}
      <span className={`font-mono ${styles.metricCardDelta} ${card.positive ? styles.metricCardDeltaPositive : styles.metricCardDeltaNeutral}`}>
        {card.positive ? '↑' : '·'} {card.delta}
      </span>
    </motion.div>
  );
}
