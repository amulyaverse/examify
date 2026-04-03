"use client";

import Sidebar from "@/components/Sidebar";
import ChartCard from "@/components/ChartCard";
import ExamTable from "@/components/ExamTable";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

      <Sidebar />

      <main className="flex-1 p-8 text-gray-800 dark:text-white">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Exam Dashboard</h1>
          <DarkModeToggle />
        </div>

        <ChartCard />

        <ExamTable />

      </main>
    </div>
  );
}