"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    
    setLoading(false);
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
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
        setTab("signin");
        setError("");
        alert("Account created! Please sign in.");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#f0f4ff" }}
    >
      <div
        className="flex w-full max-w-4xl rounded-3xl overflow-hidden"
        style={{
          background: "#ffffff",
          boxShadow: "0 30px 80px rgba(56,107,255,0.13)",
          minHeight: "560px",
        }}
      >
        {/* Left: Form Panel */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-10 py-12">
          {/* Logo with Link */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span style={{ fontSize: 26 }}>🎓</span>
            <span
              className="font-black tracking-tight"
              style={{ fontSize: 22, color: "#1a1a2e", fontFamily: "'Poppins', sans-serif" }}
            >
              Examify
            </span>
          </Link>

          {/* Title */}
          <h1
            className="font-bold mb-1"
            style={{ fontSize: 28, color: "#1a1a2e", fontFamily: "'Poppins', sans-serif" }}
          >
            {tab === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{ fontSize: 13, color: "#8a94a6", marginBottom: 28 }}>
            {tab === "signin"
              ? "Enter your credentials to continue"
              : "Create your free account today"}
          </p>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: "10px",
                borderRadius: 8,
                fontSize: 12,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* Tabs */}
          <div
            className="flex mb-8 relative"
            style={{
              background: "#f0f4ff",
              borderRadius: 12,
              padding: 4,
              gap: 4,
            }}
          >
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className="flex-1 py-2 text-sm font-semibold transition-all duration-300 relative z-10"
                style={{
                  borderRadius: 9,
                  fontFamily: "'Poppins', sans-serif",
                  background: tab === t ? "#386bff" : "transparent",
                  color: tab === t ? "#fff" : "#8a94a6",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Sign In Form */}
          <div
            style={{
              transition: "opacity 0.35s ease, transform 0.35s ease",
              opacity: tab === "signin" ? 1 : 0,
              transform: tab === "signin" ? "translateX(0)" : "translateX(-32px)",
              pointerEvents: tab === "signin" ? "auto" : "none",
              position: tab === "signin" ? "relative" : "absolute",
              top: 0,
              left: 0,
              width: "100%",
            }}
          >
            <form onSubmit={handleSignIn}>
              <InputField icon="✉️" name="email" type="email" placeholder="Email address" />
              <InputField icon="🔒" name="password" type="password" placeholder="Password" />

              <div className="flex justify-end mb-6">
                <a
                  href="#"
                  style={{ fontSize: 12, color: "#386bff", textDecoration: "none" }}
                >
                  Forgot password?
                </a>
              </div>

              <PrimaryButton disabled={loading}>
                {loading ? "Signing in..." : "Continue"}
              </PrimaryButton>
            </form>

            <Divider />
            <GoogleButton />
          </div>

          {/* Sign Up Form */}
          <div
            style={{
              transition: "opacity 0.35s ease, transform 0.35s ease",
              opacity: tab === "signup" ? 1 : 0,
              transform: tab === "signup" ? "translateX(0)" : "translateX(32px)",
              pointerEvents: tab === "signup" ? "auto" : "none",
              position: tab === "signup" ? "relative" : "absolute",
              top: 0,
              left: 0,
              width: "100%",
            }}
          >
            <form onSubmit={handleSignUp}>
              <InputField icon="👤" name="name" type="text" placeholder="Full name" />
              <InputField icon="✉️" name="email" type="email" placeholder="Email address" />
              <InputField icon="🔒" name="password" type="password" placeholder="Password (min 6 chars)" />

              <div style={{ marginBottom: 24 }} />

              <PrimaryButton disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </PrimaryButton>
            </form>

            <Divider />
            <GoogleButton label="Sign up with Google" />
          </div>

          {/* Bottom link */}
          <p style={{ textAlign: "center", fontSize: 12, color: "#8a94a6", marginTop: 20 }}>
            {tab === "signin" ? (
              <>
                New here?{" "}
                <button
                  onClick={() => setTab("signup")}
                  style={{
                    color: "#386bff",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setTab("signin")}
                  style={{
                    color: "#386bff",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Right: Image Panel */}
        <div
          className="hidden md:block w-1/2 relative overflow-hidden"
          style={{ borderRadius: "0 24px 24px 0" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #386bff 0%, #6c5ce7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "40px",
              color: "white",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎓</div>
            <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12 }}>
              Examify
            </h2>
            <p style={{ fontSize: 14, opacity: 0.9 }}>
              Convert any question paper into an interactive online exam
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}

// Updated InputField with name attribute
function InputField({
  icon,
  name,
  type,
  placeholder,
}: {
  icon: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#f7f9ff",
        border: "1.5px solid #e8eeff",
        borderRadius: 12,
        padding: "11px 14px",
        marginBottom: 12,
        transition: "border-color 0.2s",
      }}
    >
      <span style={{ fontSize: 15, lineHeight: 1 }}>{icon}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 13,
          color: "#1a1a2e",
          width: "100%",
          fontFamily: "'Poppins', sans-serif",
        }}
      />
    </div>
  );
}

function PrimaryButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        width: "100%",
        padding: "13px",
        background: disabled ? "#a0a0a0" : "#386bff",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Poppins', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s, transform 0.1s",
        letterSpacing: 0.3,
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "#2655e0";
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "#386bff";
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#e8eeff" }} />
      <span style={{ fontSize: 12, color: "#b0b8cc", fontFamily: "'Poppins', sans-serif" }}>
        Or continue with
      </span>
      <div style={{ flex: 1, height: 1, background: "#e8eeff" }} />
    </div>
  );
}

function GoogleButton({ label = "Sign in with Google" }: { label?: string }) {
  return (
    <button
      type="button"
      style={{
        width: "100%",
        padding: "11px",
        background: "#fff",
        border: "1.5px solid #e8eeff",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        color: "#1a1a2e",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      {label}
    </button>
  );
}