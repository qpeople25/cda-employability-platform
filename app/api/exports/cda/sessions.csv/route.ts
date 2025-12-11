import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCsv } from '@/lib/utils';

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const headers = [
      'session_id',
      'participant_id',
      'occurred_at',
      'readiness_index',
      'readiness_category',
      'score_motivation',
      'score_career',
      'score_search',
      'score_employability',
      'score_learning',
      'score_financial',
      'score_resilience',
      'score_support',
    ];
    
    const rows = sessions.map((s) => [
      s.id,
      s.participantId,
      s.occurredAt.toISOString(),
      s.readinessIndex,
      s.readinessCategory,
      s.scoreMotivation,
      s.scoreCareer,
      s.scoreSearch,
      s.scoreEmployability,
      s.scoreLearning,
      s.scoreFinancial,
      s.scoreResilience,
      s.scoreSupport,
    ]);
    
    const csv = generateCsv(headers, rows);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="sessions.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating sessions CSV:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}
