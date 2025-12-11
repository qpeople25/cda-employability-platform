'use client';

import { Badge } from '@/components/ui/badge';
import { DIMENSIONS, DIMENSION_MAP } from '@/lib/constants';
import { readinessIndex, readinessCategory, getCategoryDescription } from '@/lib/scoring';
import { DimensionKey } from '@/types';

interface BarrierData {
  barrierBankId: string;
  code: string;
  label: string;
  severity: string;
  source: string;
  dimension: string | null;
  notes?: string;
}

interface SessionRightPanelProps {
  scores: Record<DimensionKey, number>;
  barriers: BarrierData[];
}

export function SessionRightPanel({
  scores,
  barriers,
}: SessionRightPanelProps) {
  const index = readinessIndex(scores);
  const category = readinessCategory(scores);
  const description = getCategoryDescription(category);
  
  const getCategoryColor = () => {
    switch (category) {
      case 'A':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C':
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Readiness Assessment</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Readiness Index</span>
              <span className="text-2xl font-bold text-primary">{index}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${index}%` }}
              />
            </div>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground block mb-2">Category</span>
            <div className={`px-3 py-2 rounded-lg border ${getCategoryColor()}`}>
              <div className="font-semibold">Category {category}</div>
              <div className="text-sm">{description}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h4 className="font-medium mb-3">Domain Scores</h4>
        <div className="space-y-2">
          {DIMENSIONS.map((dimension) => (
            <div key={dimension.key} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate pr-2">
                {dimension.label.split('&')[0].trim()}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${(scores[dimension.key] / 7) * 100}%` }}
                  />
                </div>
                <span className="font-medium w-6 text-right">{scores[dimension.key]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Barriers Summary */}
      {barriers.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="font-medium mb-3">Identified Barriers ({barriers.length})</h4>
          <div className="space-y-2">
            {barriers.slice(0, 5).map((barrier) => (
              <div key={barrier.barrierBankId} className="text-sm p-2 bg-gray-50 rounded border">
                <div className="font-medium">{barrier.label}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant={
                    barrier.severity === 'High' ? 'destructive' :
                    barrier.severity === 'Medium' ? 'default' : 'secondary'
                  } className="text-xs">
                    {barrier.severity}
                  </Badge>
                  {barrier.dimension && (
                    <Badge variant="outline" className="text-xs">
                      {DIMENSION_MAP[barrier.dimension as DimensionKey]?.label.split(' ')[0] || barrier.dimension}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {barriers.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{barriers.length - 5} more barriers
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
