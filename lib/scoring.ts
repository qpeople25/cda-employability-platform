import { DimensionKey, DimensionScores, ReadinessCategory } from '@/types';

/**
 * Weights for each dimension (percentages that sum to 100)
 */
export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  motivation: 15,
  career: 15,
  search: 15,
  employability: 15,
  learning: 10,
  financial: 10,
  resilience: 10,
  support: 10,
};

/**
 * Calculate the readiness index (0-100) based on domain scores
 * Formula: for each domain: (score / 7) * weight, then sum everything
 */
export function readinessIndex(scores: DimensionScores): number {
  let total = 0;
  
  for (const key of Object.keys(scores) as DimensionKey[]) {
    const score = scores[key];
    const weight = DIMENSION_WEIGHTS[key];
    total += (score / 7) * weight;
  }
  
  return Math.round(total);
}

/**
 * Determine readiness category based on index and domain scores
 * A = readinessIndex >= 80 AND no domain <= 3
 * C = readinessIndex < 60
 * B = everything else
 */
export function readinessCategory(scores: DimensionScores): ReadinessCategory {
  const index = readinessIndex(scores);
  const allScores = Object.values(scores);
  const hasLowScore = allScores.some(score => score <= 3);
  
  if (index >= 80 && !hasLowScore) {
    return 'A';
  }
  
  if (index < 60) {
    return 'C';
  }
  
  return 'B';
}

/**
 * Get a human-readable description of the readiness category
 */
export function getCategoryDescription(category: ReadinessCategory): string {
  switch (category) {
    case 'A':
      return 'Work-ready';
    case 'B':
      return 'Close to work-ready';
    case 'C':
      return 'Needs significant support';
  }
}
