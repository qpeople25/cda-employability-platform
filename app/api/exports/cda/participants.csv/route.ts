import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCsv, calculateAge } from '@/lib/utils';

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const headers = [
      'participant_id',
      'first_name',
      'last_name',
      'gender',
      'age',
      'date_of_birth',
      'education',
      'emirate',
      'phone',
      'email',
      'created_at',
    ];
    
    const rows = participants.map((p) => [
      p.id,
      p.firstName,
      p.lastName,
      p.gender,
      p.dateOfBirth ? calculateAge(p.dateOfBirth) : '',
      p.dateOfBirth ? p.dateOfBirth.toISOString().split('T')[0] : '',
      p.education,
      p.emirate,
      p.phone || '',
      p.email || '',
      p.createdAt.toISOString(),
    ]);
    
    const csv = generateCsv(headers, rows);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="participants.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating participants CSV:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}
