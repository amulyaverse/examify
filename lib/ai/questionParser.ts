import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are an expert question paper parser. Convert the given question paper into a structured JSON format.

IMPORTANT RULES:
1. Extract ALL questions from the text
2. For each question, identify:
   - type: "single" (MCQ with one answer), "multiple", or "numerical"
   - question: The question text
   - options: Array of options (for MCQ questions)
   - correctAnswer: The correct answer(s)
   - subject: Subject category (default "General")
   - marks: Number of marks (default 1)
   - negativeMarks: Negative marking (default 0)

Return ONLY valid JSON, no other text. The JSON should have this structure:
{
  "title": "Exam Title",
  "description": "Exam Description",
  "duration": 60,
  "questions": [
    {
      "id": "q1",
      "type": "single",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "subject": "Mathematics",
      "marks": 1,
      "negativeMarks": 0.25
    }
  ]
}`;

export async function parseQuestionsWithGemini(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + text }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4000,
      },
    });
    
    const response = result.response.text();
    
    // Clean and parse JSON
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedExam = JSON.parse(cleanResponse);
    
    // Add IDs and calculate totals
    parsedExam.questions = parsedExam.questions.map((q: any, index: number) => ({
      id: q.id || `q${index + 1}`,
      ...q
    }));
    
    parsedExam.totalQuestions = parsedExam.questions.length;
    parsedExam.totalMarks = parsedExam.questions.reduce((sum: number, q: any) => sum + (q.marks || 1), 0);
    
    return parsedExam;
  } catch (error) {
    console.error("Gemini parsing error:", error);
    throw new Error("Failed to parse with Gemini");
  }
}