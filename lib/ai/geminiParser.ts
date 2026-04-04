import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function parseQuestionsWithGemini(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const prompt = `Convert this question paper to JSON. Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "marks": 1
    }
  ]
}

Text: ${text}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  return JSON.parse(cleanResponse);
}