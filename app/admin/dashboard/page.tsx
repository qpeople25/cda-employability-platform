import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import { PremiumHeader } from '@/components/layout/PremiumHeader';
import { prisma } from '@/lib/prisma';

async function getStats() {
  const totalParticipants = await prisma.participant.count();
  const totalSessions = await prisma.session.count();
  const totalBarriers = await prisma.barrier.count();
  const totalCoaches = await prisma.user.count({
    where: { role: 'coach', active: true },
  });
  
  const assessedCount = await prisma.session.groupBy({
    by: ['participantId'],
  });
  
  const recentParticipants = await prisma.participant.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      assignments: {
        include: {
          coach: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
  
  return {
    totalParticipants,
    totalCoaches,
    assessedParticipants: assessedCount.length,
    notAssessed: totalParticipants - assessedCount.length,
    totalSessions,
    totalBarriers,
    recentParticipants,
  };
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  if (user.role !== 'admin') {
    redirect('/coach/dashboard');
  }
  
  const stats = await getStats();
  
  return (
    <>
      <PremiumHeader user={user} />
      <AdminDashboardClient stats={stats} user={user} />
    </>
  );
}
