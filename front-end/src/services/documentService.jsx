import Api from "../config/Api";

// Get documents for a specific event
export const getDocumentsByEvent = async (eventId) => {
  try {
    const response = await Api.get(`/documents/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching documents by event:", error);
    throw error;
  }
};

// Get documents for a specific department in an event
export const getDocumentsByDepartment = async (eventId, departmentId) => {
  try {
    const response = await Api.get(`/documents/event/${eventId}/department/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching documents by department:", error);
    throw error;
  }
};

// Get a specific document by ID
export const getDocumentById = async (documentId) => {
  try {
    const response = await Api.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    throw error;
  }
};

// Get preview URL for a document
export const getDocumentPreviewUrl = async (documentId) => {
  try {
    const response = await Api.get(`/documents/${documentId}/preview`);
    return response.data;
  } catch (error) {
    console.error("Error getting document preview URL:", error);
    throw error;
  }
};

// Upload a document
export const uploadDocument = async (file, documentData, accountId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
      // Create the request object with required fields
    const request = {
      eventId: documentData.eventId,
      departmentId: documentData.departmentId || null,
      title: documentData.title || file.name,
      description: documentData.description || '',
      uploaderAccountId: parseInt(accountId, 10) // Ensure it's parsed as an integer
    };
    
    // Add the request part as JSON
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    
    const response = await Api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (documentId) => {
  try {
    await Api.delete(`/documents/${documentId}`);
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Get the latest 5 images - keeping this for backward compatibility
export const getImages = async () => {
  try {
    const response = await Api.get("/documents/latest");
    return response.data;
  } catch (error) {
    console.error("Error fetching document images:", error);
    return [];
  }
};

// Update document details (title, description)
export const updateDocument = async (documentId, updateData) => {
  try {
    const response = await Api.put(`/documents/${documentId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};
