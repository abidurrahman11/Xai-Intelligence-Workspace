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
