import { ChevronLeft, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { formatMoney } from "../../utils/formatMoney.js";
import { updateExpenseStatus, uploadExpenseReceipts } from "../../services/expense/ExpenseService.jsx";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ExpenseRequestDetail({
  isOpen,
  onClose,
  expenseData,
  categories,
  onUpdateSuccess,
  taskTitle: passedTaskTitle,
  userRole,
}) {
  if (!isOpen) return null;
  const { id: eventId } = useParams();
  const isAdmin = userRole?.toUpperCase() === "ADMIN";

  const navigate = useNavigate();

  const data = expenseData;
  const location = useLocation();

  const taskId = data?.taskId;

  const [currentStatus, setCurrentStatus] = useState(data?.status || "");
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [fetchedTaskTitle, setFetchedTaskTitle] = useState("");
  const [selectedReceiptFiles, setSelectedReceiptFiles] = useState([]);
  const [uploadingReceipts, setUploadingReceipts] = useState(false);
  const [receiptPreviews, setReceiptPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const taskTitleFromState = location.state?.taskTitle;
  const taskTitle = data?.taskTitle || passedTaskTitle || fetchedTaskTitle || taskTitleFromState || (taskId ? `Task #${taskId}` : "No Task");

  useEffect(() => {
    if (data) {
      setCurrentStatus(data.status);
      
      // Fetch task title if we have taskId but no title
      if (data.taskId && !data.taskTitle && !passedTaskTitle) {
        fetchTaskTitle(data.taskId);
      }
    }
  }, [data, passedTaskTitle]);
  
  // Hàm để fetch task title từ API nếu cần
  const fetchTaskTitle = async (taskId) => {
    if (!taskId) return;
    
    try {
      // Import động để tránh circular dependency
      const { getTaskDetails } = await import("../../services/profileService");
      const taskData = await getTaskDetails(taskId);
      
      if (taskData && taskData.title) {
        setFetchedTaskTitle(taskData.title);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      // Silent fail - we'll use default title
    }
  };

  // Get available status options based on current status
  const getStatusOptions = () => {
    let options = [];
    if (!isAdmin) return []; 
    switch (currentStatus) {
      case "PENDING":
        options = ["APPROVED", "REJECTED"];
        break;
      case "APPROVED":
        options = ["REJECTED"];
        break;
      case "REJECTED":
        options = ["PENDING", "APPROVED", "REJECTED"];
        break;
      case "RECEIPT_SUBMITTED":
        options = ["PAID", "REJECTED"];
        break;
      case "PAID":
        options = [];
        break;
      default:
        options = [];
    }
    return options;
  };

  // Tìm tên category từ ID
  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) return "Unknown";
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Unknown";
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-500 text-white",
      APPROVED: "bg-green-500 text-white",
      REJECTED: "bg-red-500 text-white",
      PAID: "bg-blue-500 text-white",
      RECEIPT_SUBMITTED: "bg-purple-500 text-white",
    };

    return (
      <span
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          statusStyles[status] || "bg-gray-500 text-white"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  // Handle receipt file selection
  const handleReceiptFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newPreviews = [];

    // Validate files
    files.forEach(file => {
      // Check if file is an image and under 10MB
      if (file.type.match('image.*') && file.size <= 10 * 1024 * 1024) {
        validFiles.push(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            name: file.name,
            url: e.target.result,
            file: file
          });
          setReceiptPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(`File ${file.name} is invalid. Make sure it's an image and under 10MB.`);
      }
    });

    if (validFiles.length === 0) {
      toast.error("No valid files selected. Please select valid image files under 10MB.");
      return;
    }

    setSelectedReceiptFiles(validFiles);
  };

  // Remove a receipt preview
  const removeReceiptPreview = (index) => {
    const newPreviews = [...receiptPreviews];
    newPreviews.splice(index, 1);
    setReceiptPreviews(newPreviews);
    
    const newFiles = [...selectedReceiptFiles];
    newFiles.splice(index, 1);
    setSelectedReceiptFiles(newFiles);
  };

  // Upload receipts and change status to RECEIPT_SUBMITTED
  const handleReceiptUpload = async () => {
    if (selectedReceiptFiles.length === 0) {
      toast.error("Please select at least one receipt file");
      return;
    }

    try {
      setUploadingReceipts(true);
      toast.info("Uploading receipts...");
      
      // Double-check if expense is still in APPROVED status
      if (currentStatus !== "APPROVED") {
        toast.error(`Cannot upload receipts: expense status is ${currentStatus}, must be APPROVED`);
        return;
      }
      
      // Use the service to upload receipts
      const response = await uploadExpenseReceipts(
        data.eventId,
        data.expenseId,
        selectedReceiptFiles
      );

      // Handle successful response
      toast.success("Receipts uploaded successfully");
      
      // Update expense status to RECEIPT_SUBMITTED (this should be automatic on backend)
      setCurrentStatus("RECEIPT_SUBMITTED");
      data.status = "RECEIPT_SUBMITTED";
      
      // Clear selected files and previews
      setSelectedReceiptFiles([]);
      setReceiptPreviews([]);
      
      // Update parent component if callback exists
      if (onUpdateSuccess) {
        const updatedExpense = { 
          ...data,
          status: "RECEIPT_SUBMITTED",
        }; 
        onUpdateSuccess(updatedExpense);
      }
    } catch (error) {
      console.error("Error uploading receipts:", error);
      
      // Display more specific error messages
      if (error.message?.includes("expense status")) {
        toast.error(error.message);
      } else if (error.response?.data?.message) {
        toast.error(`Server error: ${error.response.data.message}`);
      } else {
        toast.error("Failed to upload receipts. Please try again.");
      }
    } finally {
      setUploadingReceipts(false);
    }
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();

    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        status: newStatus,
        comment: statusComment || "Status updated",
        responseContent: statusComment || "No comment provided",
      };

      await updateExpenseStatus(data.eventId, data.expenseId, updateData);

      setCurrentStatus(newStatus);
      setShowStatusForm(false);
      setNewStatus("");
      setStatusComment("");
      data.status = newStatus;
      data.responseContent = updateData.responseContent;

      toast.success(`Expense request status updated to ${newStatus}`);

      if (onUpdateSuccess) {
        const updatedExpense = { ...data }; // clone tránh mutation ngoài ý
        onUpdateSuccess(updatedExpense);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update expense status");
    } finally {
      setLoading(false);
    }
  };

  // Hàm format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-200 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 flex justify-between border-b border-gray-300">
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Expense Request Details #{data.expenseId}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Expense History
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Expense Details */}
            <div className="lg:col-span-2 space-y-6">
              {taskId ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Linked Task
                  </label>
                  <div className="flex justify-between items-center bg-blue-50 border border-blue-300 rounded-md px-3 py-2">
                    <span className="text-blue-700 text-sm font-medium truncate">
                      {taskTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/event/${eventId}/staff/tasks`, {
                          state: {
                            openTaskId: taskId,
                          },
                        });
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Go to Task
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    No Linked Task
                  </label>
                </div>
              )}
              {/* Amount */}
              <div>
                <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                  <span className="text-gray-800 text-xl font-bold">
                    {formatMoney(data.amount)} VNĐ
                  </span>
                </div>
              </div>

              {/* Expense Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category:
                  </label>
                  <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-gray-800">
                      {data.categoryName || getCategoryName(data.categoryId)}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status:
                  </label>
                  <div>{getStatusBadge(data.status)}</div>
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Date:
                  </label>
                  <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-gray-800">
                      {data.paymentDate
                        ? new Date(data.paymentDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Created Date:
                  </label>
                  <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-gray-800">
                      {formatDate(data.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Created By */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Created By:
                  </label>
                  <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-gray-800">
                      {data.createdByFullName || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Response Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Response Date:
                  </label>
                  <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-gray-800">
                      {data.status === "PENDING"
                        ? "Not yet responded"
                        : formatDate(data.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description/Note */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description:
                </label>
                <div className="bg-white rounded-lg p-4 shadow-sm min-h-[150px]">
                  <p className="text-gray-800 leading-relaxed">{data.note}</p>
                </div>
              </div>

              {/* Evidence Attachments */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Evidence Attachments:
                </label>
                {data.attachments && data.attachments.filter(a => !a.attachmentType || a.attachmentType === "EVIDENCE").length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {data.attachments
                      .filter(a => !a.attachmentType || a.attachmentType === "EVIDENCE")
                      .map((attachment, index) => (
                        <div key={index} className="relative">
                          <a
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={attachment.fileUrl}
                              alt={`Evidence ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                            />
                          </a>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-gray-500">
                      No evidence attachments provided
                    </span>
                  </div>
                )}
              </div>
              
              {/* Receipt Attachments - Only show if status is RECEIPT_SUBMITTED or PAID */}
              {(currentStatus === "RECEIPT_SUBMITTED" || currentStatus === "PAID") && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Receipt Attachments:
                  </label>
                  {data.attachments && data.attachments.filter(a => a.attachmentType === "RECEIPT").length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {data.attachments
                        .filter(a => a.attachmentType === "RECEIPT")
                        .map((attachment, index) => (
                          <div key={index} className="relative">
                            <a
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={attachment.fileUrl}
                                alt={`Receipt ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity border-2 border-purple-300"
                              />
                            </a>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                      <span className="text-gray-500">
                        No receipt attachments available
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Feedback & Status Management */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 shadow-sm h-full">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  FEEDBACK
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 shadow-inner min-h-[200px]">
                  {data.responseContent ? (
                    <p className="text-gray-700 leading-relaxed">
                      {data.responseContent}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic text-center">
                      No feedback provided yet
                    </p>
                  )}
                </div>

                {currentStatus === "APPROVED" && (
                  <div className="mt-6">
                    <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded mb-4">
                      <p className="text-green-700 font-medium">
                        This expense request has been approved
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Please upload receipt(s) to proceed with payment
                      </p>
                    </div>
                    
                    {/* Only show upload to creator with at least MEMBER role */}
                    {data.createdByAccountId === parseInt(sessionStorage.getItem("accountId")) && (userRole === "MEMBER" || userRole === "DEPARTMENT_MANAGER" || userRole === "ADMIN") && (
                      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-2">Upload Receipts</h5>
                        
                        {/* Receipt file input */}
                        <div className="mb-4">
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                            onClick={() => fileInputRef.current.click()}
                          >
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-1 text-sm text-gray-500">
                              Click to upload receipt images (JPEG, PNG, GIF, WebP)
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Max 10MB per file
                            </p>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleReceiptFileChange}
                            multiple
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                        
                        {/* Receipt previews */}
                        {receiptPreviews.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Selected files:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {receiptPreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                  <img 
                                    src={preview.url} 
                                    alt={preview.name} 
                                    className="h-24 w-full object-cover rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeReceiptPreview(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                                  >
                                    &times;
                                  </button>
                                  <p className="text-xs truncate mt-1">{preview.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Upload button */}
                        {selectedReceiptFiles.length > 0 && (
                          <button
                            type="button"
                            className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                            onClick={handleReceiptUpload}
                            disabled={uploadingReceipts}
                          >
                            {uploadingReceipts ? "Uploading..." : "Submit Receipts"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {currentStatus === "REJECTED" && (
                  <div className="mt-6">
                    <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                      <p className="text-red-700 font-medium">
                        This expense request has been rejected
                      </p>
                    </div>
                  </div>
                )}

                {currentStatus === "RECEIPT_SUBMITTED" && (
                  <div className="mt-6">
                    <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded">
                      <p className="text-purple-700 font-medium">
                        Receipts submitted and awaiting payment
                      </p>
                    </div>
                  </div>
                )}

                {currentStatus === "PAID" && (
                  <div className="mt-6">
                    <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-blue-700 font-medium">
                        This expense has been paid
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Management Form */}
                {getStatusOptions().length > 0 && !showStatusForm && (
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={() => setShowStatusForm(true)}
                    >
                      Update Status
                    </button>
                  </div>
                )}

                {showStatusForm && (
                  <div className="mt-6 bg-white p-4 rounded border border-gray-200">
                    <h5 className="font-semibold mb-3">Update Status</h5>
                    <form onSubmit={handleStatusChange}>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Status
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select status</option>
                          {getStatusOptions().map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comment (optional)
                        </label>
                        <textarea
                          value={statusComment}
                          onChange={(e) => setStatusComment(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
                        >
                          {loading ? "Processing..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowStatusForm(false)}
                          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
