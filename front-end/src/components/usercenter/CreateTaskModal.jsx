import React, { useState, useEffect } from 'react';
import { getUserEvents, getUserRoleInEvent, createTask, getEventDepartments } from '../../services/profileService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getEventMembers } from '../../services/profileService';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  // Các state hiện tại
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);

  // Thêm state cho departments
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: 'MEDIUM',
    assignedToAccountId: '',
    attendees: [],
    departmentId: '' // Thêm departmentId vào formData
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // useEffect khi mở modal
  useEffect(() => {
    if (isOpen) {
      const fetchEvents = async () => {
        try {
          setLoading(true);
          const eventsData = await getUserEvents();
          setEvents(eventsData || []);

          // Lọc chỉ các event có role là ADMIN hoặc DEPARTMENT_MANAGER
          const authorizedEvents = (eventsData || []).filter(event =>
            event.role === 'ADMIN' || event.role === 'DEPARTMENT_MANAGER'
          );
          setFilteredEvents(authorizedEvents);

          // Log để debug
          console.log('All events:', eventsData);
          console.log('Authorized events:', authorizedEvents);

        } catch (err) {
          setError('Unable to load the list of events');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
      // Reset form khi mở modal
      setStep(1);
      setSelectedEvent(null);
      setFormData({
        title: '',
        description: '',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        priority: 'MEDIUM',
        assignedToAccountId: '',
        attendees: [],
        departmentId: '' // Reset departmentId
      });
      setFormErrors({});
    }
  }, [isOpen]);

  // useEffect khi chọn event - thêm lấy danh sách departments
  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedEvent) return;

      try {
        setLoading(true);
        const membersData = await getEventMembers(selectedEvent.eventId);
        setMembers(membersData || []);
      } catch (err) {
        setError('Không thể tải danh sách thành viên');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // lấy danh sách departments
    const fetchDepartments = async () => {
      if (!selectedEvent) return;

      try {
        setLoadingDepartments(true);
        const departmentsData = await getEventDepartments(selectedEvent.eventId);
        setDepartments(departmentsData || []);
      } catch (err) {
        setError('Không thể tải danh sách phòng ban');
        console.error(err);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchMembers();
    fetchDepartments();
  }, [selectedEvent]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleNextStep = () => {
    if (!selectedEvent) {
      setError('Please select an event');
      return;
    }

    setStep(2);
    setError(null);
  };

  const handlePrevStep = () => {
    setStep(1);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
    if (formErrors.dueDate) {
      setFormErrors(prev => ({ ...prev, dueDate: null }));
    }
  };

  const handleAssigneeChange = (e) => {
    const assigneeId = e.target.value;
    setFormData(prev => ({ ...prev, assignedToAccountId: assigneeId }));
    if (formErrors.assignedToAccountId) {
      setFormErrors(prev => ({ ...prev, assignedToAccountId: null }));
    }
  };

  const handleAttendeeToggle = (accountId) => {
    setFormData(prev => {
      if (accountId === formData.assignedToAccountId) {
        return prev;
      }
      const attendees = prev.attendees.includes(accountId)
        ? prev.attendees.filter(id => id !== accountId)
        : [...prev.attendees, accountId];

      return { ...prev, attendees };
    });
  };

  // xử lý thay đổi department
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFormData(prev => ({ ...prev, departmentId }));
    if (formErrors.departmentId) {
      setFormErrors(prev => ({ ...prev, departmentId: null }));
    }
  };

  //validateForm để kiểm tra department
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title must not be empty';
    if (!formData.description.trim()) errors.description = 'Description must not be empty';
    if (!formData.dueDate) errors.dueDate = 'Due date is required';
    if (!formData.assignedToAccountId) errors.assignedToAccountId = 'Please select a task assignee';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // hàm handleSubmit để gửi departmentId
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Thêm người được giao task vào danh sách attendees nếu chưa có
    const attendees = [...formData.attendees];
    const assignedId = formData.assignedToAccountId;
    if (assignedId && !attendees.includes(assignedId)) {
      attendees.push(assignedId);
    }

    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate.toISOString(),
      priority: formData.priority,
      eventId: selectedEvent.eventId,
      assignedToAccountId: parseInt(assignedId),
      taskAttendees: attendees.map(id => parseInt(id)),
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : null
    };

    console.log("Submitting task with data:", taskData);

    try {
      setSubmitting(true);
      const createdTask = await createTask(taskData);

      if (createdTask) {
        if (onTaskCreated) onTaskCreated();
        onClose();
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.message || 'Can not create task');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 mb-2">
            <h2 className="text-2xl font-bold">
              {step === 1 ? 'Select an event to create a task' : 'Create a new task'}
            </h2>
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

          {loading || loadingDepartments ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <div className="mb-6">
                    {filteredEvents.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredEvents.map(event => (
                          <div
                            key={event.eventId}
                            onClick={() => handleEventSelect(event)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedEvent?.eventId === event.eventId
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            <h4 className="font-medium">{event.eventName}</h4>
                            <p className="text-gray-600 text-sm mt-1">
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {event.role === 'ADMIN' ? 'Admin' : 'Department Manager'}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p className="text-gray-600">You do not have permission to create tasks for any event.</p>
                        <p className="text-gray-500 text-sm mt-2">Only Admins and Department Managers can create tasks.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextStep}
                      disabled={!selectedEvent}
                      className={`px-4 py-2 rounded-lg ${!selectedEvent
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#00155c] hover:bg-[#172c70] text-white'
                        }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter task title"
                      />
                      {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter task description"
                      />
                      {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Due Date <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          selected={formData.dueDate}
                          onChange={handleDateChange}
                          className={`w-full border ${formErrors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                        />
                        {formErrors.dueDate && <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="LOW">LOW</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HIGH">HIGH</option>
                          <option value="CRITICAL">CRITICAL</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department 
                      </label>
                      <select
                        value={formData.departmentId}
                        onChange={handleDepartmentChange}
                        className={`w-full border ${formErrors.departmentId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">-- Department --</option>
                        {departments.map(department => (
                          <option key={department.departmentId} value={department.departmentId}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.departmentId && <p className="text-red-500 text-xs mt-1">{formErrors.departmentId}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign to: (Leader) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.assignedToAccountId}
                        onChange={handleAssigneeChange}
                        className={`w-full border ${formErrors.assignedToAccountId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">-- Assign to: --</option>
                        {members.map(member => (
                          <option key={member.accountId} value={member.accountId}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                      </select>
                      {formErrors.assignedToAccountId && <p className="text-red-500 text-xs mt-1">{formErrors.assignedToAccountId}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Attendees (optional)
                      </label>
                      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
                        {members.length > 0 ? (
                          members.map(member => (
                            <div
                              key={member.accountId}
                              className={`p-2 mb-1 rounded-md ${member.accountId === formData.assignedToAccountId
                                ? 'bg-blue-100 text-blue-800'
                                : 'hover:bg-gray-100'
                                }`}
                            >
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={
                                    member.accountId === formData.assignedToAccountId ||
                                    formData.attendees.includes(member.accountId)
                                  }
                                  onChange={() => handleAttendeeToggle(member.accountId)}
                                  disabled={member.accountId === formData.assignedToAccountId}
                                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span>
                                  {member.fullName} {member.accountId === formData.assignedToAccountId && <span className="text-blue-600 text-xs">(Leader)</span>}
                                </span>
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 p-2">No member yet</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        * The leader is automatically included in the participant list.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`px-4 py-2 rounded-lg ${submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#00155c] hover:bg-[#172c70] text-white'
                        }`}
                    >
                      {submitting ? 'Creating...' : 'Create Task'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;