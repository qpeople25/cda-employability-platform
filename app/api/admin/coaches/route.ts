import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';

// GET /api/admin/coaches - List all coaches
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const coaches = await prisma.user.findMany({
      where: { role: 'coach' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        active: true,
        createdAt: true,
        assignedParticipants: {
          select: {
            id: true,
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
    
    const coachesWithStats = coaches.map(coach => ({
      ...coach,
      participantCount: coach.assignedParticipants.length,
      sessionCount: coach.sessions.length,
    }));
    
    return NextResponse.json(coachesWithStats);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
  }
}

// POST /api/admin/coaches - Create new coach
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { email, password, firstName, lastName } = data;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Create coach
    const hashedPwd = await hashPassword(password);
    
    const coach = await prisma.user.create({
      data: {
        email,
        password: hashedPwd,
        firstName,
        lastName,
        role: 'coach',
        active: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        active: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json(coach);
  } catch (error) {
    console.error('Error creating coach:', error);
    return NextResponse.json({ error: 'Failed to create coach' }, { status: 500 });
  }
}

// PATCH /api/admin/coaches - Update coach (activate/deactivate)
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { coachId, active, password } = data;
    
    if (!coachId) {
      return NextResponse.json({ error: 'Coach ID required' }, { status: 400 });
    }
    
    const updateData: any = {};
    
    if (typeof active === 'boolean') {
      updateData.active = active;
    }
    
    if (password) {
      updateData.password = await hashPassword(password);
    }
    
    const coach = await prisma.user.update({
      where: { id: coachId, role: 'coach' },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        active: true,
      },
    });
    
    return NextResponse.json(coach);
  } catch (error) {
    console.error('Error updating coach:', error);
    return NextResponse.json({ error: 'Failed to update coach' }, { status: 500 });
  }
}
