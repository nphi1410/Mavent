import React, { useState } from 'react';
import TaskDetails from './TaskDetails';
import { createPortal } from 'react-dom';

const TaskCard = ({ task, index, onTaskUpdated, currentUserId }) => {

  const statusClasses = {
    TODO: 'bg-yellow-100 text-yellow-800',
    DOING: 'bg-blue-100 text-blue-800',
    REVIEW: 'bg-purple-100 text-purple-800',
    DONE: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    OVERDUE: 'bg-red-100 text-red-800',
    REJECTED: 'bg-red-100 text-red-800'
  };

  const priorityClasses = {
    CRITICAL: 'bg-red-200 text-red-900',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-blue-100 text-blue-800'
  };

  // Xác định vai trò của người dùng trong task
  const getUserRole = () => {
    if (task.assignedByAccountId === currentUserId) {
      return "CREATOR";
    }
    if (task.assignedToAccountId === currentUserId) {
      return "LEADER";
    }
    return "ASSIGNEE";
  };

  // Xác định màu cho vai trò
  const getRoleClasses = () => {
    switch (getUserRole()) {
      case "CREATOR":
        return "bg-purple-100 text-purple-800";
      case "LEADER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  return (
    <>
      <tr>
        <td className="py-3 px-4 whitespace-nowrap">{index}</td>
        <td className="py-3 px-4">
          <div className="truncate w-full max-w-[350px]" title={task.title}>
            {task.title}
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="truncate w-full max-w-[230px]" title={task.eventName}>
            {task.eventName}
          </div>
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
          {new Date(task.dueDate).toLocaleDateString()}
        </td>
        <td className="font-semibold py-3 px-4 whitespace-nowrap">
          <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[task.status] || 'bg-gray-100'}`}>
            {task.status}
          </span>
        </td>
        <td className="font-semibold py-3 px-4 whitespace-nowrap">
          <span className={`px-2 py-1 rounded-full text-xs ${priorityClasses[task.priority] || 'bg-gray-100'}`}>
            {task.priority}
          </span>
        </td>
        <td className="font-semibold py-3 px-4 whitespace-nowrap">
          <span className={`px-2 py-1 rounded-full text-xs ${getRoleClasses()}`}>
            {getUserRole()}
          </span>
        </td>
        <td className="py-3 px-4 whitespace-nowrap text-center">
          <button
            onClick={handleViewDetails}
            className="font-semibold text-[#00155c] hover:text-[#172c70]"
          >
            View Details
          </button>
        </td>
      </tr>

      {isModalOpen &&
        createPortal(
          <TaskDetails
            taskId={task.taskId}
            isOpen={isModalOpen}
            onClose={closeModal}
            onTaskUpdated={onTaskUpdated}
          />,
          document.body
        )}
    </>
  );
};

export default TaskCard;