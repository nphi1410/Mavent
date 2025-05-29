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
    onChange(name, value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl relative">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          <form className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
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
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
              <select
                id="status"
                name="status"
                value={user.status}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
              <select
                id="department"
                name="department"
                value={user.department}
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
            </div>
          </form>
        </div>
        <div className="p-6 flex space-x-3">
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
