import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readinessIndex, readinessCategory } from '@/lib/scoring';
import { DimensionScores } from '@/types';
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
      scores,
      notes,
      barriers,
      shortTermGoal1,
      shortTermGoal2,
      longTermGoal,
      nextTouchpoint,
      generalNotes,
    } = data;
    
    // Debug logging for barriers
    console.log('=== SESSION SAVE DEBUG ===');
    console.log('Number of barriers:', barriers?.length || 0);
    if (barriers && barriers.length > 0) {
      console.log('Barriers data:', JSON.stringify(barriers, null, 2));
      barriers.forEach((b: any, idx: number) => {
        console.log(`Barrier ${idx}:`, {
          hasBarrierBankId: !!b.barrierBankId,
          barrierBankId: b.barrierBankId,
          label: b.label,
          severity: b.severity,
          source: b.source
        });
      });
    }
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
    
    // Calculate readiness
    const index = readinessIndex(scores as DimensionScores);
    const category = readinessCategory(scores as DimensionScores);
    
    // Prepare session data
    const sessionData = {
      participantId,
      coachId: user.id, // Capture the coach/admin who is saving this session
      consentObtained,
      scoreMotivation: scores.motivation,
      scoreCareer: scores.career,
      scoreSearch: scores.search,
      scoreEmployability: scores.employability,
      scoreLearning: scores.learning,
      scoreFinancial: scores.financial,
      scoreResilience: scores.resilience,
      scoreSupport: scores.support,
      notesMotivation: notes.motivation,
      notesCareer: notes.career,
      notesSearch: notes.search,
      notesEmployability: notes.employability,
      notesLearning: notes.learning,
      notesFinancial: notes.financial,
      notesResilience: notes.resilience,
      notesSupport: notes.support,
      readinessIndex: index,
      readinessCategory: category,
      shortTermGoal1: shortTermGoal1 || null,
      shortTermGoal2: shortTermGoal2 || null,
      longTermGoal: longTermGoal || null,
      nextTouchpoint: nextTouchpoint ? new Date(nextTouchpoint) : null,
      notes: generalNotes || null,
    };
    
    if (sessionId) {
      // Update existing session
      const session = await prisma.session.update({
        where: { id: sessionId },
        data: sessionData,
      });
      
      // Log audit
      await logAudit({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'update',
        entityType: 'session',
        entityId: session.id,
        changes: { readinessIndex: index, readinessCategory: category },
      });
      
      // Delete existing barriers and recreate them
      await prisma.barrier.deleteMany({
        where: { sessionId },
      });
      
      // Create new barriers - validate and filter out invalid ones
      if (barriers && barriers.length > 0) {
        const validBarriers = barriers.filter((barrier: any) => {
          if (!barrier.barrierBankId) {
            console.warn('Skipping barrier without barrierBankId:', barrier);
            return false;
          }
          return true;
        });
        
        if (validBarriers.length > 0) {
          await prisma.barrier.createMany({
            data: validBarriers.map((barrier: any) => ({
              sessionId: session.id,
              participantId: session.participantId,
              barrierBankId: barrier.barrierBankId,
              severity: barrier.severity || 'Medium',
              source: barrier.source || 'manual',
              dimension: barrier.dimension || null,
              notes: barrier.notes || null,
            })),
          });
        }
      }
      
      return NextResponse.json({ success: true, session });
    } else {
      // Create new session
      const session = await prisma.session.create({
        data: sessionData,
      });
      
      // Log audit
      await logAudit({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'create',
        entityType: 'session',
        entityId: session.id,
        changes: { readinessIndex: index, readinessCategory: category },
      });
      
      // Create barriers - validate and filter out invalid ones
      if (barriers && barriers.length > 0) {
        const validBarriers = barriers.filter((barrier: any) => {
          if (!barrier.barrierBankId) {
            console.warn('Skipping barrier without barrierBankId:', barrier);
            return false;
          }
          return true;
        });
        
        if (validBarriers.length > 0) {
          await prisma.barrier.createMany({
            data: validBarriers.map((barrier: any) => ({
              sessionId: session.id,
              participantId: session.participantId,
              barrierBankId: barrier.barrierBankId,
              severity: barrier.severity || 'Medium',
              source: barrier.source || 'manual',
              dimension: barrier.dimension || null,
              notes: barrier.notes || null,
            })),
          });
        }
      }
      
      return NextResponse.json({ success: true, session });
    }
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}
