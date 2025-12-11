import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const type = searchParams.get('type') || 'full';
    
    // Get all data with relationships
    const participants = await prisma.participant.findMany({
      include: {
        sessions: {
          select: {
            id: true,
            createdAt: true,
            scoreMotivation: true,
            scoreCareer: true,
            scoreSearch: true,
            scoreEmployability: true,
            scoreLearning: true,
            scoreFinancial: true,
            scoreResilience: true,
            scoreSupport: true,
            readinessIndex: true,
            readinessCategory: true,
            nextTouchpoint: true,
            consentObtained: true,
            barriers: {
              include: {
                barrierBank: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        assignments: {
          include: {
            coach: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    
    // Get barrier statistics
    const barrierStats = await prisma.barrier.groupBy({
      by: ['barrierBankId', 'severity', 'dimension'],
      _count: {
        id: true,
      },
    });
    
    // Enrich barrier stats with labels
    const barrierBankData = await prisma.barrierBank.findMany();
    const enrichedBarrierStats = barrierStats.map(stat => {
      const barrier = barrierBankData.find(b => b.id === stat.barrierBankId);
      return {
        ...stat,
        label: barrier?.label,
        category: barrier?.category,
        count: stat._count.id,
      };
    });
    
    if (format === 'excel') {
      // Create workbook with multiple sheets
      const workbook = XLSX.utils.book_new();
      
      // Sheet 1: Participants Overview
      const participantsData = participants.map(p => ({
        'Participant ID': p.id,
        'First Name': p.firstName,
        'Last Name': p.lastName,
        'Gender': p.gender,
        'Age Range': p.ageRange,
        'Emirate': p.emirate,
        'Education': p.education,
        'Phone': p.phone || '',
        'Email': p.email || '',
        'Total Sessions': p.sessions.length,
        'Latest Session Date': p.sessions[0]?.createdAt ? new Date(p.sessions[0].createdAt).toLocaleDateString() : 'N/A',
        'Latest Readiness Index': p.sessions[0]?.readinessIndex || 'N/A',
        'Latest Category': p.sessions[0]?.readinessCategory || 'N/A',
        'Assigned Coach': p.assignments[0]?.coach ? `${p.assignments[0].coach.firstName} ${p.assignments[0].coach.lastName}` : 'Unassigned',
        'Created Date': new Date(p.createdAt).toLocaleDateString(),
      }));
      const participantsSheet = XLSX.utils.json_to_sheet(participantsData);
      XLSX.utils.book_append_sheet(workbook, participantsSheet, 'Participants');
      
      // Sheet 2: Sessions Detail
      const sessionsData: any[] = [];
      participants.forEach(p => {
        p.sessions.forEach(s => {
          sessionsData.push({
            'Session ID': s.id,
            'Participant ID': p.id,
            'Participant Name': `${p.firstName} ${p.lastName}`,
            'Gender': p.gender,
            'Age Range': p.ageRange,
            'Emirate': p.emirate,
            'Education': p.education,
            'Session Date': new Date(s.createdAt).toLocaleDateString(),
            'Motivation Score': s.scoreMotivation,
            'Career Score': s.scoreCareer,
            'Job Search Score': s.scoreSearch,
            'Employability Score': s.scoreEmployability,
            'Learning Score': s.scoreLearning,
            'Financial Score': s.scoreFinancial,
            'Resilience Score': s.scoreResilience,
            'Support Score': s.scoreSupport,
            'Readiness Index': s.readinessIndex,
            'Readiness Category': s.readinessCategory,
            'Total Barriers': s.barriers.length,
            'High Severity Barriers': s.barriers.filter(b => b.severity === 'High').length,
            'Next Touchpoint': s.nextTouchpoint ? new Date(s.nextTouchpoint).toLocaleDateString() : '',
            'Consent Obtained': s.consentObtained ? 'Yes' : 'No',
          });
        });
      });
      const sessionsSheet = XLSX.utils.json_to_sheet(sessionsData);
      XLSX.utils.book_append_sheet(workbook, sessionsSheet, 'Sessions');
      
      // Sheet 3: Barriers Detail
      const barriersData: any[] = [];
      participants.forEach(p => {
        p.sessions.forEach(s => {
          s.barriers.forEach(b => {
            barriersData.push({
              'Barrier ID': b.id,
              'Session ID': s.id,
              'Participant ID': p.id,
              'Participant Name': `${p.firstName} ${p.lastName}`,
              'Gender': p.gender,
              'Age Range': p.ageRange,
              'Emirate': p.emirate,
              'Education': p.education,
              'Barrier Type': b.barrierBank.label,
              'Category': b.barrierBank.category,
              'Dimension': b.dimension || 'Cross-Cutting',
              'Severity': b.severity,
              'Source': b.source,
              'Status': b.status,
              'Notes': b.notes || '',
              'Identified Date': new Date(b.createdAt).toLocaleDateString(),
            });
          });
        });
      });
      const barriersSheet = XLSX.utils.json_to_sheet(barriersData);
      XLSX.utils.book_append_sheet(workbook, barriersSheet, 'Barriers');
      
      // Sheet 4: Barrier Statistics
      const barrierStatsData = enrichedBarrierStats
        .sort((a, b) => b.count - a.count)
        .map(stat => ({
          'Barrier Type': stat.label,
          'Category': stat.category,
          'Dimension': stat.dimension || 'Cross-Cutting',
          'Severity': stat.severity,
          'Total Occurrences': stat.count,
        }));
      const statsSheet = XLSX.utils.json_to_sheet(barrierStatsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, 'Barrier Statistics');
      
      // Sheet 5: Demographic Breakdown
      const demographicData = [
        {
          'Metric': 'Total Participants',
          'Count': participants.length,
        },
        {
          'Metric': 'Total Sessions',
          'Count': sessionsData.length,
        },
        {
          'Metric': 'Total Barriers Identified',
          'Count': barriersData.length,
        },
        {
          'Metric': 'Avg Readiness Index',
          'Count': sessionsData.length > 0 
            ? Math.round(sessionsData.reduce((sum, s) => sum + (s['Readiness Index'] || 0), 0) / sessionsData.length)
            : 0,
        },
      ];
      
      // Gender breakdown
      const genderCounts: Record<string, number> = {};
      participants.forEach(p => {
        genderCounts[p.gender] = (genderCounts[p.gender] || 0) + 1;
      });
      Object.entries(genderCounts).forEach(([gender, count]) => {
        demographicData.push({
          'Metric': `Gender: ${gender}`,
          'Count': count,
        });
      });
      
      // Age breakdown
      const ageCounts: Record<string, number> = {};
      participants.forEach(p => {
        ageCounts[p.ageRange] = (ageCounts[p.ageRange] || 0) + 1;
      });
      Object.entries(ageCounts).forEach(([age, count]) => {
        demographicData.push({
          'Metric': `Age: ${age}`,
          'Count': count,
        });
      });
      
      // Emirate breakdown
      const emirateCounts: Record<string, number> = {};
      participants.forEach(p => {
        emirateCounts[p.emirate] = (emirateCounts[p.emirate] || 0) + 1;
      });
      Object.entries(emirateCounts).forEach(([emirate, count]) => {
        demographicData.push({
          'Metric': `Emirate: ${emirate}`,
          'Count': count,
        });
      });
      
      const demographicSheet = XLSX.utils.json_to_sheet(demographicData);
      XLSX.utils.book_append_sheet(workbook, demographicSheet, 'Demographics');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="employability-data-export-${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    }
    
    // JSON format
    return NextResponse.json({
      participants,
      barrierStatistics: enrichedBarrierStats,
      summary: {
        totalParticipants: participants.length,
        totalSessions: participants.reduce((sum, p) => sum + p.sessions.length, 0),
        totalBarriers: barrierStats.reduce((sum, stat) => sum + stat._count.id, 0),
        avgReadinessIndex: participants.length > 0
          ? Math.round(
              participants
                .filter(p => p.sessions.length > 0)
                .reduce((sum, p) => sum + (p.sessions[0]?.readinessIndex || 0), 0) /
                participants.filter(p => p.sessions.length > 0).length
            )
          : 0,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
