import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Home from './Pages/Home'
// import SignIn from './pages/SignIn'
// import SignUp from './pages/SignUp'
import Dashboard from './Pages/Dashboard'
// import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './Pages/AdminDashboard'
import Contact from './Pages/Contact'
import ProtectedRoute from './Components/ProtectRoute'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/sign-in" element={<SignIn />} /> */}
          {/* <Route path="/sign-up" element={<SignUp />} /> */}
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/admin-login" element={<AdminLogin />} /> */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
