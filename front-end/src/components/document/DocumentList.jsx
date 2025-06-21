import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faEye, 
  faFileAlt, 
  faFilePdf, 
  faFileCsv, 
  faTrash, 
  faTimes, 
  faCheckSquare,
  faEllipsisH
} from '@fortawesome/free-solid-svg-icons';

const DocumentList = ({ searchTerm, departmentFilter, fileTypeFilter, dateFilter, sortBy, eventId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [processingBulkAction, setProcessingBulkAction] = useState(false);
  const documentsPerPage = 6;

  // Sample documents data - replace with actual API call in production
  const sampleDocuments = [
    {
      id: 1,
      name: 'Meeting minutes',
      type: 'doc',
      size: '8MB',
      author: 'Martin Schneider',
      departmentId: 'marketing',
      departmentName: 'Marketing Department',
      date: 'June 15, 2025'
    },
    {
      id: 2,
      name: 'SC_S1892_receipt',
      type: 'pdf',
      size: '10MB',
      author: 'Dean Hidri',
      departmentId: 'finance',
      departmentName: 'Finance Department',
      date: 'June 14, 2025'
    },
    {
      id: 3,
      name: 'SC_S1892_receipt',
      type: 'pdf',
      size: '6MB',
      author: 'Kevin Kaide',
      departmentId: 'hr',
      departmentName: 'Human Resources Department',
      date: 'June 10, 2025'
    },
    {
      id: 4,
      name: 'SC_S1892_receipt',
      type: 'csv',
      size: '12MB',
      author: 'Jan Hoffmann',
      departmentId: 'culture',
      departmentName: 'Culture Department',
      date: 'June 8, 2025'
    },
    {
      id: 5,
      name: '#SC_S1892_receipt',
      type: 'pdf',
      size: '8MB',
      author: 'Lena Nattke',
      departmentId: 'operations',
      departmentName: 'Operations Department',
      date: 'June 5, 2025'
    },
    {
      id: 6,
      name: '#SC_S1892_receipt',
      type: 'pdf',
      size: '8MB',
      author: 'Chris Kruger',
      departmentId: 'it',
      departmentName: 'IT Department',
      date: 'June 1, 2025'
    },
    {
      id: 7,
      name: 'Event Budget',
      type: 'pdf',
      size: '5MB',
      author: 'Dean Hidri',
      departmentId: 'finance',
      departmentName: 'Finance Department',
      date: 'May 28, 2025'
    },
    {
      id: 8,
      name: 'Marketing Plan',
      type: 'doc',
      size: '7MB',
      author: 'Martin Schneider',
      departmentId: 'marketing',
      departmentName: 'Marketing Department',
      date: 'May 25, 2025'
    }
  ];

  useEffect(() => {
    // Simulate an API call
    setLoading(true);
    setTimeout(() => {
      // In a real application, you'd fetch documents from an API
      // const fetchDocuments = async () => {
      //   try {
      //     const response = await getDocumentsByEventId(eventId);
      //     setDocuments(response.data);
      //   } catch (error) {
      //     console.error('Error fetching documents:', error);
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      
      // if (eventId) fetchDocuments();
      
      setDocuments(sampleDocuments);
      setLoading(false);
    }, 800);
  }, [eventId]);

  // Apply filters and search
  const filteredDocuments = documents.filter(doc => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Department filter
    const matchesDepartment = departmentFilter === 'all' || doc.departmentId === departmentFilter;
    
    // File type filter
    const matchesFileType = fileTypeFilter === 'all' || doc.type === fileTypeFilter;
    
    // Date filter (simplified - would need actual date logic in production)
    const matchesDate = dateFilter === 'all'; // Simplified for demo
    
    return matchesSearch && matchesDepartment && matchesFileType && matchesDate;
  });

  // Apply sorting
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch(sortBy) {
      case 'dateNewest':
        return new Date(b.date) - new Date(a.date);
      case 'dateOldest':
        return new Date(a.date) - new Date(b.date);
      case 'nameAZ':
        return a.name.localeCompare(b.name);
      case 'nameZA':
        return b.name.localeCompare(a.name);
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

  // Get file icon based on file type
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <FontAwesomeIcon icon={faFilePdf} className="text-red-600" />;
      case 'csv':
        return <FontAwesomeIcon icon={faFileCsv} className="text-green-600" />;
      case 'doc':
      default:
        return <FontAwesomeIcon icon={faFileAlt} className="text-blue-600" />;
    }
  };

  // User initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
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
      setSelectedDocuments(currentDocuments.map(doc => doc.id));
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
      // In a real application, you would call an API to delete the documents
      // For example:
      // await Promise.all(selectedDocuments.map(id => deleteDocument(id)));
      
      // For demonstration purposes, we'll simulate a deletion by removing
      // the selected items from our documents array
      setTimeout(() => {
        setDocuments(prevDocuments => 
          prevDocuments.filter(doc => !selectedDocuments.includes(doc.id))
        );
        
        // Clear selections after successful deletion
        clearSelections();
        setProcessingBulkAction(false);
        
        // Show success message (would be implemented via a notification system)
        console.log(`Successfully deleted ${selectedDocuments.length} documents`);
      }, 1000);
    } catch (error) {
      console.error('Error deleting documents:', error);
      setProcessingBulkAction(false);
    }
  };

  // Handle bulk download action
  const handleBulkDownload = () => {
    // In a real application, you would trigger downloads for each selected document
    console.log(`Downloading ${selectedDocuments.length} documents`);
    
    // For demonstration purposes, we'll just log the action
    selectedDocuments.forEach(id => {
      const doc = documents.find(d => d.id === id);
      console.log(`Downloading: ${doc.name} (${doc.type})`);
    });
  };

  // Update checks when the current page or documents list changes
  useEffect(() => {
    setIsSelectAll(
      currentDocuments.length > 0 && 
      currentDocuments.every(doc => selectedDocuments.includes(doc.id))
    );
  }, [currentPage, documents, selectedDocuments, currentDocuments]);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading documents...</p>
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

  // Add keyframe animations for bulk actions
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
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes bounceIn {
        0% { transform: scale(0.8); opacity: 0; }
        70% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Confirmation Dialog Component for bulk actions
  const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText = 'Delete' }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div 
          className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full z-10"
          style={{ animation: 'bounceIn 0.3s ease-out' }}
        >
          <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
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

  return (
    <div>
      {/* Bulk Actions */}
      <div 
        className={`mb-4 p-3 border rounded-md shadow-sm flex items-center justify-between transition-all duration-300 ${
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
        <div className="flex items-center">
          <span className="text-blue-700 font-medium flex items-center">
            <FontAwesomeIcon icon={faCheckSquare} className="mr-2" />
            <span>
              {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
            </span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBulkDownload}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-1" /> Download All
          </button>
          <button
            onClick={() => setIsConfirmDialogOpen(true)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete All
          </button>
          <button
            onClick={clearSelections}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-1" /> Cancel
          </button>
        </div>
      </div>
      
      {/* Document List */}
      <div className="mt-6">
        {/* Table Header */}
        <div className="bg-gray-50 border border-gray-200 rounded-t-lg p-3 flex items-center mb-2">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={isSelectAll}
              onChange={toggleSelectAll}
            />
            <span className="font-medium text-gray-700">Select All</span>
          </div>
        </div>
        {currentDocuments.map((doc) => (
          <div key={doc.id} className="border border-gray-200 rounded-lg mb-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex flex-wrap md:flex-nowrap items-center p-4 gap-2">
              {/* Checkbox and File Type Icon */}
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all duration-200 hover:shadow-md"
                  checked={selectedDocuments.includes(doc.id)}
                  onChange={() => toggleDocumentSelection(doc.id)}
                />
                <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                  {getFileIcon(doc.type)}
                </div>
              </div>
              
              {/* Document Name and Size */}
              <div className="flex-1 min-w-0 w-full md:w-1/3 px-3">
                <h3 className="text-lg font-medium text-gray-900 truncate">{doc.name}</h3>
                <p className="text-sm text-gray-500">{doc.type.toUpperCase()} • {doc.size}</p>
              </div>
              
              {/* Author Information */}
              <div className="flex items-center space-x-3 w-full md:w-1/4 px-3">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                  {getInitials(doc.author)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.author}</p>
                  <p className="text-xs text-gray-500 truncate">{doc.departmentName}</p>
                </div>
              </div>
              
              {/* Date Added */}
              <div className="text-sm text-gray-500 whitespace-nowrap w-full md:w-1/6 px-3">
                Added: <span className="font-medium">{doc.date}</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4 ml-auto w-full md:w-auto justify-end">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50" title="View Document">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50" title="Download Document">
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button 
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border-r border-gray-300 ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              &laquo; Prev
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 border-r border-gray-300 ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-500 text-center mt-4">
        Showing {filteredDocuments.length > 0 ? indexOfFirstDocument + 1 : 0} to {Math.min(indexOfLastDocument, filteredDocuments.length)} of {filteredDocuments.length} documents
      </div>
      
      {/* Confirmation Dialog for Bulk Actions */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleBulkDelete}
        title="Confirm Delete Documents"
        message={`Are you sure you want to delete ${selectedDocuments.length} selected document${selectedDocuments.length !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmButtonText="Delete"
      />
      
      {/* Bulk Action Floating Button (Mobile) */}
      {selectedDocuments.length > 0 && (
        <div 
          className="fixed bottom-5 right-5 z-40 md:hidden"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div className="bg-blue-600 text-white rounded-full shadow-lg flex items-center p-3">
            <div className="flex items-center gap-2">
              <span className="bg-white text-blue-600 w-6 h-6 flex items-center justify-center rounded-full font-bold">
                {selectedDocuments.length}
              </span>
              <span>Selected</span>
            </div>
            <button 
              className="ml-2 bg-blue-700 hover:bg-blue-800 p-2 rounded-full transition-colors"
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button 
              className="ml-2 bg-blue-700 hover:bg-blue-800 p-2 rounded-full transition-colors"
              onClick={handleBulkDownload}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
            <button 
              className="ml-2 bg-blue-700 hover:bg-blue-800 p-2 rounded-full transition-colors"
              onClick={clearSelections}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
