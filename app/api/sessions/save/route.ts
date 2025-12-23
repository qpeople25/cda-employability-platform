import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateReadinessIndex, calculateReadinessCategory } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    const {
      participantId,
      sessionId,
      consentObtained,
      // All 24 sub-component scores
      scoreMotivationToWork,
      scoreMotivationConsistency,
      scoreMotivationOwnership,
      scoreCareerClarity,
      scoreCareerSectorAwareness,
      scoreCareerRoleFit,
      scoreSearchApplicationSkills,
      scoreSearchInterviewReadiness,
      scoreSearchStrategy,
      scoreEmployabilityCommunication,
      scoreEmployabilityDigitalSkills,
      scoreEmployabilityWorkplace,
      scoreLearningAwareness,
      scoreLearningGrowthMindset,
      scoreLearningGoalSetting,
      scoreFinancialPressure,
      scoreFinancialExpectations,
      scoreFinancialFlexibility,
      scoreResilienceConfidence,
      scoreResilienceStressManagement,
      scoreResilienceIndependence,
      scoreSupportFamilyApproval,
      scoreSupportCultural,
      scoreSupportSystem,
      // Notes
      notesMotivation,
      notesCareer,
      notesSearch,
      notesEmployability,
      notesLearning,
      notesFinancial,
      notesResilience,
      notesSupport,
      // Goals
      shortTermGoal1,
      shortTermGoal2,
      longTermGoal,
      nextTouchpoint,
      notes: generalNotes,
      // Barriers
      barriers,
    } = data;
    
    // Debug logging
    console.log('=== SESSION SAVE DEBUG ===');
    console.log('Number of barriers:', barriers?.length || 0);
    console.log('Sub-component scores provided:', {
      motivationToWork: scoreMotivationToWork,
      careerClarity: scoreCareerClarity,
      // ... etc
    });
    console.log('========================');
    
    // Verify access (coaches can only save sessions for their assigned participants)
    if (user.role === 'coach') {
      const assignment = await prisma.coachAssignment.findFirst({
        where: {
          participantId,
          coachId: user.id,
        },
      });
      
      if (!assignment) {
        return NextResponse.json(
          { error: 'You do not have access to this participant' },
          { status: 403 }
        );
      }
    }
    
    // Calculate readiness from 24 sub-component scores
    const subComponentScores = {
      scoreMotivationToWork,
      scoreMotivationConsistency,
      scoreMotivationOwnership,
      scoreCareerClarity,
      scoreCareerSectorAwareness,
      scoreCareerRoleFit,
      scoreSearchApplicationSkills,
      scoreSearchInterviewReadiness,
      scoreSearchStrategy,
      scoreEmployabilityCommunication,
      scoreEmployabilityDigitalSkills,
      scoreEmployabilityWorkplace,
      scoreLearningAwareness,
      scoreLearningGrowthMindset,
      scoreLearningGoalSetting,
      scoreFinancialPressure,
      scoreFinancialExpectations,
      scoreFinancialFlexibility,
      scoreResilienceConfidence,
      scoreResilienceStressManagement,
      scoreResilienceIndependence,
      scoreSupportFamilyApproval,
      scoreSupportCultural,
      scoreSupportSystem,
    };
    
    const index = calculateReadinessIndex(subComponentScores);
    const category = calculateReadinessCategory(index);
    
    // Prepare session data
    const sessionData = {
      participantId,
      coachId: user.id,
      consentObtained,
      
      // All 24 sub-component scores
      scoreMotivationToWork,
      scoreMotivationConsistency,
      scoreMotivationOwnership,
      scoreCareerClarity,
      scoreCareerSectorAwareness,
      scoreCareerRoleFit,
      scoreSearchApplicationSkills,
      scoreSearchInterviewReadiness,
      scoreSearchStrategy,
      scoreEmployabilityCommunication,
      scoreEmployabilityDigitalSkills,
      scoreEmployabilityWorkplace,
      scoreLearningAwareness,
      scoreLearningGrowthMindset,
      scoreLearningGoalSetting,
      scoreFinancialPressure,
      scoreFinancialExpectations,
      scoreFinancialFlexibility,
      scoreResilienceConfidence,
      scoreResilienceStressManagement,
      scoreResilienceIndependence,
      scoreSupportFamilyApproval,
      scoreSupportCultural,
      scoreSupportSystem,
      
      // Notes per factor
      notesMotivation: notesMotivation || '',
      notesCareer: notesCareer || '',
      notesSearch: notesSearch || '',
      notesEmployability: notesEmployability || '',
      notesLearning: notesLearning || '',
      notesFinancial: notesFinancial || '',
      notesResilience: notesResilience || '',
      notesSupport: notesSupport || '',
      
      // Computed readiness
      readinessIndex: index,
      readinessCategory: category,
      
      // Goals and notes
      shortTermGoal1: shortTermGoal1 || '',
      shortTermGoal2: shortTermGoal2 || '',
      longTermGoal: longTermGoal || '',
      nextTouchpoint: nextTouchpoint || '',
      notes: generalNotes || '',
    };
    
    let session;
    
    if (sessionId) {
      // Update existing session
      session = await prisma.session.update({
        where: { id: sessionId },
        data: sessionData,
      });
      
      // Delete existing barriers for this session
      await prisma.barrier.deleteMany({
        where: { sessionId: session.id },
      });
      
      // Log update
      await logAudit({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'update',
        entityType: 'session',
        entityId: session.id,
      });
    } else {
      // Create new session
      session = await prisma.session.create({
        data: sessionData,
      });
      
      // Log creation
      await logAudit({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'create',
        entityType: 'session',
        entityId: session.id,
      });
    }
    
    // Create barrier records
    if (barriers && barriers.length > 0) {
      console.log('Creating barriers for session:', session.id);
      
      const barrierRecords = barriers.map((barrier: any) => ({
        sessionId: session.id,
        barrierBankId: barrier.barrierBankId,
        severity: barrier.severity,
        source: barrier.source,
        dimension: barrier.dimension,
        notes: barrier.notes || null,
      }));
      
      console.log('Barrier records to create:', barrierRecords.length);
      
      await prisma.barrier.createMany({
        data: barrierRecords,
        skipDuplicates: true,
      });
      
      console.log('Barriers created successfully');
    }
    
    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        readinessIndex: session.readinessIndex,
        readinessCategory: session.readinessCategory,
      },
    });
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json(
      { error: 'Failed to save session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
