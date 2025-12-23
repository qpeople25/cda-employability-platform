import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCsv, calculateFactorAverage } from '@/lib/utils';

// Force dynamic rendering to prevent build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const headers = [
      'session_id',
      'participant_id',
      'occurred_at',
      'readiness_index',
      'readiness_category',
      // Factor averages (calculated from sub-components)
      'factor_avg_motivation',
      'factor_avg_career',
      'factor_avg_search',
      'factor_avg_employability',
      'factor_avg_learning',
      'factor_avg_financial',
      'factor_avg_resilience',
      'factor_avg_support',
      // All 24 sub-component scores
      'score_motivation_to_work',
      'score_motivation_consistency',
      'score_motivation_ownership',
      'score_career_clarity',
      'score_career_sector_awareness',
      'score_career_role_fit',
      'score_search_application_skills',
      'score_search_interview_readiness',
      'score_search_strategy',
      'score_employability_communication',
      'score_employability_digital_skills',
      'score_employability_workplace',
      'score_learning_awareness',
      'score_learning_growth_mindset',
      'score_learning_goal_setting',
      'score_financial_pressure',
      'score_financial_expectations',
      'score_financial_flexibility',
      'score_resilience_confidence',
      'score_resilience_stress_management',
      'score_resilience_independence',
      'score_support_family_approval',
      'score_support_cultural',
      'score_support_system',
    ];
    
    const rows = sessions.map((s) => {
      // Calculate factor averages from sub-components
      const factorMotivation = calculateFactorAverage(
        s.scoreMotivationToWork || 0,
        s.scoreMotivationConsistency || 0,
        s.scoreMotivationOwnership || 0
      );
      const factorCareer = calculateFactorAverage(
        s.scoreCareerClarity || 0,
        s.scoreCareerSectorAwareness || 0,
        s.scoreCareerRoleFit || 0
      );
      const factorSearch = calculateFactorAverage(
        s.scoreSearchApplicationSkills || 0,
        s.scoreSearchInterviewReadiness || 0,
        s.scoreSearchStrategy || 0
      );
      const factorEmployability = calculateFactorAverage(
        s.scoreEmployabilityCommunication || 0,
        s.scoreEmployabilityDigitalSkills || 0,
        s.scoreEmployabilityWorkplace || 0
      );
      const factorLearning = calculateFactorAverage(
        s.scoreLearningAwareness || 0,
        s.scoreLearningGrowthMindset || 0,
        s.scoreLearningGoalSetting || 0
      );
      const factorFinancial = calculateFactorAverage(
        s.scoreFinancialPressure || 0,
        s.scoreFinancialExpectations || 0,
        s.scoreFinancialFlexibility || 0
      );
      const factorResilience = calculateFactorAverage(
        s.scoreResilienceConfidence || 0,
        s.scoreResilienceStressManagement || 0,
        s.scoreResilienceIndependence || 0
      );
      const factorSupport = calculateFactorAverage(
        s.scoreSupportFamilyApproval || 0,
        s.scoreSupportCultural || 0,
        s.scoreSupportSystem || 0
      );
      
      return [
        s.id,
        s.participantId,
        s.occurredAt.toISOString(),
        s.readinessIndex,
        s.readinessCategory,
        // Factor averages
        factorMotivation,
        factorCareer,
        factorSearch,
        factorEmployability,
        factorLearning,
        factorFinancial,
        factorResilience,
        factorSupport,
        // All 24 sub-component scores
        s.scoreMotivationToWork || 0,
        s.scoreMotivationConsistency || 0,
        s.scoreMotivationOwnership || 0,
        s.scoreCareerClarity || 0,
        s.scoreCareerSectorAwareness || 0,
        s.scoreCareerRoleFit || 0,
        s.scoreSearchApplicationSkills || 0,
        s.scoreSearchInterviewReadiness || 0,
        s.scoreSearchStrategy || 0,
        s.scoreEmployabilityCommunication || 0,
        s.scoreEmployabilityDigitalSkills || 0,
        s.scoreEmployabilityWorkplace || 0,
        s.scoreLearningAwareness || 0,
        s.scoreLearningGrowthMindset || 0,
        s.scoreLearningGoalSetting || 0,
        s.scoreFinancialPressure || 0,
        s.scoreFinancialExpectations || 0,
        s.scoreFinancialFlexibility || 0,
        s.scoreResilienceConfidence || 0,
        s.scoreResilienceStressManagement || 0,
        s.scoreResilienceIndependence || 0,
        s.scoreSupportFamilyApproval || 0,
        s.scoreSupportCultural || 0,
        s.scoreSupportSystem || 0,
      ];
    });
    
    const csv = generateCsv(headers, rows);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="sessions.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating sessions CSV:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}