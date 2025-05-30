import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditUserModal = ({
  isOpen,
  user,
  departments = [],
  onClose,
  onSave,
  onChange
}) => {
  if (!isOpen || !user) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value, departments);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl relative">
        <div className="p-6 border-b bg-blue-600">
          <h2 className="text-xl font-bold mb-2 text-white">Edit User</h2>
          <p className="text-blue-100 text-sm">Only role, status, and department can be edited</p>
        </div>
        
        <div className="flex items-center px-6 pt-6 pb-3">
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={`${user.name}'s avatar`} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="h-full w-full flex items-center justify-center"><svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
                }}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} className="text-gray-400 h-8 w-8" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-b">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-500 mb-1">Student ID:</label>
              <p className="text-sm">{user.studentId || 'N/A'}</p>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-500 mb-1">Gender:</label>
              <p className="text-sm">{user.gender || 'N/A'}</p>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-500 mb-1">Date of Birth:</label>
              <p className="text-sm">{user.dateOfBirth || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
              <select
                id="role"
                name="role"
                value={user.role}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ADMIN">Admin</option>
                <option value="DEPARTMENT_MANAGER">Department Manager</option>
                <option value="MEMBER">Member</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Current role: {user.role}</p>
            </div>
            
            <div className="mb-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
              <select
                id="status"
                name="status"
                value={user.status || 'Active'}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  console.log(`EditUserModal: Status changed to ${newStatus} (from ${user.status})`);
                  // Automatically set isActive based on status
                  const newIsActive = newStatus === 'Active';
                  console.log(`Setting isActive to: ${newIsActive}`);
                  
                  // First update status
                  handleInputChange(e);
                  
                  // Then explicitly update isActive field
                  onChange('isActive', newIsActive, departments);
                }}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current status: {user.status} 
                (isActive: {String(user.isActive !== undefined ? user.isActive : user.status === 'Active')})
              </p>
            </div>
            
            <div className="mb-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
              <select
                id="department"
                name="department"
                value={user.department || ''}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current department: {user.department || 'N/A'} 
                (ID: {user.departmentId || 'N/A'})
              </p>
            </div>
          </form>
        </div>
        <div className="p-6 flex space-x-3 bg-gray-50">
          <button 
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={onSave}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Changes
          </button>
          <button 
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
