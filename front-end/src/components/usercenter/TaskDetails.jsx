import React, { useEffect, useState } from 'react';
import { getTaskDetails, updateTaskStatus } from '../../services/profileService';

const TaskDetails = ({ taskId, isOpen, onClose, onTaskUpdated }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);

  const fetchTaskDetails = async () => {
    if (!isOpen || !taskId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTaskDetails(taskId);
      if (data) {
        setTask(data);
      } else {
        setError('Failed to load task details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching task details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId, isOpen]);

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    if (!task) return;
    
    setUpdating(true);
    setUpdateMessage(null);
    
    try {
      await updateTaskStatus(taskId, newStatus);
      setUpdateMessage({ type: 'success', text: `Task status updated to ${newStatus}` });
      
      // Refresh the task data
      await fetchTaskDetails();
      
      // Notify parent component that task was updated (to refresh the task list)
      if (onTaskUpdated) {
        onTaskUpdated();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error updating task status:", err);
      let errorMessage = "Failed to update task status";
      
      if (err.response) {
        // Extract specific error message from API response
        errorMessage = err.response.data || errorMessage;
      }
      
      setUpdateMessage({ type: 'error', text: errorMessage });
    } finally {
      setUpdating(false);
    }
  };

  // Determine if we should show action button based on status
  const renderActionButton = () => {
    if (!task || updating) return null;
    
    if (task.status === 'TODO') {
      return (
        <button 
          onClick={() => handleStatusUpdate('DOING')}
          className="bg-blue-100 text-blue-800 px-6 py-2 rounded-full font-semibold hover:bg-blue-200"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'START DOING'}
        </button>
      );
    } else if (task.status === 'DOING') {
      return (
        <button 
          onClick={() => handleStatusUpdate('REVIEW')}
          className="bg-green-100 text-green-800 px-6 py-2 rounded-full font-semibold hover:bg-green-200"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'COMPLETED'}
        </button>
      );
    } else if (task.status === 'REVIEW' && task.assignedByAccountId === task.currentAccountId) {
      // Only show the DONE button if the current user is the task creator
      return (
        <button 
          onClick={() => handleStatusUpdate('DONE')}
          className="bg-purple-100 text-purple-800 px-6 py-2 rounded-full font-semibold hover:bg-purple-200"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'MARK AS DONE'}
        </button>
      );
    }
    
    // Don't show button for other statuses
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <header className="flex justify-between items-center mb-4">
            <button onClick={onClose} className="text-[#00155c] hover:text-[#172c70] font-medium">
              ← Back to task lists
            </button>
            <button className="text-[#00155c] hover:text-[#172c70] font-medium">
              View Feedbacks →
            </button>
          </header>

          {/* Status Update Message */}
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
              <p className="mt-4 text-gray-600">Loading task details...</p>
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
                  <strong>Assignee:</strong> 
                  {task.assignees && task.assignees.map((assignee, index) => (
                    <span key={index} className="ml-2">{assignee.name}</span>
                  ))}
                </div>
                <div>
                  <strong>Status:</strong> {task.status}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description:</h3>
                <p>{task.description}</p>
              </div>

              <div className="text-center">
                {updating ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00155c] mr-3"></div>
                    <span>Updating status...</span>
                  </div>
                ) : renderActionButton()}
              </div>
            </>
          ) : (
            <div className="p-4 text-center">No task found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;