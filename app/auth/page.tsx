"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Remember email from signup
  const [rememberedEmail, setRememberedEmail] = useState("");

  // Check if already logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = document.cookie.includes("token=");
    
    if (userData && token) {
      router.push("/profile");
    }
    
    // Get remembered email from localStorage
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setRememberedEmail(savedEmail);
    }
  }, [router]);

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("sessionActive", "true");
        sessionStorage.setItem("loginTime", new Date().toISOString());
        router.push("/profile");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    
    setLoading(false);
  };

  // Sign Up Handler with auto-fill
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save email for auto-fill on signin
        localStorage.setItem("rememberedEmail", email);
        
        setSuccess("Account created! Redirecting to profile...");
        
        // Auto login - store user data
        localStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("sessionActive", "true");
        sessionStorage.setItem("loginTime", new Date().toISOString());
        
        // Redirect to profile after 1 second
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    
    setLoading(false);
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess("Password reset email sent! Check your inbox.");
        setTimeout(() => setTab("signin"), 3000);
      } else {
        setError(data.error || "Email not found");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    
    setLoading(false);
  };

  // Google Sign In
  const handleGoogleSignIn = () => {
    // Redirect to Google OAuth (implement with NextAuth or custom)
    window.location.href = "/api/auth/google/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f0f4ff" }}>
      <div className="flex w-full max-w-4xl rounded-3xl overflow-hidden" style={{ background: "#ffffff", boxShadow: "0 30px 80px rgba(56,107,255,0.13)", minHeight: "560px" }}>
        
        {/* Left Panel */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-10 py-12">
          
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span style={{ fontSize: 26 }}>🎓</span>
            <span className="font-black tracking-tight" style={{ fontSize: 22, color: "#1a1a2e" }}>Examify</span>
          </Link>

          {tab !== "forgot" ? (
            <>
              <h1 className="font-bold mb-1" style={{ fontSize: 28, color: "#1a1a2e" }}>
                {tab === "signin" ? "Welcome Back" : "Create Account"}
              </h1>
              <p style={{ fontSize: 13, color: "#8a94a6", marginBottom: 28 }}>
                {tab === "signin" ? "Enter your credentials to continue" : "Create your free account today"}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-bold mb-1" style={{ fontSize: 28, color: "#1a1a2e" }}>
                Reset Password
              </h1>
              <p style={{ fontSize: 13, color: "#8a94a6", marginBottom: 28 }}>
                Enter your email to receive reset link
              </p>
            </>
          )}

          {error && (
            <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: 8, fontSize: 12, marginBottom: 16, textAlign: "center" }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{ background: "#d1fae5", color: "#059669", padding: "10px", borderRadius: 8, fontSize: 12, marginBottom: 16, textAlign: "center" }}>
              ✅ {success}
            </div>
          )}

          {/* Sign In Form */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f7f9ff", border: "1.5px solid #e8eeff", borderRadius: 12, padding: "11px 14px", marginBottom: 12 }}>
                <span>✉️</span>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email address" 
                  defaultValue={rememberedEmail}
                  required 
                  style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, width: "100%" }} 
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f7f9ff", border: "1.5px solid #e8eeff", borderRadius: 12, padding: "11px 14px", marginBottom: 12 }}>
                <span>🔒</span>
                <input name="password" type="password" placeholder="Password" required style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, width: "100%" }} />
              </div>
              <div className="flex justify-between items-center mb-6">
                <button
                  type="button"
                  onClick={() => setTab("forgot")}
                  style={{ fontSize: 12, color: "#386bff", textDecoration: "none" }}
                >
                  Forgot password?
                </button>
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "#a0a0a0" : "#386bff", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === "signup" && (
            <form onSubmit={handleSignUp}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f7f9ff", border: "1.5px solid #e8eeff", borderRadius: 12, padding: "11px 14px", marginBottom: 12 }}>
                <span>👤</span>
                <input name="name" type="text" placeholder="Full name" required style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, width: "100%" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f7f9ff", border: "1.5px solid #e8eeff", borderRadius: 12, padding: "11px 14px", marginBottom: 12 }}>
                <span>✉️</span>
                <input name="email" type="email" placeholder="Email address" required style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, width: "100%" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f7f9ff", border: "1.5px solid #e8eeff", borderRadius: 12, padding: "11px 14px", marginBottom: 12 }}>
                <span>🔒</span>
                <input name="password" type="password" placeholder="Password (min 6 chars)" required minLength={6} style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, width: "100%" }} />
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "#a0a0a0" : "#386bff", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {tab === "forgot" && (
            <form onSubmit={handleForgotPassword}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f7f9ff", border: "1.5px solid #e8eeff", borderRadius: 12, padding: "11px 14px", marginBottom: 12 }}>
                <span>✉️</span>
                <input name="email" type="email" placeholder="Email address" required style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, width: "100%" }} />
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "#a0a0a0" : "#386bff", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => setTab("signin")}
                style={{ width: "100%", marginTop: 12, padding: "13px", background: "transparent", color: "#386bff", border: "1.5px solid #386bff", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* Divider */}
          {tab !== "forgot" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#e8eeff" }} />
                <span style={{ fontSize: 12, color: "#b0b8cc" }}>Or continue with</span>
                <div style={{ flex: 1, height: 1, background: "#e8eeff" }} />
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                style={{ width: "100%", padding: "11px", background: "#fff", border: "1.5px solid #e8eeff", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                {tab === "signin" ? "Sign in with Google" : "Sign up with Google"}
              </button>
            </>
          )}

          {/* Switch between Sign In and Sign Up */}
          {tab !== "forgot" && (
            <p style={{ textAlign: "center", fontSize: 12, color: "#8a94a6", marginTop: 20 }}>
              {tab === "signin" ? (
                <>New here? <button onClick={() => setTab("signup")} style={{ color: "#386bff", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Create an account</button></>
              ) : (
                <>Already have an account? <button onClick={() => setTab("signin")} style={{ color: "#386bff", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Sign in</button></>
              )}
            </p>
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden md:block w-1/2" style={{ background: "linear-gradient(135deg, #386bff 0%, #6c5ce7 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px", color: "white", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎓</div>
          <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12 }}>Examify</h2>
          <p style={{ fontSize: 14, opacity: 0.9 }}>Convert any question paper into an interactive online exam</p>
        </div>
      </div>
    </div>
  );
}