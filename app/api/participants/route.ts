import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const participant = await prisma.participant.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        ageRange: data.ageRange,
        education: data.education,
        emirate: data.emirate,
        phone: data.phone || null,
        email: data.email || null,
      },
    });
    
    return NextResponse.json(participant);
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json(
      { error: 'Failed to create participant' },
      { status: 500 }
    );
  }
}
