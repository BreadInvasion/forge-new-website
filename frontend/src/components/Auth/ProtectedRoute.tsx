import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // user is not authenticated
    alert("You must be logged in to access this page");
    return <Navigate to="/login" />;
  }
  return children;
};
