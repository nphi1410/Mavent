import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getExpenseCategories,
  createExpenseRequest,
} from "../../services/expense/ExpenseService.jsx";
import { toast } from "react-toastify";

const ExpenseRequestForm = ({ accountId, departmentId, budgetId, onSubmitSuccess }) => {
 
  const { id: urlEventId } = useParams();
  const eventId = urlEventId? parseInt(urlEventId) : null;
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
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

        const categoriesData = await getExpenseCategories(eventId);
        

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
    
    
    if (eventId) {
      fetchCategories();
    }
    
  }, [eventId]); 
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  
  const handleSubmit = async () => {
    
    if (!formData.title?.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
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
    
    // Set loading state
    setLoading(true);
    
    try {
      
      const expenseData = {
        eventId: Number(eventId),
        categoryId: Number(formData.category),
        departmentId: departmentId,
        budgetId: budgetId || null, 
        amount: Number(formData.amount),
        title: formData.title,
        note: formData.note,
        paymentDate: formData.date,
        paymentMethod: "CASH", 
        status: "PENDING",
        createdByAccountId: accountId
      };
      
 
  
      const response = await createExpenseRequest(eventId, expenseData, selectedFiles);
      console.log("Expense request submitted:", response);
    
      toast.success("Expense request submitted successfully!");
      
      // Reset form
      setFormData({
        title: "",
        note: "",
        amount: "",
        category: categories.length > 0 ? categories[0].categoryId : "",
        date: "",
        files: [],
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
      
      // Callback to parent component if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting expense request:", error);
      toast.error("Failed to submit expense request");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Expense Request</h2>
      
      {/* Title Input */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
      </div>
      
      {/* Amount Input */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
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
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
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
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
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
      <div className="mb-4">
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
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
      <div className="mb-4">
        <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
          Evidence Files *
        </label>
        <input
          type="file"
          id="files"
          name="files"
          onChange={(e) => {
            // Handle file selection
            const files = Array.from(e.target.files);
            setSelectedFiles(files);
            
        
            const urls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
          }}
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Upload receipts or other evidence (JPEG, PNG, GIF, WebP)
        </p>
      </div>
      

      {previewUrls.length > 0 && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
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
      <div className="mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Expense Request"}
        </button>
      </div>
      
      {/* Debug info - sẽ xóa sau */}
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-medium text-gray-700">Debug Info:</h3>
        <p>EventId: {eventId}</p>
        <p>Categories loaded: {categories.length}</p>
        <p>Selected category: {formData.category}</p>
        <p>Selected files: {selectedFiles.length}</p>
      </div>
    </div>
  );
};

export default ExpenseRequestForm;
