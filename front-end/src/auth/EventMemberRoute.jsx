import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getUserRoleInEvent, ROLE_HIERARCHY } from "../services/roleService";
import { jwtDecode } from 'jwt-decode';

// Utility function to check login status
const isLoggedIn = () => {
  const token = sessionStorage.getItem("token");
  return !!token;
};

// Check if user is a super admin
const isSuperAdmin = () => {
  const token = sessionStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // Check for "ROLE_SUPER_ADMIN" which is a system-level role, not an event-level role
    // This is separate from the EventRole enum in the backend
    return Array.isArray(decoded.roles) && decoded.roles.includes("ROLE_SUPER_ADMIN");
  } catch (e) {
    console.error("Invalid token when checking super admin status", e);
    return false;
  }
};

// This component was initially for members but now restricts access to event admins only
const EventMemberRoute = ({ children }) => {
  const location = useLocation();
  const { id } = useParams(); // Get the event ID from URL
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoggedIn()) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Super admins can access any event page
      if (isSuperAdmin()) {
        console.log('EventMemberRoute - User is a super admin, granting access');
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has member role or higher in this event
        const role = await getUserRoleInEvent(id);
        console.log('EventMemberRoute - User role for event:', id, 'is:', role);
        
        // Handle different possible API response formats
        let userRole;
        
        // If role is null or undefined, default to empty string
        if (role === null || role === undefined) {
          console.log('EventMemberRoute - Role is null or undefined');
          userRole = '';
        }
        // If role is a string, use it directly
        else if (typeof role === 'string') {
          userRole = role.toUpperCase(); // Normalize to uppercase to match ROLE_HIERARCHY keys
          console.log('EventMemberRoute - Role is a string:', userRole);
        }
        // If role is an object with a role property
        else if (typeof role === 'object' && role.role) {
          userRole = role.role.toUpperCase(); // Normalize to uppercase
          console.log('EventMemberRoute - Extracted role from object:', userRole);
        }
        // If role is an object with a roleName property
        else if (typeof role === 'object' && role.roleName) {
          userRole = role.roleName.toUpperCase(); // Normalize to uppercase
          console.log('EventMemberRoute - Extracted roleName from object:', userRole);
        }
        // For any other unexpected format, default to empty
        else {
          console.log('EventMemberRoute - Unexpected role format:', typeof role);
          userRole = '';
        }
        
        // Only allow ADMIN role for this route
        let isAuth = false;
        
        // Check if user has specifically the ADMIN role
        if (userRole === "ADMIN") {
          console.log('EventMemberRoute - User has exact ADMIN role');
          isAuth = true;
        }
        // Also check for variations of ADMIN in case the API returns it differently
        else if (userRole.includes("ADMIN") && !userRole.includes("DEPARTMENT")) {
          console.log('EventMemberRoute - User has role containing ADMIN:', userRole);
          isAuth = true;
        } else {
          console.log('EventMemberRoute - User role is not ADMIN, access denied');
        }
        
        console.log('EventMemberRoute - User role:', userRole);
        console.log('EventMemberRoute - Is user authorized?', isAuth);
        
        setIsAuthorized(isAuth);
      } catch (error) {
        console.error("Failed to check user role:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isLoggedIn() || !isAuthorized) {
    // Redirect to event details page with a message
    return <Navigate to={`/events/${id}`} state={{ 
      unauthorizedMessage: "You need to be an admin of this event to access this page." 
    }} replace />;
  }

  return children;
};

export default EventMemberRoute;
