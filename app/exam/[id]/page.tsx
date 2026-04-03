'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  id: string;
  question: string;
  options: string[];
  marks: number;
  negativeMarks: number;
  subject?: string;
}

interface ExamData {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

interface Answer {
  questionId: string;
  answer: string;
  isMarkedForReview: boolean;
  isAnswered: boolean;
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  
  const [exam, setExam] = useState<ExamData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch exam data
  useEffect(() => {
    fetch(`/api/exam/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setExam(data.exam);
        setTimeLeft(data.exam.duration * 60);
        
        // Initialize answers array
        const initialAnswers = data.exam.questions.map((q: Question) => ({
          questionId: q.id,
          answer: '',
          isMarkedForReview: false,
          isAnswered: false
        }));
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading exam:', err);
        setLoading(false);
      });
  }, [params.id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || submitted || !exam) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, submitted, exam]);

  // Save answers to localStorage
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem(`exam_${params.id}_answers`, JSON.stringify(answers));
      localStorage.setItem(`exam_${params.id}_time`, timeLeft.toString());
    }
  }, [answers, timeLeft, params.id]);

  // Load saved answers from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`exam_${params.id}_answers`);
    const savedTime = localStorage.getItem(`exam_${params.id}_time`);
    
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    if (savedTime && !submitted) {
      setTimeLeft(parseInt(savedTime));
    }
  }, [params.id]);

  const handleAutoSubmit = async () => {
    if (submitted) return;
    alert('Time is up! Submitting your exam...');
    await handleSubmit();
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId 
        ? { ...a, answer, isAnswered: true }
        : a
    ));
  };

  const handleMarkForReview = (questionId: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId 
        ? { ...a, isMarkedForReview: !a.isMarkedForReview }
        : a
    ));
  };

  const handleClearAnswer = (questionId: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId 
        ? { ...a, answer: '', isAnswered: false }
        : a
    ));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    
    const confirmSubmit = confirm('Are you sure you want to submit? You cannot change answers after submission.');
    if (!confirmSubmit) return;
    
    setSubmitted(true);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const answersObj: Record<string, string> = {};
    answers.forEach(a => {
      if (a.answer) answersObj[a.questionId] = a.answer;
    });
    
    try {
      const response = await fetch(`/api/exam/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: answersObj, 
          userId: user.id,
          timeTaken: (exam!.duration * 60) - timeLeft
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        // Clear saved data
        localStorage.removeItem(`exam_${params.id}_answers`);
        localStorage.removeItem(`exam_${params.id}_time`);
        router.push(`/result/${data.resultId}`);
      } else {
        alert('Submission failed: ' + data.error);
        setSubmitted(false);
      }
    } catch (err) {
      alert('Error submitting exam');
      setSubmitted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index: number) => {
    const answer = answers[index];
    if (!answer) return 'not-visited';
    if (answer.isMarkedForReview && answer.answer) return 'marked-answered';
    if (answer.isMarkedForReview) return 'marked';
    if (answer.answer) return 'answered';
    return 'not-answered';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'marked': return 'bg-purple-500 text-white';
      case 'marked-answered': return 'bg-orange-500 text-white';
      case 'not-answered': return 'bg-red-500 text-white';
      default: return 'bg-gray-300 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Exam not found</h2>
          <button onClick={() => router.push('/dashboard')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const totalQuestions = exam.questions.length;
  const answeredCount = answers.filter(a => a.isAnswered).length;
  const markedCount = answers.filter(a => a.isMarkedForReview).length;
  const notAnsweredCount = totalQuestions - answeredCount;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Timer and Logo */}
      <div className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-blue-800">National Testing Agency</h1>
              <p className="text-xs text-gray-500">Excellence in Assessment</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Candidate: {JSON.parse(localStorage.getItem('user') || '{}').name || 'Candidate'}</p>
              <p className="text-xs text-gray-500">{exam.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="bg-red-600 text-white py-2 px-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-semibold">Remaining Time:</span>
          <span className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Question Area */}
          <div className="lg:w-3/4">
            {/* Question Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Question {currentIndex + 1} of {totalQuestions}</span>
              </div>
              
              <h2 className="text-lg font-medium mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentAnswer?.answer === option 
                          ? 'bg-blue-50 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={currentAnswer?.answer === option}
                        onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">
                        {String.fromCharCode(65 + idx)}. {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => handleMarkForReview(currentQuestion.id)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentAnswer?.isMarkedForReview
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                📌 {currentAnswer?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
              </button>
              
              <button
                onClick={() => handleClearAnswer(currentQuestion.id)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                🗑️ Clear
              </button>
              
              <button
                onClick={() => handleMarkForReview(currentQuestion.id)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ⭐ Save & Mark for Review
              </button>
              
              <button
                onClick={() => {
                  handleMarkForReview(currentQuestion.id);
                  if (currentIndex < totalQuestions - 1) {
                    setCurrentIndex(currentIndex + 1);
                  }
                }}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                📌 Mark for Review & Next
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentIndex(prev => prev - 1)}
                disabled={currentIndex === 0}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
              >
                &lt;&lt; BACK
              </button>
              
              {currentIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  ✓ SUBMIT
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  NEXT &gt;&gt;
                </button>
              )}
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-3 text-center">Question Palette</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                  const status = getQuestionStatus(idx);
                  const statusColor = getStatusColor(status);
                  const isCurrent = currentIndex === idx;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        statusColor
                      } ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="space-y-2 text-sm border-t pt-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Answered</span>
                  <span className="ml-auto font-semibold">{answeredCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Marked for Review</span>
                  <span className="ml-auto font-semibold">{markedCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Not Answered</span>
                  <span className="ml-auto font-semibold">{notAnsweredCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>Not Visited</span>
                  <span className="ml-auto font-semibold">{totalQuestions - (answeredCount + markedCount + notAnsweredCount)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  SUBMIT EXAM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white text-center py-3 mt-8 text-sm">
        © All Rights Reserved - National Testing Agency | Examify Platform
      </div>
    </div>
  );
}