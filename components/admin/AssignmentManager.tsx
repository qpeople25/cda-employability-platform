'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Link as LinkIcon, UserPlus, Users, X } from 'lucide-react';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  emirate: string;
  createdAt: Date;
  assignments: Array<{
    id: string;
    coach: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }>;
  sessions: Array<{ id: string }>;
}

interface Coach {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  participantCount: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export default function AssignmentManager({ user }: { user: User }) {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkCoachId, setBulkCoachId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [participantsRes, coachesRes] = await Promise.all([
        fetch('/api/admin/assignments'),
        fetch('/api/admin/coaches'),
      ]);
      
      const participantsData = await participantsRes.json();
      const coachesData = await coachesRes.json();
      
      setParticipants(participantsData);
      setCoaches(coachesData.filter((c: Coach) => c.active));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredParticipants = participants.filter(p => {
    if (filter === 'assigned') return p.assignments.length > 0;
    if (filter === 'unassigned') return p.assignments.length === 0;
    return true;
  });
  
  const handleAssign = async () => {
    if (!selectedParticipant || !selectedCoachId) return;
    
    setError('');
    
    try {
      const response = await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: selectedParticipant.id,
          coachId: selectedCoachId,
        }),
      });
      
      if (response.ok) {
        setSuccess('Participant assigned successfully!');
        setShowAssignDialog(false);
        setSelectedParticipant(null);
        setSelectedCoachId('');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to assign participant');
      }
    } catch (error) {
      setError('Failed to assign participant');
    }
  };
  
  const handleBulkAssign = async () => {
    if (selectedParticipants.length === 0 || !bulkCoachId) return;
    
    setError('');
    
    try {
      const response = await fetch('/api/admin/assignments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantIds: selectedParticipants,
          coachId: bulkCoachId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(`Assigned ${data.assigned} out of ${data.total} participants successfully!`);
        setShowBulkDialog(false);
        setSelectedParticipants([]);
        setBulkCoachId('');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to bulk assign');
      }
    } catch (error) {
      setError('Failed to bulk assign');
    }
  };
  
  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm('Remove this assignment?')) return;
    
    try {
      const response = await fetch(`/api/admin/assignments?id=${assignmentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccess('Assignment removed successfully!');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to remove assignment');
    }
  };
  
  const toggleParticipantSelection = (id: string) => {
    setSelectedParticipants(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };
  
  const unassignedCount = participants.filter(p => p.assignments.length === 0).length;
  const assignedCount = participants.filter(p => p.assignments.length > 0).length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Assignment Management</h1>
                <p className="text-sm text-muted-foreground">Assign participants to coaches</p>
              </div>
            </div>
            <div className="flex gap-3">
              {selectedParticipants.length > 0 && (
                <Button onClick={() => setShowBulkDialog(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Bulk Assign ({selectedParticipants.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            {error}
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Participants</div>
            <div className="text-3xl font-bold">{participants.length}</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm text-muted-foreground mb-1">Assigned</div>
            <div className="text-3xl font-bold text-green-600">{assignedCount}</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm text-muted-foreground mb-1">Unassigned</div>
            <div className="text-3xl font-bold text-orange-600">{unassignedCount}</div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex items-center gap-4">
            <Label>Filter:</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All ({participants.length})
              </Button>
              <Button
                size="sm"
                variant={filter === 'assigned' ? 'default' : 'outline'}
                onClick={() => setFilter('assigned')}
              >
                Assigned ({assignedCount})
              </Button>
              <Button
                size="sm"
                variant={filter === 'unassigned' ? 'default' : 'outline'}
                onClick={() => setFilter('unassigned')}
              >
                Unassigned ({unassignedCount})
              </Button>
            </div>
          </div>
        </div>
        
        {/* Participants Table */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Participants ({filteredParticipants.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading participants...</div>
          ) : filteredParticipants.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-muted-foreground">No participants found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.length === filteredParticipants.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedParticipants(filteredParticipants.map(p => p.id));
                          } else {
                            setSelectedParticipants([]);
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emirate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Coach</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => toggleParticipantSelection(participant.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {participant.firstName} {participant.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participant.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participant.emirate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {participant.assignments.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-700">
                              {participant.assignments[0].coach.firstName} {participant.assignments[0].coach.lastName}
                            </span>
                            <button
                              onClick={() => handleRemoveAssignment(participant.assignments[0].id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-orange-600">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participant.sessions.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {participant.assignments.length === 0 && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedParticipant(participant);
                              setShowAssignDialog(true);
                            }}
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Coach</DialogTitle>
            <DialogDescription>
              Assign {selectedParticipant?.firstName} {selectedParticipant?.lastName} to a coach
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Coach</Label>
              <Select value={selectedCoachId} onValueChange={setSelectedCoachId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a coach" />
                </SelectTrigger>
                <SelectContent>
                  {coaches.map((coach) => (
                    <SelectItem key={coach.id} value={coach.id}>
                      {coach.firstName} {coach.lastName} ({coach.participantCount} participants)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedCoachId}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Assign Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Assign to Coach</DialogTitle>
            <DialogDescription>
              Assign {selectedParticipants.length} participants to a coach
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Coach</Label>
              <Select value={bulkCoachId} onValueChange={setBulkCoachId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a coach" />
                </SelectTrigger>
                <SelectContent>
                  {coaches.map((coach) => (
                    <SelectItem key={coach.id} value={coach.id}>
                      {coach.firstName} {coach.lastName} ({coach.participantCount} participants)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAssign} disabled={!bulkCoachId}>
              Assign All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
