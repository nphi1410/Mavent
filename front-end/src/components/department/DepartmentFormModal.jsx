import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DepartmentFormModal = ({ 
  isOpen, 
  onClose, 
  department = null, 
  onSubmit 
}) => {
  const isEditMode = !!department;
  const [formData, setFormData] = useState({
    deptNo: '',
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        deptNo: department.deptNo || '',
        name: department.name || '',
        description: department.description || ''
      });
    } else {
      // Reset form for new department 
      // We're not setting deptNo because it will be auto-generated
      setFormData({
        deptNo: '',  // This will be auto-generated and is shown as read-only
        name: '',
        description: ''
      });
    }
    setErrors({});
  }, [department, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    // No need to validate deptNo as it will be auto-generated
    
    // Name is always required
    if (!formData.name.trim()) {
      newErrors.name = 'Tên phòng ban không được để trống';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Tên phòng ban không được vượt quá 100 ký tự';
    }
    
    // Description length check (optional field)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Mô tả không được vượt quá 1000 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center z-9999">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 " onClick={onClose}></div>
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Department' : 'Add New Department'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="deptNo">
              Mã phòng ban
            </label>
            <div className="flex items-center">
                <input
                  type="text"
                  id="deptNo"
                  name="deptNo"
                  value={isEditMode ? (formData.deptNo || `DEPT-${String(department?.departmentId || '').padStart(3, '0')}`) : 'DEPT-XXX '}
                  disabled={true}
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 cursor-not-allowed"
                  placeholder={isEditMode ? "Department code cannot be modified" : "Department code will be auto-generated"}
                  readOnly
                />
                {isEditMode && !formData.deptNo && (
                  <span className="ml-2 text-xs text-gray-500">
                    (System ID: {department?.departmentId})
                  </span>
                )}
              </div>
              {!isEditMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Mã phòng ban sẽ được tạo tự động khi bạn lưu
                </p>
              )}
            {errors.deptNo && (
              <p className="text-red-500 text-xs mt-1">{errors.deptNo}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              Department Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Enter department name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter department description"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditMode ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentFormModal;
