import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const participantId = params.id;
    
    // Verify access (coaches can only edit their assigned participants)
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
    
    // Get current participant data for audit
    const currentParticipant = await prisma.participant.findUnique({
      where: { id: participantId },
    });
    
    if (!currentParticipant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    const {
      firstName,
      lastName,
      gender,
      ageRange,
      education,
      emirate,
      phone,
      email,
    } = data;
    
    // Update participant
    const updatedParticipant = await prisma.participant.update({
      where: { id: participantId },
      data: {
        firstName,
        lastName,
        gender,
        ageRange,
        education,
        emirate,
        phone: phone || null,
        email: email || null,
      },
    });
    
    // Track what changed
    const changes: Record<string, any> = {};
    const fields = ['firstName', 'lastName', 'gender', 'ageRange', 'education', 'emirate', 'phone', 'email'];
    
    fields.forEach(field => {
      const oldValue = currentParticipant[field as keyof typeof currentParticipant];
      const newValue = updatedParticipant[field as keyof typeof updatedParticipant];
      if (oldValue !== newValue) {
        changes[field] = { from: oldValue, to: newValue };
      }
    });
    
    // Log audit trail
    if (Object.keys(changes).length > 0) {
      await logAudit({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'update',
        entityType: 'participant',
        entityId: participantId,
        changes,
      });
    }
    
    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json(
      { error: 'Failed to update participant' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const participantId = params.id;
    
    // Get audit trail
    const auditTrail = await prisma.auditLog.findMany({
      where: {
        entityType: 'participant',
        entityId: participantId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    
    return NextResponse.json(auditTrail);
  } catch (error) {
    console.error('Error fetching audit trail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit trail' },
      { status: 500 }
    );
  }
}
