import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDashboard = ({ tasks }) => {
  const totalTasks = tasks.length;
  
  // Calculate task statistics with percentages
  const calculatePercentage = (count) => {
    return totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100);
  };

  const taskCounts = {
    'Active': tasks.filter(t => t.status === 'TODO').length,
    'Completed': tasks.filter(t => t.status === 'DONE').length,
    'In Progress': tasks.filter(t => t.status === 'DOING').length,
    'Review': tasks.filter(t => t.status === 'REVIEW').length,
    'Cancelled': tasks.filter(t => t.status === 'CANCELLED' || t.status === 'REJECTED').length
  };

  // Pre-calculate all percentages
  const taskStats = Object.entries(taskCounts).reduce((acc, [key, count]) => {
    acc[key] = {
      count,
      percentage: calculatePercentage(count)
    };
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(taskStats).map(label => `${label} ${taskStats[label].percentage}%`),
    datasets: [{
      data: Object.values(taskStats).map(stat => stat.percentage),
      backgroundColor: [
        '#4F46E5', // primary blue
        '#818CF8', // lighter blue
        '#6366F1', // medium blue
        '#C7D2FE', // very light blue
        '#E0E7FF', // lightest blue
      ],
      borderWidth: 0,
    }]
  };

  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* Adjust height for the chart container */}
      <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-center h-56">
        {totalTasks > 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-80">
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '75%',
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label.split(' ')[0];
                          return `${label}: ${taskStats[label].count} (${context.raw}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No data available</div>
        )}
      </div>

      {/* Adjust height for the stats container to match chart height */}
      <div className="bg-white rounded-lg p-6 shadow-sm grid grid-cols-3 gap-4 h-56">
        <div>
          <div className="text-4xl font-bold">{totalTasks}</div>
          <div className="text-gray-600">Total task</div>
        </div>
        <div>
          <div className="text-4xl font-bold">
            {taskStats['Active'].count}
          </div>
          <div className="text-gray-600">Active task</div>
        </div>
        <div>
          <div className="text-4xl font-bold">
            {taskStats['Completed'].count}
          </div>
          <div className="text-gray-600">Completed task</div>
        </div>
        <div>
          <div className="text-4xl font-bold">
            {taskStats['Review'].count}
          </div>
          <div className="text-gray-600">Need-feedback</div>
        </div>
        <div>
          <div className="text-4xl font-bold">
            {taskStats['In Progress'].count}
          </div>
          <div className="text-gray-600">In-progress task</div>
        </div>
        <div>
          <div className="text-4xl font-bold">
            {taskStats['Cancelled'].count}
          </div>
          <div className="text-gray-600">Cancelled task</div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;