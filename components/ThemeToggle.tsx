"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="px-4 py-2 bg-background text-foreground border border-border hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}