'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          🎓 Examify
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Convert Any Question Paper to Online Exam
        </p>
        <div className="space-x-4">
          <a href="/signup">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              Get Started
            </button>
          </a>
          <a href="/upload">
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg">
              Upload Paper
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
