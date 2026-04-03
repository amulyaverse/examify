import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Result from '@/lib/db/models/Result';
import Exam from '@/lib/db/models/Exam';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const result = await Result.findById(params.id);
    
    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }
    
    const exam = await Exam.findById(result.examId);
    
    return NextResponse.json({ 
      result,
      examTitle: exam?.title 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load result' }, { status: 500 });
  }
}
