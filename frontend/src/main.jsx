import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import YouTubeCard from './login/YouTubeCard.jsx'
// import Consulation from './Services/Consultation.jsx'
// import PatentServicesPage from './Services/PatentServicesPage.jsx'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
        {/* <YouTubeCard /> */}
        {/* <Consulation/> */}
        {/* <PatentServicesPage/> */}
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
)
