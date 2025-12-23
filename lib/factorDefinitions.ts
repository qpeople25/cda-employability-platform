/**
 * Factor and Sub-Component Definitions
 * Based on Amy's requirements - 8 stability factors, 3 sub-components each
 */

import { FactorKey } from '@/types';

export interface SubComponentDefinition {
  key: string;
  title: string;
  description: string;
}

export interface FactorDefinition {
  key: FactorKey;
  label: string;
  description: string;
  subComponents: SubComponentDefinition[];
}

export const FACTOR_DEFINITIONS: FactorDefinition[] = [
  {
    key: 'motivation',
    label: 'Mindset & Motivation',
    description: 'Drive, enthusiasm, and commitment to finding employment',
    subComponents: [
      {
        key: 'motivationToWork',
        title: 'Motivation to Work',
        description: 'Desire to work, urgency, willingness to take action',
      },
      {
        key: 'motivationConsistency',
        title: 'Consistency & Resilience',
        description: 'Ability to stay committed, overcome setbacks, follow through',
      },
      {
        key: 'motivationOwnership',
        title: 'Personal Ownership',
        description: 'Taking responsibility for job search vs waiting for others',
      },
    ],
  },
  {
    key: 'career',
    label: 'Career Awareness & Direction',
    description: 'Understanding of career goals and pathways',
    subComponents: [
      {
        key: 'careerClarity',
        title: 'Career Clarity',
        description: 'Understanding what job they want',
      },
      {
        key: 'careerSectorAwareness',
        title: 'Sector Awareness',
        description: 'Knowing available roles and industry expectations',
      },
      {
        key: 'careerRoleFit',
        title: 'Role Fit Understanding',
        description: 'Understanding day-to-day responsibilities and requirements',
      },
    ],
  },
  {
    key: 'search',
    label: 'Job Search Skills & Application',
    description: 'Ability to search for jobs and prepare applications',
    subComponents: [
      {
        key: 'searchApplicationSkills',
        title: 'Application Skills',
        description: 'Ability to find, select, and apply for jobs properly',
      },
      {
        key: 'searchInterviewReadiness',
        title: 'Interview Readiness',
        description: 'Preparedness and confidence in employer interactions',
      },
      {
        key: 'searchStrategy',
        title: 'Search Strategy & Behaviour',
        description: 'Consistency, methods, quality of job-search practice',
      },
    ],
  },
  {
    key: 'employability',
    label: 'Employability & Workplace Skills',
    description: 'Skills needed to succeed in the workplace',
    subComponents: [
      {
        key: 'employabilityCommunication',
        title: 'English & Communication Skills',
        description: 'Verbal and written communication ability',
      },
      {
        key: 'employabilityDigitalSkills',
        title: 'Digital Skills',
        description: 'Microsoft Office, email, systems proficiency',
      },
      {
        key: 'employabilityWorkplace',
        title: 'Workplace Behaviours',
        description: 'Punctuality, teamwork, following instructions, adaptability',
      },
    ],
  },
  {
    key: 'learning',
    label: 'Personal Development',
    description: 'Willingness to learn and develop new skills',
    subComponents: [
      {
        key: 'learningAwareness',
        title: 'Self-Awareness',
        description: 'Understanding strengths, weaknesses, and improvement areas',
      },
      {
        key: 'learningGrowthMindset',
        title: 'Growth Mindset / Willingness to Learn',
        description: 'Openness to feedback and training',
      },
      {
        key: 'learningGoalSetting',
        title: 'Goal Setting & Progress Tracking',
        description: 'Ability to set and follow personal or career goals',
      },
    ],
  },
  {
    key: 'financial',
    label: 'Financial Independence',
    description: 'Financial management and independence',
    subComponents: [
      {
        key: 'financialPressure',
        title: 'Financial Pressure Level',
        description: 'Urgency to work due to personal or family obligations',
      },
      {
        key: 'financialExpectations',
        title: 'Salary Expectations vs Market Reality',
        description: 'Whether expectations align with job availability',
      },
      {
        key: 'financialFlexibility',
        title: 'Flexibility in Entry-Level Opportunities',
        description: 'Willingness to accept entry-level positions',
      },
    ],
  },
  {
    key: 'resilience',
    label: 'Confidence & Self-Management',
    description: 'Ability to handle setbacks and manage emotions',
    subComponents: [
      {
        key: 'resilienceConfidence',
        title: 'Self-Confidence in Employment Settings',
        description: 'Confidence when applying and interviewing',
      },
      {
        key: 'resilienceStressManagement',
        title: 'Stress & Emotion Management',
        description: 'Handling setbacks, pressure, or unfamiliar environments',
      },
      {
        key: 'resilienceIndependence',
        title: 'Independence & Responsibility',
        description: 'Ability to manage time, tasks, and expectations independently',
      },
    ],
  },
  {
    key: 'support',
    label: 'Social Support & Environment',
    description: 'Support system and environmental stability',
    subComponents: [
      {
        key: 'supportFamilyApproval',
        title: 'Family Approval & Support',
        description: 'Especially private sector vs government preferences',
      },
      {
        key: 'supportCultural',
        title: 'Environmental or Cultural Constraints',
        description: 'Restrictions affecting job type or location',
      },
      {
        key: 'supportSystem',
        title: 'Support System Availability',
        description: 'Childcare, transportation, social network',
      },
    ],
  },
];

/**
 * Get factor definition by key
 */
export function getFactorDefinition(key: FactorKey): FactorDefinition | undefined {
  return FACTOR_DEFINITIONS.find(f => f.key === key);
}

/**
 * Get all sub-component keys for a factor
 */
export function getSubComponentKeys(factorKey: FactorKey): string[] {
  const factor = getFactorDefinition(factorKey);
  return factor ? factor.subComponents.map(sc => sc.key) : [];
}
