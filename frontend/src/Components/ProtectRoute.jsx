import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const location = useLocation();

  // Check admin session (set after OTP verification)
  const adminSession =
    localStorage.getItem("adminSession") ||
    sessionStorage.getItem("adminSession");

  // 👇 If admin is logged in via OTP → allow access
  if (adminSession === "true") {
    return children;
  }

  return (
    <>
      {/* 👇 If user is logged in via Clerk → allow access */}
      <SignedIn>
        {children}
      </SignedIn>

      {/* 👇 If neither Clerk nor Admin session → redirect to login */}
      <SignedOut>
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      </SignedOut>
    </>
  );
};

export default ProtectRoute;
