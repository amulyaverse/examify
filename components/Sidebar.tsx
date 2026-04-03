import { FaHome, FaFileAlt, FaUsers, FaCog } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6">

      <h2 className="text-xl font-bold mb-10 text-blue-600">
        ExamPortal
      </h2>

      <nav className="space-y-6 text-gray-700 dark:text-gray-200">

        <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500">
          <FaHome />
          Dashboard
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500">
          <FaFileAlt />
          Exams
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500">
          <FaUsers />
          Students
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500">
          <FaCog />
          Settings
        </div>

      </nav>
    </aside>
  );
}