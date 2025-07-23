import { useState, useEffect, useContext } from 'react';
import { getUserRoleInEvent, canPerformAction, hasMinimumRole } from '../services/roleService.jsx';

const getEventIdFromUrl = () => {
  const path = window.location.pathname;
  
  const eventMatch = path.match(/\/event\/(\d+)/) || path.match(/\/events\/(\d+)/);
  return eventMatch ? parseInt(eventMatch[1]) : null;
};

export const useUserPermissions = (eventId = null) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use provided eventId or extract from URL
  const currentEventId = eventId || getEventIdFromUrl();  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentEventId) {
        setLoading(false);
        setError('No event ID provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Kiểm tra xem người dùng đã được lưu là admin trong session storage hay chưa
        // const savedRole = sessionStorage.getItem('userRole');
        // if (savedRole === 'ADMIN') {
        //   console.log('Using admin role from session storage');
        //   setUserRole('ADMIN');
        //   setLoading(false);
        //   return;
        // }
        
        try {
          const roleData = await getUserRoleInEvent(currentEventId);
          const userRoleValue = roleData.eventRole || roleData.role;
          
          // Debug log để kiểm tra role
          // console.log('User role loaded:', userRoleValue);
          // console.log('Full role data:', roleData);
          
          // Xác định role của người dùng từ dữ liệu trả về và set giá trị một cách rõ ràng
          if (userRoleValue === 'ADMIN' || roleData.role === 'ADMIN') {
            // console.log('Setting user as ADMIN');
            // sessionStorage.setItem('userRole', 'ADMIN');
            setUserRole('ADMIN');
          } else {
            setUserRole(userRoleValue);
            // sessionStorage.setItem('userRole', userRoleValue);
          }
        } catch (apiError) {
          // console.error('API error fetching user role:', apiError);
          
          // Nếu không thể lấy từ API, kiểm tra username trong session
          const username = sessionStorage.getItem('username');
          // console.log('Checking username from session:', username);
          
        
      
        }
      } catch (err) {
        console.error('Failed to fetch user role:', err);
        setError(err.message || 'Failed to fetch user permissions');
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
    // console.log('Checking if user is admin or manager, role:', userRole);
    return hasRole('DEPARTMENT_MANAGER');
  };
  // Check if user is admin (using hasRole and also checking sessionStorage)
  const isAdmin = () => {
    // const sessionRole = sessionStorage.getItem('userRole');
    // console.log('Checking if user is admin, role:', userRole);
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
