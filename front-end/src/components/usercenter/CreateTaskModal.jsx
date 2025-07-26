import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { createTask, getEventDepartments, getEventMembers } from '../../services/ProfileService';
import { getDocumentsByEvent, uploadDocument } from '../../services/documentService';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, eventId, eventName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocument, setNewDocument] = useState({ file: null, title: '', description: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: 'MEDIUM',
    assignedToAccountId: '',
    attendees: [],
    departmentId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      const fetchEventData = async () => {
        try {
          setLoading(true);
          setError(null);

          const [membersData, departmentsData, documentsData] = await Promise.all([
            getEventMembers(eventId),
            getEventDepartments(eventId),
            getDocumentsByEvent(eventId)
          ]);

          setMembers(membersData || []);
          setDepartments(departmentsData || []);
          setDocuments(documentsData || []);
        } catch (err) {
          setError('Unable to load event data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchEventData();

      setFormData({
        title: '',
        description: '',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        priority: 'MEDIUM',
        assignedToAccountId: '',
        attendees: [],
        departmentId: ''
      });
      setFormErrors({});
      setSelectedDocuments([]);
      setShowUploadForm(false);
      setNewDocument({ file: null, title: '', description: '' });
    }
  }, [isOpen, eventId]);

  const activeMembers = useMemo(() => {
    return (members || []).filter(member => member.isActive === true);
  }, [members]);

  const activeMembersWithDepartment = useMemo(() => {
    return activeMembers.map(member => ({
      ...member,
      isInSelectedDepartment: formData.departmentId && 
        String(member.departmentId) === String(formData.departmentId)
    }));
  }, [activeMembers, formData.departmentId]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [formErrors]);

  const handleDateChange = useCallback((date) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
    if (formErrors.dueDate) {
      setFormErrors(prev => ({ ...prev, dueDate: null }));
    }
  }, [formErrors]);

  const handleAssigneeChange = useCallback((e) => {
    const assigneeId = e.target.value;
    setFormData(prev => ({ ...prev, assignedToAccountId: assigneeId }));
    if (formErrors.assignedToAccountId) {
      setFormErrors(prev => ({ ...prev, assignedToAccountId: null }));
    }
  }, [formErrors]);

  const handleAttendeeToggle = useCallback((accountId) => {
    setFormData(prev => {
      if (accountId === prev.assignedToAccountId) return prev;
      const attendees = prev.attendees.includes(accountId)
        ? prev.attendees.filter(id => id !== accountId)
        : [...prev.attendees, accountId];
      return { ...prev, attendees };
    });
  }, []);

  const handleDepartmentChange = useCallback((e) => {
    const departmentId = e.target.value;
    setFormData(prev => ({ ...prev, departmentId }));

    if (departmentId) {
      const departmentMemberIds = members
        .filter(member => String(member.departmentId) === String(departmentId) && member.isActive)
        .map(member => member.accountId);
      
      setFormData(prev => ({
        ...prev,
        attendees: [...new Set([...prev.attendees, ...departmentMemberIds.filter(id => String(id) !== String(prev.assignedToAccountId))])]
      }));
    }
    
    if (formErrors.departmentId) {
      setFormErrors(prev => ({ ...prev, departmentId: null }));
    }
  }, [members, formErrors]);

  const handleDocumentToggle = useCallback((documentId) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument(prev => ({ ...prev, file, title: file.name }));
    }
  }, []);

  const handleUploadDocument = useCallback(async () => {
    if (!newDocument.file) {
      setError('Please select a file to upload.');
      return;
    }
    try {
      setUploadingDocument(true);
      const documentData = {
        eventId: eventId,
        departmentId: formData.departmentId || null,
        title: newDocument.title || newDocument.file.name,
        description: newDocument.description
      };
      const newDoc = await uploadDocument(newDocument.file, documentData, null);
      
      setDocuments(prev => [...prev, newDoc]);
      setSelectedDocuments(prev => [...prev, newDoc.documentId]);
      setNewDocument({ file: null, title: '', description: '' });
      setShowUploadForm(false);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('Cannot upload document: ' + err.message);
    } finally {
      setUploadingDocument(false);
    }
  }, [newDocument, eventId, formData.departmentId]);
  
  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title must not be empty';
    if (!formData.description.trim()) errors.description = 'Description must not be empty';
    if (!formData.dueDate) errors.dueDate = 'Due date is required';
    if (!formData.assignedToAccountId) errors.assignedToAccountId = 'Please select a task assignee';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const attendees = [...new Set([...formData.attendees, formData.assignedToAccountId])].filter(Boolean);

    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate.toISOString(),
      priority: formData.priority,
      eventId: parseInt(eventId),
      assignedToAccountId: parseInt(formData.assignedToAccountId),
      taskAttendees: attendees.map(id => parseInt(id)),
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
      documentIds: selectedDocuments
    };

    try {
      setSubmitting(true);
      await createTask(taskData);
      onTaskCreated?.();
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.message || 'Can not create task');
    } finally {
      setSubmitting(false);
    }
  }, [formData, selectedDocuments, eventId, validateForm, onTaskCreated, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 mb-2">
            <h2 className="text-2xl font-bold">
              Create New Task
              {eventName && <span className="text-lg text-gray-600 ml-2">for {eventName}</span>}
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

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Department --</option>
                    {departments.map(department => (
                      <option key={department.departmentId} value={department.departmentId}>
                        {department.name}
                      </option>
                    ))}
                  </select>
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
                    {activeMembers.map(member => (
                      <option key={member.accountId} value={member.accountId}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                  {formErrors.assignedToAccountId && <p className="text-red-500 text-xs mt-1">{formErrors.assignedToAccountId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documents (optional)
                  </label>
                  
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
                    )}
                  </div>

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
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Attendees (optional)
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {activeMembers.length > 0 ? (
                      activeMembersWithDepartment.map(member => (
                        <div
                          key={member.accountId}
                          className={`p-2 mb-1 rounded-md ${
                            member.accountId === formData.assignedToAccountId
                              ? 'bg-blue-100 text-blue-800'
                              : member.isInSelectedDepartment
                                ? 'bg-green-50 border border-green-200'
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
                            <div className="flex-grow">
                              <span>
                                {member.fullName} 
                                {member.accountId === formData.assignedToAccountId && 
                                  <span className="text-blue-600 text-xs"> (Leader)</span>
                                }
                                {member.isInSelectedDepartment && member.accountId !== formData.assignedToAccountId &&
                                  <span className="text-green-600 text-xs"> (Dept. Member)</span>
                                }
                              </span>
                              {member.departmentName && (
                                <div className="text-xs text-gray-500">{member.departmentName}</div>
                              )}
                            </div>
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 p-2">No active members yet</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    * Only active members can be assigned. The leader is automatically included in the participant list.
                    <br />
                    * Selecting a department will automatically include all department members as attendees.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-8">
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
        </div>
      </div>
    </div>
  );
};

CreateTaskModal.displayName = 'CreateTaskModal';

export default React.memo(CreateTaskModal);