'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { metricCards, dashboardTabs, sidebarLinks, type DashboardTab } from '@/lib/mock-data';
import MetricCardBlock from './MetricCard';
import InsightChart from './InsightChart';
import InsightsTable from './InsightsTable';
import styles from './Dashboard.module.css';

// ── sidebar icon SVGs ──────
const icons: Record<string, React.ReactElement> = {
  grid: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  database: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="4" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 4v4c0 1.38 2.686 2.5 6 2.5S14 9.38 14 8V4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 8v4c0 1.38 2.686 2.5 6 2.5S14 13.38 14 12V8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  sparkle: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L9.2 6.8L14 8L9.2 9.2L8 14L6.8 9.2L2 8L6.8 6.8L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  zap: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9 2L4 9h5l-2 5 7-8H9l2-4h-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M12.6 3.4l-1.06 1.06M4.46 11.54l-1.06 1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
};

// ── Tab panel content ───────
function OverviewPanel() {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={styles.overviewPanel}
    >
      {/* Metrics row */}
      <div className={styles.metricsRow}>
        {metricCards.map((card, idx) => (
          <MetricCardBlock key={card.id} card={card} index={idx} />
        ))}
      </div>
      {/* Chart */}
      <InsightChart />
      {/* Table */}
      <div className={styles.insightsCard}>
        <div className={styles.insightsCardHeader}>
          <p className={`font-display ${styles.insightsCardTitle}`}>
            Recent Insights
          </p>
          <span className={`font-mono ${styles.insightsCardCount}`}>
            5 results
          </span>
        </div>
        <InsightsTable />
      </div>
    </motion.div>
  );
}

function AutomationsPanel() {
  const automations = [
    { name: 'Revenue Alert Trigger', status: 'active', runs: 48 },
    { name: 'Churn Prediction Notify', status: 'active', runs: 12 },
    { name: 'Weekly Digest — Executives', status: 'paused', runs: 0 },
    { name: 'Anomaly Escalation Flow', status: 'active', runs: 6 },
    { name: 'Competitor Monitor Daily', status: 'active', runs: 30 },
    { name: 'Supply Chain Risk Watch', status: 'active', runs: 22 },
    { name: 'Marketing ROI Report', status: 'paused', runs: 0 },
    { name: 'Data Quality Check — Nightly', status: 'active', runs: 14 },
  ];

  return (
    <motion.div
      key="automations"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={styles.automationsPanel}
    >
      {automations.map((a, idx) => (
        <motion.div
          key={a.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.04, duration: 0.3 }}
          className={styles.automationRow}
        >
          <div className={styles.automationMeta}>
            <div className={`${styles.automationStatusDot} ${a.status === 'active' ? styles.automationStatusDotActive : ''}`} />
            <span className={styles.automationName}>{a.name}</span>
          </div>
          <div className={styles.automationActions}>
            <span className={`font-mono ${styles.automationRuns}`}>
              {a.runs} runs today
            </span>
            <span className={`font-mono ${styles.automationBadge} ${a.status === 'active' ? styles.automationBadgeActive : ''}`}>
              {a.status}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ReportsPanel() {
  const reports = [
    { name: 'Q4 Revenue Intelligence Report', date: 'Jan 28, 2025', size: '2.4 MB', type: 'PDF' },
    { name: 'Churn Analysis — November Cohort', date: 'Jan 27, 2025', size: '1.1 MB', type: 'PDF' },
    { name: 'Supply Chain Risk Assessment', date: 'Jan 26, 2025', size: '856 KB', type: 'XLSX' },
    { name: 'Marketing Attribution Summary', date: 'Jan 25, 2025', size: '1.7 MB', type: 'PDF' },
    { name: 'Weekly Executive Digest — Wk 04', date: 'Jan 24, 2025', size: '420 KB', type: 'PDF' },
  ];

  return (
    <motion.div
      key="reports"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={styles.reportsPanel}
    >
      {reports.map((r, idx) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.04, duration: 0.3 }}
          className={styles.reportRow}
        >
          <div className={styles.reportMeta}>
            <div className={styles.reportIcon}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 2h5l3 3v7H3V2z" stroke="#7C5CFF" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M8 2v3h3" stroke="#7C5CFF" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className={styles.reportDetails}>
              <p className={styles.reportName}>{r.name}</p>
              <p className={`font-mono ${styles.reportMetaText}`}>{r.date} · {r.size}</p>
            </div>
          </div>
          <span className={`font-mono ${styles.reportType}`}>
            {r.type}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Dashboard wrapper ───
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('Overview');
  const [activeNav, setActiveNav] = useState('Overview');

  return (
    <section
      id="platform"
      aria-label="Intelligence Dashboard Preview"
      className={styles.dashboardSection}
    >
      <div className="content-width">
        {/* Section header */}
        <div className={styles.dashboardHeader}>
          <p className={`text-mono-label ${styles.dashboardEyebrow}`}>
            The Workspace
          </p>
          <h2 className={`font-display text-section text-primary ${styles.dashboardTitle}`}>
            Intelligence at your fingertips.
          </h2>
          <p className={`text-body text-muted ${styles.dashboardDescription}`}>
            A workspace built for speed and clarity — every insight surfaced, every action ready.
          </p>
        </div>

        {/* ── App shell ──────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={styles.dashboardShell}
        >
          {/* ── Browser chrome ── */}
          <div className={styles.browserChrome}>
            {/* Traffic lights — full opacity, not disabled-looking */}
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => {
              const colorClass = c === '#FF5F57' ? styles.trafficLightRed : c === '#FEBC2E' ? styles.trafficLightYellow : styles.trafficLightGreen;
              return <div key={c} className={`${styles.trafficLight} ${colorClass}`} />;
            })}
            {/* URL bar */}
            <div className={styles.urlBar}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#9A9AA2" strokeWidth="1" />
                <path d="M3 5h4M5 3v4" stroke="#9A9AA2" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
              <span className={`font-mono ${styles.urlLabel}`}>
                app.xai.io/workspace
              </span>
            </div>
          </div>

          {/* ── App layout ──────────────────────────────── */}
          <div className={styles.appLayout}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              {/* Logo */}
              <div className={styles.sidebarLogo}>
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-label="Xai">
                  <circle cx="11" cy="11" r="10" stroke="#7C5CFF" strokeWidth="1.5" />
                  <path d="M7 7 L15 15 M15 7 L7 15" stroke="#2DD4BF" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              {sidebarLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => setActiveNav(link.label)}
                  title={link.label}
                  className={`${styles.sidebarButton} ${activeNav === link.label ? styles.sidebarButtonActive : ''}`}
                >
                  {icons[link.icon]}
                </button>
              ))}
            </div>

            {/* Main content */}
            <div className={styles.mainContent}>
              {/* Top bar */}
              <div className={styles.topBar}>
                <div className={styles.topBarHeading}>
                  <p className={`font-display ${styles.topBarTitle}`}>
                    {activeNav}
                  </p>
                </div>
                <div className={styles.topBarActions}>
                  {/* Search */}
                  <div className={styles.searchBar}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <circle cx="5.5" cy="5.5" r="4" stroke="#9A9AA2" strokeWidth="1.2" />
                      <path d="M9 9L11 11" stroke="#9A9AA2" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className={`font-mono ${styles.searchLabel}`}>
                      Search insights...
                    </span>
                  </div>
                  {/* Avatar */}
                  <div className={styles.avatar}>
                    A
                  </div>
                </div>
              </div>

              {/* Tab bar */}
              <div className={styles.tabBar}>
                {dashboardTabs.map((tab) => (
                  <button
                    key={tab}
                    id={`dashboard-tab-${tab.toLowerCase()}`}
                    onClick={() => setActiveTab(tab)}
                    className={`${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ''}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-underline"
                        className={styles.tabUnderline}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className={styles.tabContent}>
                <AnimatePresence mode="wait">
                  {activeTab === 'Overview' && <OverviewPanel key="overview" />}
                  {activeTab === 'Automations' && <AutomationsPanel key="automations" />}
                  {activeTab === 'Reports' && <ReportsPanel key="reports" />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
