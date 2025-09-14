import { useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";

const LoginRequiredBanner = ({ serviceName, serviceUrl }) => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  if (isSignedIn) return null; // Don't show banner if user is logged in

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: serviceUrl } });
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg mb-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔒</div>
          <div>
            <h3 className="font-semibold">Login Required</h3>
            <p className="text-sm text-purple-100">
              To apply for {serviceName}, please log in to your account
            </p>
          </div>
        </div>
        <button
          onClick={handleLoginRedirect}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm"
        >
          Login Now
        </button>
      </div>
    </div>
  );
};

export default LoginRequiredBanner;