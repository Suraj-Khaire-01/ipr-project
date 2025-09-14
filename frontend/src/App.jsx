import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Home from './Pages/Home'
// import Dashboard from './Pages/Dashboard'
import Dashboard from './UserDashboard'
import AdminDashboard from './Pages/AdminDashboard'
import Contact from './Pages/Contact'
import ProtectRoute from './Components/ProtectRoute'
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
import { ThemeProvider } from './Components/ThemeProvider'  // ✅ path updated

function App() {
  const location = useLocation()
  const hideLayoutRoutes = ["/admin-dashboard", "/admindashboard"]
  const hideFooterRoutes = ["/admin-dashboard", "/admindashboard", "/login"]

  return (
    <ThemeProvider defaultTheme="light"> {/* ✅ wrap everything with ThemeProvider */}
      <div className="flex flex-col min-h-screen bg-gray-50 hide-scrollbar overflow-auto h-screen">
        {!hideLayoutRoutes.includes(location.pathname) && <Navbar />}

        <main className="flex-grow">
          {/* ✅ Force re-render of routes when path changes */}
          <Routes key={location.pathname}>
            {/* PUBLIC ROUTE */}
            <Route path="/" element={<Home />} />

            {/* 🔒 PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={<ProtectRoute><Dashboard /></ProtectRoute>}
            />
            <Route
              path="/admin-dashboard"
              element={<ProtectRoute><AdminDashboard /></ProtectRoute>}
            />

            {/* All Services Protected */}
            <Route
              path="/patentservice"
              element={<ProtectRoute><PatentServicesPage /></ProtectRoute>}
            />
            <Route
              path="/consulation"
              element={<ProtectRoute><Consulation /></ProtectRoute>}
            />
            <Route
              path="/requirements"
              element={<FilingRequirementsPage />}
            />
            <Route
              path="/patent"
              element={<ProtectRoute><PatentFilingProcess /></ProtectRoute>}
            />
            <Route
              path="/copyright"
              element={<ProtectRoute><CopyrightFillingProcess /></ProtectRoute>}
            />
            <Route
              path="/trademarkservices"
              element={<TrademarkServices />}
            />
            <Route
              path="/copyrightservices"
              element={<ProtectRoute><CopyrightServices /></ProtectRoute>}
            />
            <Route
              path="/industrialdesignservices"
              element={<IndustrialDesignServices />}
            />
            <Route
              path="/iplitigationpage"
              element={<ProtectRoute><IPLitigationPage /></ProtectRoute>}
            />

            {/* PUBLIC ROUTES */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/insights" element={<Insights />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/patentGuide" element={<PatentGuidePage />} />
            <Route path="/copyrightGuide" element={<CopyrightGuidePage />} />
          </Routes>
        </main>

        {/* Hide Footer on login and admin-dashboard pages */}
        {!hideFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
    </ThemeProvider>
  )
}

export default App
