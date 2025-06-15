import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const getUserRoles = () => {
  const token = sessionStorage.getItem("token");
  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    console.log("roles:", decoded.roles);
    return decoded.roles || [];
  } catch (e) {
    console.error("Invalid token");
    return [];
  }
};

const SuperAdminRoute = ({ children }) => {
  const location = useLocation();
  const roles = getUserRoles();

  if (roles.length === 0) {
    console.log("No role found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles.includes("ROLE_SUPER_ADMIN")) {
    console.log("User access denied, redirecting to profile");
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return children; // ✅ Correct: return children when access is granted
};

export default SuperAdminRoute;
