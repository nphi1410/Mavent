import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const getUserRoles = () => {
  const token = sessionStorage.getItem("token");
  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    // console.log("roles:", decoded.roles);
    return decoded.roles || [];
  } catch (e) {
    console.error("Invalid token: ", e);
    return [];
  }
};

const SuperAdminRoute = () => {
  const location = useLocation();
  const roles = getUserRoles();

  if (roles.length === 0) {
    console.log("No role found, redirecting to login");
    alert("You have to login first")
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles.includes("ROLE_SUPER_ADMIN")) {
    console.log("User access denied, redirecting to profile");
    alert("You don't have permission to view this page")
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />; 

};

export default SuperAdminRoute;
