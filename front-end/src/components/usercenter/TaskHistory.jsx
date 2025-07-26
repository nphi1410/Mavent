import React, { useState, useEffect } from 'react';
import { getUserTasks, getUserEvents } from '../../services/ProfileService';
import TaskCard from './TaskCard';
import { useNavigate, Link, useParams } from 'react-router-dom';

const TaskHistory = () => {
  const [displayTasks, setDisplayTasks] = useState([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id: eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Fetch all user tasks + events
        const [tasks, events] = await Promise.all([
          getUserTasks({}), // API lấy toàn bộ tasks của user
          getUserEvents(), // API lấy toàn bộ events user tham gia
        ]);

        // Tìm tên event từ eventId
        const matchedEvent = events.find(
          (e) => e.eventId === parseInt(eventId)
        );
        if (matchedEvent) {
          setEventName(matchedEvent.eventName);
        }

        // Lọc task của event hiện tại và chỉ lấy những task cũ
        const historyTasks = tasks.filter(
          (task) =>
            task.eventId === parseInt(eventId) &&
            ["DONE", "REJECTED", "CANCELLED"].includes(task.status)
        );

        setDisplayTasks(historyTasks);
      } catch (err) {
        console.error("Error fetching task history:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.message || "Failed to load task history");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [eventId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-red-600 text-center">Error: {error}</div>;
  }

  return (
    <main className="flex-grow p-10 bg-white">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Task History</h1>
            {eventName && (
              <p className="text-gray-600 mt-1">Event: {eventName}</p>
            )}
          </div>
          <Link
            to={`/event/${eventId}/staff/tasks`}
            className="bg-[#00155c] hover:bg-[#172c70] text-white px-4 py-2 rounded-lg"
          >
            Back to Active Tasks
          </Link>
        </div>

        {/* Task Table */}
        {displayTasks.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    No.
                  </th>
                  <th className="w-80 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="w-36 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Due Date
                  </th>
                  <th className="w-24 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="w-24 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Priority
                  </th>
                  <th className="w-24 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="w-32 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayTasks.map((task, index) => (
                  <TaskCard key={task.taskId} task={task} index={index + 1} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No completed tasks found for this event.
          </div>
        )}
      </div>
    </main>
  );
};

export default TaskHistory;
