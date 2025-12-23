import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date and time for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Escape CSV field value
 */
export function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  
  const str = String(value);
  
  // If the field contains comma, newline, or quotes, wrap it in quotes and escape quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

/**
 * Generate CSV from data
 */
export function generateCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const headerRow = headers.map(escapeCsvField).join(',');
  const dataRows = rows.map(row => row.map(escapeCsvField).join(',')).join('\n');
  
  return `${headerRow}\n${dataRows}`;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calculate age range bucket from date of birth
 */
export function calculateAgeRange(dateOfBirth: Date | string): string {
  const age = calculateAge(dateOfBirth);
  
  if (age >= 18 && age <= 24) return '18-24';
  if (age >= 25 && age <= 29) return '25-29';
  if (age >= 30 && age <= 34) return '30-34';
  if (age >= 35 && age <= 39) return '35-39';
  if (age >= 40 && age <= 44) return '40-44';
  if (age >= 45 && age <= 49) return '45-49';
  if (age >= 50) return '50+';
  
  return 'Under 18';
}

/**
 * Calculate readiness index from 24 sub-component scores
 */
export function calculateReadinessIndex(scores: {
  // Factor 1: Mindset & Motivation
  scoreMotivationToWork: number;
  scoreMotivationConsistency: number;
  scoreMotivationOwnership: number;
  // Factor 2: Career Awareness
  scoreCareerClarity: number;
  scoreCareerSectorAwareness: number;
  scoreCareerRoleFit: number;
  // Factor 3: Job Search Skills
  scoreSearchApplicationSkills: number;
  scoreSearchInterviewReadiness: number;
  scoreSearchStrategy: number;
  // Factor 4: Employability Skills
  scoreEmployabilityCommunication: number;
  scoreEmployabilityDigitalSkills: number;
  scoreEmployabilityWorkplace: number;
  // Factor 5: Personal Development
  scoreLearningAwareness: number;
  scoreLearningGrowthMindset: number;
  scoreLearningGoalSetting: number;
  // Factor 6: Financial Independence
  scoreFinancialPressure: number;
  scoreFinancialExpectations: number;
  scoreFinancialFlexibility: number;
  // Factor 7: Confidence & Self-Management
  scoreResilienceConfidence: number;
  scoreResilienceStressManagement: number;
  scoreResilienceIndependence: number;
  // Factor 8: Social Support
  scoreSupportFamilyApproval: number;
  scoreSupportCultural: number;
  scoreSupportSystem: number;
}): number {
  return (
    scores.scoreMotivationToWork +
    scores.scoreMotivationConsistency +
    scores.scoreMotivationOwnership +
    scores.scoreCareerClarity +
    scores.scoreCareerSectorAwareness +
    scores.scoreCareerRoleFit +
    scores.scoreSearchApplicationSkills +
    scores.scoreSearchInterviewReadiness +
    scores.scoreSearchStrategy +
    scores.scoreEmployabilityCommunication +
    scores.scoreEmployabilityDigitalSkills +
    scores.scoreEmployabilityWorkplace +
    scores.scoreLearningAwareness +
    scores.scoreLearningGrowthMindset +
    scores.scoreLearningGoalSetting +
    scores.scoreFinancialPressure +
    scores.scoreFinancialExpectations +
    scores.scoreFinancialFlexibility +
    scores.scoreResilienceConfidence +
    scores.scoreResilienceStressManagement +
    scores.scoreResilienceIndependence +
    scores.scoreSupportFamilyApproval +
    scores.scoreSupportCultural +
    scores.scoreSupportSystem
  );
}

/**
 * Determine readiness category from index
 * 24 sub-components × 7 max score = 168 maximum
 */
export function calculateReadinessCategory(readinessIndex: number): 'A' | 'B' | 'C' {
  if (readinessIndex >= 126) return 'A'; // 75%+ (closest to labour market)
  if (readinessIndex >= 84) return 'B';  // 50-74% (moderate distance)
  return 'C'; // <50% (furthest from labour market)
}

/**
 * Calculate factor average from its 3 sub-components
 */
export function calculateFactorAverage(
  subScore1: number,
  subScore2: number,
  subScore3: number
): number {
  return Math.round((subScore1 + subScore2 + subScore3) / 3);
}
