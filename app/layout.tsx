import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./providers/NextAuthProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Examify - AI-Powered Exam Platform",
  description: "Convert any question paper into an interactive online exam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      {/* Dark mode script */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme");
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>

      <body className={`${inter.variable} antialiased`}>
        {/* ✅ Wrap with NextAuth Provider for Google Sign In */}
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}