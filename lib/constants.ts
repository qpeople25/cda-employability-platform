import { DimensionKey, DimensionConfig } from '@/types';

export const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'motivation',
    label: 'Personal Mindset & Motivation',
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
    label: 'Job Search Skills & Application Readiness',
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
    label: 'L&D Engagement',
    description: 'Willingness to learn and develop new skills',
    weight: 10,
  },
  {
    key: 'financial',
    label: 'Financial Independence & Responsibility',
    description: 'Financial management and independence',
    weight: 10,
  },
  {
    key: 'resilience',
    label: 'Confidence, Resilience & Self-Management',
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

export const DIMENSION_MAP: Record<DimensionKey, DimensionConfig> = 
  DIMENSIONS.reduce((acc, dim) => {
    acc[dim.key] = dim;
    return acc;
  }, {} as Record<DimensionKey, DimensionConfig>);

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
