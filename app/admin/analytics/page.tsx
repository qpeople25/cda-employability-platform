import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { PremiumHeader } from '@/components/layout/PremiumHeader';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { prisma } from '@/lib/prisma';
import { calculateAgeRange } from '@/lib/utils';

async function getAnalyticsData() {
  // Get participants with sessions and barriers
  const participants = await prisma.participant.findMany({
    include: {
      sessions: {
        select: {
          id: true,
          createdAt: true,
          // NEW: All 24 sub-component scores
          scoreMotivationToWork: true,
          scoreMotivationConsistency: true,
          scoreMotivationOwnership: true,
          scoreCareerClarity: true,
          scoreCareerSectorAwareness: true,
          scoreCareerRoleFit: true,
          scoreSearchApplicationSkills: true,
          scoreSearchInterviewReadiness: true,
          scoreSearchStrategy: true,
          scoreEmployabilityCommunication: true,
          scoreEmployabilityDigitalSkills: true,
          scoreEmployabilityWorkplace: true,
          scoreLearningAwareness: true,
          scoreLearningGrowthMindset: true,
          scoreLearningGoalSetting: true,
          scoreFinancialPressure: true,
          scoreFinancialExpectations: true,
          scoreFinancialFlexibility: true,
          scoreResilienceConfidence: true,
          scoreResilienceStressManagement: true,
          scoreResilienceIndependence: true,
          scoreSupportFamilyApproval: true,
          scoreSupportCultural: true,
          scoreSupportSystem: true,
          // Computed fields
          readinessIndex: true,
          readinessCategory: true,
          nextTouchpoint: true,
          consentObtained: true,
          barriers: {
            include: {
              barrierBank: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  
  // Get barrier statistics
  const barrierStats = await prisma.barrier.groupBy({
    by: ['barrierBankId', 'severity', 'dimension'],
    _count: {
      id: true,
    },
  });
  
  // Get barrier bank for labels
  const barrierBank = await prisma.barrierBank.findMany();
  
  // Enrich barrier stats
  const enrichedBarrierStats = barrierStats.map(stat => {
    const barrier = barrierBank.find(b => b.id === stat.barrierBankId);
    return {
      barrierBankId: stat.barrierBankId,
      label: barrier?.label || 'Unknown',
      category: barrier?.category || 'Unknown',
      dimension: stat.dimension,
      severity: stat.severity,
      count: stat._count.id,
    };
  });
  
  // Calculate demographics
  const demographics = {
    byGender: participants.reduce((acc: Record<string, number>, p) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1;
      return acc;
    }, {}),
    byAge: participants.reduce((acc: Record<string, number>, p) => {
      if (p.dateOfBirth) {
        const ageRange = calculateAgeRange(p.dateOfBirth);
        acc[ageRange] = (acc[ageRange] || 0) + 1;
      }
      return acc;
    }, {}),
    byEmirate: participants.reduce((acc: Record<string, number>, p) => {
      acc[p.emirate] = (acc[p.emirate] || 0) + 1;
      return acc;
    }, {}),
    byEducation: participants.reduce((acc: Record<string, number>, p) => {
      acc[p.education] = (acc[p.education] || 0) + 1;
      return acc;
    }, {}),
  };
  
  // Calculate readiness distribution
  const sessions = participants.flatMap(p => p.sessions);
  const readinessDistribution = {
    categoryA: sessions.filter(s => s.readinessCategory === 'A').length,
    categoryB: sessions.filter(s => s.readinessCategory === 'B').length,
    categoryC: sessions.filter(s => s.readinessCategory === 'C').length,
  };
  
  // Average scores by factor (calculated from 3 sub-components each)
  const avgScores = sessions.length > 0 ? {
    motivation: Math.round(sessions.reduce((sum, s) => {
      const avg = Math.round(((s.scoreMotivationToWork || 0) + (s.scoreMotivationConsistency || 0) + (s.scoreMotivationOwnership || 0)) / 3);
      return sum + avg;
    }, 0) / sessions.length),
    career: Math.round(sessions.reduce((sum, s) => {
      const avg = Math.round(((s.scoreCareerClarity || 0) + (s.scoreCareerSectorAwareness || 0) + (s.scoreCareerRoleFit || 0)) / 3);
      return sum + avg;
    }, 0) / sessions.length),
    search: Math.round(sessions.reduce((sum, s) => {
      const avg = Math.round(((s.scoreSearchApplicationSkills || 0) + (s.scoreSearchInterviewReadiness || 0) + (s.scoreSearchStrategy || 0)) / 3);
      return sum + avg;
    }, 0) / sessions.length),
    employability: Math.round(sessions.reduce((sum, s) => {
      const avg = Math.round(((s.scoreEmployabilityCommunication || 0) + (s.scoreEmployabilityDigitalSkills || 0) + (s.scoreEmployabilityWorkplace || 0)) / 3);
      return sum + avg;
    }, 0) / sessions.length),
    learning: Math.round(sessions.reduce((sum, s) => {
      const avg = Math.round(((s.scoreLearningAwareness || 0) + (s.scoreLearningGrowthMindset || 0) + (s.scoreLearningGoalSetting || 0)) / 3);
      return sum + avg;
    }, 0) / sessions.length),
    financial: Math.round(sessions.reduce((sum, s) => {
      const avg = Math.round(((s.scoreFinancialPressure || 0) + (s.scoreFinancialExpectations || 0) + (s.scoreFinancialFlexibility || 0)) / 3);
      return sum + avg;
    }, 0) / sessions.length),
    resilience: Math.round(sessions.reduce((sum, s) => {
      const avg = Math.round(((s.scoreResilienceConfidence || 0) + (s.scoreResilienceStressManagement || 0) + (s.scoreResilienceIndependence || 0)) / 3);
      return sum + avg;
    }, 0) / sessions.length),
    support: Math.round(sessions.reduce((sum, s) => {
      const avg = Math.round(((s.scoreSupportFamilyApproval || 0) + (s.scoreSupportCultural || 0) + (s.scoreSupportSystem || 0)) / 3);
      return sum + avg;
    }, 0) / sessions.length),
  } : null;
  
  return {
    totalParticipants: participants.length,
    totalSessions: sessions.length,
    totalBarriers: barrierStats.reduce((sum, stat) => sum + stat._count.id, 0),
    avgReadinessIndex: sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.readinessIndex, 0) / sessions.length)
      : 0,
    demographics,
    readinessDistribution,
    avgScores,
    barrierStats: enrichedBarrierStats.sort((a, b) => b.count - a.count),
  };
}

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  if (user.role !== 'admin') {
    redirect('/coach/dashboard');
  }
  
  const data = await getAnalyticsData();
  
  return (
    <>
      <PremiumHeader user={user} />
      <AnalyticsDashboard data={data} />
    </>
  );
}
