import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";

const EditMemberModal = ({
  isOpen,
  user = null,
  departments = [],
  onClose,
  onSave,
  onChange,
  canEdit,
  userRole,
}) => {
  // Log trạng thái của modal để debug
  React.useEffect(() => {
    console.log("EditMemberModal rendered with props:", { 
      isOpen, 
      userId: user ? user.id : null,
      userName: user ? user.name : null
    });
  }, [isOpen, user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value, departments);
  };
  
  // Nếu modal không được mở, không render gì cả
  if (!isOpen) {
    console.log("EditMemberModal not rendering - isOpen is false");
    return null;
  }
  
  return (
    <div
      className="fixed  backdrop-blur-lg bg-black/50 inset-0 flex items-center justify-center z-[9999]"
      data-testid="edit-member-modal"
    >
      <div
        className="absolute inset-0  bg-opacity-50"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      ></div>
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl relative overflow-hidden"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-blue-600 p-6 text-white">
          <h2 className="text-xl font-bold">Edit User</h2>
          <p className="text-blue-100 text-sm mt-1">
            Only role, status, and department can be edited
          </p>
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center px-6 pt-6 pb-3">
          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow">
            {user && user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.name}'s avatar`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML =
                    '<div class="h-full w-full flex items-center justify-center"><svg class="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-400 h-10 w-10"
              />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{user && user.name ? user.name : 'User'}</h3>
            <p className="text-gray-500">{user && user.email ? user.email : ''}</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-b">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Student ID:
              </span>
              <div className="text-sm text-gray-900">
                {user && user.studentId ? user.studentId : "N/A"}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Gender:</span>
              <div className="text-sm text-gray-900">
                {user && user.gender ? user.gender : "N/A"}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Date of Birth:
              </span>
              <div className="text-sm text-gray-900">
                {user && user.dateOfBirth ? user.dateOfBirth : "N/A"}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          {" "}
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-2">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role:
              </label>
              <select
                id="role"
                name="role"
                value={(user && user.role) || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ADMIN">Admin</option>
                <option value="DEPARTMENT_MANAGER">Department Manager</option>
                <option value="MEMBER">Member</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current role: {user && user.role ? user.role : 'N/A'}
              </p>
            </div>
            <div className="mb-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status:
              </label>{" "}
              <select
                id="status"
                name="status"
                value={(user && user.status) || "Active"}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  const newIsActive = newStatus === "Active";
                  handleInputChange(e);

                  // Then explicitly update isActive field
                  onChange("isActive", newIsActive, departments);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current status: {user && user.status ? user.status : "N/A"}
                (isActive:{" "}
                {String(
                  user && user.isActive !== undefined
                    ? user.isActive
                    : user && user.status === "Active"
                )}
                )
              </p>
            </div>{" "}
            <div className="mb-2">
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department:
              </label>{" "}
              <select
                id="department"
                name="department"
                value={(user && user.departmentId) || ""}
                onChange={(e) => {
                  // Find department object by ID
                  const deptId = e.target.value;
                  const selectedDept = departments.find(
                    (d) => d.departmentId.toString() === deptId
                  );

                  // Update both departmentId and department name
                  onChange(
                    "departmentId",
                    deptId ? parseInt(deptId, 10) : "",
                    departments
                  );
                  onChange(
                    "department",
                    selectedDept ? selectedDept.name : "",
                    departments
                  );
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {" "}
                <option value="">Select Department</option>
                {departments && departments.length > 0 ? (
                  departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.name} {dept.deptNo ? `(${dept.deptNo})` : ""}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No departments available
                  </option>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {user && user.department
                  ? `Current department: ${user.department}`
                  : "No department assigned"}
              </p>
            </div>
          </form>
        </div>{" "}
        <div className="p-6 flex space-x-3 bg-gray-50">
          <button
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            onClick={onSave}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Changes
          </button>
          <button
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
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

export default EditMemberModal;
