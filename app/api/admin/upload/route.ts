import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import * as XLSX from 'xlsx';

interface ParticipantRow {
  firstName: string;
  lastName: string;
  gender: string;
  ageRange: string;
  education: string;
  emirate: string;
  phone?: string;
  email?: string;
  coachEmail?: string;
}

interface ValidationError {
  row: number;
  field: string;
  error: string;
}

const VALID_GENDERS = ['Male', 'Female', 'Other'];
const VALID_EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
const VALID_AGE_RANGES = ['18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50+'];
const VALID_EDUCATION = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"];

async function validateParticipant(
  row: any,
  rowIndex: number,
  coachesMap: Map<string, string>
): Promise<{ valid: boolean; errors: ValidationError[]; data?: ParticipantRow; coachId?: string }> {
  const errors: ValidationError[] = [];
  
  // Required fields
  if (!row.firstName || typeof row.firstName !== 'string' || row.firstName.trim() === '') {
    errors.push({ row: rowIndex, field: 'firstName', error: 'First name is required' });
  }
  
  if (!row.lastName || typeof row.lastName !== 'string' || row.lastName.trim() === '') {
    errors.push({ row: rowIndex, field: 'lastName', error: 'Last name is required' });
  }
  
  if (!row.gender || !VALID_GENDERS.includes(row.gender)) {
    errors.push({ row: rowIndex, field: 'gender', error: `Gender must be one of: ${VALID_GENDERS.join(', ')}` });
  }
  
  if (!row.ageRange || !VALID_AGE_RANGES.includes(row.ageRange)) {
    errors.push({ row: rowIndex, field: 'ageRange', error: `Age range must be one of: ${VALID_AGE_RANGES.join(', ')}` });
  }
  
  if (!row.education || !VALID_EDUCATION.includes(row.education)) {
    errors.push({ row: rowIndex, field: 'education', error: `Education must be one of: ${VALID_EDUCATION.join(', ')}` });
  }
  
  if (!row.emirate || !VALID_EMIRATES.includes(row.emirate)) {
    errors.push({ row: rowIndex, field: 'emirate', error: `Emirate must be one of: ${VALID_EMIRATES.join(', ')}` });
  }
  
  // Optional fields validation
  if (row.email && typeof row.email === 'string' && row.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(row.email)) {
      errors.push({ row: rowIndex, field: 'email', error: 'Invalid email format' });
    }
  }
  
  // Validate coachEmail if provided
  let coachId: string | undefined;
  if (row.coachEmail && typeof row.coachEmail === 'string' && row.coachEmail.trim() !== '') {
    const email = row.coachEmail.trim();
    coachId = coachesMap.get(email);
    
    if (!coachId) {
      errors.push({ row: rowIndex, field: 'coachEmail', error: `Coach with email "${email}" not found or inactive` });
    }
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    errors: [],
    data: {
      firstName: row.firstName.trim(),
      lastName: row.lastName.trim(),
      gender: row.gender,
      ageRange: row.ageRange,
      education: row.education,
      emirate: row.emirate,
      phone: row.phone ? String(row.phone).trim() : undefined,
      email: row.email ? row.email.trim() : undefined,
      coachEmail: row.coachEmail ? row.coachEmail.trim() : undefined,
    },
    coachId,
  };
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const rows = XLSX.utils.sheet_to_json(worksheet);
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Excel file is empty' },
        { status: 400 }
      );
    }
    
    // Get all active coaches and create email -> id map
    const coaches = await prisma.user.findMany({
      where: { role: 'coach', active: true },
      select: { id: true, email: true },
    });
    
    const coachesMap = new Map(coaches.map(c => [c.email, c.id]));
    
    // Validate all rows
    const validationResults = await Promise.all(
      rows.map((row, index) => validateParticipant(row, index + 2, coachesMap))
    );
    
    const allErrors = validationResults.flatMap(r => r.errors);
    
    if (allErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          validationErrors: allErrors,
          totalRows: rows.length,
          errorCount: allErrors.length,
        },
        { status: 400 }
      );
    }
    
    // All validation passed, insert into database
    const validData = validationResults
      .filter(r => r.valid && r.data)
      .map(r => ({ data: r.data!, coachId: r.coachId }));
    
    let importedCount = 0;
    let assignedCount = 0;
    
    for (const { data, coachId } of validData) {
      // Create participant
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
      
      importedCount++;
      
      // Create assignment if coachId provided
      if (coachId) {
        try {
          await prisma.coachAssignment.create({
            data: {
              participantId: participant.id,
              coachId,
              assignedBy: user.id,
            },
          });
          assignedCount++;
        } catch (error) {
          // Skip if assignment fails (e.g., duplicate)
          console.error('Failed to create assignment:', error);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      imported: importedCount,
      total: rows.length,
      assigned: assignedCount,
      message: `Successfully imported ${importedCount} participants. ${assignedCount} were assigned to coaches.`,
    });
    
  } catch (error: any) {
    console.error('Error uploading Excel:', error);
    return NextResponse.json(
      { error: 'Failed to process Excel file', details: error.message },
      { status: 500 }
    );
  }
}
