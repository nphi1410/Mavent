import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faEye, 
  faFileAlt, 
  faFilePdf, 
  faFileCsv, 
  faFileExcel, 
  faFileWord,
  faFileImage,
  faFileArchive,
  faFileCode,
  faFile,
  faTrash, 
  faTimes, 
  faCheckSquare,
  faEllipsisH,
  faExclamationTriangle,
  faUser,
  faPen,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { 
  getDocumentsByEvent,
  getDocumentsByDepartment,
  getDocumentPreviewUrl,
  deleteDocument,
  updateDocument
} from '../../services/documentService.jsx';

const DocumentList = ({ searchTerm, departmentFilter, fileTypeFilter, dateFilter, sortBy, eventId, refreshTrigger }) => {
  // All states declared at the top - no conditional hooks
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [processingBulkAction, setProcessingBulkAction] = useState(false);  const [previewDocument, setPreviewDocument] = useState(null);
  const [detailDocument, setDetailDocument] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const documentsPerPage = 6;

  // Fetch documents when the component mounts or when filters change
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!eventId) {
        setLoading(false);
        setError('Event ID is required to fetch documents');
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        let data;
        if (departmentFilter && departmentFilter !== 'all') {
          // Fetch documents for a specific department
          data = await getDocumentsByDepartment(eventId, departmentFilter);
        } else {
          // Fetch all documents for the event
          data = await getDocumentsByEvent(eventId);
        }
        
        setDocuments(data || []);
        setSelectedDocuments([]);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to load documents. Please try again later.');
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [eventId, departmentFilter, refreshTrigger]);
  
  // Add keyframe animations for bulk actions - moved up before any conditionals
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        0% { transform: translateY(-20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-20px); opacity: 0; }
      }
      .animate-fade-in-out {
        animation: fadeIn 0.5s;
        transition: opacity 0.5s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
    // Handle opening document detail modal
  const handleOpenDetail = (document) => {
    setDetailDocument(document);
    setIsDetailModalOpen(true);
  };
  
  // Handle actual document preview
  const handlePreview = async (documentId) => {
    try {
      const previewData = await getDocumentPreviewUrl(documentId);
      setPreviewDocument(previewData);
      
      // If the document is viewable in the browser, open it in a new tab
      if (previewData.viewable) {
        window.open(previewData.sasUrl, '_blank');
      } else {
        // Otherwise, trigger a download
        const link = document.createElement('a');
        link.href = previewData.sasUrl;
        link.setAttribute('download', previewData.fileName || 'document');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error previewing document:', error);
    }
  };
  
  // Handle document download
  const handleDownload = async (documentId) => {
    try {
      const previewData = await getDocumentPreviewUrl(documentId);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = previewData.sasUrl;
      link.setAttribute('download', previewData.fileName || 'document');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };
  // Handle document delete
  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);
      // Update the documents list
      setDocuments(documents.filter(doc => doc.documentId !== documentId));
      // Also remove from selected documents if it's there
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  
  // Handle document update
  const handleUpdateDocument = async (documentId, updatedData) => {
    try {
      // Call the API to update the document
      const updatedDocument = await updateDocument(documentId, updatedData);
      
      // Update the documents state with the updated document
      setDocuments(prevDocuments => 
        prevDocuments.map(doc => 
          doc.documentId === documentId 
            ? { ...doc, ...updatedDocument } 
            : doc
        )
      );
      
      // If we were viewing the document details, update that too
      if (detailDocument && detailDocument.documentId === documentId) {
        setDetailDocument(prev => ({ ...prev, ...updatedDocument }));
      }
      
      // Return true to indicate success
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  };

  // Apply filters and search
  const filteredDocuments = documents.filter(doc => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      (doc.title && doc.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.uploaderName && doc.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Department filter
    const matchesDepartment = departmentFilter === 'all' || 
      (doc.departmentId && doc.departmentId.toString() === departmentFilter);
    
    // File type filter
    const getFileExtension = (fileType) => {
      if (!fileType) return '';
      
      if (fileType.includes('pdf')) return 'pdf';
      if (fileType.includes('word') || fileType.includes('doc')) return 'doc';
      if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('csv')) return 'csv';
      if (fileType.includes('image') || fileType.includes('jpeg') || fileType.includes('png')) return 'image';
      if (fileType.includes('zip') || fileType.includes('archive')) return 'zip';
      if (fileType.includes('text') || fileType.includes('plain')) return 'txt';
      
      return 'other';
    };
    
    const fileExtension = getFileExtension(doc.fileType);
    const matchesFileType = fileTypeFilter === 'all' || fileExtension === fileTypeFilter;
    
    // Date filter - this is a simplified version
    let matchesDate = true;
    if (dateFilter !== 'all' && doc.createdAt) {
      const docDate = new Date(doc.createdAt);
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      
      switch(dateFilter) {
        case 'today':
          matchesDate = docDate.toDateString() === today.toDateString();
          break;
        case 'thisWeek':
          matchesDate = docDate >= weekStart;
          break;
        case 'thisMonth':
          matchesDate = docDate >= monthStart;
          break;
        case 'lastMonth':
          matchesDate = docDate >= lastMonthStart && docDate <= lastMonthEnd;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesDepartment && matchesFileType && matchesDate;
  });

  // Apply sorting
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch(sortBy) {
      case 'dateNewest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'dateOldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'nameAZ':
        return (a.title || '').localeCompare(b.title || '');
      case 'nameZA':
        return (b.title || '').localeCompare(a.title || '');
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = sortedDocuments.slice(indexOfFirstDocument, indexOfLastDocument);
  const totalPages = Math.ceil(sortedDocuments.length / documentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Get simplified file type name
  const getSimpleFileType = (fileType) => {
    if (!fileType) return 'File';
    
    const lowerType = fileType.toLowerCase();
    
    if (lowerType.includes('pdf')) return 'PDF';
    if (lowerType.includes('spreadsheet') || lowerType.includes('excel') || lowerType.includes('sheet')) return 'EXCEL';
    if (lowerType.includes('word') || lowerType.includes('doc')) return 'WORD';
    if (lowerType.includes('image') || lowerType.includes('jpeg') || lowerType.includes('png') || lowerType.includes('jpg')) return 'IMAGE';
    if (lowerType.includes('zip') || lowerType.includes('archive') || lowerType.includes('compressed')) return 'ZIP';
    if (lowerType.includes('html') || lowerType.includes('javascript') || lowerType.includes('code')) return 'CODE';
    if (lowerType.includes('text') || lowerType.includes('plain')) return 'TEXT';
    
    // Extract extension if possible
    const parts = fileType.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toUpperCase();
    }
    
    return 'FILE';
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (!fileType) return <FontAwesomeIcon icon={faFile} className="text-gray-600" />;
    
    if (fileType.includes('pdf')) {
      return <FontAwesomeIcon icon={faFilePdf} className="text-red-600" />;
    }
    if (fileType.includes('csv') || fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FontAwesomeIcon icon={faFileExcel} className="text-green-600" />;
    }
    if (fileType.includes('word') || fileType.includes('doc')) {
      return <FontAwesomeIcon icon={faFileWord} className="text-blue-600" />;
    }
    if (fileType.includes('image') || fileType.includes('jpeg') || fileType.includes('png') || fileType.includes('jpg')) {
      return <FontAwesomeIcon icon={faFileImage} className="text-purple-600" />;
    }
    if (fileType.includes('zip') || fileType.includes('archive') || fileType.includes('compressed')) {
      return <FontAwesomeIcon icon={faFileArchive} className="text-orange-600" />;
    }
    if (fileType.includes('html') || fileType.includes('javascript') || fileType.includes('code')) {
      return <FontAwesomeIcon icon={faFileCode} className="text-yellow-600" />;
    }
    
    return <FontAwesomeIcon icon={faFileAlt} className="text-gray-600" />;
  };
  // User initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    try {
      return name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
    } catch (error) {
      console.error('Error generating initials:', error);
      return 'U';
    }
  };
  
  // Handle avatar loading errors
  const handleAvatarError = (e, name) => {
    try {
      e.target.style.display = 'none';
      e.target.parentNode.classList.add('bg-blue-600', 'text-white');
      e.target.parentNode.innerHTML = getInitials(name || 'Unknown');
    } catch (error) {
      console.error('Error handling avatar fallback:', error);
      // Just in case there's an error with the DOM manipulation
      e.target.parentNode.classList.add('bg-gray-400');
      e.target.parentNode.innerHTML = 'U';
    }
  };

  // Toggle selection of a single document
  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments(prevSelected => {
      if (prevSelected.includes(docId)) {
        return prevSelected.filter(id => id !== docId);
      } else {
        return [...prevSelected, docId];
      }
    });
  };

  // Toggle select all documents on current page
  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentDocuments.map(doc => doc.documentId));
    }
    setIsSelectAll(!isSelectAll);
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedDocuments([]);
    setIsSelectAll(false);
  };

  // Handle bulk delete action
  const handleBulkDelete = async () => {
    setIsConfirmDialogOpen(false);
    setProcessingBulkAction(true);
    
    try {
      // Delete each document
      await Promise.all(selectedDocuments.map(id => deleteDocument(id)));
      
      // Update documents list
      setDocuments(prevDocuments => 
        prevDocuments.filter(doc => !selectedDocuments.includes(doc.documentId))
      );
      
      // Clear selections after successful deletion
      clearSelections();
      
      console.log(`Successfully deleted ${selectedDocuments.length} documents`);
    } catch (error) {
      console.error('Error deleting documents:', error);
    } finally {
      setProcessingBulkAction(false);
    }
  };

  // Handle bulk download action
  const handleBulkDownload = () => {
    // For each selected document, trigger a download
    selectedDocuments.forEach(async (docId) => {
      try {
        await handleDownload(docId);
      } catch (error) {
        console.error(`Error downloading document ${docId}:`, error);
      }
    });
  };

  // Update checks when the current page or documents list changes
  useEffect(() => {
    setIsSelectAll(
      currentDocuments.length > 0 && 
      currentDocuments.every(doc => selectedDocuments.includes(doc.documentId))
    );
  }, [currentPage, documents, selectedDocuments, currentDocuments]);
  // Confirmation dialog component
  const ConfirmDialog = ({ isOpen, title, message, confirmButtonText, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Document edit modal component
  const DocumentEditModal = ({ isOpen, document, onClose, onSave }) => {
    if (!isOpen || !document) return null;
    
    const [formData, setFormData] = useState({
      title: document.title || '',
      description: document.description || ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveError, setSaveError] = useState('');
    
    // Reset form data when document changes
    useEffect(() => {
      if (document) {
        setFormData({
          title: document.title || '',
          description: document.description || ''
        });
        setErrors({});
        setSaveError('');
      }
    }, [document]);
    
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.title.trim()) {
        newErrors.title = 'Document title is required';
      } else if (formData.title.trim().length > 100) {
        newErrors.title = 'Title must be less than 100 characters';
      }
      
      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description must be less than 500 characters';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear error for this field
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };
      const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsSubmitting(true);
      setSaveError('');
      
      try {
        const success = await onSave(document.documentId, {
          title: formData.title.trim(),
          description: formData.description.trim()
        });
        
        if (success) {
          onClose();
        } else {
          setSaveError('Failed to update document. Please try again.');
        }
      } catch (error) {
        console.error('Error updating document:', error);
        setSaveError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <div className="fixed inset-0 backdrop-blur-lg bg-black/50 flex items-center justify-center z-9999 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Document</h2>
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          {saveError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {saveError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                rows="4"
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description ? formData.description.length : 0}/500 characters
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // Document detail modal component
  const DocumentDetailModal = ({ isOpen, document, onClose, onPreview, onDownload, onEdit, onDelete }) => {
    if (!isOpen || !document) return null;
    return (
  <div className="fixed inset-0 backdrop-blur-lg bg-black/50 flex items-center justify-center z-9999 p-4 overflow-y-auto">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
      {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm">
            <div className="flex items-center">
              <div className="h-12 w-12 mr-4 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                {getFileIcon(document.fileType)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{document.title}</h2>
                <p className="text-sm text-gray-500">
                  {getSimpleFileType(document.fileType)} {document.fileSizeFormatted ? `• ${document.fileSizeFormatted}` : ''}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            {/* Main info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div>
                 <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Document ID</h3>
                  <p className="text-gray-800 font-mono text-sm">{document.documentId}</p>
                </div>
               
                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Uploader's Department</h3>
                  <p className="text-gray-800">{document.departmentName || "No department assigned"}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Upload Date</h3>
                  <p className="text-gray-800">{document.createdAt ? new Date(document.createdAt).toLocaleString() : 'Unknown'}</p>
                </div>
              </div>
              
              {/* Right Column */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Uploader</h3>
                  <div className="flex items-center mt-1">
                    <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium shadow-sm mr-3">
                      {document.uploaderAvatar ? (
                        <img 
                          src={document.uploaderAvatar} 
                          alt={document.uploaderName || 'Unknown'} 
                          className="h-full w-full object-cover"
                          onError={(e) => handleAvatarError(e, document.uploaderName)}
                        />
                      ) : document.uploaderName ? (
                        <div className="h-full w-full bg-blue-600 text-white flex items-center justify-center">
                          {getInitials(document.uploaderName)}
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gray-400 text-white flex items-center justify-center">
                          <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{document.uploaderName || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{document.uploaderEmail || ''}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Last Updated</h3>
                  <p className="text-gray-800">{document.updatedAt ? new Date(document.updatedAt).toLocaleString() : 'Not updated since upload'}</p>
                </div>
                
                 <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-800">{document.description || "No description provided"}</p>
                </div>
               
              </div>
            </div>
            
            {/* Tags or additional metadata could go here */}
            {document.tags && document.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="border-t px-6 py-4 bg-gray-50 sticky bottom-0 flex flex-wrap justify-between items-center gap-3">
            <div>
              <button
                onClick={() => onDelete(document.documentId)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onPreview(document.documentId)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Preview
              </button>
              
              <button
                onClick={() => onDownload(document.documentId)}
                className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download
              </button>
              
              <button
                onClick={() => onEdit(document)}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                Edit Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render appropriate content based on loading state and results
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading documents...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-8 text-center border border-red-200 bg-red-50 rounded-lg">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-3xl mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="py-8 text-center border rounded-lg bg-gray-50">
        <p className="text-gray-600">No documents found matching your filters.</p>
      </div>
    );
  }

  return (
    <div>      {/* Bulk Actions */}
      <div 
        className={`mb-4 p-3 border rounded-md shadow-sm transition-all duration-300 ${
          selectedDocuments.length > 0 
            ? 'opacity-100 bg-blue-50 border-blue-200 transform translate-y-0' 
            : 'opacity-0 bg-gray-50 border-gray-200 transform -translate-y-4 pointer-events-none absolute'
        }`}
        style={{
          height: selectedDocuments.length > 0 ? 'auto' : '0',
          overflow: 'hidden',
          zIndex: selectedDocuments.length > 0 ? '10' : '-1',
          animation: selectedDocuments.length > 0 ? 'slideDown 0.3s ease-out' : 'slideUp 0.3s ease-out',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="text-blue-700 font-medium flex items-center">
              <FontAwesomeIcon icon={faCheckSquare} className="mr-2" />
              {selectedDocuments.length}
              <span className="ml-1">Selected</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              className="px-3 py-1.5 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
              Delete
            </button>
            <button 
              className="px-3 py-1.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              onClick={handleBulkDownload}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-1.5" />
              Download
            </button>
            <button 
              className="px-3 py-1.5 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
              onClick={clearSelections}
            >
              <FontAwesomeIcon icon={faTimes} className="mr-1.5" />
              Clear
            </button>
          </div>
        </div>
      </div>{/* Documents Table */}
      <div>
        {/* Table Header */}
        <div className="bg-gray-50 border border-gray-200 rounded-t-lg p-3 flex flex-wrap items-center justify-between mb-2 gap-2">
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={isSelectAll}
              onChange={toggleSelectAll}
            />
            <span className="font-medium text-gray-700">Select All</span>
          </div>
          <div className="text-gray-500 text-sm">
            {sortedDocuments.length} document{sortedDocuments.length !== 1 ? 's' : ''} found
          </div>
        </div>          {/* Document Cards */}
        {currentDocuments.map((doc) => (
          <div key={doc.documentId} className="border border-gray-200 rounded-lg mb-4 hover:shadow-md transition-shadow bg-white overflow-hidden">            
            <div className="flex flex-col md:flex-row items-start md:items-center p-4 gap-3 w-full">
              {/* First Row: Icon, Title, Actions */}
              <div className="flex w-full items-center overflow-hidden">
                {/* Checkbox and File Type Icon */}
                <div className="flex items-center space-x-3 shrink-0">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all hover:shadow-md"
                    checked={selectedDocuments.includes(doc.documentId)}
                    onChange={() => toggleDocumentSelection(doc.documentId)}
                  />
                  <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                    {getFileIcon(doc.fileType)}
                  </div>
                </div>{/* Document Name and Size */}
                  <div className="flex-1 min-w-0 px-3 overflow-hidden">
                    <h3 className="text-lg font-medium text-gray-900 truncate max-w-full">{doc.title}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {getSimpleFileType(doc.fileType)} {doc.fileSizeFormatted ? `• ${doc.fileSizeFormatted}` : ''}
                    </p>
                    {/* {doc.description && (
                      <p className="text-xs text-gray-600 mt-1 truncate">{doc.description}</p>
                    )} */}
                  </div>
                  {/* Action Buttons */}
                <div className="flex space-x-2 ml-auto shrink-0 pl-2">                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50" 
                    title="View Document Details"
                    onClick={() => handleOpenDetail(doc)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50" 
                    title="Download Document"
                    onClick={() => handleDownload(doc.documentId)}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-full hover:bg-red-50" 
                    title="Delete Document"
                    onClick={() => handleDelete(doc.documentId)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
                {/* Second Row: Author and Date */}         
                <div className="flex w-full mt-2 md:mt-0 border-t md:border-t-0 pt-2 md:pt-0 justify-between items-center">
                {/* Date Added */}
                <div className="text-sm text-gray-500 mr-2">
                  Added: <span className="font-medium">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>                {/* Author Information */}
                <div className="flex items-center space-x-3 shrink-0">                  <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium shadow-sm">
                    {doc.uploaderAvatar ? (
                      <img 
                        src={doc.uploaderAvatar} 
                        alt={doc.uploaderName || 'Unknown'} 
                        className="h-full w-full object-cover"
                        onError={(e) => handleAvatarError(e, doc.uploaderName)}
                      />
                    ) : doc.uploaderName ? (
                      // Second option: Use initials if no avatar but name exists
                      <div className="h-full w-full bg-blue-600 text-white flex items-center justify-center">
                        {getInitials(doc.uploaderName)}
                      </div>
                    ) : (
                      // Third option: Default user icon if neither avatar nor valid name
                      <div className="h-full w-full bg-gray-400 text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 max-w-[150px] sm:max-w-[200px]">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.uploaderName || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 truncate">{doc.departmentName || 'No Department'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
        {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex flex-wrap justify-center gap-1 md:gap-0 md:border md:border-gray-300 md:rounded-md md:overflow-hidden">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-2 rounded-md md:rounded-none ${
                  pageNumber === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 md:border-0 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${selectedDocuments.length} selected document(s)? This action cannot be undone.`}
        confirmButtonText={processingBulkAction ? "Deleting..." : "Delete"}
        onConfirm={handleBulkDelete}
        onCancel={() => setIsConfirmDialogOpen(false)}
      />
      
      {/* Document Detail Modal */}      <DocumentDetailModal
        isOpen={isDetailModalOpen}
        document={detailDocument}
        onClose={() => setIsDetailModalOpen(false)}
        onPreview={(documentId) => handlePreview(documentId)}
        onDownload={(documentId) => handleDownload(documentId)}
        onEdit={(document) => {
          // Store the document and open edit modal
          setDetailDocument(document);
          setIsDetailModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={(documentId) => {
          // First close the detail modal
          setIsDetailModalOpen(false);
          
          // Then delete the document
          handleDelete(documentId);
        }}
      />
        {/* Document Edit Modal */}
      <DocumentEditModal
        isOpen={isEditModalOpen}
        document={detailDocument}
        onClose={() => {
          setIsEditModalOpen(false);
          // Reopen the detail modal if user cancels the edit
          setIsDetailModalOpen(true);
        }}        onSave={async (documentId, formData) => {
          // Call our handler to update the document
          const success = await handleUpdateDocument(documentId, formData);
          
          if (success) {
            // Close edit modal
            setIsEditModalOpen(false);
            
            // Show updated document details with a short delay to allow state update
            setTimeout(() => {
              setIsDetailModalOpen(true);
            }, 100);
            
            // Add notification feedback - in a real app, you might use a toast library
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
            notification.textContent = 'Document updated successfully';
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
              notification.classList.add('opacity-0');
              setTimeout(() => document.body.removeChild(notification), 500);
            }, 3000);
          }
          
          return success;
        }}
      />
    </div>
  );
};

export default DocumentList;
