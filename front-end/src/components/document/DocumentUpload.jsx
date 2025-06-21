import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFile } from '@fortawesome/free-solid-svg-icons';
import { uploadDocument } from '../../services/documentService';

const DocumentUpload = ({ eventId, departmentId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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
    
    // For demonstration purposes - simulate upload
    // In a real implementation, you'd submit the file to the server
    // Example:
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('fileName', file.name);
    // if (eventId && departmentId) {
    //   uploadDocument(eventId, departmentId, formData)
    //     .then(response => {
    //       // Handle success
    //       console.log('Document uploaded successfully:', response);
    //     })
    //     .catch(error => {
    //       // Handle error
    //       console.error('Error uploading document:', error);
    //     });
    // }
    
    simulateUpload();
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
    <div 
      className={`border-2 border-dashed rounded-lg p-6 mb-8 text-center transition-colors ${
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
      
      {!selectedFile && !isUploading ? (
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
          >
            Browse Files
          </button>
        </>
      ) : (
        <div>
          {selectedFile && (
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <FontAwesomeIcon icon={faFile} className="text-blue-600 text-xl" />
              </div>
              <div className="ml-3 text-left">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          )}
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload complete!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
