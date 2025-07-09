import React, { useEffect, useState } from "react";
import { EventRoleContext, useEventRole } from "../context/EventRoleContext";
import { useNavigate, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { getUserInfoInEvent } from "../services/userEventService";

// Utility function to check login status
const isLoggedIn = () => {
  const token = sessionStorage.getItem("token");
  return !!token;
};

const ProtectedRoute = ({ isRequiredToHaveRole }) => {
  const location = useLocation();
  const { id: eventId } = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // console.log('useEffect in PR');
    // console.log('user role in PR' ,user?.role)

    if (!isLoggedIn()) {
      setLoading(false); // stop loading, let fallback handle it
      return;
    }
    if (isRequiredToHaveRole) {
      const { user, roleLoading } = useEventRole();
      setLoading(roleLoading);
      if (user?.role) {
        // switch()
        setIsAuthorized(true);
      }
    }

    setLoading(false);
  }, [eventId]);

  if (!isLoggedIn()) {
    console.log("User not logged in, redirecting");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isRequiredToHaveRole && isAuthorized) {
    return (
      <Outlet />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
