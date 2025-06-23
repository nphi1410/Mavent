import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faPlus, faSearch, faEllipsisH, faArrowLeft, faCheckCircle, faExclamationCircle, faTimes, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/layout/AdminLayout';
import DepartmentFormModal from '../../components/department/DepartmentFormModal';
import * as departmentService from '../../services/departmentManagementService';

// Notification component
const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    // Use longer timeout for error notifications
    const timeout = type === 'error' ? 8000 : 5000;
    
    const timer = setTimeout(() => {
      onClose();
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [onClose, type]);
  
  return (
    <div 
      className={`fixed top-24 right-5 z-[1000] p-4 rounded-md shadow-xl flex items-center max-w-md ${
        type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
        type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
        'bg-red-50 text-red-700 border border-red-200'
      }`} 
      style={{ 
        animation: 'fadeIn 0.3s ease-in-out', 
        maxWidth: '90vw',
        opacity: 0,
        transform: 'translateY(-10px)',
        animationFillMode: 'forwards'
      }}
    >
      <span className={`mr-3 ${
        type === 'success' ? 'text-green-600' : 
        type === 'warning' ? 'text-yellow-600' : 
        'text-red-600'
      }`}>
        <FontAwesomeIcon 
          icon={type === 'success' ? faCheckCircle : faExclamationCircle} 
          size={type === 'error' ? 'lg' : 'sm'} 
          className={type === 'error' ? 'animate-pulse' : ''}
        />
      </span>
      <p className={`text-sm ${type === 'error' ? 'font-medium' : ''}`}>{message}</p>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600 flex-shrink-0"
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

// Department Detail Modal component
const DepartmentDetailModal = ({ isOpen, onClose, department, onEdit }) => {
  const { id: eventId } = useParams();
  const [memberCount, setMemberCount] = useState(null);
  const [loadingCount, setLoadingCount] = useState(false);
  
  useEffect(() => {
    const fetchMemberCount = async () => {
      if (!isOpen || !department || !department.departmentId) return;
      
      try {
        setLoadingCount(true);
        const count = await departmentService.getMemberCount(eventId, department.departmentId);
        setMemberCount(count);
      } catch (error) {
        console.error('Error fetching department member count:', error);
        // Fallback to any count we might have from the department object
        setMemberCount(department.loadedMemberCount || 
                        department.memberCount || 
                        department.members?.length || 
                        0);
      } finally {
        setLoadingCount(false);
      }
    };
    
    fetchMemberCount();
  }, [department, eventId, isOpen]);
  
  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center z-9999">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết phòng ban
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Mã phòng ban</p>
            <div className="mt-1">
              {department.deptNo ? (
                <div>
                  <p className="text-lg font-semibold text-blue-700">{department.deptNo}</p>
                  <p className="text-xs text-gray-500">ID hệ thống: {department.departmentId}</p>
                </div>
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-md text-base font-medium bg-blue-50 text-blue-800">
                  DEPT-{String(department.departmentId).padStart(3, '0')}
                </span>
              )}
            </div>
          </div>
          
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Tên phòng ban</p>
            <p className="font-medium text-gray-800">{department.name}</p>
          </div>
          
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Số lượng thành viên</p>
            <div className="mt-1">
              {loadingCount ? (
                <span className="text-sm text-gray-500">Đang tải...</span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-blue-50 text-blue-800">
                  {memberCount !== null ? memberCount : 0}
                </span>
              )}
            </div>
          </div>
          
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Mô tả</p>
            <div className="max-h-48 overflow-y-auto">
              <p className="font-medium text-gray-800 break-words whitespace-pre-wrap">{department.description || 'Không có mô tả'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium text-gray-800">
                {department.createdAt ? new Date(department.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="font-medium text-gray-800">
                {department.updatedAt ? new Date(department.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => {
              onEdit(department.departmentId);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Chỉnh sửa
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Dialog Component for bulk actions
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      {/* Dialog */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 p-6" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="mb-5">
          <div className="flex items-center justify-center bg-red-100 text-red-600 w-12 h-12 rounded-full mx-auto mb-4">
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </div>
          
          <h3 className="text-xl font-medium text-gray-900 text-center">{title}</h3>
          <p className="text-sm text-gray-600 mt-3 text-center">{message}</p>
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors min-w-[100px]"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors min-w-[100px] flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            {confirmButtonText || 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DepartmentManagementPage = () => {
  const { id: eventId } = useParams();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentDetail, setDepartmentDetail] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [processingBulkDelete, setProcessingBulkDelete] = useState(false);
  const lastSelectedRef = useRef(null);
  
  // Add keyframe animations for bulk actions
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes highlight {
        0% { background-color: rgba(147, 197, 253, 0.3); }
        50% { background-color: rgba(147, 197, 253, 0.5); }
        100% { background-color: rgba(59, 130, 246, 0.1); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
        100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  // Mock data cho departments dựa trên mockup
  const mockDepartments = [
    { id: 1, deptNo: 'MKT-001', name: 'Marketing Department' },
    { id: 2, deptNo: 'FIN-002', name: 'Finance Department' },
    { id: 3, deptNo: 'HR-003', name: 'Human Resources Department' },
    { id: 4, deptNo: 'CUL-004', name: 'Culture Department' },
    { id: 5, deptNo: 'OPS-005', name: 'Operations Department' },
    { id: 6, deptNo: 'IT-006', name: 'IT Department' },
    { id: 7, deptNo: 'RD-007', name: 'Research & Development' }
  ];

  // Load real data from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const data = await departmentService.getDepartmentsByEventId(eventId);
        console.log('Fetched departments:', data);
        
        let departmentsArray = [];
        
        // Process the returned data
        if (Array.isArray(data)) {
          departmentsArray = data;
          setTotalPages(Math.ceil(data.length / 10)); // 10 items per page
        } else if (data && Array.isArray(data.content)) {
          // If the API returns paginated data with a content array
          departmentsArray = data.content;
          setTotalPages(data.totalPages || Math.ceil(data.content.length / 10));
        } else {
          // Fallback to empty array if data format is unexpected
          console.warn('Unexpected data format:', data);
          setTotalPages(1);
        }
        
        // Store the departments in state without member counts
        setDepartments(departmentsArray);
        setError(null);
        
        // Once departments are loaded, fetch member counts for each
        if (departmentsArray.length > 0) {
          fetchMemberCounts(departmentsArray);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        const errorMessage = 'Không thể tải dữ liệu phòng ban. Vui lòng thử lại sau.';
        setError(errorMessage);
        setNotification({
          type: 'error',
          message: errorMessage
        });
        // Fallback to mock data for development purposes
        setDepartments(mockDepartments);
        setTotalPages(Math.ceil(mockDepartments.length / 10));
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [eventId]);
  
  // Fetch member counts for all departments
  const fetchMemberCounts = async (departmentsList) => {
    // Create a copy of departments to update with member counts
    const updatedDepartments = [...departmentsList];
    
    // Process departments in batches to avoid too many concurrent requests
    const batchSize = 5;
    for (let i = 0; i < updatedDepartments.length; i += batchSize) {
      const batch = updatedDepartments.slice(i, i + batchSize);
      
      // Process the batch in parallel
      const batchPromises = batch.map(async (dept) => {
        try {
          // Call the new member-count endpoint
          const memberCount = await departmentService.getMemberCount(eventId, dept.departmentId);
          return {
            ...dept,
            loadedMemberCount: memberCount
          };
        } catch (err) {
          console.error(`Error fetching member count for department ${dept.departmentId}:`, err);
          return {
            ...dept,
            loadedMemberCount: dept.memberCount || dept.members?.length || 0
          };
        }
      });
      
      // Wait for all promises in this batch to resolve
      const batchResults = await Promise.all(batchPromises);
      
      // Update the departments with their member counts
      batchResults.forEach((updatedDept, index) => {
        updatedDepartments[i + index] = updatedDept;
      });
      
      // Update state after each batch
      setDepartments([...updatedDepartments]);
    }
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department => {
    const matchesSearch = 
      (department.name && department.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (department.deptNo && department.deptNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  // Update total pages whenever filtered departments change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE));
  }, [filteredDepartments]);

  // Calculate paginated departments based on current page
  const ITEMS_PER_PAGE = 10; // Set to 10 items per page
  
  const computePaginatedDepartments = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDepartments.slice(startIndex, endIndex);
  };
  
  // Get the current page's departments
  const paginatedDepartments = computePaginatedDepartments();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Các chức năng xử lý action buttons (sẽ implement sau)
  const handleViewDepartment = (departmentId) => {
    // Check if departmentId is valid
    if (!departmentId || departmentId === 'undefined') {
      setNotification({
        type: 'error',
        message: 'Mã phòng ban không hợp lệ'
      });
      return;
    }
    
    // Find the department in the existing data
    const deptDetail = departments.find(dept => dept.departmentId === departmentId);
    
    if (!deptDetail) {
      setNotification({
        type: 'error',
        message: 'Không tìm thấy thông tin phòng ban'
      });
      return;
    }
    
    console.log('Department detail from local data:', deptDetail);
    
    // Set the department detail to state and open the modal
    setDepartmentDetail(deptDetail);
    setIsDetailModalOpen(true);
  };

  const handleEditDepartment = (departmentId) => {
    // Check if departmentId is valid
    if (!departmentId || departmentId === 'undefined') {
      setNotification({
        type: 'error',
        message: 'Mã phòng ban không hợp lệ'
      });
      return;
    }
    
    const department = departments.find(d => d.departmentId === departmentId);
    if (!department) {
      setNotification({
        type: 'error',
        message: 'Không tìm thấy thông tin phòng ban'
      });
      return;
    }
    
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (departmentId) => {
    // Check if departmentId is valid
    if (!departmentId || departmentId === 'undefined') {
      setNotification({
        type: 'error',
        message: 'Mã phòng ban không hợp lệ'
      });
      return;
    }
    
    // Find the department to get its name for better user feedback
    const departmentToDelete = departments.find(d => d.departmentId === departmentId);
    const deptName = departmentToDelete ? departmentToDelete.name : `ID: ${departmentId}`;
    
    try {
      const numericEventId = parseInt(eventId, 10);
      const numericDepartmentId = parseInt(departmentId, 10);
      
      // Clear any existing notifications first
      setNotification(null);
      setLoading(true);
      
      // First check: Get the latest member count
      console.log(`Checking member count for department ${departmentId}`);
      const memberCount = await departmentService.getMemberCount(numericEventId, numericDepartmentId);
      
      if (memberCount > 0) {
        setLoading(false);
        setNotification({
          type: 'error',
          message: `Không thể xóa phòng ban "${deptName}" vì phòng ban này có ${memberCount} thành viên. Vui lòng chuyển hoặc xóa các thành viên trước.`
        });
        return;
      }
      
      // Second check: Check for tasks (if available)
      console.log(`Checking tasks for department ${departmentId}`);
      const tasksCheck = await departmentService.checkDepartmentHasTasks(numericEventId, numericDepartmentId);
      
      if (tasksCheck.hasTasks) {
        setLoading(false);
        setNotification({
          type: 'error',
          message: `Không thể xóa phòng ban "${deptName}" vì phòng ban này có ${tasksCheck.taskCount} nhiệm vụ. Vui lòng xóa hoặc gán lại các nhiệm vụ trước.`
        });
        return;
      }
      
      setLoading(false);
      
      // If there are no known constraints, confirm deletion
      if (window.confirm(`Bạn có chắc chắn muốn xóa phòng ban "${deptName}"?`)) {
        try {
          setLoading(true);
          console.log(`Attempting to delete department ${departmentId} from event ${eventId}`);
          
          // Try to delete using our enhanced service method
          await departmentService.deleteDepartment(numericEventId, numericDepartmentId);
          
          // If we get here, deletion was successful
          console.log(`Successfully deleted department ${departmentId}`);
          
          // Update local state after successful deletion
          setDepartments(departments.filter(dept => dept.departmentId !== numericDepartmentId));
          
          setNotification({
            type: 'success',
            message: `Xóa phòng ban "${deptName}" thành công`
          });
        } catch (err) {
          console.error(`Error deleting department with ID ${departmentId}:`, err);
          
          // Get a more detailed error message
          let errorMessage = 'Không thể xóa phòng ban. ';
          
          if (err.message) {
            if (err.message.includes('constraint') || err.message.includes('ràng buộc')) {
              errorMessage = `Không thể xóa phòng ban "${deptName}" vì phòng ban này có dữ liệu liên quan (có thể là thành viên, nhiệm vụ hoặc dữ liệu khác). Vui lòng kiểm tra và xóa các dữ liệu liên quan trước.`;
            } else if (err.message.includes('permission') || err.message.includes('quyền')) {
              errorMessage = `Bạn không có quyền xóa phòng ban "${deptName}".`;
            } else if (err.message.includes('not found') || err.message.includes('không tồn tại')) {
              errorMessage = `Phòng ban "${deptName}" không tồn tại hoặc đã bị xóa.`;
            } else {
              errorMessage = err.message;
            }
          } else {
            errorMessage
          }
          
          setNotification({ 
            type: 'error', 
            message: errorMessage 
          });
        } finally {
          setLoading(false);
        }
      }
    } catch (checkErr) {
      console.error('Error performing pre-delete checks:', checkErr);
      setLoading(false);
      setNotification({
        type: 'error',
        message: `Không thể kiểm tra thông tin phòng ban "${deptName}". Vui lòng thử lại sau.`
      });
    }
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };
  
  const handleSubmitDepartment = async (formData) => {
    try {
      setLoading(true);
      if (selectedDepartment) {
        // Check if departmentId is valid
        if (!selectedDepartment.departmentId || selectedDepartment.departmentId === 'undefined') {
          throw new Error('Mã phòng ban không hợp lệ');
        }
        
        // Ensure the deptNo is preserved from the original department
        // This handles the case where the deptNo field is disabled in edit mode
        const updatedFormData = {
          ...formData,
          deptNo: selectedDepartment.deptNo || formData.deptNo
        };
        
        // Update existing department
        const updatedDepartment = await departmentService.updateDepartment(
          eventId, 
          parseInt(selectedDepartment.departmentId, 10), 
          updatedFormData
        );
        
        // Update the local state with the updated department data
        setDepartments(departments.map(dept =>
          dept.departmentId === selectedDepartment.departmentId ? updatedDepartment : dept
        ));
        
        // Show success notification
        setNotification({ type: 'success', message: 'Cập nhật phòng ban thành công' });
      } else {
        // Add new department - send the correct fields according to backend requirements
        // The backend expects: eventId, name, description
        const newDeptData = {
          eventId: parseInt(eventId, 10),  // Add eventId to match backend DTO
          name: formData.name,
          description: formData.description
        };
        
        console.log("Submitting department with data:", newDeptData);
        
        // Add new department
        const newDepartment = await departmentService.addDepartment(eventId, newDeptData);
        
        // Add the new department to the local state
        setDepartments([...departments, newDepartment]);
        
        // Show success notification
        setNotification({ type: 'success', message: 'Thêm phòng ban mới thành công' });
      }
    } catch (err) {
      console.error('Error submitting department:', err);
      const errorMessage = selectedDepartment ? 
        'Không thể cập nhật phòng ban. Vui lòng thử lại sau.' : 
        'Không thể thêm phòng ban mới. Vui lòng thử lại sau.';
      setError(errorMessage);
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  // Handle checkbox selection for a single department with Shift+click support
  const handleSelectDepartment = (departmentId, event) => {
    setSelectedDepartments(prev => {
      // Simple toggle if not using shift
      if (!event.shiftKey || !lastSelectedRef.current) {
        lastSelectedRef.current = departmentId;
        
        if (prev.includes(departmentId)) {
          return prev.filter(id => id !== departmentId);
        } else {
          return [...prev, departmentId];
        }
      }
      
      // Handle shift+click to select a range
      const currentPage = paginatedDepartments.map(dept => dept.departmentId);
      const lastSelectedIndex = currentPage.indexOf(lastSelectedRef.current);
      const currentIndex = currentPage.indexOf(departmentId);
      
      if (lastSelectedIndex === -1 || currentIndex === -1) {
        // If we can't find the indices, just toggle this item
        lastSelectedRef.current = departmentId;
        
        if (prev.includes(departmentId)) {
          return prev.filter(id => id !== departmentId);
        } else {
          return [...prev, departmentId];
        }
      }
      
      // Determine the range to select
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const rangeToSelect = currentPage.slice(start, end + 1);
      
      // Update the last selected ref
      lastSelectedRef.current = departmentId;
      
      // Add all in the range to selected
      const newSelected = [...new Set([...prev, ...rangeToSelect])];
      
      return newSelected;
    });
  };
  
  // Handle select/deselect all departments on current page
  const handleSelectAllDepartments = (e) => {
    if (e.target.checked) {
      const currentPageIds = paginatedDepartments.map(dept => dept.departmentId);
      setSelectedDepartments([...new Set([...selectedDepartments, ...currentPageIds])]);
    } else {
      const currentPageIds = paginatedDepartments.map(dept => dept.departmentId);
      setSelectedDepartments(selectedDepartments.filter(id => !currentPageIds.includes(id)));
    }
    
    // Reset last selected when selecting/deselecting all
    lastSelectedRef.current = null;
  };
  
  // Check if all departments on current page are selected
  const areAllCurrentPageDepartmentsSelected = paginatedDepartments.length > 0 && 
    paginatedDepartments.every(dept => selectedDepartments.includes(dept.departmentId));
  
  // Handle bulk delete action
  const handleBulkDelete = async () => {
    setIsConfirmDialogOpen(false);
    
    if (selectedDepartments.length === 0) return;
    
    setLoading(true);
    setProcessingBulkDelete(true);
    
    // Show initial processing notification
    setNotification({
      type: 'warning',
      message: `Đang xử lý yêu cầu xóa ${selectedDepartments.length} phòng ban...`
    });
    
    // Keep track of successful and failed deletions
    let successCount = 0;
    let errorCount = 0;
    let errorMessages = [];
    let departmentsWithConstraints = [];
    
    // Get names for all selected departments for better UX
    const deptNamesMap = {};
    selectedDepartments.forEach(deptId => {
      const dept = departments.find(d => d.departmentId === deptId);
      if (dept) {
        deptNamesMap[deptId] = dept.name;
      }
    });
    
    // Process departments in batches to avoid overwhelming the server
    const batchSize = 5;
    const totalBatches = Math.ceil(selectedDepartments.length / batchSize);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      // Update progress in notification if multiple batches
      if (totalBatches > 1 && batchIndex > 0) {
        setNotification({
          type: 'warning',
          message: `Đang xử lý... (${batchIndex}/${totalBatches} lô) - Đã xóa: ${successCount}, Lỗi: ${errorCount}`
        });
      }
      
      const start = batchIndex * batchSize;
      const batch = selectedDepartments.slice(start, start + batchSize);
      
      // Process the batch in parallel
      const batchPromises = batch.map(async (departmentId) => {
        try {
          // First check if department has any members
          const memberCount = await departmentService.getMemberCount(eventId, departmentId);
          
          if (memberCount > 0) {
            const deptName = deptNamesMap[departmentId] || `ID: ${departmentId}`;
            departmentsWithConstraints.push({ name: deptName, reason: `có ${memberCount} thành viên` });
            return {
              success: false,
              departmentId,
              error: `Phòng ban "${deptName}" có ${memberCount} thành viên và không thể xóa.`
            };
          }
          
          // Check for tasks
          const tasksCheck = await departmentService.checkDepartmentHasTasks(eventId, departmentId);
          if (tasksCheck.hasTasks) {
            const deptName = deptNamesMap[departmentId] || `ID: ${departmentId}`;
            departmentsWithConstraints.push({ name: deptName, reason: `có ${tasksCheck.taskCount} nhiệm vụ` });
            return {
              success: false,
              departmentId,
              error: `Phòng ban "${deptName}" có ${tasksCheck.taskCount} nhiệm vụ và không thể xóa.`
            };
          }
          
          // Try to delete the department
          await departmentService.deleteDepartment(eventId, departmentId);
          return { success: true, departmentId };
        } catch (error) {
          const deptName = deptNamesMap[departmentId] || `ID: ${departmentId}`;
          
          let errorMsg = `Không thể xóa "${deptName}"`;
          if (error.message) {
            if (error.message.includes('constraint') || error.message.includes('ràng buộc')) {
              errorMsg += ': có dữ liệu liên quan';
              departmentsWithConstraints.push({ name: deptName, reason: 'có dữ liệu liên quan' });
            } else {
              errorMsg += `: ${error.message}`;
            }
          }
          
          return {
            success: false,
            departmentId,
            error: errorMsg
          };
        }
      });
      
      const results = await Promise.all(batchPromises);
      
      // Count successes and failures
      results.forEach(result => {
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          errorMessages.push(result.error);
        }
      });
      
      // Update the departments list by removing successfully deleted departments
      const successfullyDeletedIds = results
        .filter(result => result.success)
        .map(result => result.departmentId);
        
      setDepartments(prev => 
        prev.filter(dept => !successfullyDeletedIds.includes(dept.departmentId))
      );
      
      // Update the selected departments list
      setSelectedDepartments(prev => 
        prev.filter(id => !successfullyDeletedIds.includes(id))
      );
    }
    
    setLoading(false);
    setProcessingBulkDelete(false);
    
    // Show detailed result notification
    if (successCount > 0 && errorCount === 0) {
      setNotification({
        type: 'success',
        message: `Đã xóa thành công ${successCount} phòng ban.`
      });
    } else if (successCount > 0 && errorCount > 0) {
      // Create a more detailed message for mixed results
      let message = `Đã xóa ${successCount} phòng ban, nhưng ${errorCount} phòng ban không thể xóa.`;
      
      if (departmentsWithConstraints.length > 0) {
        if (departmentsWithConstraints.length <= 2) {
          // Show specific details for a few departments
          message += " " + departmentsWithConstraints
            .map(d => `"${d.name}" (${d.reason})`)
            .join(", ");
        } else {
          // Just mention the most common issue
          const mainReason = departmentsWithConstraints[0].reason;
          message += ` Hầu hết lỗi do phòng ban ${mainReason}.`;
        }
      }
      
      setNotification({
        type: 'warning',
        message: message
      });
      console.error('Bulk delete errors:', errorMessages);
    } else if (errorCount > 0) {
      // Detailed error message
      let message = `Không thể xóa phòng ban nào.`;
      
      if (departmentsWithConstraints.length > 0) {
        if (departmentsWithConstraints.length <= 2) {
          message += " " + departmentsWithConstraints
            .map(d => `"${d.name}" (${d.reason})`)
            .join(", ");
        } else {
          const mainReason = departmentsWithConstraints[0].reason;
          message += ` Hầu hết phòng ban ${mainReason}.`;
        }
      } else if (errorMessages.length === 1) {
        message += ` ${errorMessages[0]}`;
      }
      
      setNotification({
        type: 'error',
        message: message
      });
      console.error('Bulk delete errors:', errorMessages);
    }
  };

  if (loading && !processingBulkDelete) return <div className="flex items-center justify-center h-64">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <Layout activeItem="departments">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Departments</h1>
      
        </div>
        <hr className="mb-6" />

        {/* Search and Add Bar */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAddDepartment}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition duration-200"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add New Department
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div 
          className={`mb-4 p-3 border rounded-md shadow-sm flex items-center justify-between transition-all duration-300 ${
            selectedDepartments.length > 0 
              ? 'opacity-100 bg-blue-50 border-blue-200 transform translate-y-0' 
              : 'opacity-0 bg-gray-50 border-gray-200 transform -translate-y-4 pointer-events-none absolute'
          }`}
          style={{
            height: selectedDepartments.length > 0 ? 'auto' : '0',
            overflow: 'hidden',
            zIndex: selectedDepartments.length > 0 ? '10' : '-1',
          }}
        >
          <div className="flex items-center">
            <span className="text-blue-700 font-medium flex items-center">
              <FontAwesomeIcon icon={faCheckSquare} className="mr-2" />
              <span>
                {selectedDepartments.length} department{selectedDepartments.length !== 1 ? 's' : ''} selected
              </span>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDepartments([])}
              className="px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Clear selection
            </button>
            <button
              onClick={() => setIsConfirmDialogOpen(true)}
              className="px-3 py-1.5 text-white bg-red-600 rounded hover:bg-red-700 flex items-center transition-colors"
              style={{ 
                animation: selectedDepartments.length >= 5 ? 'pulse 2s infinite' : 'none',
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
              Delete Selected
            </button>
          </div>
        </div>
        
        {/* Department Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pl-5 pr-2 py-4 w-10">
                  <div className="relative" title="Select/Deselect all departments on this page">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 hover:ring-2 hover:ring-blue-300 transition-all"
                      checked={areAllCurrentPageDepartmentsSelected}
                      ref={(el) => {
                        if (el) {
                          const hasSelected = paginatedDepartments.some(dept => 
                            selectedDepartments.includes(dept.departmentId)
                          );
                          el.indeterminate = hasSelected && !areAllCurrentPageDepartmentsSelected;
                        }
                      }}
                      onChange={handleSelectAllDepartments}
                    />
                    {selectedDepartments.length > 0 && !areAllCurrentPageDepartmentsSelected && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </th>
                <th className="px-3 py-4 text-sm font-medium text-gray-600">Dept ID</th>
                <th className="px-3 py-4 text-sm font-medium text-gray-600">Department Name</th>
                <th className="px-3 py-4 text-sm font-medium text-gray-600">Members</th>
                <th className="px-3 py-4 text-center text-sm font-medium text-gray-600 w-32">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedDepartments.map((department) => (
                <tr 
                  key={department.departmentId} 
                  className={`hover:bg-gray-50 transition-all duration-200 ${
                    selectedDepartments.includes(department.departmentId) 
                      ? 'bg-blue-50 shadow-sm' 
                      : ''
                  }`}
                  style={{
                    animation: selectedDepartments.includes(department.departmentId) ? 'highlight 1s ease-out' : 'none'
                  }}
                >
                  <td className="pl-5 pr-2 py-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className={`form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 hover:ring-2 hover:ring-blue-300 transition-all ${
                          selectedDepartments.includes(department.departmentId) ? 'scale-110' : ''
                        }`}
                        checked={selectedDepartments.includes(department.departmentId)}
                        onChange={(e) => handleSelectDepartment(department.departmentId, e)}
                        title="Select department (use Shift+click to select a range)"
                      />
                      {selectedDepartments.includes(department.departmentId) && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {department.deptNo ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-blue-700">{department.deptNo}</span>
                        <span className="text-xs text-gray-500">ID: {department.departmentId}</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-800">
                        DEPT-{String(department.departmentId).padStart(3, '0')}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-800 font-medium">{department.name}</td>
                  <td className="px-3 py-4 text-sm text-gray-600">
                    {department.loadedMemberCount !== undefined ? (
                      <span className="font-medium">{department.loadedMemberCount}</span>
                    ) : (
                      <span className="text-gray-400">Đang tải...</span>  
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center space-x-1">
                      <button 
                        onClick={() => handleViewDepartment(department.departmentId)}
                        className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
                        title="View"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        onClick={() => handleEditDepartment(department.departmentId)}
                        className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleDeleteDepartment(department.departmentId)}
                        className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-red-500"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {filteredDepartments.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredDepartments.length)} of {filteredDepartments.length} departments
          </div>
          <div className="flex justify-center items-center space-x-1">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 text-sm rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Department Form Modal */}
        <DepartmentFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          department={selectedDepartment}
          onSubmit={handleSubmitDepartment}
        />

        {/* Department Detail Modal */}
        <DepartmentDetailModal 
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          department={selectedDepartment}
        />

        {/* Confirmation Dialog for Bulk Actions */}
        <ConfirmationDialog
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleBulkDelete}
          title="Xác nhận xóa nhiều phòng ban"
          message={`Bạn có chắc chắn muốn xóa ${selectedDepartments.length} phòng ban đã chọn? Hành động này không thể hoàn tác.`}
          confirmButtonText="Xóa"
        />

        {/* Notification */}
        {notification && (
          <Notification 
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
      
      {/* Bulk Action Floating Button (Mobile) */}
      {selectedDepartments.length > 0 && (
        <div 
          className="fixed bottom-5 right-5 z-40 md:hidden"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div className="bg-blue-600 text-white rounded-full shadow-lg flex items-center p-3">
            <div className="flex items-center gap-2">
              <span className="bg-white text-blue-600 w-6 h-6 flex items-center justify-center rounded-full font-bold">
                {selectedDepartments.length}
              </span>
              <button
                onClick={() => setIsConfirmDialogOpen(true)}
                className="flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Form Modal for Add/Edit */}
      <DepartmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={selectedDepartment}
        onSubmit={handleSubmitDepartment}
      />
      
      {/* Detail Modal for View */}
      <DepartmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        department={departmentDetail}
        onEdit={handleEditDepartment}
      />
      
      {/* Notification - this one rendered at the component level for better positioning */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </Layout>
  );
};

export default DepartmentManagementPage;
