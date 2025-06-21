import api from '../config/Api';

// Get all documents for an event
export const getDocumentsByEventId = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/documents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Get documents for a specific department in an event
export const getDocumentsByDepartment = async (eventId, departmentId) => {
  try {
    const response = await api.get(`/events/${eventId}/departments/${departmentId}/documents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching department documents:', error);
    throw error;
  }
};

// Upload a document
export const uploadDocument = async (eventId, departmentId, formData) => {
  try {
    const response = await api.post(
      `/events/${eventId}/departments/${departmentId}/documents/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          // You can use this to track upload progress
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Update state with progress
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// Download a document
export const downloadDocument = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from response headers if available
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'document'; // Default filename
    
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up URL
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
