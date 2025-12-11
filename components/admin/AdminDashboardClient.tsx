'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';
import { Upload, Users, FileSpreadsheet, AlertCircle, CheckCircle, Download, LogOut, BarChart3, UserCog, Link as LinkIcon } from 'lucide-react';

interface Stats {
  totalParticipants: number;
  totalCoaches: number;
  assessedParticipants: number;
  notAssessed: number;
  totalSessions: number;
  totalBarriers: number;
  recentParticipants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    emirate: string;
    createdAt: Date;
    assignments: Array<{
      coach: {
        firstName: string;
        lastName: string;
      };
    }>;
  }>;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface UploadResult {
  success: boolean;
  imported?: number;
  total?: number;
  message?: string;
  error?: string;
  validationErrors?: Array<{
    row: number;
    field: string;
    error: string;
  }>;
}

export default function AdminDashboardClient({ stats, user }: { stats: Stats; user: User }) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setUploadResult(result);
      
      if (result.success) {
        router.refresh();
        setSelectedFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: 'Failed to upload file. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };
  
  const downloadTemplate = () => {
    const template = `firstName,lastName,gender,ageRange,education,emirate,phone,email,coachEmail
Ahmed,Al Mansoori,Male,25-29,Bachelor's Degree,Dubai,+971501234567,ahmed@example.com,coach1@cda.ae
Fatima,Al Mazrouei,Female,30-34,Master's Degree,Abu Dhabi,+971509876543,fatima@example.com,coach1@cda.ae
Mohammed,Al Hashimi,Male,18-24,High School,Sharjah,,mohammed@example.com,coach2@cda.ae`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto py-8 px-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#0A4D68] to-[#1565A6] rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-white/90">
            Here's an overview of your platform activity and performance metrics.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Total Participants</span>
              <Users className="h-5 w-5 text-[#0A4D68]" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Coaches</span>
              <UserCog className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600">{stats.totalCoaches}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Assessed</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.assessedParticipants}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Not Assessed</span>
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.notAssessed}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Sessions</span>
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Barriers Identified</span>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalBarriers}</div>
          </div>
        </div>
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Bulk Import Participants</h2>
              <p className="text-sm text-muted-foreground">
                Upload an Excel or CSV file to import multiple participants at once
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Template Download */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-1">Need a template?</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Download our Excel template with the correct format and example data.
                  </p>
                  <p className="text-xs text-blue-600 mb-2">
                    <strong>Required columns:</strong> firstName, lastName, gender, ageRange, education, emirate
                  </p>
                  <p className="text-xs text-blue-600">
                    <strong>Optional columns:</strong> phone, email, <strong className="text-indigo-700">coachEmail</strong>
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </div>
            
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select Excel File (.xlsx, .xls, .csv)</Label>
              <div className="flex gap-3">
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="flex-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                />
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  size="lg"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Import'}
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            
            {/* Upload Result */}
            {uploadResult && (
              <div
                className={`rounded-lg p-4 ${
                  uploadResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {uploadResult.success ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Import Successful!</h4>
                      <p className="text-sm text-green-700 mt-1">
                        {uploadResult.message}
                      </p>
                      <p className="text-sm text-green-600 mt-2">
                        Imported: <strong>{uploadResult.imported}</strong> / {uploadResult.total} participants
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Import Failed</h4>
                        <p className="text-sm text-red-700 mt-1">
                          {uploadResult.error || 'Please fix the errors below and try again.'}
                        </p>
                      </div>
                    </div>
                    
                    {uploadResult.validationErrors && uploadResult.validationErrors.length > 0 && (
                      <div className="mt-3 max-h-64 overflow-y-auto bg-white rounded border border-red-200 p-3">
                        <h5 className="text-sm font-medium text-red-900 mb-2">
                          Validation Errors ({uploadResult.validationErrors.length}):
                        </h5>
                        <ul className="space-y-1">
                          {uploadResult.validationErrors.map((err, idx) => (
                            <li key={idx} className="text-xs text-red-700">
                              <strong>Row {err.row}</strong> - {err.field}: {err.error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Participants */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recently Added Participants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emirate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Coach</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.firstName} {participant.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.emirate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.assignments.length > 0 ? (
                        <span className="text-green-700">
                          {participant.assignments[0].coach.firstName} {participant.assignments[0].coach.lastName}
                        </span>
                      ) : (
                        <span className="text-orange-600">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(participant.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/participants/${participant.id}/session`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/participants">
            <Button>
              <Users className="mr-2 h-4 w-4" />
              View All Participants
            </Button>
          </Link>
          <Link href="/admin/coaches">
            <Button variant="outline">
              <UserCog className="mr-2 h-4 w-4" />
              Manage Coaches
            </Button>
          </Link>
          <Link href="/admin/assignments">
            <Button variant="outline">
              <LinkIcon className="mr-2 h-4 w-4" />
              Manage Assignments
            </Button>
          </Link>
          <Link href="/api/exports/cda/participants.csv">
            <Button variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
