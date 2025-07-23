import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getExpenseCategories,
  createExpenseRequest,
} from "../../services/expense/ExpenseService.jsx";
import { toast } from "react-toastify";

const ExpenseRequestPopup = ({ 
  isOpen, 
  onClose, 
  accountId, 
  departmentId, 
  budgetId, 
  onSubmitSuccess 
}) => {
 
  const { id: urlEventId } = useParams();
  const eventId = urlEventId? parseInt(urlEventId) : null;
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    note: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
    files: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // console.log("Fetching expense categories for eventId:", eventId);
        
        if (!eventId) {
          console.error("EventId is undefined or null");
          toast.error("Event ID is missing. Cannot load categories.");
          return;
        }

        const categoriesData = await getExpenseCategories(eventId);
        // console.log("Categories loaded:", categoriesData);
        
        setCategories(categoriesData);

        if (categoriesData && categoriesData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: categoriesData[0].categoryId,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && eventId) {
      fetchCategories();
    }
  }, [eventId, isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    
    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!formData.note?.trim()) {
      toast.error("Please enter a note");
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one evidence file");
      return;
    }

    // Validate image files again before submission
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = selectedFiles.filter(file => 
      validImageTypes.includes(file.type) && file.size <= maxSize
    );

    if (validFiles.length === 0) {
      toast.error("No valid files to upload. Please select valid image files under 10MB.");
      return;
    }

    if (validFiles.length !== selectedFiles.length) {
      toast.warning(`${selectedFiles.length - validFiles.length} files will be skipped due to invalid type or size.`);
    }
    
    setLoading(true);
    toast.info("Submitting expense request...");
    
    try {
      const expenseData = {
        eventId: Number(eventId),
        categoryId: Number(formData.category),
        departmentId: Number(departmentId || 0),
        amount: Number(formData.amount),
        note: formData.note,
        budgetId: Number(budgetId || 0),
        paymentDate: formData.date,
        paymentMethod: "CASH", 
        status: "PENDING",
        createdByAccountId: Number(accountId || 0)
      };
      
   
      
      console.log("Submitting expense request:", expenseData);
      console.log("EventId:", eventId, "Type:", typeof eventId);
      console.log("Files being uploaded:", validFiles.map(f => ({name: f.name, type: f.type, size: f.size})));
      
      if (!eventId || isNaN(eventId)) {
        toast.error("Invalid event ID. Cannot submit request.");
        return;
      }
      
      const response = await createExpenseRequest(eventId, expenseData, validFiles);
      
      toast.success("Expense request submitted successfully!");
      
      // Reset form
      setFormData({
        note: "",
        amount: "",
        category: categories.length > 0 ? categories[0].categoryId : "",
        date: new Date().toISOString().split('T')[0],
        files: [],
      });
      setSelectedFiles([]);
      
      // Clean up object URLs to prevent memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Error submitting expense request:", error);
      
      // Hiển thị thông báo lỗi chi tiết hơn cho người dùng
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 413) {
          toast.error("Files are too large. Please reduce file sizes and try again.");
        } else if (status === 415) {
          toast.error("Unsupported file type. Please use only JPEG, PNG, GIF, or WebP images.");
        } else if (status === 400 && data && data.message) {
          toast.error(`Bad Request: ${data.message}`);
        } else if (status === 500) {
          toast.error("Server error. Please try again later or contact support.");
        } else if (data && data.message) {
          toast.error(`Error (${status}): ${data.message}`);
        } else {
          toast.error(`Error (${status}): The server rejected the request.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your internet connection and try again.");
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Failed to submit expense request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Create Expense Request</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Card Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter expense title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                required
              />
            </div> */}
            
            {/* Amount Input */}
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (VND) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount in VND"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            
            {/* Category Dropdown */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? (
                  <option>Loading categories...</option>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
            </div>
            
            {/* Date Input */}
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Note Textarea */}
            <div className="space-y-2">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                Note *
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="3"
                placeholder="Enter description for this expense"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            {/* File Upload */}
            <div className="space-y-2">
              <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                Evidence Files *
              </label>
              <input
                type="file"
                id="files"
                name="files"
                onChange={(e) => {
                  // Handle file selection
                  const files = Array.from(e.target.files);
                  
                  // Validate file types
                  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                  const validFiles = files.filter(file => validImageTypes.includes(file.type));
                  
                  if (validFiles.length !== files.length) {
                    toast.warning(`${files.length - validFiles.length} file(s) were skipped because they are not valid image types.`);
                  }
                  
                  if (validFiles.length === 0) {
                    toast.error("Please select valid image files (JPEG, PNG, GIF, WebP)");
                    return;
                  }
                  
                  // Kiểm tra kích thước file
                  const maxSize = 10 * 1024 * 1024; 
                  const validSizeFiles = validFiles.filter(file => file.size <= maxSize);
                  
                  if (validSizeFiles.length !== validFiles.length) {
                    toast.warning(`${validFiles.length - validSizeFiles.length} file(s) were skipped because they exceed the 10MB limit.`);
                  }
                  
                  if (validSizeFiles.length === 0) {
                    toast.error("All files exceed the 10MB size limit. Please select smaller files.");
                    return;
                  }
                  
                  console.log("Selected files:", validSizeFiles.map(f => ({name: f.name, type: f.type, size: f.size})));
                  setSelectedFiles(validSizeFiles);
                  
                  const urls = validSizeFiles.map(file => URL.createObjectURL(file));
                  setPreviewUrls(urls);
                }}
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload receipts or other evidence (JPEG, PNG, GIF, WebP). Maximum file size: 10MB per file.
              </p>
            </div>

            {/* File Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-full object-cover rounded" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // Remove file from selection
                        const newFiles = [...selectedFiles];
                        newFiles.splice(index, 1);
                        setSelectedFiles(newFiles);
                        
                        // Remove preview URL
                        const newUrls = [...previewUrls];
                        URL.revokeObjectURL(newUrls[index]); // Free memory
                        newUrls.splice(index, 1);
                        setPreviewUrls(newUrls);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      aria-label="Remove file"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit Expense Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseRequestPopup;
