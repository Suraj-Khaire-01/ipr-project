import { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [activeTab, setActiveTab] = useState("client");
  const [adminData, setAdminData] = useState({
    username: "",
    password: "",
    otpSent: false,
    otp: "",
    enteredOtp: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Admin Login Handler with OTP
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    try {
      if (
        adminData.username === envUsername &&
        adminData.password === envPassword
      ) {
        // ✅ Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setAdminData({ ...adminData, otp, otpSent: true });

        // ✅ Send OTP via EmailJS
        // ✅ Send OTP Email via EmailJS
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
            template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            user_id: import.meta.env.VITE_EMAILJS_USER_ID,
            template_params: {
              to_email: import.meta.env.VITE_ADMIN_USERNAME,
              subject: "Your Admin Login OTP",
              message: `Your One-Time Password (OTP) is ${otp}. It is valid for 5 minutes.`,
            },
          }),
        });


        alert("✅ OTP sent to your admin email");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("OTP send error:", error);
      setError("Something went wrong while sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ OTP Verification Handler
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");

    if (adminData.enteredOtp === adminData.otp) {
      localStorage.setItem("adminSession", "true");
      localStorage.setItem("adminToken", "secure-admin-auth");
      alert("✅ Admin verified successfully");
      navigate("/admin-dashboard");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  // ✅ Admin Logout Function
  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminSession");
    alert("✅ Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-xl mt-8">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your account</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
          {/* Tabs */}
          <div className="relative flex mb-8 p-1 bg-white/5 rounded-2xl border border-white/10">
            <div
              className={`absolute top-1 bottom-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl transition-all duration-300 ease-out ${activeTab === "client"
                  ? "left-1 right-1/2 mr-0.5"
                  : "right-1 left-1/2 ml-0.5"
                }`}
            />
            <button
              className={`relative flex-1 py-3 text-center font-semibold rounded-xl transition-all duration-300 ${activeTab === "client"
                  ? "text-white"
                  : "text-slate-300 hover:text-white"
                }`}
              onClick={() => setActiveTab("client")}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Client
              </span>
            </button>
            <button
              className={`relative flex-1 py-3 text-center font-semibold rounded-xl transition-all duration-300 ${activeTab === "admin"
                  ? "text-white"
                  : "text-slate-300 hover:text-white"
                }`}
              onClick={() => setActiveTab("admin")}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Admin
              </span>
            </button>
          </div>

          {/* ✅ Client Login (Unchanged) */}
          {activeTab === "client" && (
            <div className="animate-fadeIn flex justify-center">
              <div className="w-full max-w-md">
                <SignIn
                  appearance={{
                    elements: {
                      card: "bg-transparent shadow-none border-none w-full",
                      rootBox: "w-full flex justify-center",
                      formButtonPrimary:
                        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 w-full",
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* ✅ Admin Login with OTP */}
          {activeTab === "admin" && (
            <div className="animate-fadeIn">
              {!adminData.otpSent ? (
                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={adminData.username}
                        onChange={(e) =>
                          setAdminData({
                            ...adminData,
                            username: e.target.value,
                          })
                        }
                        className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-purple-400 outline-none"
                        placeholder="Enter your username"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={adminData.password}
                        onChange={(e) =>
                          setAdminData({
                            ...adminData,
                            password: e.target.value,
                          })
                        }
                        className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-purple-400 outline-none"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                  >
                    {isLoading ? "Sending OTP..." : "Login & Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Enter OTP sent to your email
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      value={adminData.enteredOtp}
                      onChange={(e) =>
                        setAdminData({
                          ...adminData,
                          enteredOtp: e.target.value,
                        })
                      }
                      className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-purple-400 outline-none"
                      placeholder="6-digit OTP"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                  >
                    Verify OTP
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-slate-400">
          <p className="text-sm">
            Secure login powered by advanced authentication
          </p>
        </div>
      </div>
    </div>
  );
}
