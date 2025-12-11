'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Users, 
  BarChart3, 
  AlertTriangle,
  TrendingUp,
  PieChart,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalyticsData {
  totalParticipants: number;
  totalSessions: number;
  totalBarriers: number;
  avgReadinessIndex: number;
  demographics: {
    byGender: Record<string, number>;
    byAge: Record<string, number>;
    byEmirate: Record<string, number>;
    byEducation: Record<string, number>;
  };
  readinessDistribution: {
    categoryA: number;
    categoryB: number;
    categoryC: number;
  };
  avgScores: {
    motivation: number;
    career: number;
    search: number;
    employability: number;
    learning: number;
    financial: number;
    resilience: number;
    support: number;
  } | null;
  barrierStats: Array<{
    barrierBankId: string;
    label: string;
    category: string;
    dimension: string | null;
    severity: string;
    count: number;
  }>;
}

interface Props {
  data: AnalyticsData;
}

export default function AnalyticsDashboard({ data }: Props) {
  const [filterDimension, setFilterDimension] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/analytics/export?format=excel');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employability-data-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Filter barriers
  const filteredBarriers = data.barrierStats.filter(b => {
    if (filterDimension !== 'all' && b.dimension !== filterDimension) return false;
    if (filterSeverity !== 'all' && b.severity !== filterSeverity) return false;
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive data analysis and reporting dashboard
            </p>
          </div>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            size="lg"
            className="bg-gradient-to-r from-[#0A4D68] to-[#1565A6]"
          >
            <Download className="h-5 w-5 mr-2" />
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Participants</span>
              <Users className="h-6 w-6 text-[#0A4D68]" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{data.totalParticipants}</div>
          </div>
          
          <div className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Sessions</span>
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{data.totalSessions}</div>
          </div>
          
          <div className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Barriers Identified</span>
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{data.totalBarriers}</div>
          </div>
          
          <div className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Avg Readiness</span>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{data.avgReadinessIndex}/100</div>
          </div>
        </div>
        
        {/* Readiness Distribution */}
        <div className="p-6 mb-8 bg-white shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="h-6 w-6 text-[#0A4D68]" />
            Readiness Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
              <div className="text-green-900 font-semibold text-lg mb-2">Category A</div>
              <div className="text-4xl font-bold text-green-700">{data.readinessDistribution.categoryA}</div>
              <p className="text-green-700 text-sm mt-2">Job-ready participants</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
              <div className="text-blue-900 font-semibold text-lg mb-2">Category B</div>
              <div className="text-4xl font-bold text-blue-700">{data.readinessDistribution.categoryB}</div>
              <p className="text-blue-700 text-sm mt-2">Developing readiness</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-6">
              <div className="text-orange-900 font-semibold text-lg mb-2">Category C</div>
              <div className="text-4xl font-bold text-orange-700">{data.readinessDistribution.categoryC}</div>
              <p className="text-orange-700 text-sm mt-2">Requires intensive support</p>
            </div>
          </div>
        </div>
        
        {/* Average Scores by Dimension */}
        {data.avgScores && (
          <div className="p-6 mb-8 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Average Scores by Dimension</h2>
            <div className="space-y-4">
              {Object.entries(data.avgScores).map(([dimension, score]) => (
                <div key={dimension} className="flex items-center gap-4">
                  <div className="w-48 font-medium text-gray-700 capitalize">{dimension}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                    <div 
                      className="bg-gradient-to-r from-[#0A4D68] to-[#1565A6] h-8 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${(score / 7) * 100}%` }}
                    >
                      <span className="text-white font-bold text-sm">{score}/7</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">By Gender</h2>
            <div className="space-y-3">
              {Object.entries(data.demographics.byGender).map(([gender, count]) => (
                <div key={gender} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{gender}</span>
                  <Badge variant="outline" className="text-base">{count}</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">By Age Range</h2>
            <div className="space-y-3">
              {Object.entries(data.demographics.byAge).map(([age, count]) => (
                <div key={age} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{age}</span>
                  <Badge variant="outline" className="text-base">{count}</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">By Emirate</h2>
            <div className="space-y-3">
              {Object.entries(data.demographics.byEmirate).map(([emirate, count]) => (
                <div key={emirate} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{emirate}</span>
                  <Badge variant="outline" className="text-base">{count}</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">By Education Level</h2>
            <div className="space-y-3">
              {Object.entries(data.demographics.byEducation).map(([education, count]) => (
                <div key={education} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{education}</span>
                  <Badge variant="outline" className="text-base">{count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Barrier Analysis */}
        <div className="p-6 bg-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Common Barriers Analysis
            </h2>
            <div className="flex gap-3">
              <Select value={filterDimension} onValueChange={setFilterDimension}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by dimension" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dimensions</SelectItem>
                  <SelectItem value="motivation">Motivation</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="search">Job Search</SelectItem>
                  <SelectItem value="employability">Employability</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="resilience">Resilience</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredBarriers.slice(0, 20).map((barrier, idx) => (
              <div 
                key={barrier.barrierBankId + idx}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold text-gray-400 w-8">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{barrier.label}</div>
                    <div className="text-sm text-gray-600">{barrier.category} • {barrier.dimension || 'Cross-Cutting'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={
                      barrier.severity === 'High' ? 'destructive' :
                      barrier.severity === 'Medium' ? 'default' : 'secondary'
                    }
                  >
                    {barrier.severity}
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#0A4D68]">{barrier.count}</div>
                    <div className="text-xs text-gray-600">occurrences</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBarriers.length > 20 && (
            <p className="text-center text-gray-500 mt-6">
              Showing top 20 of {filteredBarriers.length} barriers. Export to Excel for complete data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
