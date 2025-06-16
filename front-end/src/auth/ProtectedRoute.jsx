import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Utility function to check login status
const isLoggedIn = () => {
  const token = sessionStorage.getItem("token");
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    // Redirect to login and preserve current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
