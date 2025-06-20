import React, { useEffect, useState } from 'react';
import { getTaskDetails, updateTaskStatus, getUserProfile, getTaskAttendees } from '../../services/profileService';
import AttendeesModal from './AttendeesModal';

const TaskDetails = ({ taskId, isOpen, onClose, onTaskUpdated }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // State cho attendees
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);

  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile({ requireAuth: true });
        setCurrentUser(userProfile);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchTaskDetails = async () => {
    if (!isOpen || !taskId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTaskDetails(taskId);
      if (data) {
        setTask(data);
      } else {
        setError('Không thể tải thông tin chi tiết task');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải thông tin chi tiết task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId, isOpen]);

  // Hàm fetch attendees
  const fetchAttendees = async () => {
    if (!taskId) return;
    
    setLoadingAttendees(true);
    try {
      const data = await getTaskAttendees(taskId);
      if (data) {
        setAttendees(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách người tham gia:", err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleOpenAttendeesModal = () => {
    if (attendees.length === 0) {
      fetchAttendees();
    }
    setShowAttendeesModal(true);
  };

  // Đóng modal attendees
  const handleCloseAttendeesModal = () => {
    setShowAttendeesModal(false);
  };

  // Kiểm tra quyền cập nhật trạng thái
  const canUpdateStatus = (status, newStatus) => {
    if (!currentUser || !task) return false;

    const currentUserId = currentUser.id;
    
    // Chỉ người được giao task mới có thể cập nhật từ TODO sang DOING và DOING sang REVIEW
    if (currentUserId === task.assignedToAccountId) {
      if (status === 'TODO' && newStatus === 'DOING') return true;
      if (status === 'DOING' && newStatus === 'REVIEW') return true;
    }
    
    // Chỉ người giao task mới có thể cập nhật từ REVIEW sang DONE
    if (currentUserId === task.assignedByAccountId) {
      if (status === 'REVIEW' && newStatus === 'DONE') return true;
    }
    
    return false;
  };

  // Xử lý cập nhật trạng thái
  const handleStatusUpdate = async (newStatus) => {
    if (!task) return;
    
    // Kiểm tra quyền cập nhật
    if (!canUpdateStatus(task.status, newStatus)) {
      setUpdateMessage({ 
        type: 'error', 
        text: 'Bạn không có quyền cập nhật trạng thái này' 
      });
      return;
    }
    
    setUpdating(true);
    setUpdateMessage(null);
    
    try {
      await updateTaskStatus(taskId, newStatus);
      setUpdateMessage({ type: 'success', text: `Đã cập nhật trạng thái thành ${newStatus}` });
      
      // Cập nhật lại dữ liệu
      await fetchTaskDetails();
      
      // Thông báo cho component cha
      if (onTaskUpdated) {
        onTaskUpdated();
      }
      
      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái task:", err);
      let errorMessage = "Không thể cập nhật trạng thái task";
      
      if (err.response) {
        // Trích xuất thông báo lỗi cụ thể từ API
        errorMessage = err.response.data || errorMessage;
      }
      
      setUpdateMessage({ type: 'error', text: errorMessage });
    } finally {
      setUpdating(false);
    }
  };

  // Hiển thị nút tương ứng với trạng thái và quyền
  const renderActionButton = () => {
    if (!task || !currentUser || updating) return null;
    console.log(task);
    
    const currentUserId = currentUser.id;
    const isAssignee = currentUserId === task.assignedToAccountId;
    const isCreator = currentUserId === task.assignedByAccountId;
    
    // Người được giao task có thể đổi TODO -> DOING
    if (task.status === 'TODO' && isAssignee) {
      return (
        <button 
          onClick={() => handleStatusUpdate('DOING')}
          className="bg-blue-100 text-blue-800 px-6 py-2 rounded-full font-semibold hover:bg-blue-200"
          disabled={updating}
        >
          {updating ? 'Đang cập nhật...' : 'BẮT ĐẦU LÀM'}
        </button>
      );
    }
    
    // Người được giao task có thể đổi DOING -> REVIEW
    else if (task.status === 'DOING' && isAssignee) {
      return (
        <button 
          onClick={() => handleStatusUpdate('REVIEW')}
          className="bg-green-100 text-green-800 px-6 py-2 rounded-full font-semibold hover:bg-green-200"
          disabled={updating}
        >
          {updating ? 'Đang cập nhật...' : 'YÊU CẦU XEM XÉT'}
        </button>
      );
    }
    
    // Người giao task có thể đổi REVIEW -> DONE
    else if (task.status === 'REVIEW' && isCreator) {
      return (
        <button 
          onClick={() => handleStatusUpdate('DONE')}
          className="bg-purple-100 text-purple-800 px-6 py-2 rounded-full font-semibold hover:bg-purple-200"
          disabled={updating}
        >
          {updating ? 'Đang cập nhật...' : 'ĐÁNH DẤU HOÀN THÀNH'}
        </button>
      );
    }
    
    return null;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <header className="flex justify-between items-center mb-4">
              <button onClick={onClose} className="text-[#00155c] hover:text-[#172c70] font-medium">
                ← Quay lại danh sách
              </button>
              <div className="flex space-x-4">
                {/* Nút mở modal attendees */}
                <button 
                  onClick={handleOpenAttendeesModal}
                  className="text-[#00155c] hover:text-[#172c70] font-medium flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Người tham gia
                </button>
                <button className="text-[#00155c] hover:text-[#172c70] font-medium">
                  Xem phản hồi →
                </button>
              </div>
            </header>

            {/* Thông báo khi cập nhật trạng thái */}
            {updateMessage && (
              <div 
                className={`mb-4 p-3 rounded-md ${
                  updateMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {updateMessage.text}
              </div>
            )}

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00155c] mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">Lỗi: {error}</div>
            ) : task ? (
              <>
                <h2 className="text-2xl font-bold mb-4">{task.title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <strong>Ngày hết hạn:</strong> {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Độ ưu tiên:</strong> {task.priority}
                  </div>
                  
                  <div>
                    <strong>Trạng thái:</strong> {task.status}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Mô tả:</h3>
                  <p>{task.description}</p>
                </div>

                <div className="text-center mt-6">
                  {updating ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00155c] mr-3"></div>
                      <span>Đang cập nhật trạng thái...</span>
                    </div>
                  ) : renderActionButton()}
                </div>
              </>
            ) : (
              <div className="p-4 text-center">Không tìm thấy thông tin task</div>
            )}
          </div>
        </div>
      </div>

      <AttendeesModal
        isOpen={showAttendeesModal}
        onClose={handleCloseAttendeesModal}
        attendees={attendees}
        loading={loadingAttendees}
        taskData={task}  
      />
    </>
  );
};

export default TaskDetails;