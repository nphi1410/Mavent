import { useState, useEffect, useContext } from 'react';
import { getUserRoleInEvent, canPerformAction, hasMinimumRole } from '../services/roleService';

// Get event ID from URL path
const getEventIdFromUrl = () => {
  const path = window.location.pathname;
  const eventMatch = path.match(/\/event\/(\d+)/);
  return eventMatch ? parseInt(eventMatch[1]) : null;
};

export const useUserPermissions = (eventId = null) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use provided eventId or extract from URL
  const currentEventId = eventId || getEventIdFromUrl();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentEventId) {
        setLoading(false);
        setError('No event ID provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const roleData = await getUserRoleInEvent(currentEventId);
        setUserRole(roleData.eventRole || roleData.role);
        
        console.log('User role loaded:', roleData.eventRole || roleData.role);
      } catch (err) {
        console.error('Failed to fetch user role:', err);
        setError(err.message || 'Failed to fetch user permissions');
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [currentEventId]);

  // Permission check functions
  const canEdit = (targetUserRole) => {
    if (!userRole) return false;
    return canPerformAction(userRole, targetUserRole, 'edit');
  };

  const canBan = (targetUserRole) => {
    if (!userRole) return false;
    return canPerformAction(userRole, targetUserRole, 'ban');
  };

  const canView = (targetUserRole) => {
    if (!userRole) return false;
    return canPerformAction(userRole, targetUserRole, 'view');
  };

  const hasRole = (minimumRole) => {
    if (!userRole) return false;
    return hasMinimumRole(userRole, minimumRole);
  };

  // Check if user is admin or department manager
  const isAdminOrManager = () => {
    return hasRole('DEPARTMENT_MANAGER');
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  return {
    userRole,
    loading,
    error,
    canEdit,
    canBan,
    canView,
    hasRole,
    isAdminOrManager,
    isAdmin,
    eventId: currentEventId
  };
};

export default useUserPermissions;
