'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProfileTab } from '@/components/session/ProfileTab';
import { DimensionTab } from '@/components/session/DimensionTab';
import { PlanSummaryTab } from '@/components/session/PlanSummaryTab';
import { SessionRightPanel } from '@/components/session/SessionRightPanel';
import { DimensionKey, BarrierSeverity } from '@/types';
import { DIMENSION_MAP } from '@/lib/constants';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface BarrierData {
  barrierBankId: string;
  code: string;
  label: string;
  severity: BarrierSeverity;
  source: 'auto' | 'manual';
  dimension: DimensionKey | null;
  notes?: string;
}

interface SessionPageClientProps {
  participant: any;
  barrierBank: any[];
  existingSession: any | null;
  currentUser: any;
}

export default function SessionPageClient({
  participant,
  barrierBank,
  existingSession,
  currentUser,
}: SessionPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Session state
  const [consentObtained, setConsentObtained] = useState(existingSession?.consentObtained || false);
  const [scores, setScores] = useState<Record<DimensionKey, number>>(
    existingSession
      ? {
          motivation: existingSession.scoreMotivation,
          career: existingSession.scoreCareer,
          search: existingSession.scoreSearch,
          employability: existingSession.scoreEmployability,
          learning: existingSession.scoreLearning,
          financial: existingSession.scoreFinancial,
          resilience: existingSession.scoreResilience,
          support: existingSession.scoreSupport,
        }
      : {
          motivation: 0,
          career: 0,
          search: 0,
          employability: 0,
          learning: 0,
          financial: 0,
          resilience: 0,
          support: 0,
        }
  );
  
  const [notes, setNotes] = useState<Record<DimensionKey, string>>(
    existingSession
      ? {
          motivation: existingSession.notesMotivation || '',
          career: existingSession.notesCareer || '',
          search: existingSession.notesSearch || '',
          employability: existingSession.notesEmployability || '',
          learning: existingSession.notesLearning || '',
          financial: existingSession.notesFinancial || '',
          resilience: existingSession.notesResilience || '',
          support: existingSession.notesSupport || '',
        }
      : {
          motivation: '',
          career: '',
          search: '',
          employability: '',
          learning: '',
          financial: '',
          resilience: '',
          support: '',
        }
  );
  
  const [barriers, setBarriers] = useState<BarrierData[]>([]);
  const [shortTermGoal1, setShortTermGoal1] = useState(existingSession?.shortTermGoal1 || '');
  const [shortTermGoal2, setShortTermGoal2] = useState(existingSession?.shortTermGoal2 || '');
  const [longTermGoal, setLongTermGoal] = useState(existingSession?.longTermGoal || '');
  const [nextTouchpoint, setNextTouchpoint] = useState(existingSession?.nextTouchpoint || '');
  const [generalNotes, setGeneralNotes] = useState(existingSession?.notes || '');
  
  // Load existing barriers
  useEffect(() => {
    if (existingSession?.barriers) {
      const existingBarriers: BarrierData[] = existingSession.barriers.map((b: any) => ({
        barrierBankId: b.barrierBankId,
        code: b.barrierBank.code,
        label: b.barrierBank.label,
        severity: b.severity as BarrierSeverity,
        source: b.source as 'auto' | 'manual',
        dimension: b.dimension as DimensionKey | null,
        notes: b.notes || undefined,
      }));
      setBarriers(existingBarriers);
    }
  }, [existingSession]);
  
  const handleScoreChange = (dimension: DimensionKey, score: number) => {
    setScores(prev => ({ ...prev, [dimension]: score }));
  };
  
  const handleNotesChange = (dimension: DimensionKey, note: string) => {
    setNotes(prev => ({ ...prev, [dimension]: note }));
  };
  
  const handleAddBarrier = (barrier: BarrierData) => {
    // Check if barrier already exists
    const exists = barriers.some(b => b.barrierBankId === barrier.barrierBankId);
    if (!exists) {
      setBarriers(prev => [...prev, barrier]);
    }
  };
  
  const handleRemoveBarrier = (barrierBankId: string) => {
    setBarriers(prev => prev.filter(b => b.barrierBankId !== barrierBankId));
  };
  
  const handleParticipantUpdate = (updatedData: any) => {
    // Update participant data in parent (refresh page or update state)
    router.refresh();
  };
  
  const handleSave = async () => {
    // Validation
    const allScored = Object.values(scores).every(score => score > 0);
    if (!allScored) {
      alert('Please provide scores for all dimensions before saving.');
      return;
    }
    
    if (!consentObtained) {
      alert('Please obtain participant consent before saving the session.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/sessions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: participant.id,
          sessionId: existingSession?.id || null,
          consentObtained,
          scores,
          notes,
          barriers,
          shortTermGoal1,
          shortTermGoal2,
          longTermGoal,
          nextTouchpoint: nextTouchpoint || null,
          generalNotes,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save session');
      }
      
      setSaveMessage('Session saved successfully!');
      setTimeout(() => {
        router.push('/participants');
      }, 1500);
    } catch (error: any) {
      console.error('Error saving session:', error);
      alert(error.message || 'Failed to save session. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Get barriers for specific dimension
  const getBarriersForDimension = (dimension: DimensionKey) => {
    return barriers.filter(b => b.dimension === dimension);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/participants">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Participants
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">
                  Coaching Session: {participant.firstName} {participant.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {existingSession ? 'Review and update assessment' : 'Complete baseline assessment'}
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : existingSession ? 'Update Session' : 'Save Session'}
            </Button>
          </div>
          {saveMessage && (
            <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-md text-sm">
              {saveMessage}
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 flex-wrap h-auto">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="motivation">Motivation</TabsTrigger>
                  <TabsTrigger value="career">Career</TabsTrigger>
                  <TabsTrigger value="search">Job Search</TabsTrigger>
                  <TabsTrigger value="employability">Employability</TabsTrigger>
                  <TabsTrigger value="learning">Learning</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="resilience">Resilience</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                  <TabsTrigger value="plan">Plan & Summary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <ProfileTab
                    participant={participant}
                    consentObtained={consentObtained}
                    onConsentChange={setConsentObtained}
                    onParticipantUpdate={handleParticipantUpdate}
                  />
                </TabsContent>
                
                {/* Motivation Tab */}
                <TabsContent value="motivation">
                  <DimensionTab
                    dimensionKey="motivation"
                    dimensionLabel={DIMENSION_MAP.motivation.label}
                    dimensionDescription={DIMENSION_MAP.motivation.description}
                    score={scores.motivation}
                    notes={notes.motivation}
                    barriers={getBarriersForDimension('motivation')}
                    barrierBank={barrierBank}
                    onScoreChange={(score) => handleScoreChange('motivation', score)}
                    onNotesChange={(note) => handleNotesChange('motivation', note)}
                    onAddBarrier={handleAddBarrier}
                    onRemoveBarrier={handleRemoveBarrier}
                  />
                </TabsContent>
                
                {/* Career Tab */}
                <TabsContent value="career">
                  <DimensionTab
                    dimensionKey="career"
                    dimensionLabel={DIMENSION_MAP.career.label}
                    dimensionDescription={DIMENSION_MAP.career.description}
                    score={scores.career}
                    notes={notes.career}
                    barriers={getBarriersForDimension('career')}
                    barrierBank={barrierBank}
                    onScoreChange={(score) => handleScoreChange('career', score)}
                    onNotesChange={(note) => handleNotesChange('career', note)}
                    onAddBarrier={handleAddBarrier}
                    onRemoveBarrier={handleRemoveBarrier}
                  />
                </TabsContent>
                
                {/* Job Search Tab */}
                <TabsContent value="search">
                  <DimensionTab
                    dimensionKey="search"
                    dimensionLabel={DIMENSION_MAP.search.label}
                    dimensionDescription={DIMENSION_MAP.search.description}
                    score={scores.search}
                    notes={notes.search}
                    barriers={getBarriersForDimension('search')}
                    barrierBank={barrierBank}
                    onScoreChange={(score) => handleScoreChange('search', score)}
                    onNotesChange={(note) => handleNotesChange('search', note)}
                    onAddBarrier={handleAddBarrier}
                    onRemoveBarrier={handleRemoveBarrier}
                  />
                </TabsContent>
                
                {/* Employability Tab */}
                <TabsContent value="employability">
                  <DimensionTab
                    dimensionKey="employability"
                    dimensionLabel={DIMENSION_MAP.employability.label}
                    dimensionDescription={DIMENSION_MAP.employability.description}
                    score={scores.employability}
                    notes={notes.employability}
                    barriers={getBarriersForDimension('employability')}
                    barrierBank={barrierBank}
                    onScoreChange={(score) => handleScoreChange('employability', score)}
                    onNotesChange={(note) => handleNotesChange('employability', note)}
                    onAddBarrier={handleAddBarrier}
                    onRemoveBarrier={handleRemoveBarrier}
                  />
                </TabsContent>
                
                {/* Learning Tab */}
                <TabsContent value="learning">
                  <DimensionTab
                    dimensionKey="learning"
                    dimensionLabel={DIMENSION_MAP.learning.label}
                    dimensionDescription={DIMENSION_MAP.learning.description}
                    score={scores.learning}
                    notes={notes.learning}
                    barriers={getBarriersForDimension('learning')}
                    barrierBank={barrierBank}
                    onScoreChange={(score) => handleScoreChange('learning', score)}
                    onNotesChange={(note) => handleNotesChange('learning', note)}
                    onAddBarrier={handleAddBarrier}
                    onRemoveBarrier={handleRemoveBarrier}
                  />
                </TabsContent>
                
                {/* Financial Tab */}
                <TabsContent value="financial">
                  <DimensionTab
                    dimensionKey="financial"
                    dimensionLabel={DIMENSION_MAP.financial.label}
                    dimensionDescription={DIMENSION_MAP.financial.description}
                    score={scores.financial}
                    notes={notes.financial}
                    barriers={getBarriersForDimension('financial')}
                    barrierBank={barrierBank}
                    onScoreChange={(score) => handleScoreChange('financial', score)}
                    onNotesChange={(note) => handleNotesChange('financial', note)}
                    onAddBarrier={handleAddBarrier}
                    onRemoveBarrier={handleRemoveBarrier}
                  />
                </TabsContent>
                
                {/* Resilience Tab */}
                <TabsContent value="resilience">
                  <DimensionTab
                    dimensionKey="resilience"
                    dimensionLabel={DIMENSION_MAP.resilience.label}
                    dimensionDescription={DIMENSION_MAP.resilience.description}
                    score={scores.resilience}
                    notes={notes.resilience}
                    barriers={getBarriersForDimension('resilience')}
                    barrierBank={barrierBank}
                    onScoreChange={(score) => handleScoreChange('resilience', score)}
                    onNotesChange={(note) => handleNotesChange('resilience', note)}
                    onAddBarrier={handleAddBarrier}
                    onRemoveBarrier={handleRemoveBarrier}
                  />
                </TabsContent>
                
                {/* Support Tab */}
                <TabsContent value="support">
                  <DimensionTab
                    dimensionKey="support"
                    dimensionLabel={DIMENSION_MAP.support.label}
                    dimensionDescription={DIMENSION_MAP.support.description}
                    score={scores.support}
                    notes={notes.support}
                    barriers={getBarriersForDimension('support')}
                    barrierBank={barrierBank}
                    onScoreChange={(score) => handleScoreChange('support', score)}
                    onNotesChange={(note) => handleNotesChange('support', note)}
                    onAddBarrier={handleAddBarrier}
                    onRemoveBarrier={handleRemoveBarrier}
                  />
                </TabsContent>
                
                <TabsContent value="plan">
                  <PlanSummaryTab
                    barriers={barriers}
                    shortTermGoal1={shortTermGoal1}
                    shortTermGoal2={shortTermGoal2}
                    longTermGoal={longTermGoal}
                    nextTouchpoint={nextTouchpoint}
                    generalNotes={generalNotes}
                    onShortTermGoal1Change={setShortTermGoal1}
                    onShortTermGoal2Change={setShortTermGoal2}
                    onLongTermGoalChange={setLongTermGoal}
                    onNextTouchpointChange={setNextTouchpoint}
                    onGeneralNotesChange={setGeneralNotes}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <SessionRightPanel
              scores={scores}
              barriers={barriers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
