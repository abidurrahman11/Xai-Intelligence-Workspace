'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { chartData } from '@/lib/mock-data';
import styles from './Dashboard.module.css';

const W = 640;
const H = 180;
const PADDING = { top: 16, right: 16, bottom: 32, left: 40 };
const INNER_W = W - PADDING.left - PADDING.right;
const INNER_H = H - PADDING.top - PADDING.bottom;

const values = chartData.map((d) => d.value);
const minVal = Math.min(...values);
const maxVal = Math.max(...values);
const range = maxVal - minVal || 1;

function toX(i: number) {
  return PADDING.left + (i / (chartData.length - 1)) * INNER_W;
}
function toY(v: number) {
  return PADDING.top + INNER_H - ((v - minVal) / range) * INNER_H;
}

// Build SVG path strings
const linePath = chartData
  .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.value)}`)
  .join(' ');

const areaPath =
  `M ${toX(0)} ${toY(chartData[0].value)} ` +
  chartData.map((d, i) => `L ${toX(i)} ${toY(d.value)}`).join(' ') +
  ` L ${toX(chartData.length - 1)} ${H - PADDING.bottom} L ${toX(0)} ${H - PADDING.bottom} Z`;

// Y-axis tick values
const yTicks = [minVal, (minVal + maxVal) / 2, maxVal].map(Math.round);
// X-axis labels (day 1, 10, 20, 30)
const xLabels = [1, 10, 20, 30];

export default function InsightChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <p className={`font-mono ${styles.chartEyebrow}`}>
            Insight Trend
          </p>
          <p className={`font-display ${styles.chartTitle}`}>
            Last 30 Days
          </p>
        </div>
        <div className={styles.chartLegend}>
          <div className={styles.chartLegendDot} />
          <span className={`font-mono ${styles.chartLegendLabel}`}>
            INSIGHTS / DAY
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        role="img"
        aria-label="Insight trend chart for the last 30 days"
        className={styles.chartSvg}
      >
        <defs>
          {/* Area gradient */}
          <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2DD4BF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0"    />
          </linearGradient>
          {/* Line gradient */}
          <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
          {/* Clip path for draw-on animation */}
          <clipPath id="chart-clip">
            <motion.rect
              x={0}
              y={0}
              height={H}
              initial={{ width: 0 }}
              animate={{ width: inView ? W : 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          </clipPath>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left} y1={toY(tick)}
              x2={W - PADDING.right} y2={toY(tick)}
              stroke="#303138"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <text
              x={PADDING.left - 8}
              y={toY(tick) + 4}
              textAnchor="end"
              fontSize="10"
              fontFamily="var(--font-jetbrains)"
              fill="#9A9AA2"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((day) => (
          <text
            key={day}
            x={toX(day - 1)}
            y={H - 4}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-jetbrains)"
            fill="#9A9AA2"
          >
            {`Day ${day}`}
          </text>
        ))}

        {/* Area fill (clipped) */}
        <path d={areaPath} fill="url(#chart-area-grad)" clipPath="url(#chart-clip)" />

        {/* Line (clipped) */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#chart-line-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#chart-clip)"
        />

        {/* Latest data point dot */}
        <motion.circle
          cx={toX(chartData.length - 1)}
          cy={toY(chartData[chartData.length - 1].value)}
          r={4}
          fill="#2DD4BF"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
          transition={{ delay: 1.5, duration: 0.3 }}
        />
      </svg>
    </div>
  );
}