import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Exam from '@/lib/db/models/Exam';

export async function POST(req: Request) {
  try {
    const examData = await req.json();
    await connectDB();
    
    const exam = await Exam.create(examData);
    
    return NextResponse.json({ 
      success: true, 
      examId: exam._id 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save exam' }, { status: 500 });
  }
}
