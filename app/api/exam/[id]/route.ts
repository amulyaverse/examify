import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Exam from '@/lib/db/models/Exam';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const exam = await Exam.findById(params.id);
    
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }
    
    // Remove correct answers for frontend
    const examForFrontend = {
      _id: exam._id,
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      questions: exam.questions.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        marks: q.marks
      }))
    };
    
    return NextResponse.json({ exam: examForFrontend });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load exam' }, { status: 500 });
  }
}
