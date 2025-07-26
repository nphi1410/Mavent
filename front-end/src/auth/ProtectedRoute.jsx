import React, { useEffect, useState } from "react";
import { EventRoleContext, useEventRole } from "../context/EventRoleContext";
import { useNavigate, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { getUserInfoInEvent } from "../services/userEventService";
import RedirectPage from "../pages/UserAuthorization/UnauthorizedAccess";
import { set } from "react-hook-form";

// Utility function to check login status
const isLoggedIn = () => {
  const token = sessionStorage.getItem("token");
  return !!token;
};

const ProtectedRoute = ({ isRequiredToHaveRole, requiredRoles, children }) => {
  const { id: eventId } = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [contextUser, setContextUser] = useState(null);
  const { user, roleLoading } = useEventRole();
  const navigate = useNavigate();
  

  useEffect(() => {
    // console.log('useEffect in PR');
    // console.log('user role in PR' ,user?.role)
    // if (loading) return;
    setLoading(true);

    if (!isLoggedIn()) {
      // console.log("User not logged in, redirecting");
      return;
    }

    if (isRequiredToHaveRole) {
      // setContextUser(user);
      if (requiredRoles && requiredRoles.includes(user?.role)) {
        // console.log("User does have required role, redirecting");
        setIsAuthorized(true);
      }
      else if (!requiredRoles) {
        // console.log("No specific roles required, user is authorized");
        setIsAuthorized(true);
      }
    }


    // console.log("useEffect completed for eventId in PR:", eventId);
    setLoading(false);
  }, [eventId]);
  // console.log("authorization status in PR:", isAuthorized);
  // console.log("isrequiredToHaveRole in PR:", isRequiredToHaveRole);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn()) {
    // console.log("User not logged in, redirecting");
    return <RedirectPage
      message={`You must be logged in first!`}
      pageName="Login Page"
      redirectUrl="/login"
    />
  }

  if (!isAuthorized && isRequiredToHaveRole) {
    // console.log("User not authorized, redirecting");
    return <RedirectPage
      message={`You do not have authority to access this content`}
      pageName="Details Page"
      redirectUrl="/"
    />
  }

  if (isRequiredToHaveRole && isAuthorized) {
    if (children) return children;
    // If no children, render Outlet for nested routes
    return (
      <Outlet />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
