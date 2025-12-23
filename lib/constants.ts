import { FactorKey, FactorConfig } from '@/types';

export const FACTORS: FactorConfig[] = [
  {
    key: 'motivation',
    label: 'Mindset & Motivation',
    description: 'Drive, enthusiasm, and commitment to finding employment',
    weight: 15,
  },
  {
    key: 'career',
    label: 'Career Awareness & Direction',
    description: 'Understanding of career goals and pathways',
    weight: 15,
  },
  {
    key: 'search',
    label: 'Job Search Skills & Application',
    description: 'Ability to search for jobs and prepare applications',
    weight: 15,
  },
  {
    key: 'employability',
    label: 'Employability & Workplace Skills',
    description: 'Skills needed to succeed in the workplace',
    weight: 15,
  },
  {
    key: 'learning',
    label: 'Personal Development',
    description: 'Willingness to learn and develop new skills',
    weight: 10,
  },
  {
    key: 'financial',
    label: 'Financial Independence',
    description: 'Financial management and independence',
    weight: 10,
  },
  {
    key: 'resilience',
    label: 'Confidence & Self-Management',
    description: 'Ability to handle setbacks and manage emotions',
    weight: 10,
  },
  {
    key: 'support',
    label: 'Social Support & Environment',
    description: 'Support system and environmental stability',
    weight: 10,
  },
];

export const FACTOR_MAP: Record<FactorKey, FactorConfig> = 
  FACTORS.reduce((acc, factor) => {
    acc[factor.key] = factor;
    return acc;
  }, {} as Record<FactorKey, FactorConfig>);

export const EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];

export const AGE_RANGES = [
  '18-24',
  '25-29',
  '30-34',
  '35-39',
  '40-44',
  '45-49',
  '50+',
];

export const GENDERS = ['Male', 'Female', 'Other'];

export const EDUCATION_LEVELS = [
  'High School',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Other',
];

export const MARITAL_STATUS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
];
