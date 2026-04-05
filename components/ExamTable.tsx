export default function ExamTable() {

  const exams = [
    { name: "Math Test", students: 45, status: "Active" },
    { name: "Physics Mock", students: 30, status: "Completed" },
    { name: "Chemistry Quiz", students: 28, status: "Active" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Exam Management
      </h2>

      <table className="w-full">

        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="py-2 dark:text-gray-300">Exam</th>
            <th className="dark:text-gray-300">Students</th>
            <th className="dark:text-gray-300">Status</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam, i) => (
            <tr key={i} className="border-b dark:border-gray-700">

              <td className="py-3 dark:text-gray-200">{exam.name}</td>
              <td className="dark:text-gray-200">{exam.students}</td>

              <td>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm">
                  {exam.status}
                </span>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}