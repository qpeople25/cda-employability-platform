'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SubComponentSectionProps {
  title: string;
  description: string;
  score: number;
  onScoreChange: (score: number) => void;
  questionPlaceholder?: boolean; // Show placeholder for diagnostic questions (pending Sally's input)
}

const SCORE_OPTIONS = [
  { value: 1, label: '1 - Very Low' },
  { value: 2, label: '2 - Low' },
  { value: 3, label: '3 - Below Average' },
  { value: 4, label: '4 - Average' },
  { value: 5, label: '5 - Above Average' },
  { value: 6, label: '6 - High' },
  { value: 7, label: '7 - Very High' },
];

export function SubComponentSection({
  title,
  description,
  score,
  onScoreChange,
  questionPlaceholder = true,
}: SubComponentSectionProps) {
  return (
    <div className="border rounded-lg p-4 bg-white space-y-3">
      {/* Sub-Component Header */}
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      {/* Diagnostic Questions Placeholder */}
      {questionPlaceholder && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">📋 Diagnostic Questions (Pending Sally's Review)</span>
            <br />
            <span className="text-xs">
              2-3 structured questions will appear here (multiple choice, frequency scales, scenarios, etc.)
            </span>
          </p>
        </div>
      )}

      {/* Score Selection */}
      <div className="space-y-2">
        <Label htmlFor={`score-${title}`} className="text-sm font-medium">
          Coach Assessment Score *
        </Label>
        <Select
          value={(score || 4).toString()}
          onValueChange={(value) => onScoreChange(parseInt(value))}
        >
          <SelectTrigger id={`score-${title}`}>
            <SelectValue placeholder="Select score (1-7)" />
          </SelectTrigger>
          <SelectContent>
            {SCORE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
