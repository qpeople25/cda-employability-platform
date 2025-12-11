import { DimensionKey, BarrierSuggestion } from '@/types';

/**
 * Maps dimensions to suggested barriers when scores are low (≤ 3)
 * This configuration determines which barriers are auto-suggested based on domain scores
 */
export const DIMENSION_BARRIER_SUGGESTIONS: Record<DimensionKey, string[]> = {
  motivation: ['low_motivation', 'unrealistic_expectations'],
  career: ['lack_career_direction', 'limited_work_experience'],
  search: ['no_cv', 'no_job_portal_activity', 'low_interview_confidence'],
  employability: ['poor_communication', 'time_management', 'low_digital_literacy'],
  learning: ['low_learning_engagement'],
  financial: ['financial_pressure', 'family_dependency', 'no_budgeting_skills'],
  resilience: ['low_confidence', 'poor_resilience'],
  support: ['limited_social_support', 'cultural_constraints', 'environmental_instability'],
};

/**
 * Get suggested barriers for a given dimension and score
 */
export function getSuggestedBarriers(
  dimension: DimensionKey,
  score: number,
  barrierBank: Array<{ id: string; code: string; label: string; defaultSeverity: string }>
): BarrierSuggestion[] {
  // Only suggest barriers if score is 3 or below
  if (score > 3) {
    return [];
  }
  
  const suggestedCodes = DIMENSION_BARRIER_SUGGESTIONS[dimension] || [];
  
  return suggestedCodes
    .map(code => {
      const barrier = barrierBank.find(b => b.code === code);
      if (!barrier) return null;
      
      return {
        barrierBankId: barrier.id,
        code: barrier.code,
        label: barrier.label,
        severity: barrier.defaultSeverity as 'High' | 'Medium' | 'Low',
        dimension,
      };
    })
    .filter((b): b is BarrierSuggestion => b !== null);
}
