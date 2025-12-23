'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FACTORS } from '@/lib/constants';
import { getSuggestedBarriers } from '@/lib/barriers';
import { FactorKey, BarrierSeverity } from '@/types';
import { Plus, X } from 'lucide-react';

interface BarrierData {
  barrierBankId: string;
  code: string;
  label: string;
  severity: BarrierSeverity;
  source: 'auto' | 'manual';
  factor: FactorKey | null;
  notes?: string;
}

interface CoachingConversationTabProps {
  scores: Record<FactorKey, number>;
  notes: Record<FactorKey, string>;
  barriers: BarrierData[];
  barrierBank: Array<{
    id: string;
    code: string;
    label: string;
    category: string;
    defaultSeverity: string;
    factor: string | null;
  }>;
  onScoreChange: (dimension: FactorKey, score: number) => void;
  onNotesChange: (dimension: FactorKey, notes: string) => void;
  onAddBarrier: (barrier: BarrierData) => void;
  onRemoveBarrier: (barrierBankId: string) => void;
}

export function CoachingConversationTab({
  scores,
  notes,
  barriers,
  barrierBank,
  onScoreChange,
  onNotesChange,
  onAddBarrier,
  onRemoveBarrier,
}: CoachingConversationTabProps) {
  const [selectedFactorForManualBarrier, setSelectedDimensionForManualBarrier] = useState<FactorKey | null>(null);
  const [showManualBarrierForm, setShowManualBarrierForm] = useState(false);
  const [manualBarrier, setManualBarrier] = useState({
    barrierBankId: '',
    severity: 'Medium' as BarrierSeverity,
    notes: '',
  });
  
  const handleAddManualBarrier = () => {
    if (!manualBarrier.barrierBankId || !selectedFactorForManualBarrier) return;
    
    const barrier = barrierBank.find(b => b.id === manualBarrier.barrierBankId);
    if (!barrier) return;
    
    onAddBarrier({
      barrierBankId: barrier.id,
      code: barrier.code,
      label: barrier.label,
      severity: manualBarrier.severity,
      source: 'manual',
      factor: selectedFactorForManualBarrier,
      notes: manualBarrier.notes || undefined,
    });
    
    setManualBarrier({
      barrierBankId: '',
      severity: 'Medium',
      notes: '',
    });
    setShowManualBarrierForm(false);
    setSelectedDimensionForManualBarrier(null);
  };
  
  const isBarrierAdded = (barrierBankId: string) => {
    return barriers.some(b => b.barrierBankId === barrierBankId);
  };
  
  return (
    <div className="space-y-8">
      {FACTORS.map((dimension) => {
        const suggestions = getSuggestedBarriers(dimension.key, scores[dimension.key], barrierBank);
        const dimensionBarriers = barriers.filter(b => b.factor === dimension.key);
        
        return (
          <div key={dimension.key} className="border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{dimension.label}</h3>
              <p className="text-sm text-muted-foreground">{dimension.description}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`score-${dimension.key}`}>
                Coach Score (1-7) *
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  id={`score-${dimension.key}`}
                  min="1"
                  max="7"
                  value={scores[dimension.key]}
                  onChange={(e) => onScoreChange(dimension.key, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-primary w-8 text-center">
                  {scores[dimension.key]}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`notes-${dimension.key}`}>
                Evidence Notes * (Describe specific behaviors and observations)
              </Label>
              <Textarea
                id={`notes-${dimension.key}`}
                value={notes[dimension.key]}
                onChange={(e) => onNotesChange(dimension.key, e.target.value)}
                placeholder="Provide detailed behavioral evidence supporting this score..."
                rows={3}
                className="resize-none"
              />
              {notes[dimension.key] && notes[dimension.key].length < 15 && (
                <p className="text-xs text-orange-600">Please provide at least 15 characters of evidence.</p>
              )}
            </div>
            
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Suggested Barriers (score ≤ 3)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion.barrierBankId}
                      type="button"
                      size="sm"
                      variant={isBarrierAdded(suggestion.barrierBankId) ? "secondary" : "outline"}
                      onClick={() => {
                        if (!isBarrierAdded(suggestion.barrierBankId)) {
                          onAddBarrier({ ...suggestion, source: 'auto' as const });
                        }
                      }}
                      disabled={isBarrierAdded(suggestion.barrierBankId)}
                    >
                      {suggestion.label}
                      {isBarrierAdded(suggestion.barrierBankId) && (
                        <span className="ml-1">✓</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {dimensionBarriers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Added Barriers</Label>
                <div className="flex flex-wrap gap-2">
                  {dimensionBarriers.map((barrier) => (
                    <Badge
                      key={barrier.barrierBankId}
                      variant={
                        barrier.severity === 'High' ? 'destructive' :
                        barrier.severity === 'Medium' ? 'default' : 'secondary'
                      }
                      className="pr-1"
                    >
                      {barrier.label} ({barrier.severity})
                      <button
                        type="button"
                        onClick={() => onRemoveBarrier(barrier.barrierBankId)}
                        className="ml-1 hover:bg-black/20 rounded p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {!showManualBarrierForm || selectedFactorForManualBarrier !== dimension.key ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDimensionForManualBarrier(dimension.key);
                  setShowManualBarrierForm(true);
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Manual Barrier
              </Button>
            ) : (
              <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="space-y-2">
                  <Label>Select Barrier</Label>
                  <Select
                    value={manualBarrier.barrierBankId}
                    onValueChange={(value) => setManualBarrier({ ...manualBarrier, barrierBankId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a barrier" />
                    </SelectTrigger>
                    <SelectContent>
                      {barrierBank
                        .filter(b => !isBarrierAdded(b.id))
                        .map((barrier) => (
                          <SelectItem key={barrier.id} value={barrier.id}>
                            {barrier.label} ({barrier.category})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={manualBarrier.severity}
                    onValueChange={(value) => setManualBarrier({ ...manualBarrier, severity: value as BarrierSeverity })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={manualBarrier.notes}
                    onChange={(e) => setManualBarrier({ ...manualBarrier, notes: e.target.value })}
                    placeholder="Additional context..."
                    rows={2}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddManualBarrier}
                    disabled={!manualBarrier.barrierBankId}
                  >
                    Add Barrier
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowManualBarrierForm(false);
                      setSelectedDimensionForManualBarrier(null);
                      setManualBarrier({
                        barrierBankId: '',
                        severity: 'Medium',
                        notes: '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
