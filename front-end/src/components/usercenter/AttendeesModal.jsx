import React, { useState, useEffect } from 'react';
import { getEventMembers, updateTaskAttendees } from '../../services/profileService';

const AttendeesModal = ({ 
  isOpen, 
  onClose, 
  attendees, 
  loading, 
  taskData,
  onAttendeeUpdated
}) => {
  const [editing, setEditing] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Khởi tạo danh sách attendees được chọn từ prop attendees
  useEffect(() => {
    if (attendees && attendees.length > 0) {
      setSelectedAttendees(attendees.map(a => a.accountId));
    }
  }, [attendees]);

  // Hàm bắt đầu chỉnh sửa danh sách attendees
  const handleStartEditing = async () => {
    if (!taskData || !taskData.eventId) return;
    
    setEditing(true);
    setLoadingMembers(true);
    setError(null);
    
    try {
      const members = await getEventMembers(taskData.eventId);
      setAvailableMembers(members || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách thành viên:", err);
      setError("Không thể tải danh sách thành viên sự kiện");
    } finally {
      setLoadingMembers(false);
    }
  };

  // Hàm để toggle chọn/bỏ chọn attendee
  const handleAttendeeToggle = (accountId) => {
    // Không cho phép bỏ chọn người được giao task (leader)
    if (taskData && accountId === taskData.assignedToAccountId) return;
    
    setSelectedAttendees(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId);
      } else {
        return [...prev, accountId];
      }
    });
  };

  // Hàm cập nhật danh sách attendees
  const handleSaveAttendees = async () => {
    if (!taskData || !taskData.taskId) return;
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updateTaskAttendees(taskData.taskId, selectedAttendees);
      setSuccess("Cập nhật người tham gia thành công");
      setEditing(false);
      
      // Thông báo cho component cha để refresh lại danh sách attendees
      if (onAttendeeUpdated) {
        onAttendeeUpdated();
      }
      
      // Tự động đóng thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error("Lỗi khi cập nhật người tham gia:", err);
      setError(err.message || "Không thể cập nhật người tham gia");
    } finally {
      setSubmitting(false);
    }
  };

  // Hàm hủy chỉnh sửa
  const handleCancelEditing = () => {
    setEditing(false);
    // Reset lại danh sách selected attendees về trạng thái ban đầu
    if (attendees && attendees.length > 0) {
      setSelectedAttendees(attendees.map(a => a.accountId));
    }
  };

  // Hàm hiển thị màu sắc và text cho status
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'INVITED':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'Đã mời'
        };
      case 'ACCEPTED':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Đã chấp nhận'
        };
      case 'DECLINED':
        return {
          color: 'bg-red-100 text-red-800',
          text: 'Từ chối'
        };
      case 'ATTENDED':
        return {
          color: 'bg-purple-100 text-purple-800',
          text: 'Đã tham gia'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: status || 'Không xác định'
        };
    }
  };

  if (!isOpen) return null;

  const canEdit = taskData && (
    taskData.assignedToAccountId === (taskData.currentUser?.id || taskData.currentUser?.accountId) || 
    taskData.assignedByAccountId === (taskData.currentUser?.id || taskData.currentUser?.accountId)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold">Người tham gia task</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {!editing ? (
            <>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : attendees?.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {attendees.map(attendee => {
                      const statusDisplay = getStatusDisplay(attendee.status);
                      return (
                        <div 
                          key={attendee.accountId} 
                          className={`flex items-center p-3 border rounded-lg ${
                            taskData && attendee.accountId === taskData.assignedToAccountId 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex-shrink-0 mr-3">
                            {attendee.avatarUrl ? (
                              <img 
                                src={attendee.avatarUrl} 
                                alt={attendee.accountName} 
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                                {(attendee.accountName || attendee.name || "?").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">
                              {attendee.accountName || attendee.name || "Không có tên"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {attendee.email || "Không có email"}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {/* Hiển thị badge leader */}
                            {taskData && attendee.accountId === taskData.assignedToAccountId && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                Leader
                              </span>
                            )}
                            
                            {/* Hiển thị badge status */}
                            <span className={`px-2 py-1 ${statusDisplay.color} text-xs rounded-full font-medium`}>
                              {statusDisplay.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {canEdit && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={handleStartEditing}
                        className="px-4 py-2 bg-[#00155c] hover:bg-[#172c70] text-white rounded-lg flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Chỉnh sửa người tham gia
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>Chưa có người tham gia nào</p>
                  
                  {canEdit && (
                    <button
                      onClick={handleStartEditing}
                      className="mt-4 px-4 py-2 bg-[#00155c] hover:bg-[#172c70] text-white rounded-lg"
                    >
                      Thêm người tham gia
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Chọn thành viên tham gia task này. Người được giao task (Leader) luôn được đánh dấu tham gia.
              </div>
              
              {loadingMembers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                  {availableMembers.length > 0 ? (
                    <div className="divide-y">
                      {availableMembers.map(member => {
                        // Tìm thông tin status nếu người này đã là attendee
                        const existingAttendee = attendees?.find(a => a.accountId === member.accountId);
                        const status = existingAttendee?.status;
                        const statusDisplay = status ? getStatusDisplay(status) : null;
                        
                        return (
                          <div 
                            key={member.accountId}
                            className={`p-3 ${
                              member.accountId === taskData?.assignedToAccountId
                                ? 'bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <label className="flex items-center cursor-pointer w-full">
                              <input 
                                type="checkbox"
                                checked={selectedAttendees.includes(member.accountId)}
                                onChange={() => handleAttendeeToggle(member.accountId)}
                                disabled={member.accountId === taskData?.assignedToAccountId}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                              />
                              <div className="ml-3 flex items-center flex-grow">
                                <div className="flex-shrink-0 mr-3">
                                  {member.avatarUrl ? (
                                    <img 
                                      src={member.avatarUrl} 
                                      alt={member.name} 
                                      className="h-8 w-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                                      {(member.name || "?").charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{member.name || member.fullName}</div>
                                  <div className="text-xs text-gray-500">{member.email}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                {member.accountId === taskData?.assignedToAccountId && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    Leader
                                  </span>
                                )}
                                
                                {/* Hiển thị status hiện tại nếu có */}
                                {statusDisplay && (
                                  <span className={`ml-2 px-2 py-1 ${statusDisplay.color} text-xs rounded-full font-medium`}>
                                    {statusDisplay.text}
                                  </span>
                                )}
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Không có thành viên nào trong sự kiện
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-2 mb-4 bg-yellow-50 p-3 rounded-lg text-sm text-yellow-700">
                <p className="font-semibold">Lưu ý về trạng thái người tham gia:</p>
                <ul className="mt-1 list-disc list-inside">
                  <li>Người được thêm mới sẽ có trạng thái <span className="font-medium">Đã mời</span></li>
                  <li>Leader luôn có trạng thái <span className="font-medium">Đã chấp nhận</span></li>
                  <li>Trạng thái hiện tại sẽ được giữ nguyên cho những người đã tham gia</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelEditing}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveAttendees}
                  disabled={submitting || loadingMembers}
                  className={`px-4 py-2 rounded-lg ${
                    submitting || loadingMembers
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#00155c] hover:bg-[#172c70] text-white'
                  }`}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </>
          )}
          
          {/* Giải thích về các trạng thái */}
          {!editing && attendees?.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Các trạng thái người tham gia:</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-sm text-gray-600">Đã mời: Chờ phản hồi</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm text-gray-600">Đã chấp nhận: Đồng ý tham gia</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-sm text-gray-600">Từ chối: Không tham gia</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-sm text-gray-600">Đã tham gia: Hoàn thành</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeesModal;