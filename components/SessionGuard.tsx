"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      try {
        const userData = localStorage.getItem("user");
        const sessionActive = sessionStorage.getItem("sessionActive");
        const hasToken = document.cookie.includes("token=");
        
        // If user data exists but no session or token, force logout
        if (userData && (!sessionActive || !hasToken)) {
          console.log("Session expired - logging out");
          localStorage.removeItem("user");
          sessionStorage.removeItem("sessionActive");
          sessionStorage.removeItem("loginTime");
          router.push("/auth");
          return false;
        }
        
        // If no user data, redirect to auth
        if (!userData) {
          router.push("/auth");
          return false;
        }
        
        return true;
      } catch (error) {
        console.error("Session check error:", error);
        return false;
      }
    };
    
    // Initial check
    checkSession();
    setIsChecking(false);
    
    // Check session every 5 seconds
    const interval = setInterval(checkSession, 5000);
    
    return () => clearInterval(interval);
  }, [router]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}