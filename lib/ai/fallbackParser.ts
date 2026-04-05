// Simple parser for when OpenAI API is not available
export function parseQuestionsManually(text: string): any {
  const lines = text.split('\n');
  const questions: any[] = [];
  let currentQuestion: any = null;
  let questionNumber = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if line starts with a number (question)
    const questionMatch = line.match(/^(\d+)[\.\)]\s*(.+)/);
    if (questionMatch) {
      // Save previous question
      if (currentQuestion && currentQuestion.question) {
        questions.push(currentQuestion);
      }
      
      // Start new question
      questionNumber++;
      currentQuestion = {
        id: `q${questionNumber}`,
        type: 'single',
        question: questionMatch[2],
        options: [],
        correctAnswer: '',
        subject: 'General',
        marks: 1,
        negativeMarks: 0
      };
    }
    // Check for options (A, B, C, D)
    else if (currentQuestion && line.match(/^[A-D][\.\)]\s*(.+)/i)) {
      const optionMatch = line.match(/^[A-D][\.\)]\s*(.+)/i);
      if (optionMatch) {
        currentQuestion.options.push(optionMatch[1]);
      }
    }
    // Check for answer
    else if (currentQuestion && line.toLowerCase().startsWith('answer:')) {
      let answerText = line.substring(7).trim();
      // Convert letter answer to actual option text
      if (answerText.match(/^[A-D]$/i)) {
        const letterIndex = answerText.toUpperCase().charCodeAt(0) - 65;
        if (currentQuestion.options[letterIndex]) {
          currentQuestion.correctAnswer = currentQuestion.options[letterIndex];
        }
      } else {
        currentQuestion.correctAnswer = answerText;
      }
    }
  }
  
  // Add last question
  if (currentQuestion && currentQuestion.question) {
    questions.push(currentQuestion);
  }
  
  // If no questions found, create a sample
  if (questions.length === 0) {
    questions.push({
      id: 'q1',
      type: 'single',
      question: 'Sample Question: What is 2+2?',
      options: ['1', '2', '3', '4'],
      correctAnswer: '4',
      subject: 'Mathematics',
      marks: 1,
      negativeMarks: 0
    });
  }
  
  return {
    title: 'Parsed Exam',
    description: 'Automatically generated from your input',
    duration: Math.ceil(questions.length * 1.5),
    totalQuestions: questions.length,
    totalMarks: questions.length,
    questions: questions
  };
}
