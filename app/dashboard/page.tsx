"use client";

import Sidebar from "@/components/Sidebar";
import ChartCard from "@/components/ChartCard";
import ExamTable from "@/components/ExamTable";
import ThemeToggle from "@/components/ThemeToggle";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 text-gray-800 dark:text-gray-100">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exam Dashboard
          </h1>

          <ThemeToggle />
        </div>

        {/* Chart */}
        <div className="mb-8">
          <ChartCard />
        </div>

        {/* Exam Table */}
        <ExamTable />

      </main>

    </div>
  );
}