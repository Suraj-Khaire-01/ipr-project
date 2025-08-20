import { useState } from "react"
import { SignIn } from "@clerk/clerk-react"
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [activeTab, setActiveTab] = useState("client")
    const [adminData, setAdminData] = useState({ username: "", password: "" })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    // Temporary API handler (will move to /api later)
    const adminApiHandler = async (credentials) => {
        const envUsername = import.meta.env.VITE_ADMIN_USERNAME
        const envPassword = import.meta.env.VITE_ADMIN_PASSWORD

        if (
            credentials.username === envUsername &&
            credentials.password === envPassword
        ) {
            return { ok: true, message: "Login successful" }
        }
        return { ok: false, message: "Invalid username or password" }
    }

    const handleAdminLogin = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const result = await adminApiHandler(adminData)

            if (result.ok) {
                alert("✅ Admin logged in successfully")
                navigate("/admindashboard")
            } else {
                setError(result.message)
            }
        } catch (error) {
            console.error("Admin login error:", error)
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

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
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to your account</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
                    
                    {/* Enhanced Tabs */}
                    <div className="relative flex mb-8 p-1 bg-white/5 rounded-2xl border border-white/10">
                        <div 
                            className={`absolute top-1 bottom-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl transition-all duration-300 ease-out ${
                                activeTab === "client" ? "left-1 right-1/2 mr-0.5" : "right-1 left-1/2 ml-0.5"
                            }`}
                        />
                        <button
                            className={`relative flex-1 py-3 text-center font-semibold rounded-xl transition-all duration-300 ${
                                activeTab === "client"
                                    ? "text-white"
                                    : "text-slate-300 hover:text-white"
                            }`}
                            onClick={() => setActiveTab("client")}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Client
                            </span>
                        </button>
                        <button
                            className={`relative flex-1 py-3 text-center font-semibold rounded-xl transition-all duration-300 ${
                                activeTab === "admin"
                                    ? "text-white"
                                    : "text-slate-300 hover:text-white"
                            }`}
                            onClick={() => setActiveTab("admin")}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Admin
                            </span>
                        </button>
                    </div>

                    {/* Client Login - Centered */}
                    {activeTab === "client" && (
                        <div className="animate-fadeIn flex justify-center">
                            <div className="w-full max-w-md">
                                <SignIn
                                    appearance={{
                                        elements: {
                                            card: "bg-transparent shadow-none border-none w-full",
                                            rootBox: "w-full flex justify-center",
                                            formButtonPrimary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 w-full",
                                            formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-slate-300 rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-purple-400 w-full",
                                            formFieldLabel: "text-slate-200 font-medium",
                                            headerTitle: "text-white text-xl font-bold text-center",
                                            headerSubtitle: "text-slate-300 text-center",
                                            socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl backdrop-blur-sm w-full",
                                            dividerLine: "bg-white/20",
                                            dividerText: "text-slate-300",
                                            footerActionLink: "text-purple-400 hover:text-purple-300",
                                            identityPreviewText: "text-slate-300",
                                            formResendCodeLink: "text-purple-400 hover:text-purple-300",
                                            alertText: "text-red-300",
                                            formFieldSuccessText: "text-green-300",
                                            form: "w-full space-y-4",
                                            formField: "w-full",
                                            socialButtonsBlock: "w-full",
                                            main: "w-full"
                                        },
                                        variables: {
                                            colorPrimary: "#8b5cf6",
                                            colorText: "#ffffff",
                                            colorTextSecondary: "#cbd5e1",
                                            colorBackground: "transparent",
                                            colorInputBackground: "rgba(255,255,255,0.1)",
                                            colorInputText: "#ffffff"
                                        },
                                        layout: {
                                            logoPlacement: "inside"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Enhanced Admin Login */}
                    {activeTab === "admin" && (
                        <div className="animate-fadeIn">
                            <form onSubmit={handleAdminLogin} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={adminData.username}
                                                onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-slate-300 rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 outline-none"
                                                placeholder="Enter your username"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                value={adminData.password}
                                                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-slate-300 rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 outline-none"
                                                placeholder="Enter your password"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            {error}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 focus:ring-2 focus:ring-purple-400/50 outline-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Admin Login
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="text-center mt-6 text-slate-400">
                    <p className="text-sm">Secure login powered by advanced authentication</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-shake {
                    animation: shake 0.5s ease-out;
                }
            `}</style>
        </div>
    )
}