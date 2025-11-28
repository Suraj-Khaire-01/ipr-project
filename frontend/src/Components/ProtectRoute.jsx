import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {/* If user is signed in → show protected content */}
      <SignedIn>
        {children}
      </SignedIn>

      {/* If user is not signed in → redirect to login page */}
      <SignedOut>
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      </SignedOut>
    </>
  );
};

export default ProtectRoute;
