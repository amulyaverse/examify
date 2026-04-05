"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  // ✅ Sync with <html> class on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  // ✅ Toggle dark class on <html>
  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);

    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleDark}
      className="px-4 py-2 rounded-lg bg-gray-800 dark:bg-white text-white dark:text-gray-900 font-medium transition-colors"
    >
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}