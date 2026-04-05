import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a question extraction engine. Extract ALL multiple-choice questions from the provided PDF document.

STRICT RULES:
1. Return ONLY a raw JSON array. No markdown, no code fences, no explanation.
2. Each object must have exactly these fields:
   - "question": the full question text as a string
   - "options": an array of exactly 4 strings, each formatted as "A. text", "B. text", "C. text", "D. text"
   - "correctAnswer": must be the FULL option string that is correct, e.g. "A. Paris" (not just "A")
3. If a question has no clearly marked correct answer, make your best guess.
4. Do NOT include any text outside the JSON array.

Example output format:
[
  {
    "question": "What is the capital of France?",
    "options": ["A. London", "B. Paris", "C. Berlin", "D. Rome"],
    "correctAnswer": "B. Paris"
  }
]
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64String,
          mimeType: "application/pdf",
        },
      },
    ]);

    let text = result.response.text().trim();

    console.log("=== RAW AI RESPONSE ===");
    console.log(text);
    console.log("=======================");

    // Strip markdown code fences if Gemini wraps response in them
    text = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    // Parse JSON safely
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse failed. Raw response was:", text);
      return NextResponse.json(
        { error: "AI returned invalid JSON. Try uploading again." },
        { status: 500 }
      );
    }

    // Handle both array and wrapped object formats
    let finalQuestions: unknown[] = [];
    if (Array.isArray(parsedData)) {
      finalQuestions = parsedData;
    } else if (parsedData && typeof parsedData === 'object') {
      const obj = parsedData as Record<string, unknown>;
      const key = Object.keys(obj).find(k => Array.isArray(obj[k]));
      if (key) finalQuestions = obj[key] as unknown[];
    }

    if (finalQuestions.length === 0) {
      console.error("No questions found in parsed data:", parsedData);
      return NextResponse.json(
        { error: "No questions could be extracted from this document." },
        { status: 422 }
      );
    }

    // Validate and sanitize each question object
    const validQuestions = finalQuestions.filter((q): q is {
      question: string;
      options: string[];
      correctAnswer: string;
    } => {
      if (!q || typeof q !== 'object') return false;
      const item = q as Record<string, unknown>;
      return (
        typeof item.question === 'string' &&
        Array.isArray(item.options) &&
        item.options.length > 0 &&
        typeof item.correctAnswer === 'string'
      );
    });

    console.log(`Extracted ${validQuestions.length} valid questions`);
    return NextResponse.json({ questions: validQuestions });

  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process the document. Please try again." },
      { status: 500 }
    );
  }
}