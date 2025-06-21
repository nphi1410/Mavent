import React, { useState, useEffect } from 'react';
import { getUserTasks, getUserEvents, getUserProfile } from '../../services/profileService';
import TaskCard from './TaskCard';
import TaskDashboard from './TaskDashboard';
import { useNavigate, Link } from 'react-router-dom';
import CreateTaskModal from './CreateTaskModal';

const parseStatus = (status) => {
  if (status === 'active') return ['TODO', 'DOING', 'REVIEW', 'OVERDUE'];
  if (!status) return [];
  return [status];
};

const UserTasksContent = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    priority: '',
    sortOrder: '',
    eventName: '',
    role: ''
  });

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const navigate = useNavigate();

  const filterActiveTasks = (tasks) => {
    return tasks.filter(task => ['TODO', 'DOING', 'REVIEW', 'OVERDUE'].includes(task.status));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [tasks, events] = await Promise.all([
          getUserTasks({}),
          getUserEvents()
        ]);
        const taskList = Array.isArray(tasks) ? tasks : [];
        const activeTasks = filterActiveTasks(taskList);
        setAllTasks(taskList);
        setDisplayTasks(activeTasks);
        setEvents(Array.isArray(events) ? events : []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError(err.message || 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [navigate]);

  useEffect(() => {
    const fetchFilteredTasks = async () => {
      setFilterLoading(true);
      try {
        const statusList = parseStatus(filters.status);
        const statusString = statusList.join(',');

        const response = await getUserTasks({
          ...filters,
          keyword: filters.keyword || undefined,
          status: statusString || undefined,
          priority: filters.priority || undefined,
          sortOrder: filters.sortOrder || undefined,
          eventName: filters.eventName || undefined
        });

        let fetchedTasks = Array.isArray(response) ? response : [];

        // Filter by role (only on frontend)
        if (filters.role && userProfile) {
          const userId = userProfile.id;
          if (filters.role === 'CREATOR') {
            fetchedTasks = fetchedTasks.filter(task => task.assignedByAccountId === userId);
          } else if (filters.role === 'LEADER') {
            fetchedTasks = fetchedTasks.filter(task => task.assignedToAccountId === userId);
          } else if (filters.role === 'ASSIGNEE') {
            fetchedTasks = fetchedTasks.filter(task =>
              task.assignedByAccountId !== userId &&
              task.assignedToAccountId !== userId
            );
          }
        }

        setFilteredTasks(fetchedTasks);
        if (!filters.status || filters.status === 'active') {
          fetchedTasks = filterActiveTasks(fetchedTasks);
        }
        setDisplayTasks(fetchedTasks);
      } catch (err) {
        console.error('Error fetching filtered tasks:', err);
        setDisplayTasks([]);
        setFilteredTasks([]);
      } finally {
        setFilterLoading(false);
      }
    };

    if (
      filters.status ||
      filters.priority ||
      filters.keyword ||
      filters.eventName ||
      filters.sortOrder ||
      filters.role
    ) {
      const timeoutId = setTimeout(fetchFilteredTasks, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setDisplayTasks(filterActiveTasks(allTasks));
    }
  }, [filters, allTasks, userProfile]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = displayTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(displayTasks.length / tasksPerPage);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const refreshTasks = async () => {
    try {
      setFilterLoading(true);

      const statusList = parseStatus(filters.status);
      const statusString = statusList.join(',');

      const response = await getUserTasks({
        ...filters,
        keyword: filters.keyword || undefined,
        status: statusString || undefined,
        priority: filters.priority || undefined,
        sortOrder: filters.sortOrder || undefined,
        eventName: filters.eventName || undefined
      });

      let fetchedTasks = Array.isArray(response) ? response : [];

      // Apply role filter again
      if (filters.role && userProfile) {
        const userId = userProfile.id;
        if (filters.role === 'CREATOR') {
          fetchedTasks = fetchedTasks.filter(task => task.assignedByAccountId === userId);
        } else if (filters.role === 'LEADER') {
          fetchedTasks = fetchedTasks.filter(task => task.assignedToAccountId === userId);
        } else if (filters.role === 'ASSIGNEE') {
          fetchedTasks = fetchedTasks.filter(task =>
            task.assignedByAccountId !== userId &&
            task.assignedToAccountId !== userId
          );
        }
      }

      setFilteredTasks(fetchedTasks);
      if (!filters.status || filters.status === 'active') {
        fetchedTasks = filterActiveTasks(fetchedTasks);
      }
      setDisplayTasks(fetchedTasks);
    } catch (err) {
      console.error('Error refreshing tasks:', err);
    } finally {
      setFilterLoading(false);
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <main className="flex-grow p-10 bg-white">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Active Tasks</h1>
          <div className="flex gap-4">
            <button onClick={openCreateModal} className="bg-[#00155c] hover:bg-[#172c70] text-white px-4 py-2 rounded-lg">
              Create Task
            </button>
            <Link to="/profile/tasks/history" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              View Task History
            </Link>
          </div>
        </div>

        <TaskDashboard
          tasks={filters.eventName ? filteredTasks : allTasks}
          isFiltered={!!filters.eventName}
          currentUserId={userProfile?.id}
        />

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: 'Sort by',
                name: 'sortOrder',
                options: [
                  { value: '', label: 'Sort by' },
                  { value: 'asc', label: 'Due Date (Earliest)' },
                  { value: 'desc', label: 'Due Date (Latest)' }
                ]
              },
              {
                label: 'Event',
                name: 'eventName',
                options: [
                  { value: '', label: 'All Events' },
                  ...events
                    .filter(e => e.role !== 'PARTICIPANT')
                    .map(e => ({ value: e.eventId, label: e.eventName }))
                ]
              },
              {
                label: 'Status',
                name: 'status',
                options: [
                  { value: '', label: 'Active Tasks' },
                  { value: 'TODO', label: 'To Do' },
                  { value: 'DOING', label: 'Doing' },
                  { value: 'REVIEW', label: 'Review' },
                  { value: 'OVERDUE', label: 'Overdue' }
                ]
              },
              {
                label: 'Priority',
                name: 'priority',
                options: [
                  { value: '', label: 'All Priorities' },
                  { value: 'CRITICAL', label: 'Critical' },
                  { value: 'HIGH', label: 'High' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'LOW', label: 'Low' }
                ]
              },
              {
                label: 'Role',
                name: 'role',
                options: [
                  { value: '', label: 'All Roles' },
                  { value: 'CREATOR', label: 'CREATOR' },
                  { value: 'LEADER', label: 'LEADER' },
                  { value: 'ASSIGNEE', label: 'ASSIGNEE' }
                ]
              }
            ].map(({ label, name, options }) => (
              <div key={name} className="relative">
                <select
                  value={filters[name]}
                  onChange={(e) => handleFilterChange(name, e.target.value)}
                  className="max-w-40 appearance-none px-4 py-2 border rounded-lg bg-white pr-8"
                >
                  {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by task name..."
              className="max-w-60 sm:w-80 pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="h-4 w-4 fill-current text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Task Table */}
        {filterLoading ? (
          <div className="text-center text-gray-500 py-10">Loading tasks...</div>
        ) : displayTasks.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full table-fixed"> {/* Thêm table-fixed để kiểm soát chiều rộng cột */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                  <th className="w-48 md:w-64 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="w-36 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="w-32 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="w-24 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="w-24 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="w-24 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="w-32 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTasks.map((task, idx) => (
                  <TaskCard
                    key={task.taskId}
                    task={task}
                    index={indexOfFirstTask + idx + 1}
                    onTaskUpdated={refreshTasks}
                    currentUserId={userProfile?.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">No active tasks found.</div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="py-4 px-6 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#00155c] text-white hover:bg-[#172c70]'
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={currentPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: totalPages }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Page {i + 1}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <svg className="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
                <span className="text-gray-600">
                  of {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#00155c] text-white hover:bg-[#172c70]'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onTaskCreated={refreshTasks}
        />
      </div>
    </main>
  );
};

export default UserTasksContent;
