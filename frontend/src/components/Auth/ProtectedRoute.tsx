import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, suppressAlertInProtectedRoute } = useAuth();
  const location = useLocation();
  const isEmailVerificationRoute = location.pathname.startsWith("/verify-email/");

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    if (!isEmailVerificationRoute && !suppressAlertInProtectedRoute) {
      alert("You must be logged in to access this page");
    }

    if (isEmailVerificationRoute) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Navigate to="/" replace />;
  }

  // Render the protected content if authenticated
  return <>{children}</>;
};
