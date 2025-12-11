import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CoachDashboard from '@/components/coach/CoachDashboard';

async function getCoachStats(coachId: string) {
  const assignments = await prisma.coachAssignment.findMany({
    where: { coachId },
    include: {
      participant: {
        include: {
          sessions: {
            where: { coachId },
            select: {
              id: true,
              readinessCategory: true,
            },
          },
        },
      },
    },
  });
  
  const myParticipants = assignments.map(a => a.participant);
  const totalParticipants = myParticipants.length;
  const assessedParticipants = myParticipants.filter(p => p.sessions.length > 0).length;
  const notAssessed = totalParticipants - assessedParticipants;
  
  // Count by readiness category
  const categories = { A: 0, B: 0, C: 0 };
  myParticipants.forEach(p => {
    if (p.sessions.length > 0) {
      const category = p.sessions[0].readinessCategory as 'A' | 'B' | 'C';
      categories[category]++;
    }
  });
  
  // Get recent participants
  const recentParticipants = myParticipants
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  
  // Get upcoming touchpoints
  const upcomingTouchpoints = await prisma.session.findMany({
    where: {
      coachId,
      nextTouchpoint: {
        gte: new Date(),
      },
    },
    include: {
      participant: true,
    },
    orderBy: {
      nextTouchpoint: 'asc',
    },
    take: 5,
  });
  
  return {
    totalParticipants,
    assessedParticipants,
    notAssessed,
    categories,
    recentParticipants,
    upcomingTouchpoints,
  };
}

export default async function CoachDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  if (user.role !== 'coach') {
    redirect('/admin/dashboard');
  }
  
  const stats = await getCoachStats(user.id);
  
  return <CoachDashboard user={user} stats={stats} />;
}
