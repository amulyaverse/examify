"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function ChartCard() {

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Exams Taken",
        data: [12, 19, 8, 15, 22],
        backgroundColor: "#3b82f6",
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">

      <h2 className="text-lg font-semibold mb-4">
        Monthly Exam Activity
      </h2>

      <Bar data={data} />

    </div>
  );
}