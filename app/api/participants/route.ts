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
        // New fields
        maritalStatus: data.maritalStatus || null,
        dependents: data.dependents ? parseInt(data.dependents) : 0,
        nationalServiceCompleted: data.nationalServiceCompleted || false,
        peopleOfDetermination: data.peopleOfDetermination || false,
        conviction: data.conviction || false,
        drivingLicense: data.drivingLicense || false,
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
