'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { InsightFlowStage } from '@/lib/mock-data';
import styles from './InsightFlow.module.css';

interface InsightFlowStageProps {
  stage: InsightFlowStage;
  isActive: boolean;
  isPast: boolean;
  isLast: boolean;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function InsightFlowStageBlock({
  stage,
  isActive,
  isPast,
  isLast,
}: InsightFlowStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerClassName = `${styles.stageBlock} ${isLast ? styles.stageBlockLast : ''}`.trim();
  const connectorClassName = `${styles.stageConnector} ${isPast ? styles.stageConnectorPast : styles.stageConnectorDefault}`.trim();
  const cardClassName = `${styles.stageCard} ${isActive ? styles.stageCardActive : isPast ? styles.stageCardPast : styles.stageCardDefault}`.trim();
  const labelClassName = `${styles.stageLabel} ${isActive ? styles.stageLabelActive : styles.stageLabelInactive}`.trim();
  const titleClassName = `${styles.stageTitle} ${isActive ? styles.stageTitleActive : styles.stageTitleInactive}`.trim();
  const bodyClassName = `${styles.stageBody} ${isActive ? styles.stageBodyActive : styles.stageBodyInactive}`.trim();
  const transition = shouldReduceMotion
    ? { duration: 0.16, ease: EASE_OUT }
    : { duration: 0.28, ease: EASE_OUT };

  return (
    <div className={containerClassName}>
      {/* vertical connector line between stages */}
      {!isLast && <div aria-hidden="true" className={connectorClassName} />}

      <motion.div
        // all animation via Framer
        animate={{
          opacity: isActive ? 1 : isPast ? 0.35 : 0.18,
          y: isActive ? 0 : isPast ? -4 : 4,
        }}
        transition={transition}
        initial={false}
        style={{ willChange: 'opacity, transform' }}
        className={cardClassName}
      >
        {/* Stage index label */}
        <p className={`font-mono ${labelClassName}`}>{stage.label}</p>

        {/* Headline */}
        <h3 className={`font-display ${titleClassName}`}>{stage.headline}</h3>

        {/* Body — brighter when active */}
        <p className={bodyClassName}>{stage.body}</p>
      </motion.div>
    </div>
  );
}
