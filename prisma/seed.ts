import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const barrierBankData = [
  // Mindset & Motivation barriers
  {
    code: 'low_motivation',
    label: 'Low Motivation',
    category: 'Mindset',
    description: 'Participant shows limited drive or enthusiasm for job seeking',
    defaultSeverity: 'Medium',
    dimension: 'motivation',
  },
  {
    code: 'unrealistic_expectations',
    label: 'Unrealistic Expectations',
    category: 'Mindset',
    description: 'Participant has expectations misaligned with market reality',
    defaultSeverity: 'Medium',
    dimension: 'motivation',
  },
  {
    code: 'low_confidence',
    label: 'Anxiety / Low Confidence',
    category: 'Mindset',
    description: 'Participant exhibits anxiety or low self-confidence',
    defaultSeverity: 'High',
    dimension: 'resilience',
  },
  {
    code: 'poor_resilience',
    label: 'Poor Resilience',
    category: 'Mindset',
    description: 'Participant struggles with setbacks and rejection',
    defaultSeverity: 'Medium',
    dimension: 'resilience',
  },
  
  // Career barriers
  {
    code: 'lack_career_direction',
    label: 'Lack of Career Direction',
    category: 'Career',
    description: 'Participant unclear about career goals or pathway',
    defaultSeverity: 'High',
    dimension: 'career',
  },
  {
    code: 'limited_work_experience',
    label: 'Limited Work Experience',
    category: 'Career',
    description: 'Participant has minimal or no work experience',
    defaultSeverity: 'Medium',
    dimension: 'career',
  },
  
  // Job Search barriers
  {
    code: 'no_cv',
    label: 'No CV / Poor CV',
    category: 'Job Search',
    description: 'Participant lacks a CV or has a poorly structured CV',
    defaultSeverity: 'High',
    dimension: 'search',
  },
  {
    code: 'no_job_portal_activity',
    label: 'No Job Portal Activity',
    category: 'Job Search',
    description: 'Participant not actively using job portals',
    defaultSeverity: 'High',
    dimension: 'search',
  },
  {
    code: 'low_interview_confidence',
    label: 'Low Interview Confidence',
    category: 'Job Search',
    description: 'Participant lacks confidence in interview situations',
    defaultSeverity: 'Medium',
    dimension: 'search',
  },
  {
    code: 'low_digital_literacy',
    label: 'Low Digital Literacy',
    category: 'Job Search',
    description: 'Participant has limited digital/computer skills',
    defaultSeverity: 'Medium',
    dimension: 'employability',
  },
  
  // Employability & Workplace Skills barriers
  {
    code: 'poor_communication',
    label: 'Poor Communication Skills',
    category: 'Employability',
    description: 'Participant struggles with verbal or written communication',
    defaultSeverity: 'High',
    dimension: 'employability',
  },
  {
    code: 'time_management',
    label: 'Time Management Challenges',
    category: 'Employability',
    description: 'Participant has difficulty managing time effectively',
    defaultSeverity: 'Medium',
    dimension: 'employability',
  },
  
  // Learning barriers
  {
    code: 'low_learning_engagement',
    label: 'Low Engagement in Learning',
    category: 'Learning',
    description: 'Participant shows limited interest in upskilling',
    defaultSeverity: 'Medium',
    dimension: 'learning',
  },
  
  // Financial barriers
  {
    code: 'financial_pressure',
    label: 'Financial Pressure',
    category: 'Financial',
    description: 'Participant under significant financial stress',
    defaultSeverity: 'High',
    dimension: 'financial',
  },
  {
    code: 'family_dependency',
    label: 'Family Dependency',
    category: 'Financial',
    description: 'Participant has dependents relying on their income',
    defaultSeverity: 'Medium',
    dimension: 'financial',
  },
  {
    code: 'no_budgeting_skills',
    label: 'No Budgeting Skills',
    category: 'Financial',
    description: 'Participant lacks financial planning skills',
    defaultSeverity: 'Low',
    dimension: 'financial',
  },
  
  // Structural barriers
  {
    code: 'childcare_responsibilities',
    label: 'Childcare Responsibilities',
    category: 'Structural',
    description: 'Participant constrained by childcare duties',
    defaultSeverity: 'High',
    dimension: null,
  },
  {
    code: 'transport_issues',
    label: 'Transport Issues',
    category: 'Structural',
    description: 'Participant has limited access to transportation',
    defaultSeverity: 'Medium',
    dimension: null,
  },
  {
    code: 'caregiving_responsibilities',
    label: 'Caregiving Responsibilities',
    category: 'Structural',
    description: 'Participant responsible for caring for family members',
    defaultSeverity: 'High',
    dimension: null,
  },
  {
    code: 'health_limitations',
    label: 'Health-Related Limitations',
    category: 'Structural',
    description: 'Participant has health issues affecting employment',
    defaultSeverity: 'High',
    dimension: null,
  },
  
  // Social Support barriers
  {
    code: 'limited_social_support',
    label: 'Limited Social Support',
    category: 'Social Support',
    description: 'Participant has weak family/friend support network',
    defaultSeverity: 'Medium',
    dimension: 'support',
  },
  {
    code: 'cultural_constraints',
    label: 'Cultural Constraints',
    category: 'Social Support',
    description: 'Participant faces cultural barriers to employment',
    defaultSeverity: 'Medium',
    dimension: 'support',
  },
  {
    code: 'environmental_instability',
    label: 'Environmental Instability',
    category: 'Social Support',
    description: 'Participant has unstable home/living situation',
    defaultSeverity: 'High',
    dimension: 'support',
  },
];

async function main() {
  console.log('Seeding database...');
  
  // Seed BarrierBank
  console.log('Seeding BarrierBank...');
  for (const barrier of barrierBankData) {
    await prisma.barrierBank.upsert({
      where: { code: barrier.code },
      update: barrier,
      create: barrier,
    });
  }
  console.log(`✓ Seeded ${barrierBankData.length} barriers to BarrierBank`);
  
  // Create default admin user
  console.log('Creating default admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@cda.ae' },
    update: {},
    create: {
      email: 'admin@cda.ae',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      active: true,
    },
  });
  console.log('✓ Created admin user: admin@cda.ae / admin123');
  
  console.log('\nSeeding complete!');
  console.log('\nDefault Login:');
  console.log('Email: admin@cda.ae');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
