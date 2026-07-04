'use client';

import { motion } from 'framer-motion';
import { recentInsights } from '@/lib/mock-data';
import styles from './Dashboard.module.css';

const COLUMNS = ['Insight', 'Confidence', 'Source', 'Date'] as const;

function confidenceClass(score: number): string {
  if (score >= 90) return styles.confidenceBadgeHigh;
  if (score >= 80) return styles.confidenceBadgeMedium;
  return styles.confidenceBadgeLow;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

export default function InsightsTable() {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.insightsTable} aria-label="Recent Insights table">
        {/* Header */}
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col}
                className={`${styles.tableHeaderCell} ${col === 'Confidence' ? styles.tableHeaderCellCenter : ''}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {recentInsights.map((row, idx) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={styles.tableRow}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#131417';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
              }}
            >
              {/* Insight text */}
              <td className={styles.insightCell}>
                {row.insight}
              </td>

              {/* Confidence */}
              <td className={styles.confidenceCell}>
                <span className={`font-mono ${styles.confidenceBadge} ${confidenceClass(row.confidence)}`}>
                  {row.confidence}%
                </span>
              </td>

              {/* Source */}
              <td className={styles.sourceCell}>
                {row.source}
              </td>

              {/* Date */}
              <td className={`font-mono ${styles.dateCell}`}>
                {formatDate(row.date)}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
