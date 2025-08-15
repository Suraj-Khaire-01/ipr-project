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
    {/* direct Home  */}
      <Home />

    </div>
  )
}

export default App
