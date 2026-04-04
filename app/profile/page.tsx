"use client"

import { useState } from "react"

export default function ProfilePage() {
  const [edit, setEdit] = useState(false)

  const [user, setUser] = useState({
    name: "Ganesha Pandey",
    email: "ganesha@gmail.com",
    phone: "9876543210",
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black">

      {/* CARD */}
      <div className="bg-gray-100 w-full max-w-md rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-teal-700">
            Profile
          </h1>
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center mt-6">
          <div className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name.charAt(0)}
          </div>

          <h2 className="mt-4 text-2xl font-semibold">
            {user.name}
          </h2>

          <p className="text-gray-500 text-sm">
            {user.email}
          </p>
        </div>

        {/* DETAILS */}
        <div className="mt-6 space-y-4">

          <div>
            <p className="text-sm text-gray-500">Name</p>
            <input
              disabled={!edit}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full p-2 border rounded-lg bg-white text-black"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <input
              disabled={!edit}
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full p-2 border rounded-lg bg-white text-black"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <input
              disabled
              value={user.email}
              className="w-full p-2 border rounded-lg bg-gray-200"
            />
          </div>

        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">

          <button
            onClick={() => setEdit(!edit)}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg transition"
          >
            {edit ? "Save" : "Edit"}
          </button>

          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition">
            Logout
          </button>

        </div>

      </div>
    </div>
  )
}