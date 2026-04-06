"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User, Edit2, Save, LogOut, X } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    joinDate: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // Load user data from session or localStorage
  useEffect(() => {
    const loadUserData = async () => {
      // First try to get from NextAuth session
      if (status === "authenticated" && session?.user) {
        setUser({
          id: session.user.id || "",
          name: session.user.name || "User",
          email: session.user.email || "",
          phone: "",
          joinDate: new Date().toLocaleDateString(),
        });
        setFormData({
          name: session.user.name || "User",
          phone: "",
        });
        setLoading(false);
        return;
      }
      
      // Fallback to localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({
            id: parsedUser.id || "",
            name: parsedUser.name || "User",
            email: parsedUser.email || "",
            phone: parsedUser.phone || "",
            joinDate: new Date().toLocaleDateString(),
          });
          setFormData({
            name: parsedUser.name || "User",
            phone: parsedUser.phone || "",
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      setLoading(false);
    };

    loadUserData();
  }, [session, status]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, phone: formData.phone }),
      });

      if (response.ok) {
        // Update localStorage
        const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...existingUser, name: formData.name, phone: formData.phone };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setUser(prev => ({ ...prev, name: formData.name, phone: formData.phone }));
        setEditMode(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong");
    }
    setSaving(false);
  };

  // ✅ FIXED: Complete logout function
  const handleLogout = async () => {
    try {
      // Clear NextAuth session
      await signOut({ redirect: false });
      
      // Clear localStorage
      localStorage.removeItem("user");
      
      // Clear sessionStorage
      sessionStorage.removeItem("sessionActive");
      sessionStorage.removeItem("loginTime");
      
      // Clear cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Redirect to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if error
      router.push("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <button
            onClick={() => router.push("/auth")}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-teal-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold text-teal-700">Examify</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-4">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
              <p className="text-teal-100 mt-1">Manage your profile</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
              <div className="bg-teal-600 p-6 text-white text-center">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold mx-auto mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-teal-100 text-sm mt-1">{user.email}</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full p-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-800 font-medium">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Email Address</label>
                  <p className="mt-1 text-gray-800">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Add your phone number"
                      className="mt-1 w-full p-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-800">{user.phone || "Not provided"}</p>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  {editMode ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                      >
                        <Save size={16} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setFormData({ name: user.name, phone: user.phone });
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full bg-teal-50 text-teal-700 py-2 rounded-lg hover:bg-teal-100 transition flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-teal-600">0</div>
                <div className="text-gray-500 text-sm">Exams Created</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-2xl font-bold text-teal-600">0</div>
                <div className="text-gray-500 text-sm">Exams Taken</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-teal-600">0%</div>
                <div className="text-gray-500 text-sm">Average Score</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/upload">
                  <div className="bg-teal-50 p-4 rounded-xl text-center hover:bg-teal-100 transition cursor-pointer">
                    <div className="text-3xl mb-2">📤</div>
                    <div className="font-semibold text-gray-800">Upload Exam</div>
                    <div className="text-sm text-gray-500">Create from question paper</div>
                  </div>
                </Link>
                <Link href="/my-exams">
                  <div className="bg-teal-50 p-4 rounded-xl text-center hover:bg-teal-100 transition cursor-pointer">
                    <div className="text-3xl mb-2">📋</div>
                    <div className="font-semibold text-gray-800">My Exams</div>
                    <div className="text-sm text-gray-500">View all your exams</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}