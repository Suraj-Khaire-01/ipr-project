import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import AdminDashboard from './Pages/AdminDashboard'
import Contact from './Pages/Contact'
import ProtectedRoute from './Components/ProtectRoute'
import About from './Components/About'
import Insights from './Components/Insights'
import PatentServicesPage from './Services/PatentServicesPage'
import Consulation from './Services/Consultation'
import FilingRequirementsPage from './Services/FilingRequirementsPage'
import PatentFilingProcess from './Services/PatentFilingProcess'
import CopyrightFillingProcess from './Services/CopyrightFillingProcess'
import TrademarkServices from './Services/TrademarkServices'
import CopyrightServices from './Services/CopyrightServices'
import IndustrialDesignServices from './Services/IndustrialDesignServices'
import IPLitigationPage from './Services/IPLitigationPage'
import Login from './login/login'

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
          <Route path="/patentservice" element={<PatentServicesPage />}/>
          <Route path="/consulation" element={<Consulation />}/>
          <Route path="/requirements" element={<FilingRequirementsPage />}/>
          <Route path="/patent" element={<PatentFilingProcess />}/>
          <Route path="/copyright" element={<CopyrightFillingProcess />}/>
          <Route path="/trademarkservices" element={<TrademarkServices />}/>
          <Route path="/copyrightservices" element={<CopyrightServices />}/>
          <Route path="/industrialdesignservices" element={<IndustrialDesignServices />}/>
          <Route path="/iplitigationpage" element={<IPLitigationPage />}/>
          <Route path="/login" element={<Login />}/>
          {/* <Route path="/admin-login" element={<AdminLogin />} /> */}
        </Routes>
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  )
}

export default App
