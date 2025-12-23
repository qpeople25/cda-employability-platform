'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { calculateReadinessIndex, calculateReadinessCategory, calculateFactorAverage } from '@/lib/utils';
import { FACTOR_DEFINITIONS } from '@/lib/factorDefinitions';

interface SubComponentScores {
  // Factor 1: Mindset & Motivation
  scoreMotivationToWork: number;
  scoreMotivationConsistency: number;
  scoreMotivationOwnership: number;
  // Factor 2: Career Awareness
  scoreCareerClarity: number;
  scoreCareerSectorAwareness: number;
  scoreCareerRoleFit: number;
  // Factor 3: Job Search Skills
  scoreSearchApplicationSkills: number;
  scoreSearchInterviewReadiness: number;
  scoreSearchStrategy: number;
  // Factor 4: Employability Skills
  scoreEmployabilityCommunication: number;
  scoreEmployabilityDigitalSkills: number;
  scoreEmployabilityWorkplace: number;
  // Factor 5: Personal Development
  scoreLearningAwareness: number;
  scoreLearningGrowthMindset: number;
  scoreLearningGoalSetting: number;
  // Factor 6: Financial Independence
  scoreFinancialPressure: number;
  scoreFinancialExpectations: number;
  scoreFinancialFlexibility: number;
  // Factor 7: Confidence & Self-Management
  scoreResilienceConfidence: number;
  scoreResilienceStressManagement: number;
  scoreResilienceIndependence: number;
  // Factor 8: Social Support
  scoreSupportFamilyApproval: number;
  scoreSupportCultural: number;
  scoreSupportSystem: number;
}

interface BarrierData {
  barrierBankId: string;
  code: string;
  label: string;
  severity: string;
  source: 'auto' | 'manual';
  factor: string | null;
}

interface SessionRightPanelProps {
  subComponentScores: SubComponentScores;
  barriers: BarrierData[];
}

export function SessionRightPanel({ subComponentScores, barriers }: SessionRightPanelProps) {
  // Calculate readiness index from all 24 sub-component scores
  const readinessIndex = calculateReadinessIndex(subComponentScores);
  const readinessCategory = calculateReadinessCategory(readinessIndex);
  
  // Calculate percentage
  const maxScore = 168; // 24 sub-components × 7 max score
  const percentage = Math.round((readinessIndex / maxScore) * 100);
  
  // Calculate factor averages directly using known property names
  const factorAverages = [
    {
      label: 'Mindset & Motivation',
      average: calculateFactorAverage(
        subComponentScores.scoreMotivationToWork || 4,
        subComponentScores.scoreMotivationConsistency || 4,
        subComponentScores.scoreMotivationOwnership || 4
      ),
    },
    {
      label: 'Career Awareness',
      average: calculateFactorAverage(
        subComponentScores.scoreCareerClarity || 4,
        subComponentScores.scoreCareerSectorAwareness || 4,
        subComponentScores.scoreCareerRoleFit || 4
      ),
    },
    {
      label: 'Job Search Skills',
      average: calculateFactorAverage(
        subComponentScores.scoreSearchApplicationSkills || 4,
        subComponentScores.scoreSearchInterviewReadiness || 4,
        subComponentScores.scoreSearchStrategy || 4
      ),
    },
    {
      label: 'Employability Skills',
      average: calculateFactorAverage(
        subComponentScores.scoreEmployabilityCommunication || 4,
        subComponentScores.scoreEmployabilityDigitalSkills || 4,
        subComponentScores.scoreEmployabilityWorkplace || 4
      ),
    },
    {
      label: 'Personal Development',
      average: calculateFactorAverage(
        subComponentScores.scoreLearningAwareness || 4,
        subComponentScores.scoreLearningGrowthMindset || 4,
        subComponentScores.scoreLearningGoalSetting || 4
      ),
    },
    {
      label: 'Financial Independence',
      average: calculateFactorAverage(
        subComponentScores.scoreFinancialPressure || 4,
        subComponentScores.scoreFinancialExpectations || 4,
        subComponentScores.scoreFinancialFlexibility || 4
      ),
    },
    {
      label: 'Confidence & Self-Management',
      average: calculateFactorAverage(
        subComponentScores.scoreResilienceConfidence || 4,
        subComponentScores.scoreResilienceStressManagement || 4,
        subComponentScores.scoreResilienceIndependence || 4
      ),
    },
    {
      label: 'Social Support',
      average: calculateFactorAverage(
        subComponentScores.scoreSupportFamilyApproval || 4,
        subComponentScores.scoreSupportCultural || 4,
        subComponentScores.scoreSupportSystem || 4
      ),
    },
  ];
  
  // Count barriers by severity
  const criticalCount = barriers.filter(b => b.severity === 'Critical').length;
  const highCount = barriers.filter(b => b.severity === 'High').length;
  const mediumCount = barriers.filter(b => b.severity === 'Medium').length;
  const lowCount = barriers.filter(b => b.severity === 'Low').length;
  
  return (
    <div className="space-y-4 sticky top-20">
      {/* Readiness Overview Card */}
      <Card className="p-4 bg-white border-2">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Employment Readiness
        </h3>
        
        <div className="space-y-3">
          {/* Readiness Category Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Category:</span>
            <Badge
              variant="outline"
              className={`text-lg font-bold px-3 py-1 ${
                readinessCategory === 'A'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : readinessCategory === 'B'
                  ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}
            >
              {readinessCategory}
            </Badge>
          </div>
          
          {/* Readiness Index */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Readiness Index:</span>
              <span className="font-semibold">{readinessIndex} / 168</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  readinessCategory === 'A'
                    ? 'bg-green-600'
                    : readinessCategory === 'B'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-right">{percentage}%</p>
          </div>
          
          {/* Category Description */}
          <div className="pt-2 border-t text-xs">
            {readinessCategory === 'A' && (
              <div className="flex items-start gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Closest to Labour Market</p>
                  <p className="text-gray-600 mt-1">Ready for job placement with minimal intervention</p>
                </div>
              </div>
            )}
            {readinessCategory === 'B' && (
              <div className="flex items-start gap-2 text-yellow-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Moderate Distance</p>
                  <p className="text-gray-600 mt-1">Requires targeted intervention and support</p>
                </div>
              </div>
            )}
            {readinessCategory === 'C' && (
              <div className="flex items-start gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Furthest from Labour Market</p>
                  <p className="text-gray-600 mt-1">Requires intensive, comprehensive support</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Factor Averages Overview */}
      <Card className="p-4 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Factor Scores</h3>
        <div className="space-y-2">
          {factorAverages.map((factor) => (
            <div key={factor.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{factor.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      factor.average >= 6 ? 'bg-green-500' :
                      factor.average >= 4 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(factor.average / 7) * 100}%` }}
                  ></div>
                </div>
                <span className="font-medium w-8 text-right">{factor.average}/7</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Each factor score is the average of its 3 sub-components
        </p>
      </Card>
      
      {/* Barriers Summary */}
      <Card className="p-4 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Barriers Summary
        </h3>
        
        {barriers.length > 0 ? (
          <div className="space-y-2">
            {criticalCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-700 font-medium">Critical</span>
                <Badge variant="outline" className="bg-red-50 border-red-500 text-red-700">
                  {criticalCount}
                </Badge>
              </div>
            )}
            {highCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-700 font-medium">High</span>
                <Badge variant="outline" className="bg-orange-50 border-orange-500 text-orange-700">
                  {highCount}
                </Badge>
              </div>
            )}
            {mediumCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-700 font-medium">Medium</span>
                <Badge variant="outline" className="bg-yellow-50 border-yellow-500 text-yellow-700">
                  {mediumCount}
                </Badge>
              </div>
            )}
            {lowCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">Low</span>
                <Badge variant="outline" className="bg-blue-50 border-blue-500 text-blue-700">
                  {lowCount}
                </Badge>
              </div>
            )}
            
            <div className="pt-2 border-t mt-3">
              <p className="text-sm font-semibold">Total Barriers: {barriers.length}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No barriers identified yet
          </p>
        )}
      </Card>
      
      {/* Quick Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-sm text-blue-900 mb-2">💡 Assessment Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Score each sub-component independently</li>
          <li>• Use diagnostic questions to inform scores</li>
          <li>• Add barriers as you identify them</li>
          <li>• Save frequently to preserve progress</li>
        </ul>
      </Card>
    </div>
  );
}
