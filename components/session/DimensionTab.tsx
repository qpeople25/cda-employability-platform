'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSuggestedBarriers } from '@/lib/barriers';
import { DimensionKey, BarrierSeverity } from '@/types';
import { Plus, X, AlertCircle, MessageCircle, Target, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import coachingQuestions from '@/lib/coaching-questions.json';

interface BarrierData {
  barrierBankId: string;
  code: string;
  label: string;
  severity: BarrierSeverity;
  source: 'auto' | 'manual';
  dimension: DimensionKey | null;
  notes?: string;
}

interface DimensionTabProps {
  dimensionKey: DimensionKey;
  dimensionLabel: string;
  dimensionDescription: string;
  score: number;
  notes: string;
  barriers: BarrierData[];
  barrierBank: Array<{
    id: string;
    code: string;
    label: string;
    category: string;
    defaultSeverity: string;
    dimension: string | null;
  }>;
  onScoreChange: (score: number) => void;
  onNotesChange: (notes: string) => void;
  onAddBarrier: (barrier: BarrierData) => void;
  onRemoveBarrier: (barrierBankId: string) => void;
}

export function DimensionTab({
  dimensionKey,
  dimensionLabel,
  dimensionDescription,
  score,
  notes,
  barriers,
  barrierBank,
  onScoreChange,
  onNotesChange,
  onAddBarrier,
  onRemoveBarrier,
}: DimensionTabProps) {
  const [showManualBarrierForm, setShowManualBarrierForm] = useState(false);
  const [showScoringGuide, setShowScoringGuide] = useState(false);
  const [manualBarrier, setManualBarrier] = useState({
    barrierBankId: '',
    severity: 'Medium' as BarrierSeverity,
    notes: '',
  });
  
  // Get coaching questions for this dimension
  const dimensionQuestions = (coachingQuestions as any)[dimensionKey] || {
    primary_questions: [],
    follow_up_probes: [],
    scoring_guide: []
  };
  
  // Get barriers relevant to this dimension
  const relevantBarriers = barrierBank.filter(b => 
    !b.dimension || b.dimension === dimensionKey
  );
  
  // Get suggested barriers based on score
  const suggestedBarriers = getSuggestedBarriers(dimensionKey, score, barrierBank);
  const currentBarrierIds = barriers.map(b => b.barrierBankId);
  const unappliedSuggestions = suggestedBarriers.filter(
    s => !currentBarrierIds.includes(s.barrierBankId)
  );
  
  const handleAddManualBarrier = () => {
    if (!manualBarrier.barrierBankId) return;
    
    const barrier = barrierBank.find(b => b.id === manualBarrier.barrierBankId);
    if (!barrier) return;
    
    onAddBarrier({
      barrierBankId: barrier.id,
      code: barrier.code,
      label: barrier.label,
      severity: manualBarrier.severity,
      source: 'manual',
      dimension: dimensionKey,
      notes: manualBarrier.notes || undefined,
    });
    
    setManualBarrier({
      barrierBankId: '',
      severity: 'Medium',
      notes: '',
    });
    setShowManualBarrierForm(false);
  };
  
  const handleApplySuggestion = (suggestion: any) => {
    onAddBarrier({
      barrierBankId: suggestion.barrierBankId,
      code: suggestion.code,
      label: suggestion.label,
      severity: suggestion.defaultSeverity as BarrierSeverity,
      source: 'auto',
      dimension: dimensionKey,
    });
  };
  
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 6) return 'from-green-500 to-emerald-600';
    if (scoreValue >= 4) return 'from-blue-500 to-indigo-600';
    return 'from-orange-500 to-red-600';
  };
  
  const getScoreIcon = (scoreValue: number) => {
    if (scoreValue >= 6) return CheckCircle2;
    if (scoreValue >= 4) return HelpCircle;
    return AlertTriangle;
  };
  
  return (
    <div className="space-y-8">
      {/* Dimension Header */}
      <div className="bg-gradient-to-r from-[#0A4D68] to-[#1565A6] text-white rounded-2xl p-6 shadow-xl">
        <h3 className="text-2xl font-bold mb-2">{dimensionLabel}</h3>
        <p className="text-white/90">{dimensionDescription}</p>
      </div>
      
      {/* Coaching Questions Section */}
      {dimensionQuestions.primary_questions.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-blue-900">Coaching Questions</h4>
          </div>
          
          <div className="space-y-3">
            {dimensionQuestions.primary_questions.map((question: string, idx: number) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                <p className="text-gray-800 leading-relaxed">{question}</p>
              </div>
            ))}
          </div>
          
          {dimensionQuestions.follow_up_probes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">Follow-up Probes:</p>
              <div className="space-y-2">
                {dimensionQuestions.follow_up_probes.map((probe: string, idx: number) => (
                  <div key={idx} className="text-sm text-blue-700 italic pl-4 border-l-2 border-blue-300">
                    {probe}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Scoring Section */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-[#0A4D68]" />
            <h4 className="text-lg font-semibold text-gray-900">Assessment Score</h4>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowScoringGuide(!showScoringGuide)}
          >
            {showScoringGuide ? 'Hide' : 'Show'} Scoring Guide
          </Button>
        </div>
        
        {/* Score Buttons - Large and Prominent */}
        <div className="grid grid-cols-7 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((value) => {
            const Icon = getScoreIcon(value);
            const isSelected = score === value;
            return (
              <button
                key={value}
                onClick={() => onScoreChange(value)}
                className={`
                  relative py-6 px-2 rounded-xl border-3 text-center transition-all duration-300 transform
                  ${isSelected
                    ? `bg-gradient-to-br ${getScoreColor(value)} text-white font-bold shadow-xl scale-105 border-transparent`
                    : 'border-gray-300 hover:border-[#0A4D68] bg-white hover:shadow-lg hover:scale-102'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  <div className="text-3xl font-bold">{value}</div>
                </div>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Current Score Display */}
        {score > 0 && (
          <div className={`bg-gradient-to-r ${getScoreColor(score)} text-white rounded-xl p-4 mb-4`}>
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = getScoreIcon(score);
                return <Icon className="h-6 w-6" />;
              })()}
              <div>
                <div className="font-semibold">Current Score: {score} / 7</div>
                <div className="text-sm text-white/90">
                  {score >= 6 && 'Strong capability - minimal support needed'}
                  {score >= 4 && score < 6 && 'Developing capability - moderate support needed'}
                  {score < 4 && 'Significant support required'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Detailed Scoring Guide */}
        {showScoringGuide && dimensionQuestions.scoring_guide.length > 0 && (
          <div className="space-y-3 border-t pt-6">
            <h5 className="font-semibold text-gray-900 mb-4">Detailed Scoring Guide:</h5>
            {dimensionQuestions.scoring_guide.map((guide: any) => (
              <div 
                key={guide.score}
                className={`border-2 rounded-lg p-4 transition-all ${
                  score === guide.score
                    ? 'border-[#0A4D68] bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${score === guide.score 
                      ? 'bg-[#0A4D68] text-white' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {guide.score}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{guide.description}</p>
                    {guide.evidence && (
                      <div className="text-sm bg-green-50 border border-green-200 rounded p-2 mb-2">
                        <span className="font-medium text-green-800">Evidence: </span>
                        <span className="text-green-700">{guide.evidence}</span>
                      </div>
                    )}
                    {guide.red_flags && (
                      <div className="text-sm bg-red-50 border border-red-200 rounded p-2">
                        <span className="font-medium text-red-800">Red Flags: </span>
                        <span className="text-red-700">{guide.red_flags}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Coaching Notes */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
        <Label htmlFor={`notes-${dimensionKey}`} className="text-lg font-semibold text-gray-900 mb-3 block">
          Coaching Notes & Observations
        </Label>
        <Textarea
          id={`notes-${dimensionKey}`}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={`Record your observations, strengths, areas for development, and coaching conversation highlights for ${dimensionLabel.toLowerCase()}...`}
          rows={6}
          className="text-base border-2 focus:border-[#0A4D68]"
        />
      </div>
      
      {/* Barriers Section */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="h-6 w-6 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">Identified Barriers</h4>
        </div>
        
        {/* Current Barriers - Large Cards */}
        {barriers.length === 0 ? (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            No barriers identified for this dimension yet
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 mb-6">
            {barriers.map((barrier) => (
              <div key={barrier.barrierBankId} className="flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 text-lg">{barrier.label}</span>
                    <Badge variant={barrier.source === 'auto' ? 'secondary' : 'outline'} className="text-xs">
                      {barrier.source === 'auto' ? 'Auto-detected' : 'Manual'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        barrier.severity === 'High' ? 'destructive' :
                        barrier.severity === 'Medium' ? 'default' : 'secondary'
                      }
                      className="text-sm px-3 py-1"
                    >
                      {barrier.severity} Severity
                    </Badge>
                  </div>
                  {barrier.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">{barrier.notes}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveBarrier(barrier.barrierBankId)}
                  className="ml-4 text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Suggested Barriers */}
        {unappliedSuggestions.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-700" />
              <h5 className="font-semibold text-yellow-900">
                Suggested Barriers (based on score {score}/7)
              </h5>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {unappliedSuggestions.map((suggestion) => (
                <div key={suggestion.barrierBankId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                  <span className="font-medium text-gray-900">{suggestion.label}</span>
                  <Button
                    size="sm"
                    onClick={() => handleApplySuggestion(suggestion)}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add Manual Barrier */}
        {!showManualBarrierForm ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowManualBarrierForm(true)}
            className="w-full border-2 border-dashed border-gray-300 hover:border-[#0A4D68] h-14 text-base"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Barrier Manually
          </Button>
        ) : (
          <div className="border-2 border-[#0A4D68] rounded-xl p-5 space-y-4 bg-blue-50">
            <h5 className="font-semibold text-[#0A4D68]">Add Manual Barrier</h5>
            
            <div className="space-y-2">
              <Label>Select Barrier</Label>
              <Select
                value={manualBarrier.barrierBankId}
                onValueChange={(value) => setManualBarrier({ ...manualBarrier, barrierBankId: value })}
              >
                <SelectTrigger className="h-12 border-2">
                  <SelectValue placeholder="Choose a barrier..." />
                </SelectTrigger>
                <SelectContent>
                  {relevantBarriers
                    .filter(b => !currentBarrierIds.includes(b.id))
                    .map((barrier) => (
                      <SelectItem key={barrier.id} value={barrier.id} className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{barrier.label}</span>
                          <span className="text-xs text-gray-500">({barrier.category})</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Severity Level</Label>
              <Select
                value={manualBarrier.severity}
                onValueChange={(value: BarrierSeverity) => setManualBarrier({ ...manualBarrier, severity: value })}
              >
                <SelectTrigger className="h-12 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High" className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium">High</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Medium" className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Low" className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Low</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={manualBarrier.notes}
                onChange={(e) => setManualBarrier({ ...manualBarrier, notes: e.target.value })}
                placeholder="Additional context about this barrier..."
                rows={3}
                className="border-2"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleAddManualBarrier} 
                disabled={!manualBarrier.barrierBankId}
                className="flex-1 h-12 text-base"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Barrier
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowManualBarrierForm(false)}
                className="flex-1 h-12 text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
