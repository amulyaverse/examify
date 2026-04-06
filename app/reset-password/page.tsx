"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } else {
        setError(data.error || "Reset failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600">Invalid reset link. Please request a new one.</p>
        <Link href="/auth" className="text-blue-600 mt-4 inline-block">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f0f4ff" }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl">🎓</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Examify</h1>
          </Link>
          <h2 className="text-xl font-semibold mt-4">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your new password</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/auth" className="text-blue-600 text-sm hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}