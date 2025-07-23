import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import RedirectPage from "../pages/UserAuthorization/UnauthorizedAccess";

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
    return <RedirectPage
      message={`You must be logged in first!`}
      pageName="Login Page"
      redirectUrl="/login"
    />
  }

  if (!roles.includes("ROLE_SUPER_ADMIN")) {
    console.log("User access denied, redirecting to profile");
    alert("You don't have permission to view this page")
    return <RedirectPage
      message={`You must have ${requiredRoles} privileges to access this content`}
      pageName="Home Page"
      redirectUrl="/"
    />
  }

  return <Outlet />; 

};

export default SuperAdminRoute;
