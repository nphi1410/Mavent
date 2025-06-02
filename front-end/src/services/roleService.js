import Api from "../config/Api";

const handleAuthError = (error) => {
  console.error('Auth Error:', {
    status: error.response?.status,
    data: error.response?.data
  });

  if (error.response?.status === 401) {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  if (error.response?.status === 403) {
    console.error('Forbidden access:', error.response?.data);
    throw new Error('You do not have permission to perform this action');
  }

  throw error;
};

// Get current user's role in a specific event
export const getUserRoleInEvent = async (eventId) => {
  try {
    console.log('Fetching user role for event:', eventId);
    const response = await Api.get(`/user/role/${eventId}`);
    console.log('User role response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user role in event:', error);
    handleAuthError(error);
    throw error;
  }
};

// Permission levels from backend constants
export const ROLE_HIERARCHY = {
  ADMIN: 4,
  DEPARTMENT_MANAGER: 3,
  MEMBER: 2,
  PARTICIPANT: 1,
  GUEST: 0
};

// Check if current user role can perform action on target user role
export const canPerformAction = (currentUserRole, targetUserRole, action) => {
  const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetUserRole] || 0;

  switch (action) {
    case 'edit':
    case 'ban':
      // Can edit/ban users with lower role level
      return currentLevel > targetLevel;
    case 'view':
      // Can view users with equal or lower role level
      return currentLevel >= targetLevel;
    default:
      return false;
  }
};

// Check if user has minimum role required for an action
export const hasMinimumRole = (userRole, minimumRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const minimumLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userLevel >= minimumLevel;
};

export default {
  getUserRoleInEvent,
  canPerformAction,
  hasMinimumRole,
  ROLE_HIERARCHY
};
