export type DimensionKey =
  | 'motivation'
  | 'career'
  | 'search'
  | 'employability'
  | 'learning'
  | 'financial'
  | 'resilience'
  | 'support';

export type DimensionScores = Record<DimensionKey, number>;

export type ReadinessCategory = 'A' | 'B' | 'C';

export type SessionType = 'baseline' | 'follow_up';

export type BarrierSeverity = 'High' | 'Medium' | 'Low';

export type BarrierSource = 'auto' | 'manual';

export type BarrierStatus = 'active' | 'resolved';

export interface DimensionConfig {
  key: DimensionKey;
  label: string;
  description: string;
  weight: number;
}

export interface BarrierSuggestion {
  barrierBankId: string;
  code: string;
  label: string;
  severity: BarrierSeverity;
  dimension: DimensionKey;
}

export interface ParticipantWithStatus {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  ageRange: string;
  education: string;
  emirate: string;
  createdAt: Date;
  hasSession: boolean;
}
