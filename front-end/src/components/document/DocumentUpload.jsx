import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFile, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { uploadDocument } from '../../services/documentService.jsx';

const DocumentUpload = ({ eventId, departmentId, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const fileInputRef = useRef(null);  // Get current user ID from sessionStorage on component mount
  useEffect(() => {
    // Get accountId from sessionStorage
    let accountId = sessionStorage.getItem('accountId');
    
    // If accountId is not in sessionStorage, try to get it from localStorage
    if (!accountId) {
      accountId = localStorage.getItem('accountId');
    }
    
    setUserId(accountId);
    
    if (!accountId) {
      console.error('User ID not found in session or local storage');
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setTitle(file.name); // Set default title to file name
    setError(''); // Clear any previous errors
  };
  
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!eventId) {
      setError('Event ID is required');
      return;
    }
    
    if (!userId) {
      setError('You must be logged in to upload documents');
      return;
    }
    
    if (!title.trim()) {
      setError('Please provide a title for the document');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Prepare document data
      const documentData = {
        eventId: parseInt(eventId),
        departmentId: departmentId && departmentId !== 'all' ? parseInt(departmentId) : null,
        title: title.trim(),
        description: description.trim()
      };
      
      // Create a fake progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      
      // Call the API
      const response = await uploadDocument(selectedFile, documentData, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset form after successful upload
      setTimeout(() => {
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        setIsUploading(false);
        setUploadProgress(0);
        
        // Notify parent component about successful upload
        if (onUploadComplete && typeof onUploadComplete === 'function') {
          onUploadComplete(response);
        }
      }, 1000);
      
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setError(error.response?.data?.message || 'Error uploading document. Please try again.');
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setSelectedFile(null);
            // In a real app, you'd notify success here
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Display a message if no department is selected (optional)
  if (!eventId) {
    return (
      <div className="border-2 border-dashed rounded-lg p-6 mb-8 text-center border-gray-200 bg-gray-50">
        <p className="text-gray-500">Event ID is required to upload documents.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Document</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {!selectedFile ? (
          <>
            <FontAwesomeIcon 
              icon={faCloudUploadAlt} 
              className="text-gray-400 text-3xl mb-3" 
            />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Choose file
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or drag file in here
            </p>
            <button
              type="button"
              onClick={triggerFileInput}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              disabled={isUploading}
            >
              Browse Files
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 p-3 rounded-lg">
              <FontAwesomeIcon icon={faFile} className="text-blue-600 text-xl" />
            </div>
            <div className="ml-3 text-left">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            {!isUploading && (
              <button 
                className="ml-auto text-sm text-red-500 hover:text-red-700"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
      
      {selectedFile && (
        <>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document title"
              disabled={isUploading}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document description (optional)"
              rows={3}
              disabled={isUploading}
            />
          </div>
          
          {isUploading ? (
            <div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              disabled={isUploading}
            >
              Upload Document
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentUpload;
