import { useState } from "react"
import { SignIn } from "@clerk/clerk-react"

export default function Login() {
  const [activeTab, setActiveTab] = useState("client")
  const [adminData, setAdminData] = useState({ username: "", password: "" })

  const handleAdminLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      })

      const data = await res.json()
      if (res.ok) {
        alert("✅ Admin logged in successfully")
        // Example: redirect to admin dashboard
        window.location.href = "/admin-dashboard"
      } else {
        alert("❌ " + data.message)
      }
    } catch (error) {
      console.error("Admin login error:", error)
      alert("Something went wrong")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "client"
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("client")}
          >
            Client Login
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "admin"
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Login
          </button>
        </div>

        {/* Client Login */}
        {activeTab === "client" && (
          <div className="space-y-4">
            <SignIn
              appearance={{
                elements: {
                  card: "shadow-none border rounded-xl",
                  formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white",
                },
              }}
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />
          </div>
        )}

        {/* Admin Login */}
        {activeTab === "admin" && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={adminData.username}
                onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={adminData.password}
                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition"
            >
              Admin Login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
