import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getEventMembers, updateTask, getUserRoleInEvent, getTaskAttendees, getEventDepartments } from '../../services/profileService';

const UpdateTaskModal = ({ isOpen, onClose, taskData, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'MEDIUM',
    assignedToAccountId: '',
    departmentId: '' // Thêm departmentId
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [taskAttendees, setTaskAttendees] = useState([]);
  const [departments, setDepartments] = useState([]); // Thêm state departments
  const [loading, setLoading] = useState(false);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false); // Thêm state loading departments
  const [currentUserId, setCurrentUserId] = useState(null);

  // Khởi tạo form data khi taskData thay đổi
  useEffect(() => {
    if (taskData) {
      setError(""); // Reset error khi mở modal với dữ liệu mới
      
      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date(),
        priority: taskData.priority || 'MEDIUM',
        assignedToAccountId: taskData.assignedToAccountId || '',
        departmentId: taskData.departmentId || '' // Khởi tạo departmentId
      });

      // Lưu lại ID của người dùng hiện tại (từ dữ liệu task)
      if (taskData.currentUser) {
        console.log("Current user data:", taskData.currentUser);
        // Hỗ trợ cả id và accountId
        setCurrentUserId(taskData.currentUser.id || taskData.currentUser.accountId);
      }

      // Lấy danh sách attendees của task
      fetchTaskAttendees(taskData.taskId);

      // Lấy danh sách thành viên sự kiện
      fetchEventMembers(taskData.eventId);
      
      // Lấy danh sách departments của event
      fetchEventDepartments(taskData.eventId);
    }
  }, [taskData]);

  // Lấy danh sách departments của event
  const fetchEventDepartments = async (eventId) => {
    if (!eventId) return;
    
    setLoadingDepartments(true);
    try {
      const departments = await getEventDepartments(eventId);
      setDepartments(departments || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phòng ban:", err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Kiểm tra quyền chỉnh sửa task
  const hasEditPermission = () => {
    console.log("Checking edit permission for user ID:", currentUserId);
    console.log("Task data:", taskData);
    
    
    // Nếu chưa có thông tin task hoặc người dùng, không cho phép chỉnh sửa
    if (!taskData || !currentUserId) return false;
    console.log(taskData.assignedByAccountId, currentUserId);
    
    if (currentUserId === taskData.assignedToAccountId) return true;
    else return false;
    // Chỉ người giao task (assignedByAccountId) mới có quyền chỉnh sửa
    
  };

  // Lấy danh sách người tham gia task
  const fetchTaskAttendees = async (taskId) => {
    if (!taskId) return;
    
    setLoadingAttendees(true);
    try {
      const attendees = await getTaskAttendees(taskId);
      setTaskAttendees(attendees || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người tham gia task:", err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  // Lấy danh sách thành viên sự kiện
  const fetchEventMembers = async (eventId) => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const members = await getEventMembers(eventId);
      setMembers(members || []);

    } catch (err) {
      console.error("Lỗi khi tải danh sách thành viên sự kiện:", err);
      setError("Không thể tải danh sách thành viên sự kiện");
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra xem một thành viên có phải là người tham gia task không
  const isTaskAttendee = (accountId) => {
    return taskAttendees.some(attendee => String(attendee.accountId) === String(accountId));
  };

  // Lọc ra danh sách thành viên là người tham gia task
  const getAttendeeMembers = () => {
    return members.filter(member => isTaskAttendee(member.accountId));
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setError(""); // Reset thông báo lỗi chung
    
    // Xóa lỗi cụ thể khi người dùng thay đổi input
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Xử lý thay đổi ngày
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dueDate: date
    }));
    
    setError(""); // Reset thông báo lỗi chung
    
    if (formErrors.dueDate) {
      setFormErrors(prev => ({ ...prev, dueDate: null }));
    }
  };

  // Xử lý thay đổi người được giao task
  const handleAssigneeChange = (e) => {
    const assigneeId = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      assignedToAccountId: assigneeId
    }));
    
    setError(""); // Reset thông báo lỗi chung
    
    if (formErrors.assignedToAccountId) {
      setFormErrors(prev => ({ ...prev, assignedToAccountId: null }));
    }
  };

  // Thêm hàm xử lý thay đổi department
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      departmentId: departmentId
    }));
    
    setError(""); // Reset thông báo lỗi chung
    
    if (formErrors.departmentId) {
      setFormErrors(prev => ({ ...prev, departmentId: null }));
    }
  };

  // Kiểm tra form trước khi submit
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Tiêu đề là bắt buộc";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Mô tả là bắt buộc";
    }
    
    if (!formData.dueDate) {
      errors.dueDate = "Ngày hạn là bắt buộc";
    } else if (formData.dueDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      errors.dueDate = "Ngày hạn không thể là ngày trong quá khứ";
    }
    
    if (!formData.assignedToAccountId) {
      errors.assignedToAccountId = "Người được giao task là bắt buộc";
    } else if (!isTaskAttendee(formData.assignedToAccountId)) {
      errors.assignedToAccountId = "Người được giao task phải là người tham gia task";
    }
    
    // Bỏ validation cho departmentId
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(""); // Reset error khi người dùng submit form
    
    // Kiểm tra quyền chỉnh sửa trước khi submit
    if (!hasEditPermission()) {
      setError("Bạn không có quyền cập nhật task này. Chỉ người giao task mới có quyền chỉnh sửa.");
      return;
    }
    
    if (!validateForm()) return;
    
    // Tạo object updateData cơ bản
    const updateData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate.toISOString(),
      priority: formData.priority,
      eventId: taskData.eventId,
      assignedToAccountId: parseInt(formData.assignedToAccountId)
    };
    
    // Chỉ thêm departmentId nếu có giá trị
    if (formData.departmentId) {
      updateData.departmentId = parseInt(formData.departmentId);
    } else {
      // Gửi null để xóa departmentId nếu đã chọn "Không chọn phòng ban"
      updateData.departmentId = null;
    }
    
    console.log("Submitting update with data:", updateData);
    
    try {
      setSubmitting(true);
      const updatedTask = await updateTask(taskData.taskId, updateData);
      
      if (updatedTask) {
        if (onTaskUpdated) onTaskUpdated();
        handleClose();
      }
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message || 'Không thể cập nhật task');
    } finally {
      setSubmitting(false);
    }
  };

  // Cập nhật hàm onClose
  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  // Nếu người dùng không phải là người giao task, hiển thị thông báo
  const isNotTaskCreator = currentUserId && taskData && String(currentUserId) !== String(taskData.assignedByAccountId);
  
  // Danh sách thành viên đã là người tham gia task
  const attendeeMembers = getAttendeeMembers();

  return (
    <div className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold">Cập nhật task</h2>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Hiển thị thông báo lỗi hoặc cảnh báo không có quyền */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isNotTaskCreator ? (
            <div className="text-center py-8 bg-yellow-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">Quyền bị giới hạn</h3>
              <p className="text-yellow-700 max-w-md mx-auto">
                Bạn không có quyền chỉnh sửa task này. Chỉ người giao task mới có thể cập nhật thông tin task.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          ) : loading || loadingAttendees || loadingDepartments ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập tiêu đề task"
                  />
                  {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Mô tả chi tiết task"
                  />
                  {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày hạn <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      selected={formData.dueDate}
                      onChange={handleDateChange}
                      className={`w-full border ${formErrors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                    />
                    {formErrors.dueDate && <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mức độ ưu tiên
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Thấp</option>
                      <option value="MEDIUM">Trung bình</option>
                      <option value="HIGH">Cao</option>
                    </select>
                  </div>
                </div>

                {/* Thêm dropdown chọn department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng ban
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={handleDepartmentChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Không chọn phòng ban --</option>
                    {departments.map(department => (
                      <option key={department.departmentId} value={department.departmentId}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.departmentId && <p className="text-red-500 text-xs mt-1">{formErrors.departmentId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người được giao task (Leader) <span className="text-red-500">*</span>
                  </label>
                  
                  {taskAttendees.length > 0 ? (
                    <select
                      value={formData.assignedToAccountId}
                      onChange={handleAssigneeChange}
                      className={`w-full border ${formErrors.assignedToAccountId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">-- Chọn người được giao task --</option>
                      {attendeeMembers.map(member => (
                        <option key={member.accountId} value={member.accountId}>
                          {member.name || member.fullName} ({member.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md">
                      Chưa có người tham gia nào trong task. Vui lòng thêm người tham gia trước khi thay đổi Leader.
                    </div>
                  )}
                  
                  {formErrors.assignedToAccountId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.assignedToAccountId}</p>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-2">
                    * Chỉ người tham gia task mới có thể được chọn làm Leader
                  </p>
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-700 mb-1">Lưu ý:</p>
                  <p>Quản lý danh sách người tham gia task có thể được thực hiện thông qua nút "Người tham gia" trên màn hình chi tiết task.</p>
                </div>
              </div>

              <div className="flex justify-end mt-8 space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting || isNotTaskCreator}
                  className={`px-4 py-2 rounded-lg ${
                    submitting || isNotTaskCreator
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#00155c] hover:bg-[#172c70] text-white'
                  }`}
                >
                  {submitting ? 'Đang cập nhật...' : 'Cập nhật task'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateTaskModal;