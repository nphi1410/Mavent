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
    // console.log('Fetching user role for event:', eventId);
    const response = await Api.get(`/user/role/${eventId}`);
    // console.log('User role response:', response.data);
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
  // Debug logs để kiểm tra các giá trị
  // console.log('canPerformAction - currentUserRole:', currentUserRole);
  // console.log('canPerformAction - targetUserRole:', targetUserRole);
  // console.log('canPerformAction - action:', action);
  
  // Kiểm tra xem user có role ADMIN trong session storage không
  const sessionRole = sessionStorage.getItem('userRole');
  if (sessionRole === 'ADMIN') {
    // console.log('Admin user from session storage - granting permission for action:', action);
    return true;
  }
  
  // Đảm bảo currentUserRole có giá trị hợp lệ
  if (!currentUserRole) {
    console.error('Current user role is undefined or null');
    
    // Kiểm tra username trong session
    const username = sessionStorage.getItem('username');
    if (username && username.toLowerCase().includes('admin')) {
      // console.log('Username contains "admin", granting permission');
      return true;
    }
    
    return false;
  }
  
  // Admin luôn có mọi quyền
  if (currentUserRole === 'ADMIN') {
    // console.log('Admin user - granting permission for action:', action);
    return true;
  }
  
  const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetUserRole] || 0;
  
  // console.log('Role levels - current:', currentLevel, 'target:', targetLevel);

  let result = false;
  switch (action) {
    case 'edit':
    case 'ban':
      // Can edit/ban users with lower role level
      result = currentLevel > targetLevel;
      break;
    case 'view':
      // Can view users with equal or lower role level
      result = currentLevel >= targetLevel;
      break;
    default:
      result = false;
  }
  
  // console.log('Permission result for', action, ':', result);
  return result;
};

// Check if user has minimum role required for an action
export const hasMinimumRole = (userRole, minimumRole) => {

  // Kiểm tra xem user có role ADMIN trong session storage không
  const sessionRole = sessionStorage.getItem('userRole');
  if (sessionRole === 'ADMIN') {
    // console.log('Admin from session storage always has minimum role');
    return true;
  }
  
  // Đảm bảo userRole có giá trị hợp lệ
  if (!userRole) {
    console.error('User role is undefined or null');
    
    // Kiểm tra username trong session
    const username = sessionStorage.getItem('username');
    if (username && username.toLowerCase().includes('admin')) {
      // console.log('Username contains "admin", granting minimum role');
      return true;
    }
    
    return false;
  }
  
  // Admin luôn có mọi quyền
  if (userRole === 'ADMIN') {
    // console.log('Admin always has minimum role');
    return true;
  }
  
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const minimumLevel = ROLE_HIERARCHY[minimumRole] || 0;
  
  const result = userLevel >= minimumLevel;
  // console.log('Role levels - user:', userLevel, 'minimum:', minimumLevel, 'result:', result);
  
  return result;
};

export default {
  getUserRoleInEvent,
  canPerformAction,
  hasMinimumRole,
  ROLE_HIERARCHY
};
