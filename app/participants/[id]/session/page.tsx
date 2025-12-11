import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SessionPageClient from '@/components/session/SessionPageClient';
import { getCurrentUser } from '@/lib/auth';

interface SessionPageProps {
  params: {
    id: string;
  };
}

async function getParticipant(id: string) {
  const participant = await prisma.participant.findUnique({
    where: { id },
  });
  
  return participant;
}

async function verifyCoachAccess(participantId: string, userId: string, userRole: string) {
  if (userRole === 'admin') {
    return true; // Admins have access to all
  }
  
  // Check if coach is assigned to this participant
  const assignment = await prisma.coachAssignment.findFirst({
    where: {
      participantId,
      coachId: userId,
    },
  });
  
  return !!assignment;
}

async function getExistingSession(participantId: string) {
  const session = await prisma.session.findFirst({
    where: { participantId },
    include: {
      barriers: {
        include: {
          barrierBank: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return session;
}

async function getBarrierBank() {
  const barriers = await prisma.barrierBank.findMany({
    where: { active: true },
    orderBy: { label: 'asc' },
  });
  
  return barriers;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  const participant = await getParticipant(params.id);
  
  if (!participant) {
    notFound();
  }
  
  // Verify access
  const hasAccess = await verifyCoachAccess(participant.id, user.id, user.role);
  
  if (!hasAccess) {
    redirect('/participants');
  }
  
  const existingSession = await getExistingSession(participant.id);
  const barrierBank = await getBarrierBank();
  
  return (
    <SessionPageClient
      participant={participant}
      barrierBank={barrierBank}
      existingSession={existingSession}
      currentUser={user}
    />
  );
}
