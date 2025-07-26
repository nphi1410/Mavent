import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import {
  getDocumentsByEvent,
  getDocumentsByDepartment,
  getDocumentPreviewUrl,
  deleteDocument,
  updateDocument,
} from "../../services/DocumentService.jsx";
import DocumentPreviewModal from "./DocumentPreviewModal";

const DocumentList = ({
  searchTerm,
  departmentFilter,
  fileTypeFilter,
  dateFilter,
  sortBy,
  eventId,
  refreshTrigger,
}) => {
  // All states declared at the top - no conditional hooks
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [processingBulkAction, setProcessingBulkAction] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [detailDocument, setDetailDocument] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [documentsPerPage, setDocumentsPerPage] = useState(6);

  // Show notification utility function - reusable for all notifications
  const showNotification = (message, type = "success") => {
    // Create notification element
    const notification = document.createElement("div");

    // Set appropriate styling based on notification type
    let bgColor = "bg-green-600";
    let textColor = "text-white";
    let icon = "";

    switch (type) {
      case "error":
        bgColor = "bg-red-600";
        icon = `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
        break;
      case "warning":
        bgColor = "bg-yellow-500";
        icon = `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
        break;
      case "info":
        bgColor = "bg-blue-600";
        icon = `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
        break;
      default: // success
        icon = `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
    }

    // Set notification styling and content
    notification.className = `fixed bottom-4 right-4 ${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out flex items-center`;
    notification.innerHTML = `${icon}<span>${message}</span>`;

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after delay
    setTimeout(() => {
      notification.classList.add("opacity-0");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 3000);
  };

  // Fetch documents when the component mounts or when filters change
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!eventId) {
        setLoading(false);
        setError("Event ID is required to fetch documents");
        return;
      }

      setLoading(true);
      setError("");

      try {
        let data;
        if (departmentFilter && departmentFilter !== "all") {
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
        console.error("Error fetching documents:", error);
        setError("Failed to load documents. Please try again later.");
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [eventId, departmentFilter, refreshTrigger]);

  // Add keyframe animations for bulk actions - moved up before any conditionals
  useEffect(() => {
    const style = document.createElement("style");
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
  }; // Handle actual document preview
  const handlePreview = async (documentId) => {
    try {
      // console.log("Fetching preview for document ID:", documentId);
      setLoading(true); // Show loading indicator

      // Make the API call to get preview URL
      const previewData = await getDocumentPreviewUrl(documentId);
      // console.log("Preview data received:", previewData);
      // Log more details for debugging Excel file type issues
      // console.log("File type detection check:", {
      //   fileName: previewData?.fileName,
      //   contentType: previewData?.contentType,
      //   fileExtension: previewData?.fileName
      //     ? getFileExtension(previewData.fileName)
      //     : "",
      //   contentTypeExtension: previewData?.contentType
      //     ? getFileExtension(previewData.contentType)
      //     : "",
      //   isExcel:
      //     previewData?.fileName?.toLowerCase().endsWith(".xlsx") ||
      //     previewData?.fileName?.toLowerCase().endsWith(".xls") ||
      //     (previewData?.contentType &&
      //       (previewData.contentType.includes("spreadsheetml") ||
      //         previewData.contentType.includes("ms-excel"))),
      // });

      if (!previewData) {
        console.error("No preview data received from API");
        showNotification("Không thể tải dữ liệu xem trước tài liệu", "error");
        return;
      }

      if (!previewData.sasUrl) {
        console.error("Missing SAS URL in preview data");
        showNotification("Link xem trước tài liệu không có sẵn", "error");
        return;
      }

      // Test if the SAS URL is accessible
      // console.log("Testing SAS URL accessibility:", previewData.sasUrl);

      // Set the data and open the modal
      setPreviewDocument(previewData);
      setIsPreviewModalOpen(true);
      // Log document details for debugging
      // console.log("Document preview details:", {
      //   contentType: previewData.contentType,
      //   fileName: previewData.fileName,
      //   isViewable: previewData.isViewable || previewData.viewable, // Handle both property names
      // });
    } catch (error) {
      console.error("Error previewing document:", error);
      showNotification(
        "Lỗi khi xem trước tài liệu: " +
          (error.message || "Lỗi không xác định"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle document download
  const handleDownload = async (documentId) => {
    try {
      const previewData = await getDocumentPreviewUrl(documentId);

      // Trigger download
      const link = document.createElement("a");
      link.href = previewData.sasUrl;
      link.setAttribute("download", previewData.fileName || "document");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  }; // State for delete confirmation dialog
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    documentId: null,
    documentTitle: "",
  });
  // Close modal with Escape key and handle body scroll lock
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && deleteConfirmation.isOpen) {
        setDeleteConfirmation({
          isOpen: false,
          documentId: null,
          documentTitle: "",
        });
      }
    };

    // Add event listener when the modal is open
    if (deleteConfirmation.isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    }

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto"; // Ensure scrolling is re-enabled
    };
  }, [deleteConfirmation.isOpen]);

  // Handle document delete
  const handleDelete = async (documentId) => {
    const doc = documents.find((d) => d.documentId === documentId);
    const docTitle = doc ? doc.title : "this document";

    // Open confirmation dialog instead of window.confirm
    setDeleteConfirmation({
      isOpen: true,
      documentId: documentId,
      documentTitle: docTitle,
    });
  };
  // Handle confirmation dialog confirm button
  const handleConfirmDelete = async () => {
    const { documentId, documentTitle } = deleteConfirmation;

    // Close the confirmation dialog first to improve UI responsiveness
    setDeleteConfirmation({
      isOpen: false,
      documentId: null,
      documentTitle: "",
    });

    try {
      await deleteDocument(documentId);

      // Update the documents list
      setDocuments(documents.filter((doc) => doc.documentId !== documentId));

      // Also remove from selected documents if it's there
      setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId));

      // Show success notification
      showNotification(
        `Document "${documentTitle}" was successfully deleted`,
        "success"
      );
    } catch (error) {
      console.error("Error deleting document:", error);
      showNotification("Failed to delete document. Please try again.", "error");
    }
  };

  // Handle document update
  const handleUpdateDocument = async (documentId, updatedData) => {
    try {
      // Call the API to update the document
      const updatedDocument = await updateDocument(documentId, updatedData);

      // Update the documents state with the updated document
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.documentId === documentId ? { ...doc, ...updatedDocument } : doc
        )
      );

      // If we were viewing the document details, update that too
      if (detailDocument && detailDocument.documentId === documentId) {
        setDetailDocument((prev) => ({ ...prev, ...updatedDocument }));
      }

      // Return true to indicate success
      return true;
    } catch (error) {
      console.error("Error updating document:", error);
      return false;
    }
  }; // File type filter - returns types matching fileTypes array in DocumentManagement.jsx
  const getFileExtension = (fileType) => {
    if (!fileType) return "";

    const lowerType = fileType.toLowerCase();

    // Check for actual file extensions in the name first
    if (
      lowerType.endsWith(".xlsx") ||
      lowerType.endsWith(".xls") ||
      lowerType.endsWith(".csv") ||
      lowerType.endsWith(".ods") ||
      lowerType.endsWith(".xlsm") ||
      lowerType.endsWith(".xlsb")
    ) {
      return "csv"; // Return spreadsheet code
    }

    // PDF documents
    if (lowerType.includes("pdf") || lowerType.endsWith(".pdf")) {
      return "pdf";
    }
    // Spreadsheet formats (xlsx, xls, csv, ods, etc.) - check Excel formats first!
    if (
      lowerType.includes("excel") ||
      lowerType.includes("spreadsheet") ||
      lowerType.includes("csv") ||
      lowerType.includes("sheet") ||
      lowerType.includes("xls") ||
      lowerType.includes("ods") ||
      lowerType.includes("numbers") ||
      lowerType.includes("spreadsheetml") || // Important MIME type for Excel files
      lowerType.endsWith(".xlsx") ||
      lowerType.endsWith(".xls") ||
      lowerType.endsWith(".csv") ||
      lowerType.endsWith(".ods") ||
      lowerType.endsWith(".tsv")
    ) {
      return "csv";
    }

    // Word documents (doc, docx, rtf, odt, etc.)
    if (
      lowerType.includes("word") ||
      lowerType.includes("wordprocessingml") || // Word specific MIME type
      (lowerType.includes("document") &&
        !lowerType.includes("spreadsheetml")) || // Avoid catching Excel files
      (lowerType.includes("doc") && !lowerType.includes("spreadsheetml")) || // Avoid catching Excel files
      lowerType.includes("rtf") ||
      lowerType.includes("odt") ||
      lowerType.includes("text/richtext") ||
      lowerType.endsWith(".doc") ||
      lowerType.endsWith(".docx") ||
      lowerType.endsWith(".rtf") ||
      lowerType.endsWith(".odt") ||
      lowerType.endsWith(".dot") ||
      lowerType.endsWith(".dotx")
    ) {
      return "doc";
    }

    // Image formats (jpg, jpeg, png, gif, svg, webp, etc.)
    if (
      lowerType.includes("image") ||
      lowerType.includes("jpeg") ||
      lowerType.includes("jpg") ||
      lowerType.includes("png") ||
      lowerType.includes("gif") ||
      lowerType.includes("bmp") ||
      lowerType.includes("svg") ||
      lowerType.includes("webp") ||
      lowerType.includes("tiff") ||
      lowerType.includes("ico") ||
      lowerType.endsWith(".jpg") ||
      lowerType.endsWith(".jpeg") ||
      lowerType.endsWith(".png") ||
      lowerType.endsWith(".gif") ||
      lowerType.endsWith(".svg") ||
      lowerType.endsWith(".webp") ||
      lowerType.endsWith(".bmp") ||
      lowerType.endsWith(".tiff") ||
      lowerType.endsWith(".ico")
    ) {
      return "image";
    }

    // Archive formats
    if (
      lowerType.includes("zip") ||
      lowerType.includes("archive") ||
      lowerType.includes("compressed") ||
      lowerType.includes("rar") ||
      lowerType.includes("tar") ||
      lowerType.includes("7z") ||
      lowerType.endsWith(".zip") ||
      lowerType.endsWith(".rar") ||
      lowerType.endsWith(".tar") ||
      lowerType.endsWith(".gz") ||
      lowerType.endsWith(".7z")
    ) {
      return "zip";
    }

    // Text files
    if (
      lowerType.includes("text/plain") ||
      lowerType.includes("txt") ||
      lowerType.endsWith(".txt")
    ) {
      return "txt";
    }

    // If no match, return 'other'
    return "other";
  };

  // Apply filters and search
  const filteredDocuments = documents.filter((doc) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      (doc.title &&
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.uploaderName &&
        doc.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Department filter
    const matchesDepartment =
      departmentFilter === "all" ||
      (doc.departmentId && doc.departmentId.toString() === departmentFilter);

    const fileExtension = getFileExtension(doc.fileType);

    // Simple match since getFileExtension now returns values consistent with fileTypes in DocumentManagement.jsx
    const matchesFileType =
      fileTypeFilter === "all" || fileExtension === fileTypeFilter;

    // Date filter - this is a simplified version
    let matchesDate = true;
    if (dateFilter !== "all" && doc.createdAt) {
      const docDate = new Date(doc.createdAt);
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      switch (dateFilter) {
        case "today":
          matchesDate = docDate.toDateString() === today.toDateString();
          break;
        case "thisWeek":
          matchesDate = docDate >= weekStart;
          break;
        case "thisMonth":
          matchesDate = docDate >= monthStart;
          break;
        case "lastMonth":
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
    switch (sortBy) {
      case "dateNewest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "dateOldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "nameAZ":
        return (a.title || "").localeCompare(b.title || "");
      case "nameZA":
        return (b.title || "").localeCompare(a.title || "");
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = sortedDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );
  const totalPages = Math.ceil(sortedDocuments.length / documentsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get simplified file type name
  const getSimpleFileType = (fileType) => {
    if (!fileType) return "File";

    // First use getFileExtension to get the standardized file type
    const fileExtension = getFileExtension(fileType);

    // Then map to display format
    switch (fileExtension) {
      case "pdf":
        return "PDF";
      case "doc":
        return "Document";
      case "csv":
        return "Spreadsheet";
      case "image":
        return "Image";
      case "zip":
        return "Archive";
      case "txt":
        return "Text File";
      case "other":
      default:
        return "File";
    }
  }; // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (!fileType)
      return <FontAwesomeIcon icon={faFile} className="text-gray-600" />;

    // Instead of repeating all the checks, let's use our getSimpleFileType function
    const simpleType = getSimpleFileType(fileType);

    switch (simpleType) {
      case "PDF":
        return <FontAwesomeIcon icon={faFilePdf} className="text-red-600" />;
      case "Document":
        return <FontAwesomeIcon icon={faFileWord} className="text-blue-600" />;
      case "Spreadsheet":
        return (
          <FontAwesomeIcon icon={faFileExcel} className="text-green-600" />
        );
      case "Image":
        return (
          <FontAwesomeIcon icon={faFileImage} className="text-purple-600" />
        );
      case "Archive":
        return (
          <FontAwesomeIcon icon={faFileArchive} className="text-orange-600" />
        );
      case "Text File":
        return (
          <FontAwesomeIcon icon={faFileAlt} className="text-blue-gray-600" />
        );
      case "File":
      default:
        return <FontAwesomeIcon icon={faFileAlt} className="text-gray-600" />;
    }
  };
  // User initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    try {
      return name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
    } catch (error) {
      console.error("Error generating initials:", error);
      return "U";
    }
  };

  // Handle avatar loading errors
  const handleAvatarError = (e, name) => {
    try {
      e.target.style.display = "none";
      e.target.parentNode.classList.add("bg-blue-600", "text-white");
      e.target.parentNode.innerHTML = getInitials(name || "Unknown");
    } catch (error) {
      console.error("Error handling avatar fallback:", error);
      // Just in case there's an error with the DOM manipulation
      e.target.parentNode.classList.add("bg-gray-400");
      e.target.parentNode.innerHTML = "U";
    }
  };

  // Toggle selection of a single document
  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments((prevSelected) => {
      if (prevSelected.includes(docId)) {
        return prevSelected.filter((id) => id !== docId);
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
      setSelectedDocuments(currentDocuments.map((doc) => doc.documentId));
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
      await Promise.all(selectedDocuments.map((id) => deleteDocument(id)));

      // Update documents list
      setDocuments((prevDocuments) =>
        prevDocuments.filter(
          (doc) => !selectedDocuments.includes(doc.documentId)
        )
      );

      // Clear selections after successful deletion
      clearSelections();

      showNotification(
        `Successfully deleted ${selectedDocuments.length} documents`,
        "success"
      );
    } catch (error) {
      console.error("Error deleting documents:", error);
      showNotification("Error deleting documents. Please try again.", "error");
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
        currentDocuments.every((doc) =>
          selectedDocuments.includes(doc.documentId)
        )
    );

    // Ensure current page is valid after filtering or changing items per page
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    documents,
    selectedDocuments,
    currentDocuments,
    totalPages,
    documentsPerPage,
  ]);
  // Confirmation dialog component
  const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmButtonText,
    onConfirm,
    onCancel,
  }) => {
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
      title: document.title || "",
      description: document.description || "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveError, setSaveError] = useState("");

    // Reset form data when document changes
    useEffect(() => {
      if (document) {
        setFormData({
          title: document.title || "",
          description: document.description || "",
        });
        setErrors({});
        setSaveError("");
      }
    }, [document]);

    const validateForm = () => {
      const newErrors = {};

      if (!formData.title.trim()) {
        newErrors.title = "Document title is required";
      } else if (formData.title.trim().length > 100) {
        newErrors.title = "Title must be less than 100 characters";
      }

      if (formData.description && formData.description.length > 500) {
        newErrors.description = "Description must be less than 500 characters";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      setSaveError("");

      try {
        const success = await onSave(document.documentId, {
          title: formData.title.trim(),
          description: formData.description.trim(),
        });

        if (success) {
          onClose();
        } else {
          setSaveError("Failed to update document. Please try again.");
        }
      } catch (error) {
        console.error("Error updating document:", error);
        setSaveError("An unexpected error occurred. Please try again.");
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
                className={`w-full px-3 py-2 border ${
                  errors.title ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                className={`w-full px-3 py-2 border ${
                  errors.description ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description ? formData.description.length : 0}/500
                characters
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
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Document detail modal component
  const DocumentDetailModal = ({
    isOpen,
    document,
    onClose,
    onPreview,
    onDownload,
    onEdit,
    onDelete,
  }) => {
    const handleBackDropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
    if (!isOpen || !document) return null;
    return (
      <div
        onClick={handleBackDropClick}
        className="fixed inset-0 backdrop-blur-lg bg-black/50 flex items-center justify-center z-9999 p-4 overflow-y-auto"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm">
            <div className="flex items-center">
              <div className="h-12 w-12 mr-4 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                {getFileIcon(document.fileType)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {document.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {getSimpleFileType(document.fileType)}{" "}
                  {document.fileSizeFormatted
                    ? `• ${document.fileSizeFormatted}`
                    : ""}
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
                  <p className="text-gray-800 font-mono text-sm">
                    {document.documentId}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">
                    Uploader's Department
                  </h3>
                  <p className="text-gray-800">
                    {document.departmentName || "No department"}
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Upload Date</h3>
                  <p className="text-gray-800">
                    {document.createdAt
                      ? new Date(document.createdAt).toLocaleString()
                      : "Unknown"}
                  </p>
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
                          alt={document.uploaderName || "Unknown"}
                          className="h-full w-full object-cover"
                          onError={(e) =>
                            handleAvatarError(e, document.uploaderName)
                          }
                        />
                      ) : document.uploaderName ? (
                        <div className="h-full w-full bg-blue-600 text-white flex items-center justify-center">
                          {getInitials(document.uploaderName)}
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gray-400 text-white flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="h-3.5 w-3.5"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {document.uploaderName || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {document.uploaderEmail || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Last Updated</h3>
                  <p className="text-gray-800">
                    {document.updatedAt
                      ? new Date(document.updatedAt).toLocaleString()
                      : "Not updated since upload"}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-800">
                    {document.description || "No description provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags or additional metadata could go here */}
            {document.tags && document.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                    >
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
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-red-500 text-3xl mb-2"
        />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="py-8 text-center border rounded-lg bg-gray-50">
        <p className="text-gray-600">
          No documents found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      {" "}
      {/* Bulk Actions */}
      <div
        className={`mb-4 p-3 border rounded-md shadow-sm transition-all duration-300 ${
          selectedDocuments.length > 0
            ? "opacity-100 bg-blue-50 border-blue-200 transform translate-y-0"
            : "opacity-0 bg-gray-50 border-gray-200 transform -translate-y-4 pointer-events-none absolute"
        }`}
        style={{
          height: selectedDocuments.length > 0 ? "auto" : "0",
          overflow: "hidden",
          zIndex: selectedDocuments.length > 0 ? "10" : "-1",
          animation:
            selectedDocuments.length > 0
              ? "slideDown 0.3s ease-out"
              : "slideUp 0.3s ease-out",
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
      </div>
      {/* Documents Table */}
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
            {sortedDocuments.length} document
            {sortedDocuments.length !== 1 ? "s" : ""} found
          </div>
        </div>{" "}
        {/* Document Cards */}
        {currentDocuments.map((doc) => (
          <div
            key={doc.documentId}
            className="border border-gray-200 rounded-lg mb-4 hover:shadow-md transition-shadow bg-white overflow-hidden"
          >
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
                </div>
                {/* Document Name and Size */}
                <div className="flex-1 min-w-0 px-3 overflow-hidden">
                  <h3 className="text-lg font-medium text-gray-900 truncate max-w-full">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {getSimpleFileType(doc.fileType)}{" "}
                    {doc.fileSizeFormatted ? `• ${doc.fileSizeFormatted}` : ""}
                  </p>
                  {/* {doc.description && (
                      <p className="text-xs text-gray-600 mt-1 truncate">{doc.description}</p>
                    )} */}
                </div>
                {/* Action Buttons */}{" "}
                <div className="flex space-x-2 ml-auto shrink-0 pl-2">
                  {" "}
                  <button
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                    title="Document Details"
                    onClick={() => handleOpenDetail(doc)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-full hover:bg-green-50"
                    title="Preview Document"
                    onClick={() => handlePreview(doc.documentId)}
                  >
                    <FontAwesomeIcon icon={faFileAlt} />
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
                  Added:{" "}
                  <span className="font-medium">
                    {doc.createdAt
                      ? new Date(doc.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>{" "}
                {/* Author Information */}
                <div className="flex items-center space-x-3 shrink-0">
                  {" "}
                  <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium shadow-sm">
                    {doc.uploaderAvatar ? (
                      <img
                        src={doc.uploaderAvatar}
                        alt={doc.uploaderName || "Unknown"}
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
                        <FontAwesomeIcon
                          icon={faUser}
                          className="h-3.5 w-3.5"
                        />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 max-w-[150px] sm:max-w-[200px]">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.uploaderName || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {doc.departmentName || "No Department"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>{" "}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-6 space-y-3">
          {/* Page information */}
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
            <span className="ml-1">
              ({sortedDocuments.length} total documents)
            </span>
          </div>

          {/* Pagination controls */}
          <div className="flex flex-wrap justify-center items-center gap-1">
            {/* First page button */}
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className={`px-2 py-2 rounded-md flex items-center ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              title="First Page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Previous page button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-2 rounded-md flex items-center ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              title="Previous Page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Page numbers - with ellipsis for many pages */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              {totalPages <= 7 ? (
                // Show all pages if there are 7 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-3 py-2 ${
                        pageNumber === currentPage
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                )
              ) : (
                // Show limited pages with ellipsis for many pages
                <>
                  {/* First page always shown */}
                  <button
                    onClick={() => paginate(1)}
                    className={`px-3 py-2 ${
                      1 === currentPage
                        ? "bg-blue-600 text-white font-medium"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    1
                  </button>

                  {/* Left ellipsis if needed */}
                  {currentPage > 3 && (
                    <span className="px-3 py-2 bg-white text-gray-600">
                      ...
                    </span>
                  )}

                  {/* Pages around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (page === 1 || page === totalPages) return false;
                      return Math.abs(page - currentPage) < 2;
                    })
                    .map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-2 ${
                          pageNumber === currentPage
                            ? "bg-blue-600 text-white font-medium"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                  {/* Right ellipsis if needed */}
                  {currentPage < totalPages - 2 && (
                    <span className="px-3 py-2 bg-white text-gray-600">
                      ...
                    </span>
                  )}

                  {/* Last page always shown */}
                  <button
                    onClick={() => paginate(totalPages)}
                    className={`px-3 py-2 ${
                      totalPages === currentPage
                        ? "bg-blue-600 text-white font-medium"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Next page button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 py-2 rounded-md flex items-center ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              title="Next Page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Last page button */}
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-2 py-2 rounded-md flex items-center ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              title="Last Page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 10-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {/* Items per page selector */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">Items per page:</span>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={documentsPerPage}
              onChange={(e) => {
                setDocumentsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
          </div>
        </div>
      )}
      {/* Confirmation Dialog */}{" "}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${selectedDocuments.length} selected document(s)? This action cannot be undone.`}
        confirmButtonText={processingBulkAction ? "Deleting..." : "Delete"}
        onConfirm={handleBulkDelete}
        onCancel={() => setIsConfirmDialogOpen(false)}
      />
      {/* Document Detail Modal */}{" "}
      <DocumentDetailModal
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
      />{" "}
      {/* Document Edit Modal */}
      <DocumentEditModal
        isOpen={isEditModalOpen}
        document={detailDocument}
        onClose={() => {
          setIsEditModalOpen(false);
          // Reopen the detail modal if user cancels the edit
          setIsDetailModalOpen(true);
        }}
        onSave={async (documentId, formData) => {
          // Call our handler to update the document
          const success = await handleUpdateDocument(documentId, formData);

          if (success) {
            // Close edit modal
            setIsEditModalOpen(false);

            // Show updated document details with a short delay to allow state update
            setTimeout(() => {
              setIsDetailModalOpen(true);
            }, 100);

            // Show success notification
            showNotification("Document updated successfully", "success");
          }

          return success;
        }}
      />
      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.isOpen && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay, click to close */}
            <div
              className="fixed inset-0 backdrop-blur-lg bg-black/50 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() =>
                setDeleteConfirmation({
                  isOpen: false,
                  documentId: null,
                  documentTitle: "",
                })
              }
            ></div>

            {/* This element centers the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal panel */}
            <div
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()} // Prevent clicks from passing through to the overlay
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Delete Document
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "
                        {deleteConfirmation.documentTitle}"? This action cannot
                        be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() =>
                    setDeleteConfirmation({
                      isOpen: false,
                      documentId: null,
                      documentTitle: "",
                    })
                  }
                >
                  {" "}
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        previewData={previewDocument}
      />
    </div>
  );
};

export default DocumentList;
