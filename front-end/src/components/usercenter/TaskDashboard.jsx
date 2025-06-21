import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faClock, 
  faPenToSquare, 
  faClockRotateLeft
} from '@fortawesome/free-solid-svg-icons';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDashboard = ({ tasks, isFiltered, currentUserId }) => {
  const todoTasks = tasks.filter(task => task.status === 'TODO');
  const doingTasks = tasks.filter(task => task.status === 'DOING');
  const reviewTasks = tasks.filter(task => task.status === 'REVIEW');
  // const completedTasks = tasks.filter(task => task.status === 'DONE');
  const overdueTasks = tasks.filter(task => task.status === 'OVERDUE');
  
  return (
    <div className="mb-8">
      {/* <h2 className="text-xl font-semibold mb-4">Task Overview</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card đếm task ToDo */}
        <div className="rounded-lg p-4 bg-yellow-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-yellow-700">TO DO</h3>
              <p className="text-2xl font-bold text-yellow-900">{todoTasks.length}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon icon="fa-solid fa-file" className="h-7 w-7 text-yellow-500"/>
            </div>
          </div>
        </div>

        {/* Card đếm task Doing */}
        <div className="rounded-lg p-4 bg-blue-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-blue-700">IN PROGRESS</h3>
              <p className="text-2xl font-bold text-blue-900">{doingTasks.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon 
                icon={faClock} 
                className="h-7 w-7 text-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Card đếm task Review */}
        <div className="rounded-lg p-4 bg-purple-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-purple-700">REVIEWING</h3>
              <p className="text-2xl font-bold text-purple-900">{reviewTasks.length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FontAwesomeIcon 
                icon={faPenToSquare} 
                className="h-7 w-7 text-purple-500" 
              />
            </div>
          </div>
        </div>

        {/* Card đếm task Overdue */}
        <div className="rounded-lg p-4 bg-red-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-red-700">OVERDUE</h3>
              <p className="text-2xl font-bold text-red-900">{overdueTasks.length}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <FontAwesomeIcon 
                icon={faClockRotateLeft} 
                className="h-7 w-7 text-red-500" 
              />
            </div>
          </div>
        </div>
      </div>

      {isFiltered && (
        <div className="mt-3 text-sm text-gray-500">
          * Hiển thị thống kê cho sự kiện đã chọn
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;