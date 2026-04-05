"use client";

import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function CBTPrototype() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const [testComplete, setTestComplete] = useState(false);
  const [score, setScore] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return setErrorMsg("Please select a PDF first.");

    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Server error. Please try again.");
        return;
      }

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setErrorMsg("No questions found. Make sure it's a valid MCQ question paper PDF.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };

  const submitTest = () => {
    const unanswered = questions.length - Object.keys(selectedAnswers).length;
    if (unanswered > 0) {
      const confirmed = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      );
      if (!confirmed) return;
    }

    let finalScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        finalScore += 1;
      }
    });
    setScore(finalScore);
    setTestComplete(true);
  };

  // ── Phase 1: Upload Screen ──────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-black">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2">Upload Question Paper</h1>
          <p className="text-sm text-gray-500 mb-6">Upload a PDF with multiple-choice questions to generate a CBT.</p>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {file && (
            <p className="text-xs text-gray-400 mb-3 truncate">
              Selected: {file.name}
            </p>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                AI is processing PDF...
              </span>
            ) : "Generate CBT"}
          </button>
        </div>
      </div>
    );
  }

  // ── Phase 3: Results Screen ─────────────────────────────────────────────────
  if (testComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-black">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-5xl mb-4">{percentage >= 70 ? "🎉" : percentage >= 40 ? "📝" : "💪"}</div>
          <h1 className="text-3xl font-bold mb-2">Test Complete!</h1>
          <p className="text-xl mb-2">
            Score: <span className="font-bold text-blue-600">{score}</span> / {questions.length}
          </p>
          <p className="text-gray-500 mb-6">{percentage}% correct</p>

          {/* Answer Review */}
          <div className="text-left space-y-4 mb-6 max-h-64 overflow-y-auto border rounded-md p-4">
            {questions.map((q, i) => {
              const userAns = selectedAnswers[i];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={i} className="text-sm">
                  <p className="font-medium text-gray-700">Q{i + 1}. {q.question}</p>
                  <p className={`mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {userAns || "Not answered"} {isCorrect ? "✓" : "✗"}
                  </p>
                  {!isCorrect && (
                    <p className="text-green-700">Correct: {q.correctAnswer}</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 font-semibold"
          >
            Start New Test
          </button>
        </div>
      </div>
    );
  }

  // ── Phase 2: Active Test Screen ─────────────────────────────────────────────
  const currentQ = questions[currentIndex];
  const totalAnswered = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50 text-black">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">
            Question {currentIndex + 1} <span className="text-gray-400">of {questions.length}</span>
          </h2>
          <span className="text-sm text-gray-500">{totalAnswered}/{questions.length} answered</span>
        </div>

        {/* Question */}
        <p className="text-lg mb-6 leading-relaxed">{currentQ.question}</p>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              className={`w-full text-left p-4 rounded-md border transition-colors ${
                selectedAnswers[currentIndex] === option
                  ? "bg-blue-100 border-blue-500 font-medium"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={submitTest}
              className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>

        {/* Question Navigator Dots */}
        <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                i === currentIndex
                  ? "bg-blue-600 text-white"
                  : selectedAnswers[i]
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}