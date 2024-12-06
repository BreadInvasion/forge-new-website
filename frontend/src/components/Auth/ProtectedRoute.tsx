import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading indicator while authentication is still being determined
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper spinner or loader.
  }

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    alert("You must be logged in to access this page");
    return <Navigate to="/login" />;
  }

  // Render the protected content if authenticated
  return <>{children}</>;
};
