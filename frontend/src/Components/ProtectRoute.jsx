import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = () => {
      try {
        // Check for admin token or session data
        const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        const adminSession = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
        
        console.log('ProtectRoute - Checking auth, token:', !!adminToken, 'session:', !!adminSession);
        
        if (adminToken || adminSession) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with the current path as return URL
    console.log('Admin not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('Admin is authenticated, rendering protected content');
  return children;
};

export default ProtectRoute;