"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    
    if (!userData) {
      router.push("/auth");
      return;
    }
    
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">🎓 Examify</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
          <p className="text-blue-100">Ready to create or take an exam today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-3">📊</div>
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-gray-500">Exams Created</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-3">📝</div>
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-gray-500">Exams Taken</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-2xl font-bold text-gray-800">0%</div>
            <div className="text-gray-500">Average Score</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/upload">
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="text-5xl mb-4">📤</div>
              <h3 className="text-xl font-bold mb-2">Upload Exam</h3>
              <p className="text-gray-500">Create a new exam from a question paper</p>
            </div>
          </Link>
          
          <Link href="/my-exams">
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">My Exams</h3>
              <p className="text-gray-500">View and manage your existing exams</p>
            </div>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Name:</span> {user?.name}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Member since:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}