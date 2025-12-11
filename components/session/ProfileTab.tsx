'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDateTime } from '@/lib/utils';

interface ProfileTabProps {
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    ageRange: string;
    education: string;
    emirate: string;
    phone?: string | null;
    email?: string | null;
  };
  consentObtained: boolean;
  onConsentChange: (value: boolean) => void;
  onParticipantUpdate?: (updatedData: any) => void;
}

const VALID_GENDERS = ['Male', 'Female', 'Other'];
const VALID_EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
const VALID_AGE_RANGES = ['18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50+'];
const VALID_EDUCATION = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"];

export function ProfileTab({ participant, consentObtained, onConsentChange, onParticipantUpdate }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: participant.firstName,
    lastName: participant.lastName,
    gender: participant.gender,
    ageRange: participant.ageRange,
    education: participant.education,
    emirate: participant.emirate,
    phone: participant.phone || '',
    email: participant.email || '',
  });
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/participants/${participant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const updatedParticipant = await response.json();
        setIsEditing(false);
        if (onParticipantUpdate) {
          onParticipantUpdate(updatedParticipant);
        }
      } else {
        alert('Failed to update participant');
      }
    } catch (error) {
      alert('Error updating participant');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      firstName: participant.firstName,
      lastName: participant.lastName,
      gender: participant.gender,
      ageRange: participant.ageRange,
      education: participant.education,
      emirate: participant.emirate,
      phone: participant.phone || '',
      email: participant.email || '',
    });
    setIsEditing(false);
  };
  
  const fetchAuditTrail = async () => {
    try {
      const response = await fetch(`/api/participants/${participant.id}`);
      if (response.ok) {
        const data = await response.json();
        setAuditTrail(data);
        setShowAuditTrail(true);
      }
    } catch (error) {
      console.error('Error fetching audit trail:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Participant Information</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAuditTrail}
            >
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>First Name *</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name *</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>Gender *</Label>
            {isEditing ? (
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALID_GENDERS.map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={formData.gender} disabled />
            )}
          </div>
          <div className="space-y-2">
            <Label>Age Range *</Label>
            {isEditing ? (
              <Select value={formData.ageRange} onValueChange={(value) => setFormData({ ...formData, ageRange: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALID_AGE_RANGES.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={formData.ageRange} disabled />
            )}
          </div>
          <div className="space-y-2">
            <Label>Education *</Label>
            {isEditing ? (
              <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALID_EDUCATION.map(e => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={formData.education} disabled />
            )}
          </div>
          <div className="space-y-2">
            <Label>Emirate *</Label>
            {isEditing ? (
              <Select value={formData.emirate} onValueChange={(value) => setFormData({ ...formData, emirate: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALID_EMIRATES.map(e => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={formData.emirate} disabled />
            )}
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              placeholder="Optional"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Session Consent</h3>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="consent"
            checked={consentObtained}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300"
          />
          <Label htmlFor="consent" className="font-normal cursor-pointer">
            Participant has given consent for this coaching session
          </Label>
        </div>
      </div>
      
      {/* Audit Trail Dialog */}
      <Dialog open={showAuditTrail} onOpenChange={setShowAuditTrail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit History for {participant.firstName} {participant.lastName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {auditTrail.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No changes recorded yet</p>
            ) : (
              auditTrail.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {log.action === 'create' ? 'Created' : log.action === 'update' ? 'Updated' : 'Deleted'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(log.timestamp)}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    By: {log.userEmail} ({log.userRole})
                  </div>
                  {log.changes && (
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <div className="font-medium mb-2">Changes:</div>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(log.changes), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
