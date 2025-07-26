import React, { useState, useEffect } from "react";
import {
    getTaskFeedback,
    createTaskFeedback,
    getTaskDocuments,
    updateTask
} from '../../services/ProfileService';
import { getAllAccounts } from '../../services/accountService';
import { getDocumentsByEvent, uploadDocument } from '../../services/documentService';

const TaskFeedbackModal = ({ taskId, isOpen, onClose, taskData }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  // Thêm state cho documents
  const [documents, setDocuments] = useState([]);
  const [taskDocuments, setTaskDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    file: null,
    title: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState("feedback");

  useEffect(() => {
    if (isOpen && taskId) {
      fetchFeedback();
      fetchAllAccounts();
      fetchTaskDocuments();
      console.log("Fetching task documents for taskId:", taskId);
      console.log("Task data:", taskData);

      if (taskData) {
        console.log(
          "Task data provided, fetching event documents if available"
        );

        fetchEventDocuments();
      }
    }
  }, [isOpen, taskId, taskData]);

  const fetchAllAccounts = async () => {
    try {
      const accounts = await getAllAccounts();
      setUserAccounts(accounts || []);
      const accountsMap = {};
      accounts.forEach((account) => {
        accountsMap[account.accountId] = account;
      });
      setUsersMap(accountsMap);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  };

    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTaskFeedback(taskId);
            setFeedback(data || []);
        } catch (err) {
            console.error("Failed to fetch feedback:", err);
            setError(err.message || "Can't fetch feedback");
        } finally {
            setLoading(false);
        }
    };

  const fetchTaskDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const data = await getTaskDocuments(taskId);
      setTaskDocuments(data || []);
    } catch (err) {
      console.error("Failed to fetch task documents:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const fetchEventDocuments = async () => {
    console.log(taskData, "taskData in fetchEventDocuments");
    console.log("Fetching event documents for eventId:", taskData?.eventId);

    if (!taskData?.eventId) {
      console.log("error");
      return;
    }
    try {
      console.log("load ok");

      const data = await getDocumentsByEvent(taskData.eventId);
      console.log("Fetched event documents:", data);

      setDocuments(data || []);
    } catch (err) {
      console.error("Failed to fetch event documents:", err);
    }
  };

  const getUserInfo = (userId) => {
    const userAccount = usersMap[userId];
    if (userAccount) {
      return {
        fullName: userAccount.fullName || userAccount.username,
      };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const data = await createTaskFeedback(taskId, newComment);
            setFeedback([...feedback, data]);
            setNewComment('');
        } catch (err) {
            console.error("Failed to submit feedback:", err);
            setError(err.message || "Can't submit feedback");
        } finally {
            setSubmitting(false);
        }
    };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument((prev) => ({
        ...prev,
        file,
        title: file.name,
      }));
    }
  };

    const handleUploadDocument = async () => {
        if (!newDocument.file) {
            setError("Please select a file");
            return;
        }

        if (!taskData) {
            setError("No task information available");
            return;
        }

    try {
      setUploadingDocument(true);
      const documentData = {
        eventId: taskData.eventId,
        departmentId: taskData.departmentId || null,
        title: newDocument.title || newDocument.file.name,
        description: newDocument.description,
      };

            const uploadedDoc = await uploadDocument(newDocument.file, documentData, null);

            const currentDocIds = taskDocuments.map(doc => doc.documentId);

            const updatedDocIds = [...currentDocIds, uploadedDoc.documentId];

            const updateData = {
                title: taskData.title,
                description: taskData.description,
                dueDate: new Date(taskData.dueDate).toISOString(),
                priority: taskData.priority,
                eventId: taskData.eventId,
                assignedToAccountId: taskData.assignedToAccountId,
                departmentId: taskData.departmentId,
                documentIds: updatedDocIds
            };

      await updateTask(taskId, updateData);

      // Refresh task documents
      await fetchTaskDocuments();

      // Reset form upload
      setNewDocument({ file: null, title: "", description: "" });
      setShowUploadForm(false);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

            setError(null);

        } catch (err) {
            setError('Can not upload document: ' + err.message);
            console.error(err);
        } finally {
            setUploadingDocument(false);
        }
    };

    const handleAttachExistingDocument = async (documentId) => {
        try {
            const currentDocIds = taskDocuments.map(doc => doc.documentId);

            if (currentDocIds.includes(documentId)) {
                setError("This document is already attached to the task");
                return;
            }

            const updatedDocIds = [...currentDocIds, documentId];

            const updateData = {
                title: taskData.title,
                description: taskData.description,
                dueDate: new Date(taskData.dueDate).toISOString(),
                priority: taskData.priority,
                eventId: taskData.eventId,
                assignedToAccountId: taskData.assignedToAccountId,
                departmentId: taskData.departmentId,
                documentIds: updatedDocIds
            };

      await updateTask(taskId, updateData);

            await fetchTaskDocuments();
            setError(null);

        } catch (err) {
            setError("Can't attach document: " + err.message);
            console.error(err);
        }
    };

    const handleRemoveDocument = async (documentId) => {
        try {
            const currentDocIds = taskDocuments.map(doc => doc.documentId);
            const updatedDocIds = currentDocIds.filter(id => id !== documentId);

      // Update task
      const updateData = {
        title: taskData.title,
        description: taskData.description,
        dueDate: new Date(taskData.dueDate).toISOString(),
        priority: taskData.priority,
        eventId: taskData.eventId,
        assignedToAccountId: taskData.assignedToAccountId,
        departmentId: taskData.departmentId,
        documentIds: updatedDocIds,
      };

      await updateTask(taskId, updateData);

            // Refresh task documents
            await fetchTaskDocuments();
            setError(null);

        } catch (err) {
            setError("Can't remove document: " + err.message);
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error("Error formatting date:", error, dateString);
            return dateString || "Do not have date";
        }
    };

  if (!isOpen) return null;

    // Lọc ra documents chưa được attach
    const availableDocuments = documents.filter(doc =>
        !taskDocuments.some(taskDoc => taskDoc.documentId === doc.documentId)
    );
    console.log("Available documents:", availableDocuments);
    
    return (
        <div className="fixed inset-0 bg-gray-900/40 z-[10000] flex justify-center items-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Task Feedback & Documents</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`${
                    activeTab === "feedback"
                      ? "border-[#00155c] text-[#00155c]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  Feedback
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`${
                    activeTab === "documents"
                      ? "border-[#00155c] text-[#00155c]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  Documents ({taskDocuments.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "feedback" ? (
            // Feedback Tab
            <div>
              {/* Feedback list */}
              <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00155c]"></div>
                  </div>
                ) : feedback.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">
                    No feedback yet
                  </div>
                ) : (
                  feedback.map((item) => {
                    const userInfo = getUserInfo(item.feedbackByAccountId);
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div>
                            <div className="font-semibold text-sm">
                              {userInfo?.fullName ||
                                `User #${item.feedbackByAccountId}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {item.comment}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* New feedback form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your feedback..."
                    disabled={submitting}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="float-end mb-5 w-1/6 px-4 py-2 bg-[#00155c] text-white rounded-md hover:bg-[#172c70] disabled:bg-gray-400 text-sm"
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? "Sending..." : "Send feedback"}
                </button>
              </form>
            </div>
          ) : (
            // Documents Tab
            <div className="space-y-6">
              {/* Attached Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Attached Documents
                </h3>
                {loadingDocuments ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00155c]"></div>
                  </div>
                ) : taskDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {taskDocuments.map((doc) => (
                      <div
                        key={doc.documentId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {doc.title}
                            </p>
                            {doc.description && (
                              <p className="text-xs text-gray-600">
                                {doc.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              {doc.fileType} •{" "}
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.filePath && (
                            <a
                              href={doc.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00155c] hover:text-[#172c70] font-medium text-xs"
                            >
                              View
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm text-center py-6">
                    No documents attached to this task.
                  </p>
                )}
              </div>

              {/* Upload New Document */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Add Documents</h3>
                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="text-[#00155c] hover:text-[#172c70] text-sm font-medium"
                  >
                    + Upload New Document
                  </button>
                </div>

                {/* Upload Form */}
                {showUploadForm && (
                  <div className="mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3 text-sm">
                      Upload New Document
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Document title"
                          value={newDocument.title}
                          onChange={(e) =>
                            setNewDocument((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Description (optional)"
                          value={newDocument.description}
                          onChange={(e) =>
                            setNewDocument((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleUploadDocument}
                          disabled={!newDocument.file || uploadingDocument}
                          className="px-3 py-1 bg-[#00155c] text-white rounded text-xs hover:bg-[#172c70] disabled:bg-gray-400"
                        >
                          {uploadingDocument
                            ? "Uploading..."
                            : "Upload & Attach"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUploadForm(false)}
                          className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                                {/* Available Documents from Event */}
                                {availableDocuments.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-3 text-sm">Available Documents from Event</h4>
                                        <div className="max-h-48 overflow-y-auto space-y-2">
                                            {availableDocuments.map((doc) => (
                                                <div key={doc.documentId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-gray-400 mr-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                        <div>
                                                            <p className="font-medium text-xs text-gray-900">{doc.title}</p>
                                                            {doc.description && (
                                                                <p className="text-xs text-gray-600">{doc.description}</p>
                                                            )}
                                                            <p className="text-xs text-gray-500">
                                                                {doc.fileType} • {new Date(doc.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAttachExistingDocument(doc.documentId)}
                                                        className="text-[#00155c] hover:text-[#172c70] text-xs font-medium"
                                                    >
                                                        Attach
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskFeedbackModal;
