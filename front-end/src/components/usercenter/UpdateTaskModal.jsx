import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  getEventMembers,
  updateTask,
  getUserRoleInEvent,
  getTaskAttendees,
  getEventDepartments,
  getTaskDocuments
} from '../../services/profileService';
import { getDocumentsByEvent, uploadDocument } from '../../services/documentService';

const UpdateTaskModal = ({ isOpen, onClose, taskData, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'MEDIUM',
    assignedToAccountId: '',
    departmentId: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [taskAttendees, setTaskAttendees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Thêm state cho documents
  const [documents, setDocuments] = useState([]);
  const [taskDocuments, setTaskDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [loadingTaskDocuments, setLoadingTaskDocuments] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [documentsChanged, setDocumentsChanged] = useState(false);
  const [newDocument, setNewDocument] = useState({
    file: null,
    title: '',
    description: ''
  });

  useEffect(() => {
    if (taskData) {
      setError("");

      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date(),
        priority: taskData.priority || 'MEDIUM',
        assignedToAccountId: taskData.assignedToAccountId || '',
        departmentId: taskData.departmentId || ''
      });

      if (taskData.currentUser) {
        setCurrentUserId(taskData.currentUser.id || taskData.currentUser.accountId);
      }

      fetchTaskAttendees(taskData.taskId);
      fetchEventMembers(taskData.eventId);
      fetchEventDepartments(taskData.eventId);
      fetchEventDocuments(taskData.eventId);
      fetchTaskDocuments(taskData.taskId);
    }
  }, [taskData]);

  const fetchEventDepartments = async (eventId) => {
    if (!eventId) return;
    setLoadingDepartments(true);
    try {
      const departments = await getEventDepartments(eventId);
      setDepartments(departments || []);
    } catch (err) {
      console.error("Error loading department list:", err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Thêm các hàm fetch documents
  const fetchEventDocuments = async (eventId) => {
    if (!eventId) return;
    setLoadingDocuments(true);
    try {
      const documents = await getDocumentsByEvent(eventId);
      setDocuments(documents || []);
    } catch (err) {
      console.error("Error loading event documents:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const fetchTaskDocuments = async (taskId) => {
    if (!taskId) return;
    setLoadingTaskDocuments(true);
    try {
      const taskDocs = await getTaskDocuments(taskId);
      setTaskDocuments(taskDocs || []);
      setSelectedDocuments((taskDocs || []).map(doc => doc.documentId));
    } catch (err) {
      console.error("Error loading task documents:", err);
    } finally {
      setLoadingTaskDocuments(false);
    }
  };

  // Thêm các hàm xử lý documents
  const handleDocumentToggle = (documentId) => {
    setSelectedDocuments(prev => {
      const newSelection = prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId];
      
      setDocumentsChanged(true);
      return newSelection;
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument(prev => ({
        ...prev,
        file,
        title: file.name
      }));
    }
  };

  const handleUploadDocument = async () => {
    if (!newDocument.file) {
      setError('Vui lòng chọn file');
      return;
    }

    try {
      setUploadingDocument(true);
      const documentData = {
        eventId: taskData.eventId,
        departmentId: formData.departmentId || null,
        title: newDocument.title || newDocument.file.name,
        description: newDocument.description
      };

      const response = await uploadDocument(newDocument.file, documentData, null);
      
      // Thêm document mới vào danh sách và tự động chọn
      const newDoc = response;
      setDocuments(prev => [...prev, newDoc]);
      setSelectedDocuments(prev => [...prev, newDoc.documentId]);
      setDocumentsChanged(true);
      
      // Reset form upload
      setNewDocument({ file: null, title: '', description: '' });
      setShowUploadForm(false);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError('Không thể upload document: ' + err.message);
      console.error(err);
    } finally {
      setUploadingDocument(false);
    }
  };

  const hasEditPermission = () => {
    // console.log("Checking edit permission for task:", taskData, "Current user ID:", currentUserId);

    if (!taskData || !currentUserId) return false;
    return currentUserId === taskData.assignedByAccountId;
  };

  const fetchTaskAttendees = async (taskId) => {
    if (!taskId) return;
    setLoadingAttendees(true);
    try {
      const attendees = await getTaskAttendees(taskId);
      setTaskAttendees(attendees || []);
    } catch (err) {
      console.error("Error loading task attendees:", err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const fetchEventMembers = async (eventId) => {
    if (!eventId) return;
    setLoading(true);
    try {
      const members = await getEventMembers(eventId);
      setMembers(members || []);
    } catch (err) {
      console.error("Error loading event members:", err);
      setError("Failed to load event members.");
    } finally {
      setLoading(false);
    }
  };

  const isTaskAttendee = (accountId) => {
    return taskAttendees.some(attendee => String(attendee.accountId) === String(accountId));
  };

  const getAttendeeMembers = () => {
    return members.filter(member => isTaskAttendee(member.accountId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dueDate: date
    }));
    setError("");
    if (formErrors.dueDate) {
      setFormErrors(prev => ({ ...prev, dueDate: null }));
    }
  };

  const handleAssigneeChange = (e) => {
    const assigneeId = e.target.value;
    setFormData(prev => ({
      ...prev,
      assignedToAccountId: assigneeId
    }));
    setError("");
    if (formErrors.assignedToAccountId) {
      setFormErrors(prev => ({ ...prev, assignedToAccountId: null }));
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFormData(prev => ({
      ...prev,
      departmentId: departmentId
    }));
    setError("");
    if (formErrors.departmentId) {
      setFormErrors(prev => ({ ...prev, departmentId: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    }
    if (!formData.dueDate) {
      errors.dueDate = "Due date is required.";
    } else if (formData.dueDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      errors.dueDate = "Due date cannot be in the past.";
    }
    if (!formData.assignedToAccountId) {
      errors.assignedToAccountId = "Assignee is required.";
    } else if (!isTaskAttendee(formData.assignedToAccountId)) {
      errors.assignedToAccountId = "Assignee must be a task attendee.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Cập nhật hàm handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!hasEditPermission()) {
      setError("You do not have permission to update this task. Only the task assigner can edit it.");
      return;
    }

    if (!validateForm()) return;

    const updateData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate.toISOString(),
      priority: formData.priority,
      eventId: taskData.eventId,
      assignedToAccountId: parseInt(formData.assignedToAccountId),
      documentIds: selectedDocuments // Luôn gửi selectedDocuments
    };

    updateData.departmentId = formData.departmentId ? parseInt(formData.departmentId) : null;

    // console.log("Updating task with data:", updateData); // Debug log

    try {
      setSubmitting(true);
      
      const updatedTask = await updateTask(taskData.taskId, updateData);
      
      if (updatedTask && onTaskUpdated) {
        onTaskUpdated();
        handleClose();
      }
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message || 'Failed to update task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setError("");
    setDocumentsChanged(false);
    onClose();
  };

  if (!isOpen) return null;

  const isNotTaskCreator = currentUserId && taskData && String(currentUserId) !== String(taskData.assignedByAccountId);
  const attendeeMembers = getAttendeeMembers();

  return (
    <div className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold">Update Task</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isNotTaskCreator ? (
            <div className="text-center py-8 bg-yellow-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-yellow-500 mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">Permission Denied</h3>
              <p className="text-yellow-700 max-w-md mx-auto">
                You are not allowed to edit this task. Only the task assigner can update it.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          ) : loading || loadingAttendees || loadingDepartments || loadingDocuments || loadingTaskDocuments ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : (
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
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
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
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- No Department --</option>
                    {departments.map(department => (
                      <option key={department.departmentId} value={department.departmentId}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.departmentId && <p className="text-red-500 text-xs mt-1">{formErrors.departmentId}</p>}
                </div>

                {/* Thêm section Documents */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documents
                  </label>
                  
                  {/* Danh sách documents có sẵn */}
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto mb-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">Available Documents ({documents.length})</span>
                      <button
                        type="button"
                        onClick={() => setShowUploadForm(!showUploadForm)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Upload New Document
                      </button>
                    </div>

                    {documents.length > 0 ? (
                      <div className="space-y-2">
                        {documents.map(doc => (
                          <div key={doc.documentId} className="flex items-center p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(doc.documentId)}
                              onChange={() => handleDocumentToggle(doc.documentId)}
                              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex-grow">
                              <p className="font-medium text-sm">{doc.title}</p>
                              {doc.description && (
                                <p className="text-xs text-gray-600">{doc.description}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                {doc.fileType} • {new Date(doc.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No documents available for this event</p>
                    )
                    }
                  </div>

                  {/* Form upload document mới */}
                  {showUploadForm && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium mb-3">Upload New Document</h4>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="file"
                            onChange={handleFileSelect}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Document title"
                            value={newDocument.title}
                            onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <textarea
                            placeholder="Description (optional)"
                            value={newDocument.description}
                            onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                            rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleUploadDocument}
                            disabled={!newDocument.file || uploadingDocument}
                            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                          >
                            {uploadingDocument ? 'Uploading...' : 'Upload'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowUploadForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedDocuments.length > 0 && (
                    <p className="text-sm text-blue-600 mt-2">
                      {selectedDocuments.length} document(s) selected
                      {documentsChanged && <span className="text-orange-600"> (changed)</span>}
                    </p>
                  )}
                </div>

                {/* Assignee section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee (Leader) <span className="text-red-500">*</span>
                  </label>

                  {taskAttendees.length > 0 ? (
                    <select
                      value={formData.assignedToAccountId}
                      onChange={handleAssigneeChange}
                      className={`w-full border ${formErrors.assignedToAccountId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">-- Select Assignee --</option>
                      {attendeeMembers.map(member => (
                        <option key={member.accountId} value={member.accountId}>
                          {member.name || member.fullName} ({member.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md">
                      There are no attendees for this task. Please add attendees before assigning a Leader.
                    </div>
                  )}

                  {formErrors.assignedToAccountId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.assignedToAccountId}</p>
                  )}

                  <p className="text-sm text-gray-500 mt-2">
                    * Only task attendees can be selected as the Leader.
                  </p>
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-700 mb-1">Note:</p>
                  <p>
                    You can manage task attendees via the "Attendees" button on the task details screen.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-8 space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || isNotTaskCreator}
                  className={`px-4 py-2 rounded-lg ${submitting || isNotTaskCreator
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#00155c] hover:bg-[#172c70] text-white'
                    }`}
                >
                  {submitting ? 'Updating...' : 'Update Task'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
