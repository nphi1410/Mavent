import React, { useEffect, useState } from 'react';
import { getTaskDetails, updateTaskStatus, getUserProfile, getTaskAttendees, getTaskDocuments, updateAttendeeStatus } from '../../services/profileService';
import AttendeesModal from './AttendeesModal';
import UpdateTaskModal from './UpdateTaskModal';
import TaskFeedbackModal from './TaskFeedbackModal';

const TaskDetails = ({ taskId, isOpen, onClose, onTaskUpdated }) => {
  // State hiện tại
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

  // State cho documents
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // state cho update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // state cho feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // State cho attendee actions
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile({ requireAuth: true });
        setCurrentUser(userProfile);
      } catch (err) {
        console.error("Error fetch profile:", err);
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
        await fetchDocuments();
        // Fetch attendees ngay để kiểm tra status
        await fetchAttendees();
      } else {
        setError('Failed to load task details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading task details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId, isOpen]);

  // fetch attendees
  const fetchAttendees = async () => {
    if (!taskId) return;

    setLoadingAttendees(true);
    try {
      const data = await getTaskAttendees(taskId);
      if (data) {
        setAttendees(data);
      }
    } catch (err) {
      console.error("Error while loading attendee list:", err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const fetchDocuments = async () => {
    if (!taskId) return;

    setLoadingDocuments(true);
    try {
      const data = await getTaskDocuments(taskId);
      if (data) {
        setDocuments(data);
      }
    } catch (err) {
      console.error("Error while loading documents:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleOpenAttendeesModal = () => {
    if (attendees.length === 0) {
      fetchAttendees();
    }
    setShowAttendeesModal(true);
  };

  const handleCloseAttendeesModal = () => {
    setShowAttendeesModal(false);
  };

  const handleAttendeeUpdated = () => {
    fetchAttendees();
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  // Cập nhật hàm canUpdateStatus để cho phép người tạo hủy task
  const canUpdateStatus = (status, newStatus) => {
    if (!currentUser || !task) return false;

    const currentUserId = currentUser.id;

    if (currentUserId === task.assignedToAccountId) {
      if (status === 'TODO' && newStatus === 'DOING') return true;
      if (status === 'DOING' && newStatus === 'REVIEW') return true;
      if (status === 'OVERDUE' && newStatus === 'REVIEW') return true;
    }

    if (currentUserId === task.assignedByAccountId) {
      if (status === 'REVIEW' && newStatus === 'DONE') return true;
      // Thêm quyền hủy task cho người tạo task với các trạng thái hợp lệ
      if (newStatus === 'CANCELLED' && !['DONE', 'REJECTED', 'CANCELLED'].includes(status)) return true;
    }

    return false;
  };

  const renderActionButton = () => {
    if (!task || !currentUser || updating) return null;

    const currentUserId = currentUser.id;
    const isAssignee = currentUserId === task.assignedToAccountId;
    const isCreator = currentUserId === task.assignedByAccountId;
    const canCancelTask = isCreator && !['DONE', 'REJECTED', 'CANCELLED'].includes(task.status);
    // console.log(canCancelTask, task.status, isCreator);

    // Helper: Nút Cancel (tránh lặp code)
    const renderCancelButton = () => (
      <button
        onClick={() => handleStatusUpdate('CANCELLED')}
        className="bg-red-100 text-red-800 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition-all duration-200"
        disabled={updating}
      >
        {updating ? 'Updating...' : 'CANCEL TASK'}
      </button>
    );

    const renderButtons = (buttons) => (
      <div className="flex justify-center flex-wrap gap-3 mt-4">
        {buttons}
        {canCancelTask && renderCancelButton()}
      </div>
    );

    // START DOING
    if (task.status === 'TODO' && (isAssignee)) {
      return renderButtons([
        <button
          key="start"
          onClick={() => handleStatusUpdate('DOING')}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-medium hover:bg-blue-200 transition-all duration-200"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'START DOING'}
        </button>
      ]);
    }

    // REVIEWING
    if (task.status === 'DOING' && (isAssignee)) {
      return renderButtons([
        <button
          key="review"
          onClick={() => handleStatusUpdate('REVIEW')}
          className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-medium hover:bg-green-200 transition-all duration-200"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'REVIEWING'}
        </button>
      ]);
    }

    // MARK AS DONE
    if (task.status === 'REVIEW' && isCreator) {
      return renderButtons([
        <button
          key="done"
          onClick={() => handleStatusUpdate('DONE')}
          className="bg-purple-100 text-purple-800 px-4 py-2 rounded-xl font-medium hover:bg-purple-200 transition-all duration-200"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'MARK AS DONE'}
        </button>
      ]);
    }

    // OVERDUE → vẫn cho assignee hoặc creator gửi REVIEW
    if (task.status === 'OVERDUE' && (isAssignee || isCreator)) {
      return renderButtons([
        <button
          key="review-overdue"
          onClick={() => handleStatusUpdate('REVIEW')}
          className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-medium hover:bg-green-200 transition-all duration-200"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'REVIEWING'}
        </button>
      ]);
    }

    if (canCancelTask) {
      return renderButtons([]);
    }
    return null;
  };



  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleTaskUpdated = async () => {
    await fetchTaskDetails();
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  const canUpdateTask = () => {
    if (!currentUser || !task) return false;

    return currentUser.id === task.assignedByAccountId;
  };

  const handleOpenFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  // Cập nhật hàm handleStatusUpdate để thêm xác nhận khi hủy task
  const handleStatusUpdate = async (newStatus) => {
    if (!task) return;

    // Hiện hộp thoại xác nhận khi hủy task
    if (newStatus === 'CANCELLED') {
      const confirmed = window.confirm("Are you sure you want to cancel this task? This action cannot be undone.");
      if (!confirmed) return;
    }

    if (!canUpdateStatus(task.status, newStatus)) {
      setUpdateMessage({
        type: 'error',
        text: 'You do not have permission to update this status'
      });
      return;
    }

    setUpdating(true);
    setUpdateMessage(null);

    try {
      await updateTaskStatus(taskId, newStatus);

      // Hiển thị thông báo thành công với nội dung phù hợp
      if (newStatus === 'CANCELLED') {
        setUpdateMessage({ type: 'success', text: 'Task has been cancelled successfully' });
      } else {
        setUpdateMessage({ type: 'success', text: `Status has been updated to ${newStatus}` });
      }

      await fetchTaskDetails();

      if (onTaskUpdated) {
        onTaskUpdated();
      }

      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);

    } catch (err) {
      console.error("An error occurred while updating the task status:", err);
      let errorMessage = "Failed to update the task status";

      if (err.response) {
        errorMessage = err.response.data || errorMessage;
      }

      setUpdateMessage({ type: 'error', text: errorMessage });
    } finally {
      setUpdating(false);
    }
  };

  // Thêm functions xử lý accept/decline
  const handleAcceptTask = async () => {
    try {
      await updateAttendeeStatus(taskId, currentUser.id, 'ACCEPTED');
      setUpdateMessage({ type: 'success', text: 'Đã xác nhận tham gia task' });
      // Refresh attendees để cập nhật status
      await fetchAttendees();
    } catch (err) {
      setUpdateMessage({ type: 'error', text: 'Không thể xác nhận tham gia task' });
    }
  };

  const handleDeclineTask = async () => {
    if (!declineReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    
    try {
      await updateAttendeeStatus(taskId, currentUser.id, 'DECLINED', declineReason);
      setUpdateMessage({ type: 'success', text: 'Đã gửi yêu cầu từ chối task' });
      setShowDeclineModal(false);
      setDeclineReason('');
      // Refresh attendees để cập nhật status
      await fetchAttendees();
    } catch (err) {
      setUpdateMessage({ type: 'error', text: 'Không thể gửi yêu cầu từ chối task' });
    }
  };

  const renderAttendeeActions = () => {
    // Kiểm tra xem user có phải là attendee không và có status INVITED
    if (!currentUser || !attendees || attendees.length === 0) {
      return null;
    }

    const currentAttendee = attendees.find(a => a.accountId === currentUser.id);
    
    // Chỉ hiển thị khi user có status INVITED
    if (!currentAttendee || currentAttendee.status !== 'INVITED') {
      return null;
    }
    
    return (
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 mb-3">
          Bạn được mời tham gia task này. Vui lòng xác nhận:
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAcceptTask}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={updating}
          >
            Accept Task
          </button>
          <button
            onClick={() => setShowDeclineModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            disabled={updating}
          >
            Reject Task
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] flex justify-center items-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <header className="flex justify-between items-center mb-4">
              <button onClick={onClose} className="text-[#00155c] hover:text-[#172c70] font-medium">
                ← Back to Task List
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
                  Attendees
                </button>

                {/* Nút chỉnh sửa task - chỉ hiển thị nếu có quyền */}
                {task && canUpdateTask() && (
                  <button
                    onClick={handleOpenUpdateModal}
                    className="text-[#00155c] hover:text-[#172c70] font-medium flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Task
                  </button>
                )}

                {/* Cập nhật nút xem phản hồi */}
                <button
                  onClick={handleOpenFeedbackModal}
                  className="text-[#00155c] hover:text-[#172c70] font-medium flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  View Feedback
                </button>
              </div>
            </header>

            {/* Thông báo khi cập nhật trạng thái */}
            {updateMessage && (
              <div
                className={`mb-4 p-3 rounded-md ${updateMessage.type === 'success'
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
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">Error: {error}</div>
            ) : task ? (
              <>
                <h2 className="text-2xl font-bold mb-4">{task.title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Priority:</strong> {task.priority}
                  </div>

                  <div>
                    <strong>Status:</strong> {task.status}
                  </div>

                  {/* Thêm hiển thị department */}
                  <div>
                    <strong>Department:</strong> {task.departmentName || 'All departments'}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description:</h3>
                  <p>{task.description}</p>
                </div>

                <div className="text-center mt-6">
                  {updating ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00155c] mr-3"></div>
                      <span>Updating status...</span>
                    </div>
                  ) : renderActionButton()}
                </div>

                {/* Hiển thị attendee actions khi có status INVITED */}
                {renderAttendeeActions()}
              </>
            ) : (
              <div className="p-4 text-center">Can not find detail</div>
            )}
            {/* Thêm section Documents */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Documents:</h3>
              {loadingDocuments ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00155c]"></div>
                  <span className="ml-2 text-gray-600">Loading documents...</span>
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.documentId} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        {doc.description && (
                          <p className="text-sm text-gray-600">{doc.description}</p>
                        )}
                      </div>
                      {doc.filePath && (
                        <a
                          href={doc.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 text-[#00155c] hover:text-[#172c70] font-medium text-sm"
                        >
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No documents attached to this task.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modal attendees */}
      <AttendeesModal
        isOpen={showAttendeesModal}
        onClose={handleCloseAttendeesModal}
        attendees={attendees}
        loading={loadingAttendees}
        taskData={{
          ...task,
          currentUser: currentUser
        }}
        onAttendeeUpdated={handleAttendeeUpdated}
      />

      {/* Modal cập nhật task */}
      <UpdateTaskModal
        isOpen={showUpdateModal}
        onClose={handleCloseUpdateModal}
        taskData={{ ...task, currentUser }}
        onTaskUpdated={handleTaskUpdated}
      />

      {/* Thêm TaskFeedbackModal */}
      <TaskFeedbackModal
        taskId={taskId}
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedbackModal}
        taskData={{
          ...task,
          currentUser: currentUser
        }}
      />

      {/* Modal từ chối task */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Từ chối tham gia task</h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              className="w-full h-24 p-3 border border-gray-300 rounded resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleDeclineTask}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Gửi yêu cầu từ chối
              </button>
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDetails;