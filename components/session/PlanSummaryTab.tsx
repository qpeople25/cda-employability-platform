'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DimensionKey, BarrierSeverity } from '@/types';
import { DIMENSION_MAP } from '@/lib/constants';
import { 
  Target, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  Sparkles,
  Flag
} from 'lucide-react';

interface BarrierData {
  barrierBankId: string;
  code: string;
  label: string;
  severity: BarrierSeverity;
  source: 'auto' | 'manual';
  dimension: DimensionKey | null;
  notes?: string;
}

interface PlanSummaryTabProps {
  barriers: BarrierData[];
  shortTermGoal1: string;
  shortTermGoal2: string;
  longTermGoal: string;
  nextTouchpoint: string;
  generalNotes: string;
  onShortTermGoal1Change: (value: string) => void;
  onShortTermGoal2Change: (value: string) => void;
  onLongTermGoalChange: (value: string) => void;
  onNextTouchpointChange: (value: string) => void;
  onGeneralNotesChange: (value: string) => void;
}

export function PlanSummaryTab({
  barriers,
  shortTermGoal1,
  shortTermGoal2,
  longTermGoal,
  nextTouchpoint,
  generalNotes,
  onShortTermGoal1Change,
  onShortTermGoal2Change,
  onLongTermGoalChange,
  onNextTouchpointChange,
  onGeneralNotesChange,
}: PlanSummaryTabProps) {
  // Group barriers by severity
  const highBarriers = barriers.filter(b => b.severity === 'High');
  const mediumBarriers = barriers.filter(b => b.severity === 'Medium');
  const lowBarriers = barriers.filter(b => b.severity === 'Low');
  
  // Group barriers by dimension
  const barriersByDimension = barriers.reduce((acc, barrier) => {
    const dimension = barrier.dimension || 'cross-cutting';
    if (!acc[dimension]) {
      acc[dimension] = [];
    }
    acc[dimension].push(barrier);
    return acc;
  }, {} as Record<string, BarrierData[]>);
  
  const getDimensionLabel = (key: string) => {
    if (key === 'cross-cutting') return 'Cross-Cutting Barriers';
    return DIMENSION_MAP[key as DimensionKey]?.label || key;
  };
  
  return (
    <div className="space-y-8">
      {/* Header with Icon */}
      <div className="bg-gradient-to-r from-[#0A4D68] to-[#1565A6] text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Action Plan & Summary</h2>
            <p className="text-white/90 text-lg mt-1">
              Consolidate insights and create a clear path forward
            </p>
          </div>
        </div>
      </div>
      
      {/* Barriers Overview - Visual Dashboard */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <h3 className="text-2xl font-bold text-gray-900">Barriers Overview</h3>
        </div>
        
        {barriers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No barriers identified</p>
            <p className="text-gray-400 text-sm mt-2">
              Add barriers in the dimension tabs to see them summarized here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-900 font-semibold text-lg">High Priority</span>
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {highBarriers.length}
                  </div>
                </div>
                <p className="text-red-700 text-sm">Requires immediate attention</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-900 font-semibold text-lg">Medium Priority</span>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {mediumBarriers.length}
                  </div>
                </div>
                <p className="text-yellow-700 text-sm">Needs structured support</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-900 font-semibold text-lg">Low Priority</span>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {lowBarriers.length}
                  </div>
                </div>
                <p className="text-green-700 text-sm">Minor adjustments needed</p>
              </div>
            </div>
            
            {/* Barriers by Dimension */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Flag className="h-5 w-5 text-gray-600" />
                Barriers by Dimension
              </h4>
              
              {Object.entries(barriersByDimension).map(([dimension, dimensionBarriers]) => (
                <div key={dimension} className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#0A4D68]"></div>
                    <h5 className="font-bold text-gray-900 text-lg">
                      {getDimensionLabel(dimension)}
                    </h5>
                    <Badge variant="outline" className="ml-auto">
                      {dimensionBarriers.length} barrier{dimensionBarriers.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {dimensionBarriers.map((barrier) => (
                      <div 
                        key={barrier.barrierBankId} 
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-3 h-3 rounded-full ${
                            barrier.severity === 'High' ? 'bg-red-500' :
                            barrier.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{barrier.label}</p>
                          {barrier.notes && (
                            <p className="text-sm text-gray-600 mt-1 italic">{barrier.notes}</p>
                          )}
                        </div>
                        <Badge 
                          variant={
                            barrier.severity === 'High' ? 'destructive' :
                            barrier.severity === 'Medium' ? 'default' : 'secondary'
                          }
                          className="flex-shrink-0"
                        >
                          {barrier.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Goals Section - Redesigned with Icons */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-6 w-6 text-[#0A4D68]" />
          <h3 className="text-2xl font-bold text-gray-900">Development Goals</h3>
        </div>
        
        <div className="space-y-6">
          {/* Short-term Goals */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-700" />
              <h4 className="text-lg font-semibold text-blue-900">Short-Term Goals (Next 1-3 Months)</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="shortTermGoal1" className="text-base font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Goal #1
                </Label>
                <Input
                  id="shortTermGoal1"
                  value={shortTermGoal1}
                  onChange={(e) => onShortTermGoal1Change(e.target.value)}
                  placeholder="e.g., Complete CV workshop and update resume"
                  className="h-12 text-base border-2 border-blue-300 focus:border-blue-500 bg-white"
                />
              </div>
              
              <div>
                <Label htmlFor="shortTermGoal2" className="text-base font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Goal #2
                </Label>
                <Input
                  id="shortTermGoal2"
                  value={shortTermGoal2}
                  onChange={(e) => onShortTermGoal2Change(e.target.value)}
                  placeholder="e.g., Apply to 5 relevant job openings"
                  className="h-12 text-base border-2 border-blue-300 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>
          
          {/* Long-term Goal */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flag className="h-5 w-5 text-purple-700" />
              <h4 className="text-lg font-semibold text-purple-900">Long-Term Goal (6-12 Months)</h4>
            </div>
            
            <div>
              <Label htmlFor="longTermGoal" className="text-base font-medium text-purple-900 mb-2 block">
                Career Vision & Aspirations
              </Label>
              <Textarea
                id="longTermGoal"
                value={longTermGoal}
                onChange={(e) => onLongTermGoalChange(e.target.value)}
                placeholder="e.g., Secure a permanent position in customer service with opportunities for career progression and professional development"
                rows={4}
                className="text-base border-2 border-purple-300 focus:border-purple-500 bg-white"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Next Steps Section */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-900">Next Steps & Follow-up</h3>
        </div>
        
        <div className="space-y-6">
          {/* Next Touchpoint */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-green-700" />
              <Label htmlFor="nextTouchpoint" className="text-lg font-semibold text-green-900">
                Schedule Next Session
              </Label>
            </div>
            <Input
              id="nextTouchpoint"
              type="date"
              value={nextTouchpoint}
              onChange={(e) => onNextTouchpointChange(e.target.value)}
              className="h-14 text-lg border-2 border-green-300 focus:border-green-500 bg-white"
            />
            <p className="text-sm text-green-700 mt-2">
              Set a follow-up date to review progress and adjust the action plan
            </p>
          </div>
          
          {/* General Notes */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-700" />
              <Label htmlFor="generalNotes" className="text-lg font-semibold text-gray-900">
                Session Notes & Observations
              </Label>
            </div>
            <Textarea
              id="generalNotes"
              value={generalNotes}
              onChange={(e) => onGeneralNotesChange(e.target.value)}
              placeholder="Capture key insights, participant engagement, notable moments, recommended interventions, and any other important observations from this session..."
              rows={8}
              className="text-base border-2 border-gray-300 focus:border-gray-500 bg-white"
            />
            <p className="text-sm text-gray-600 mt-2">
              These notes will help track progress over time and inform future coaching sessions
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Items Summary */}
      <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#F0D97D]/10 border-2 border-[#D4AF37] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-[#B8941F]" />
          <h4 className="text-xl font-bold text-gray-900">Ready to Save</h4>
        </div>
        <p className="text-gray-700 mb-4">
          Review all sections to ensure completeness, then click the <strong>"Save Session"</strong> button 
          at the bottom of the page to finalize this coaching session.
        </p>
        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#D4AF37]">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <strong>Checklist:</strong> Goals defined • Barriers identified • Next session scheduled • Notes recorded
          </div>
        </div>
      </div>
    </div>
  );
}
