import { Routes, Route, useLocation } from 'react-router-dom'
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
import PatentGuidePage from './Guides/PatentGuidePage'
import CopyrightGuidePage from './Guides/CopyrightGuidePage'
import CostEstimation from './Pages/CostEstimation'


function App() {
  const location = useLocation()

  // Hide Navbar & Footer on these routes
  const hideLayoutRoutes = ["/admin-dashboard", "/admindashboard"]
  
  // Hide only Footer on these routes
  const hideFooterRoutes = ["/admin-dashboard", "/admindashboard", "/login"]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Show Navbar only if not in hide list */}
      {!hideLayoutRoutes.includes(location.pathname) && <Navbar />}
      

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
          <Route path="/about" element={<About />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/patentservice" element={<PatentServicesPage />} />
          <Route path="/consulation" element={<Consulation />} />
          <Route path="/requirements" element={<FilingRequirementsPage />} />
          <Route path="/patent" element={<PatentFilingProcess />} />
          <Route path="/copyright" element={<CopyrightFillingProcess />} />
          <Route path="/trademarkservices" element={<TrademarkServices />} />
          <Route path="/copyrightservices" element={<CopyrightServices />} />
          <Route path="/industrialdesignservices" element={<IndustrialDesignServices />} />
          <Route path="/iplitigationpage" element={<IPLitigationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/patentGuide" element={<PatentGuidePage/>}/>
          <Route path="/copyrightGuide" element={<CopyrightGuidePage/>}/>
          <Route path="/cost-estimation" element={<CostEstimation/>}/>


        </Routes>
      </main>

      {/* Show Footer only if not in hide list */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  )
}

export default App
