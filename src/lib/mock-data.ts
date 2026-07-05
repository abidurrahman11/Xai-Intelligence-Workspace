//  Xai - mock data

export interface NavLink {
  label: string;
  href: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export interface ChartDataPoint {
  day: number;
  value: number;
}

export interface RecentInsight {
  id: string;
  insight: string;
  confidence: number;
  source: string;
  date: string;
}

export interface InsightFlowStage {
  id: string;
  index: string;
  label: string;
  headline: string;
  body: string;
}

export interface ClientCard {
  id: string;
  company: string;
  logoInitials: string;
  accentColor: string;
  headline: string;
  stat: string;
  statLabel: string;
  body: string;
  industry: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

// ── Navigation ──────────────────────────────
export const navLinks: NavLink[] = [
  { label: 'Product',  href: '#product'  },
  { label: 'Platform', href: '#platform' },
  { label: 'Insights', href: '#insights' },
  { label: 'Pricing',  href: '#pricing'  },
];

// ── Pricing Plans ──────────────────────────────
export const pricingPlans: PricingPlan[] = [
  {
    id:          'trial',
    name:        'Free Trial',
    price:       '$0',
    period:      'for 14 days',
    description: 'Full workspace access. No credit card required.',
    features: [
      'All core integrations',
      'Up to 3 data sources',
      'Real-time insight alerts',
      'Community support',
    ],
    cta: 'Start Free Trial',
  },
  {
    id:          'monthly',
    name:        'Monthly',
    price:       '$49',
    period:      'per month',
    description: 'For teams ready to move from insight to action.',
    features: [
      'Unlimited data sources',
      'AI anomaly detection',
      'Custom automations',
      'Priority email support',
    ],
    highlighted: true,
    cta: 'Get Started',
  },
  {
    id:          'yearly',
    name:        'Yearly',
    price:       '$468',
    period:      'per year · save 20%',
    description: 'Best value for teams committed to data intelligence.',
    features: [
      'Everything in Monthly',
      'Dedicated success manager',
      'Advanced audit logs',
      'SSO & team permissions',
    ],
    cta: 'Get Started',
  },
];

// ── Dashboard Metrics ────────────────────────
export const metricCards: MetricCard[] = [
  {
    id:       'records',
    label:    'Data Processed',
    value:    '2.4M',
    delta:    '+18% vs last week',
    positive: true,
  },
  {
    id:       'anomalies',
    label:    'Anomalies Detected',
    value:    '12',
    delta:    '3 new today',
    positive: false,
  },
  {
    id:       'automations',
    label:    'Active Automations',
    value:    '8',
    delta:    '+2 this month',
    positive: true,
  },
];

// ── Insight Trend Chart (30-day) ─────────────
// Deterministic pseudo-random values (seeded pattern)
const baseValues = [
  22, 25, 21, 28, 24, 30, 27, 33, 29, 35,
  31, 38, 34, 40, 36, 42, 38, 45, 41, 48,
  43, 50, 46, 52, 48, 55, 51, 58, 53, 60,
];

export const chartData: ChartDataPoint[] = baseValues.map((value, i) => ({
  day:   i + 1,
  value: value + (i % 3 === 0 ? -3 : i % 4 === 0 ? 4 : 0),
}));

// ── Recent Insights Table ────────────────────
export const recentInsights: RecentInsight[] = [
  {
    id:         'ins-001',
    insight:    'Revenue anomaly in Q4 pipeline',
    confidence: 94,
    source:     'Salesforce',
    date:       '2025-01-28',
  },
  {
    id:         'ins-002',
    insight:    'User churn risk — cohort Nov 2024',
    confidence: 87,
    source:     'Analytics',
    date:       '2025-01-27',
  },
  {
    id:         'ins-003',
    insight:    'Supply chain latency increase',
    confidence: 91,
    source:     'ERP System',
    date:       '2025-01-26',
  },
  {
    id:         'ins-004',
    insight:    'Marketing spend efficiency drop',
    confidence: 78,
    source:     'Ad Platform',
    date:       '2025-01-25',
  },
  {
    id:         'ins-005',
    insight:    'Competitor pricing shift detected',
    confidence: 83,
    source:     'Web Signals',
    date:       '2025-01-24',
  },
];

// ── Insight Flow Stages ──────────────────────
export const insightFlowStages: InsightFlowStage[] = [
  {
    id:       'ingest',
    index:    '01',
    label:    '01 · Ingest',
    headline: 'Ingest Data',
    body:     'Connect any data source — structured or unstructured — in seconds. Xai handles the complexity of ingestion so you never have to.',
  },
  {
    id:       'analyze',
    index:    '02',
    label:    '02 · Analyze',
    headline: 'Analyze with AI',
    body:     "Xai's models detect patterns, correlations, and anomalies automatically — surfacing signals that would take analysts weeks to find.",
  },
  {
    id:       'generate',
    index:    '03',
    label:    '03 · Generate',
    headline: 'Generate Insight',
    body:     'Get clear, decision-ready output — not just numbers. Xai tells you what changed, why it changed, and what to do next.',
  },
];

// ── Dashboard Sidebar Nav ────────────────────
export const sidebarLinks = [
  { label: 'Overview',     icon: 'grid'      },
  { label: 'Data Sources', icon: 'database'  },
  { label: 'Insights',     icon: 'sparkle'   },
  { label: 'Automations',  icon: 'zap'       },
  { label: 'Settings',     icon: 'settings'  },
];

// ── Dashboard Tabs ───────────────────────────
export const dashboardTabs = ['Overview', 'Automations', 'Reports'] as const;
export type DashboardTab = (typeof dashboardTabs)[number];

// ── Orbital Carousel — Client Success Stories ─
export const clientCards: ClientCard[] = [
  {
    id:           'card-meridian',
    company:      'Meridian Capital',
    logoInitials: 'MC',
    accentColor:  '#7C5CFF',
    industry:     'Finance',
    headline:     'Portfolio risk eliminated before market open',
    stat:         '340%',
    statLabel:    'ROI in 6 months',
    body:         'Xai surfaced a correlated exposure across 12 funds that analysts had missed for two quarters — flagged and hedged in 4 hours.',
  },
  {
    id:           'card-nova',
    company:      'Nova Health',
    logoInitials: 'NH',
    accentColor:  '#2DD4BF',
    industry:     'Healthcare',
    headline:     'Patient readmissions cut by a third',
    stat:         '31%',
    statLabel:    'Reduction in readmissions',
    body:         'Predictive risk scoring let care teams intervene 48 hrs earlier. Xai integrated with existing EHR data in under a day.',
  },
  {
    id:           'card-auric',
    company:      'Auric Retail',
    logoInitials: 'AR',
    accentColor:  '#F59E0B',
    industry:     'Retail',
    headline:     'Inventory waste slashed before peak season',
    stat:         '$2.1M',
    statLabel:    'Saved in overstock costs',
    body:         'Demand forecasting across 800 SKUs, updated in real time. Auric avoided their worst stock-out quarter on record.',
  },
  {
    id:           'card-stratum',
    company:      'Stratum Logistics',
    logoInitials: 'SL',
    accentColor:  '#3B82F6',
    industry:     'Logistics',
    headline:     'Route optimization at scale, instantly',
    stat:         '18%',
    statLabel:    'Fuel cost reduction',
    body:         'Xai modeled 4,000 daily routes against live traffic and weather signals — a task that previously took overnight batch jobs.',
  },
  {
    id:           'card-helios',
    company:      'Helios Media',
    logoInitials: 'HM',
    accentColor:  '#EC4899',
    industry:     'Media',
    headline:     'Content that converts, before publishing',
    stat:         '4.2×',
    statLabel:    'Engagement lift',
    body:         'Xai predicted article performance from draft text alone, letting editors double down on high-signal stories pre-launch.',
  },
  {
    id:           'card-vanta',
    company:      'Vanta Systems',
    logoInitials: 'VS',
    accentColor:  '#10B981',
    industry:     'Engineering',
    headline:     'Anomalies caught before they become outages',
    stat:         '99.97%',
    statLabel:    'Uptime maintained',
    body:         'Sensor telemetry from 3,200 machines analyzed continuously. Xai flagged bearing failures 72 hours before physical symptoms.',
  },
];
