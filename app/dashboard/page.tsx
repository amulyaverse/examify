export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-8">Examify</h2>

        <ul className="space-y-4">
          <li className="hover:text-blue-500 cursor-pointer">Dashboard</li>
          <li className="hover:text-blue-500 cursor-pointer">Exams</li>
          <li className="hover:text-blue-500 cursor-pointer">Results</li>
          <li className="hover:text-blue-500 cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="bg-white px-4 py-2 rounded shadow">
            Welcome User
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Total Exams</h3>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Students</h3>
            <p className="text-3xl font-bold mt-2">240</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Completed</h3>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>

        </div>

      </div>
    </div>
  );
}