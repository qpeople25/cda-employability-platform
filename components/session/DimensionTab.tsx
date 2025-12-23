'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubComponentSection } from './SubComponentSection';
import { Plus, X, AlertCircle, MessageCircle, HelpCircle } from 'lucide-react';
import { getSuggestedBarriers } from '@/lib/barriers';
import { FactorKey, BarrierSeverity } from '@/types';

interface BarrierData {
  barrierBankId: string;
  code: string;
  label: string;
  severity: BarrierSeverity;
  source: 'auto' | 'manual';
  factor: FactorKey | null;
  notes?: string;
}

interface SubComponentData {
  key: string;
  title: string;
  description: string;
  score: number;
}

interface FactorTabProps {
  factorKey: FactorKey;
  factorLabel: string;
  factorDescription: string;
  subComponentData: SubComponentData[];
  factorAverage: number;
  notes: string;
  barriers: BarrierData[];
  barrierBank: Array<{
    id: string;
    code: string;
    label: string;
    category: string;
    defaultSeverity: string;
    factor: string | null;
  }>;
  onSubComponentScoreChange: (subComponentKey: any, score: number) => void;
  onNotesChange: (notes: string) => void;
  onAddBarrier: (barrier: BarrierData) => void;
  onRemoveBarrier: (barrierBankId: string) => void;
}

export function DimensionTab({
  factorKey,
  factorLabel,
  factorDescription,
  subComponentData,
  factorAverage,
  notes,
  barriers,
  barrierBank,
  onSubComponentScoreChange,
  onNotesChange,
  onAddBarrier,
  onRemoveBarrier,
}: FactorTabProps) {
  const [showManualBarrierForm, setShowManualBarrierForm] = useState(false);
  const [showScoringGuide, setShowScoringGuide] = useState(false);
  const [manualBarrier, setManualBarrier] = useState({
    barrierBankId: '',
    severity: 'Medium' as BarrierSeverity,
    notes: '',
  });

  // Get suggested barriers based on factor average
  const suggestedBarriers = getSuggestedBarriers(factorKey, factorAverage, barrierBank);
  const currentBarrierIds = barriers.map(b => b.barrierBankId);
  const newSuggestions = suggestedBarriers.filter(
    s => !currentBarrierIds.includes(s.barrierBankId)
  );

  // Get relevant barriers for manual selection
  const relevantBarriers = barrierBank.filter(b =>
    !b.factor || b.factor === factorKey
  );

  const handleAddManualBarrier = () => {
    if (!manualBarrier.barrierBankId) return;

    const barrierInfo = barrierBank.find(b => b.id === manualBarrier.barrierBankId);
    if (!barrierInfo) return;

    onAddBarrier({
      barrierBankId: barrierInfo.id,
      code: barrierInfo.code,
      label: barrierInfo.label,
      severity: manualBarrier.severity,
      source: 'manual',
      factor: factorKey,
      notes: manualBarrier.notes || undefined,
    });

    setManualBarrier({ barrierBankId: '', severity: 'Medium', notes: '' });
    setShowManualBarrierForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Factor Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900">{factorLabel}</h3>
        <p className="text-sm text-gray-600 mt-1">{factorDescription}</p>
        <div className="mt-3 flex items-center gap-3">
          <Badge variant="outline" className="text-sm font-semibold">
            Factor Average: {factorAverage}/7
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowScoringGuide(!showScoringGuide)}
            className="text-xs"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Scoring Guide
          </Button>
        </div>
      </div>

      {/* Scoring Guide */}
      {showScoringGuide && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
          <h4 className="font-semibold mb-2">Scoring Guide (1-7 Scale)</h4>
          <ul className="space-y-1 text-gray-700">
            <li><strong>7 - Very High:</strong> Demonstrates excellence; no intervention needed</li>
            <li><strong>6 - High:</strong> Strong capability; minor refinement only</li>
            <li><strong>5 - Above Average:</strong> Good foundation; some development beneficial</li>
            <li><strong>4 - Average:</strong> Meets basic requirements; targeted support needed</li>
            <li><strong>3 - Below Average:</strong> Significant gaps; structured intervention required</li>
            <li><strong>2 - Low:</strong> Major barriers; intensive support essential</li>
            <li><strong>1 - Very Low:</strong> Critical deficiency; comprehensive intervention urgent</li>
          </ul>
        </div>
      )}

      {/* Sub-Components Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Sub-Components Assessment</h4>
          <span className="text-xs text-gray-500">(Score each component separately for diagnostic accuracy)</span>
        </div>

        <div className="grid gap-4">
          {subComponentData.map((subComponent) => (
            <SubComponentSection
              key={subComponent.key}
              title={subComponent.title}
              description={subComponent.description}
              score={subComponent.score}
              onScoreChange={(score) => onSubComponentScoreChange(subComponent.key, score)}
              questionPlaceholder={true}
            />
          ))}
        </div>
      </div>

      {/* Overall Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Overall Observations & Notes for {factorLabel}
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={`Record overall observations, patterns, or context across all ${factorLabel.toLowerCase()} sub-components...`}
          className="min-h-[100px]"
        />
        <p className="text-xs text-gray-500">
          Use this space for holistic observations that span multiple sub-components or contextual notes.
        </p>
      </div>

      {/* Barriers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h4 className="font-semibold text-gray-900">Identified Barriers</h4>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowManualBarrierForm(!showManualBarrierForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Barrier
          </Button>
        </div>

        {/* Suggested Barriers */}
        {newSuggestions.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <p className="text-sm font-medium text-amber-900 mb-2">
              💡 Suggested Barriers (Based on Factor Average: {factorAverage}/7)
            </p>
            <div className="flex flex-wrap gap-2">
              {newSuggestions.map((suggestion) => (
                <Button
                  key={suggestion.barrierBankId}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddBarrier({
                    barrierBankId: suggestion.barrierBankId,
                    code: suggestion.code,
                    label: suggestion.label,
                    severity: suggestion.severity,
                    source: 'auto',
                    factor: factorKey,
                  })}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggestion.label} ({suggestion.severity})
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Barrier Form */}
        {showManualBarrierForm && (
          <div className="border rounded p-3 bg-gray-50 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="barrier-select">Select Barrier</Label>
              <select
                id="barrier-select"
                value={manualBarrier.barrierBankId}
                onChange={(e) => setManualBarrier({ ...manualBarrier, barrierBankId: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Choose a barrier...</option>
                {relevantBarriers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} - {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <select
                  id="severity"
                  value={manualBarrier.severity}
                  onChange={(e) => setManualBarrier({ ...manualBarrier, severity: e.target.value as BarrierSeverity })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleAddManualBarrier} className="w-full">
                  Add Barrier
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="barrier-notes">Notes (Optional)</Label>
              <Textarea
                id="barrier-notes"
                value={manualBarrier.notes}
                onChange={(e) => setManualBarrier({ ...manualBarrier, notes: e.target.value })}
                placeholder="Add specific context about this barrier..."
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Current Barriers List */}
        {barriers.length > 0 ? (
          <div className="space-y-2">
            {barriers.map((barrier) => (
              <div
                key={barrier.barrierBankId}
                className="flex items-start justify-between p-3 border rounded bg-white"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={barrier.source === 'auto' ? 'secondary' : 'default'} className="text-xs">
                      {barrier.source === 'auto' ? 'Suggested' : 'Manual'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        barrier.severity === 'Critical' ? 'border-red-500 text-red-700' :
                        barrier.severity === 'High' ? 'border-orange-500 text-orange-700' :
                        barrier.severity === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                        'border-blue-500 text-blue-700'
                      }
                    >
                      {barrier.severity}
                    </Badge>
                  </div>
                  <p className="font-medium mt-1">{barrier.label}</p>
                  {barrier.notes && (
                    <p className="text-sm text-gray-600 mt-1">{barrier.notes}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveBarrier(barrier.barrierBankId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded border border-dashed">
            No barriers identified yet. Add barriers manually or they'll be suggested based on sub-component scores.
          </p>
        )}
      </div>
    </div>
  );
}
