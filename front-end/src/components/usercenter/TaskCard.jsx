import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import TaskDetails from './TaskDetails';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'CRITICAL': return 'text-red-600';
    case 'HIGH': return 'text-orange-500';
    case 'MEDIUM': return 'text-blue-600';
    case 'LOW': return 'text-green-600';
    case 'OPTIONAL': return 'text-gray-600';
    default: return 'text-gray-600';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'TODO': return 'bg-yellow-100 text-yellow-800';
    case 'DOING': return 'bg-blue-100 text-blue-800';
    case 'DONE': return 'bg-green-100 text-green-800';
    case 'REVIEW': return 'bg-purple-100 text-purple-800';
    case 'CANCELLED': return 'bg-gray-100 text-gray-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const TaskCard = ({ task, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(task);
  

  return (
    <>
      <tr className={index % 2 === 1 ? 'bg-white' : 'bg-gray-50'}>
        <td className="py-3 px-4">{index}</td>
        <td className="py-3 px-4">{task.title}</td>
        <td className="py-3 px-4">{task.eventName}</td>
        <td className="py-3 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>
        <td className="py-3 px-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </td>
        <td className={`py-3 px-4 ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </td>
        <td className="py-3 px-4">
          <button
            onClick={handleViewDetails}
            className="text-[#00155c] hover:text-[#172c70] font-medium"
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
            onTaskUpdated={() => {
              if (onTaskUpdated) onTaskUpdated();
            }}
          />,
          document.body
        )
      }

    </>
  );
};

export default TaskCard;