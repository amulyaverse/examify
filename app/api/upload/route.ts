import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { connectDB } from '@/lib/db/mongodb';
import Exam from '@/lib/db/models/Exam';
import { parsePDF } from '@/lib/ocr/pdfParser';
import { parseImage } from '@/lib/ocr/imageParser';
import { parseQuestionsWithGemini } from '@/lib/ai/geminiParser';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const text = formData.get('text') as string;
    
    let extractedText = '';
    let examData = null;
    
    // Case 1: File Upload
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileType = file.type;
      const fileName = file.name;
      
      console.log(`Processing file: ${fileName}, Type: ${fileType}, Size: ${buffer.length} bytes`);
      
      // Save file temporarily (optional - for debugging)
      const uploadDir = path.join(process.cwd(), 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, `${Date.now()}-${fileName}`);
      await writeFile(filePath, buffer);
      console.log(`File saved to: ${filePath}`);
      
      // Extract text based on file type
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        console.log('Parsing PDF file...');
        extractedText = await parsePDF(buffer);
      } 
      else if (fileType.startsWith('image/') || fileName.match(/\.(png|jpg|jpeg)$/i)) {
        console.log('Parsing Image file...');
        extractedText = await parseImage(buffer);
      }
      else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        console.log('Reading text file...');
        extractedText = buffer.toString('utf-8');
      }
      else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload PDF, image, or text file.' },
          { status: 400 }
        );
      }
    }
    
    // Case 2: Pasted Text
    else if (text) {
      console.log('Processing pasted text...');
      extractedText = text;
    }
    
    else {
      return NextResponse.json(
        { error: 'No file or text provided' },
        { status: 400 }
      );
    }
    
    // Validate extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the provided input. Please check the file format.' },
        { status: 400 }
      );
    }
    
    console.log(`Extracted text length: ${extractedText.length} characters`);
    console.log('First 500 chars:', extractedText.substring(0, 500));
    
    // Parse questions using AI
    console.log('Sending to AI for parsing...');
    try {
      examData = await parseQuestionsWithAI(extractedText);
      console.log(`AI parsed ${examData.questions.length} questions successfully`);
    } catch (aiError) {
      console.error('AI parsing error:', aiError);
      return NextResponse.json(
        { error: 'AI failed to parse questions. Please check the question paper format.' },
        { status: 500 }
      );
    }
    
    // Save exam to database
    await connectDB();
    const exam = await Exam.create({
      title: examData.title || 'AI Generated Exam',
      description: examData.description || 'Automatically generated from uploaded question paper',
      duration: examData.duration || Math.ceil(examData.questions.length * 1.5),
      totalMarks: examData.totalMarks,
      totalQuestions: examData.totalQuestions,
      questions: examData.questions,
      createdBy: null, // Will be set when auth is implemented
      isPublic: false,
      shareableLink: generateShareableLink(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`Exam saved successfully with ID: ${exam._id}`);
    
    return NextResponse.json({
      success: true,
      examId: exam._id,
      message: 'Exam created successfully!',
      questionCount: examData.questions.length
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}

function generateShareableLink(): string {
  return Math.random().toString(36).substring(2, 15);
}