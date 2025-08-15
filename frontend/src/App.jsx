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
import About from './Components/About'
import Insights from './Components/Insights'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Common Navbar */}
      <Navbar />

      {/* Page Routes */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          {/* Uncomment if needed */}
          <Route path="/about" element={<About />} />
          <Route path="/insights" element={<Insights />} />
          {/* <Route path="/admin-login" element={<AdminLogin />} /> */}
        </Routes>
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  )
}

export default App
