'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Users, FileSpreadsheet, CheckCircle, AlertCircle, Calendar, LogOut, BarChart3 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  emirate: string;
  createdAt: Date;
  sessions: Array<{
    id: string;
    readinessCategory: string;
  }>;
}

interface Stats {
  totalParticipants: number;
  assessedParticipants: number;
  notAssessed: number;
  categories: {
    A: number;
    B: number;
    C: number;
  };
  recentParticipants: Participant[];
  upcomingTouchpoints: Array<{
    id: string;
    nextTouchpoint: Date | null;
    participant: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

export default function CoachDashboard({ user, stats }: { user: User; stats: Stats }) {
  const router = useRouter();
  
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Coach Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/participants">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  My Participants
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">My Participants</span>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{stats.totalParticipants}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Assessed</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.assessedParticipants}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Not Assessed</span>
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.notAssessed}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Category A</span>
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.categories.A}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Category B</span>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.categories.B}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Category C</span>
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.categories.C}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Participants */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">My Recent Participants</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.recentParticipants.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No participants assigned yet</p>
                </div>
              ) : (
                stats.recentParticipants.map((participant) => (
                  <div key={participant.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {participant.firstName} {participant.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {participant.gender} • {participant.emirate}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {participant.sessions.length > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Assessed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                        <Link href={`/participants/${participant.id}/session`}>
                          <Button size="sm">
                            {participant.sessions.length > 0 ? 'View' : 'Start'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Upcoming Touchpoints */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Upcoming Touchpoints</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.upcomingTouchpoints.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No upcoming touchpoints</p>
                </div>
              ) : (
                stats.upcomingTouchpoints.map((touchpoint) => (
                  <div key={touchpoint.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {touchpoint.participant.firstName} {touchpoint.participant.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {touchpoint.nextTouchpoint ? formatDate(touchpoint.nextTouchpoint) : 'No date set'}
                        </div>
                      </div>
                      <Link href={`/participants/${touchpoint.participant.id}/session`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Quick Actions</h3>
          <div className="flex gap-3">
            <Link href="/participants">
              <Button>
                <Users className="mr-2 h-4 w-4" />
                View All My Participants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
