"use client"

import { useState } from "react"

export default function ResultPage() {
  const questions = [
    {
      question: "2 + 2 = ?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 3,
      subject: "Math",
      difficulty: "Easy",
      time: 20,
    },
    {
      question: "Capital of India?",
      options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
      correctAnswer: 1,
      subject: "GK",
      difficulty: "Easy",
      time: 10,
    },
    {
      question: "5 * 3 = ?",
      options: ["15", "10", "20", "25"],
      correctAnswer: 0,
      subject: "Math",
      difficulty: "Medium",
      time: 40,
    },
  ]

  const answers = [2, 1, -1] // -1 = skipped
  const timeTaken = [25, 8, 50]

  const correct = answers.filter((a, i) => a === questions[i].correctAnswer).length
  const attempted = answers.filter(a => a !== -1).length
  const wrong = attempted - correct
  const accuracy = ((correct / attempted) * 100 || 0).toFixed(1)

  const negativeMarks = wrong * 1 // assume -1 marking

  const [selectedQ, setSelectedQ] = useState(0)

  // SUBJECT ANALYSIS
  const subjects: any = {}
  const difficultyStats: any = { Easy: { total: 0, correct: 0 }, Medium: { total: 0, correct: 0 }, Hard: { total: 0, correct: 0 } }

  let slowQuestions = 0

  questions.forEach((q, i) => {
    // subject
    if (!subjects[q.subject]) {
      subjects[q.subject] = { total: 0, correct: 0 }
    }
    subjects[q.subject].total++
    if (answers[i] === q.correctAnswer) subjects[q.subject].correct++

    // difficulty
    difficultyStats[q.difficulty].total++
    if (answers[i] === q.correctAnswer) difficultyStats[q.difficulty].correct++

    // time analysis
    if (timeTaken[i] > q.time) slowQuestions++
  })

  // mistake classification (dummy logic)
  const sillyMistakes = wrong > 0 ? 1 : 0
  const conceptualMistakes = wrong > 1 ? 1 : 0
  const guessMistakes = wrong > 2 ? 1 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-teal-700">Advanced Test Analysis</h1>

      {/* PERFORMANCE */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card title="Score" value={`${correct}/${questions.length}`} />
        <Card title="Accuracy" value={`${accuracy}%`} />
        <Card title="Attempted" value={attempted} />
        <Card title="Wrong" value={wrong} />
        <Card title="Negative Marks" value={`-${negativeMarks}`} />
      </div>

      {/* TIME ANALYSIS */}
      <Section title="⏱ Time Analysis">
        <p>Slow Questions: {slowQuestions}</p>
        <p>Avg Time: {(timeTaken.reduce((a, b) => a + b, 0) / questions.length).toFixed(1)} sec</p>
      </Section>

      {/* SUBJECT PERFORMANCE */}
      <Section title="📘 Subject Performance">
        {Object.keys(subjects).map(sub => (
          <Bar key={sub} label={sub} value={(subjects[sub].correct / subjects[sub].total) * 100} />
        ))}
      </Section>

      {/* DIFFICULTY ANALYSIS */}
      <Section title="🎯 Difficulty Analysis">
        {Object.keys(difficultyStats).map(d => (
          <Bar key={d} label={d} value={(difficultyStats[d].correct / difficultyStats[d].total) * 100} />
        ))}
      </Section>

      {/* MISTAKE ANALYSIS */}
      <Section title="⚠️ Mistake Breakdown">
        <p>Conceptual Mistakes: {conceptualMistakes}</p>
        <p>Silly Mistakes: {sillyMistakes}</p>
        <p>Guess Errors: {guessMistakes}</p>
      </Section>

      {/* STRATEGY */}
      <Section title="🧠 Strategy Insights">
        <p>• You spent too much time on {slowQuestions} questions</p>
        <p>• Improve accuracy to reduce negative marking</p>
        <p>• Focus more on weak subjects</p>
      </Section>

    </div>
  )
}

// 🔹 reusable components

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-lg font-bold text-teal-700">{value}</h2>
    </div>
  )
}

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="font-semibold text-teal-700 mb-2">{title}</h2>
      {children}
    </div>
  )
}

function Bar({ label, value }: any) {
  return (
    <div className="mb-2">
      <p className="text-sm">{label}</p>
      <div className="w-full bg-gray-200 rounded h-3">
        <div className="bg-teal-500 h-3 rounded" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}