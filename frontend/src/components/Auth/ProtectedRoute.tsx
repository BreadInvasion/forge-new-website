import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, suppressAlertInProtectedRoute } = useAuth();

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    if (!suppressAlertInProtectedRoute) alert("You must be logged in to access this page");
    return <Navigate to="/" />;
  }

  // Render the protected content if authenticated
  return <>{children}</>;
};
