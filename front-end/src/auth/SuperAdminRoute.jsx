import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import RedirectPage from "../pages/UserAuthorization/UnauthorizedAccess";

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const SuperAdminRoute = () => {
  const token = sessionStorage.getItem("token");

  const [roles, setRoles] = useState([]);
  const [isTokenExpired, setIsTokenExpired] = useState(true);

  useEffect(() => {
    try {
      const decoded = jwtDecode(token);
      const payload = parseJwt(token);
      // console.log("Issued at (iat):", new Date(payload.iat * 1000));
      // console.log("Expires at (exp):", new Date(payload.exp * 1000).toLocaleString());
      setIsTokenExpired(Date.now() > new Date(payload.exp * 1000));
      // console.log("decoded: ", decoded);
      setRoles(decoded.roles || []);
    } catch (e) {
      console.error("Invalid token: ", e);
    }
  }, [token])

  if (roles.length === 0 || isTokenExpired) {
    // console.log("No role found, redirecting to login");
    return <RedirectPage
      message={`You must be logged in first!`}
      pageName="Login Page"
      redirectUrl="/login"
    />
  }

  if (!roles.includes("ROLE_SUPER_ADMIN")) {
    // console.log("User access denied, redirecting to profile");
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
