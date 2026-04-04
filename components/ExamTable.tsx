export default function ExamTable() {

  const exams = [
    { name: "Math Test", students: 45, status: "Active" },
    { name: "Physics Mock", students: 30, status: "Completed" },
    { name: "Chemistry Quiz", students: 28, status: "Active" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Exam Management
      </h2>

      <table className="w-full">

        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Exam</th>
            <th>Students</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam, i) => (
            <tr key={i} className="border-b">

              <td className="py-3">{exam.name}</td>
              <td>{exam.students}</td>

              <td>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
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