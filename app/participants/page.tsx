import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreateParticipantDialog } from '@/components/participants/CreateParticipantDialog';
import { FileDown, UserCircle } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function getParticipants(userId: string, userRole: string) {
  if (userRole === 'admin') {
    // Admins see all participants
    const participants = await prisma.participant.findMany({
      include: {
        sessions: {
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return participants.map(p => ({
      ...p,
      hasSession: p.sessions.length > 0,
    }));
  } else {
    // Coaches see only their assigned participants
    const assignments = await prisma.coachAssignment.findMany({
      where: { coachId: userId },
      include: {
        participant: {
          include: {
            sessions: {
              select: { id: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
    
    return assignments.map(a => ({
      ...a.participant,
      hasSession: a.participant.sessions.length > 0,
    }));
  }
}

export default async function ParticipantsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  const participants = await getParticipants(user.id, user.role);
  const isAdmin = user.role === 'admin';
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {isAdmin ? 'All Participants' : 'My Participants'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? 'Manage and assess Emirati job seekers in the employability program'
              : `You have ${participants.length} assigned participants`
            }
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <>
              <Link href="/api/exports/cda/participants.csv">
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </Link>
              <CreateParticipantDialog />
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emirate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <UserCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>
                      {isAdmin 
                        ? 'No participants yet. Create your first participant to get started.'
                        : 'No participants assigned to you yet. Contact your administrator.'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                participants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </div>
                      {participant.email && (
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.ageRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.education}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.emirate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(participant.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.hasSession ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Assessed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Not Assessed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/participants/${participant.id}/session`}>
                        <Button size="sm">
                          {participant.hasSession ? 'View Session' : 'Start Assessment'}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
