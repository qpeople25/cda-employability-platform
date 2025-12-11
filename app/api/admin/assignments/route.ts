import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/assignments - Get all assignments
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const participants = await prisma.participant.findMany({
      include: {
        assignments: {
          include: {
            coach: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        sessions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

// POST /api/admin/assignments - Assign participant to coach
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { participantId, coachId } = data;
    
    if (!participantId || !coachId) {
      return NextResponse.json(
        { error: 'Participant ID and Coach ID are required' },
        { status: 400 }
      );
    }
    
    // Verify coach exists and is active
    const coach = await prisma.user.findUnique({
      where: { id: coachId, role: 'coach', active: true },
    });
    
    if (!coach) {
      return NextResponse.json(
        { error: 'Coach not found or inactive' },
        { status: 404 }
      );
    }
    
    // Verify participant exists
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });
    
    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }
    
    // Check if already assigned
    const existing = await prisma.coachAssignment.findUnique({
      where: {
        coachId_participantId: {
          coachId,
          participantId,
        },
      },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Participant already assigned to this coach' },
        { status: 400 }
      );
    }
    
    // Create assignment
    const assignment = await prisma.coachAssignment.create({
      data: {
        coachId,
        participantId,
        assignedBy: user.id,
      },
      include: {
        coach: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        participant: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    
    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}

// DELETE /api/admin/assignments - Remove assignment
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('id');
    
    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID required' },
        { status: 400 }
      );
    }
    
    await prisma.coachAssignment.delete({
      where: { id: assignmentId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}

// PATCH /api/admin/assignments - Bulk assign participants
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { participantIds, coachId } = data;
    
    if (!participantIds || !Array.isArray(participantIds) || !coachId) {
      return NextResponse.json(
        { error: 'Invalid data' },
        { status: 400 }
      );
    }
    
    // Verify coach
    const coach = await prisma.user.findUnique({
      where: { id: coachId, role: 'coach', active: true },
    });
    
    if (!coach) {
      return NextResponse.json(
        { error: 'Coach not found or inactive' },
        { status: 404 }
      );
    }
    
    // Create assignments (skip duplicates)
    const assignments = [];
    
    for (const participantId of participantIds) {
      try {
        const assignment = await prisma.coachAssignment.create({
          data: {
            coachId,
            participantId,
            assignedBy: user.id,
          },
        });
        assignments.push(assignment);
      } catch (error) {
        // Skip if already exists
        continue;
      }
    }
    
    return NextResponse.json({
      success: true,
      assigned: assignments.length,
      total: participantIds.length,
    });
  } catch (error) {
    console.error('Error bulk assigning:', error);
    return NextResponse.json({ error: 'Failed to bulk assign' }, { status: 500 });
  }
}
