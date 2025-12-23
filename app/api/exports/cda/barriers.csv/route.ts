import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCsv } from '@/lib/utils';

// Force dynamic rendering to prevent build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const barriers = await prisma.barrier.findMany({
      include: {
        barrierBank: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    const headers = [
      'barrier_row_id',
      'session_id',
      'participant_id',
      'barrier_code',
      'barrier_label',
      'barrier_category',
      'dimension_key',
      'severity',
      'source',
      'status',
      'notes',
    ];
    
    const rows = barriers.map((b) => [
      b.id,
      b.sessionId,
      b.participantId,
      b.barrierBank.code,
      b.barrierBank.label,
      b.barrierBank.category,
      b.dimension || '',
      b.severity,
      b.source,
      b.status,
      b.notes || '',
    ]);
    
    const csv = generateCsv(headers, rows);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="barriers.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating barriers CSV:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}