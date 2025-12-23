import { FactorKey, BarrierSuggestion } from '@/types';

/**
 * Maps factors to suggested barriers when scores are low (≤ 3)
 * This configuration determines which barriers are auto-suggested based on factor scores
 */
export const FACTOR_BARRIER_SUGGESTIONS: Record<FactorKey, string[]> = {
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
 * Get suggested barriers for a given factor and score
 */
export function getSuggestedBarriers(
  factor: FactorKey,
  score: number,
  barrierBank: Array<{ id: string; code: string; label: string; defaultSeverity: string }>
): BarrierSuggestion[] {
  // Only suggest barriers if score is 3 or below
  if (score > 3) {
    return [];
  }
  
  const suggestedCodes = FACTOR_BARRIER_SUGGESTIONS[factor] || [];
  
  return suggestedCodes
    .map(code => {
      const barrier = barrierBank.find(b => b.code === code);
      if (!barrier) return null;
      
      return {
        barrierBankId: barrier.id,
        code: barrier.code,
        label: barrier.label,
        severity: barrier.defaultSeverity as 'Critical' | 'High' | 'Medium' | 'Low',
        factor,
      };
    })
    .filter((b): b is BarrierSuggestion => b !== null);
}
