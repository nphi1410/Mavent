import React, { useState, useEffect, useRef } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faDownload, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import DocViewer, {DocViewerRenderers} from "react-doc-viewer";

const DocumentPreviewModal = ({isOpen, onClose, previewData}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    
    // States for iframe loading - moved from conditional code
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [gdocsLoaded, setGdocsLoaded] = useState(false);
    const [gdocsTimeout, setGdocsTimeout] = useState(false);
    
    // Track what type of content is being displayed to conditionally render things
    const [currentContentType, setCurrentContentType] = useState(null);
    const [isGoogleDocsViewer, setIsGoogleDocsViewer] = useState(false);
    const [isOfficeDoc, setIsOfficeDoc] = useState(false);

    // Create an AbortController when the component mounts and clean up when it unmounts
    useEffect(() => {
        // Create a new AbortController when the component mounts
        abortControllerRef.current = new AbortController();
        
        // Clean up function to abort any pending requests when the component unmounts
        return () => {
            if (abortControllerRef.current) {
                console.log('Aborting any pending fetch requests on unmount');
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        console.log("DocumentPreviewModal previewData:", previewData);
        if (previewData) {
            setLoading(false);
            setError(null);
            
            // Reset states for iframe loading
            setIframeLoaded(false);
            setGdocsLoaded(false);
            setGdocsTimeout(false);
            
            // Determine content type
            if (previewData.contentType) {
                setCurrentContentType(previewData.contentType);
                setIsOfficeDoc(isOfficeDocument(previewData.contentType));
            }
        }
    }, [previewData]);
    
    // Setup timeout for Google Docs viewer loading
    useEffect(() => {
        let timeoutId = null;
        
        // Only set timeout if we're displaying Office documents or using Google Docs viewer
        if (isOfficeDoc || isGoogleDocsViewer) {
            timeoutId = setTimeout(() => {
                if (!gdocsLoaded) {
                    setGdocsTimeout(true);
                    console.log("Google Docs viewer timed out after 10 seconds");
                }
            }, 10000);
        }
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [gdocsLoaded, isOfficeDoc, isGoogleDocsViewer]);
    
    // Timeout check for general iframe loading
    useEffect(() => {
        let timeout = null;
        
        if (isGoogleDocsViewer && !isOfficeDoc) {
            timeout = setTimeout(() => {
                if (!iframeLoaded) {
                    console.error("Google Docs viewer timeout - might be CORS or loading issue");
                    setError("Không thể tải tài liệu qua Google Docs. Có thể là vấn đề CORS.");
                }
            }, 5000);
        }
        
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [iframeLoaded, isGoogleDocsViewer, isOfficeDoc]);

    // Helper function to check if content type is an Office document
    const isOfficeDocument = (contentType) => {
        if (!contentType) return false;
        
        return (
            contentType.includes('wordprocessingml') || 
            contentType.includes('msword') ||
            contentType.includes('spreadsheetml') ||
            contentType.includes('ms-excel') ||
            contentType.includes('presentationml') ||
            contentType.includes('ms-powerpoint') ||
            contentType.includes('officedocument')
        );
    };

    if (!isOpen || !previewData)  return null;
    const isSupportedByDocViewer = (contentType) => {
     const supportedTypes = [
      'application/pdf',
      'image/png', 'image/jpeg', 'image/jpg', 'image/bmp',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/html'
    ];

    const isSupported = supportedTypes.includes(contentType);
    console.log(`Content type: ${contentType}, Supported by DocViewer: ${isSupported}`);
    return isSupported;
    };

    const canUseGoogleViewer = (contentType) => {
        
        const googleSupportedTypes = [
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];

    return googleSupportedTypes.includes(contentType)
    };

    const renderPreviewContent = () => {
        if(loading) { 
            return (
                <div className="flex items-center justify-center w-full h-64">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            );
        }

        if (!previewData || !previewData.sasUrl) {
            return (
                <div className="p-6 text-center">
                    <p className="text-red-600 mb-4">Không có dữ liệu xem trước hoặc URL không hợp lệ</p>
                </div>
            );
        }

        // Handle property name mismatch (backend sends viewable, frontend expects isViewable)
        const {contentType, sasUrl, fileName} = previewData;
        
        // Override the viewable flag for Office documents - force them to be viewable
        let isViewable = previewData.isViewable || previewData.viewable;
        
        // Force certain types to be viewable even if backend says they're not
        if (!isViewable && contentType) {
            const forceViewableTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
                'application/msword', // doc
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
                'application/vnd.ms-excel', // xls
                'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
                'application/vnd.ms-powerpoint', // ppt
                'application/pdf' // pdf
            ];
            
            if (forceViewableTypes.includes(contentType)) {
                console.log('Forcing document to be viewable despite backend flag:', contentType);
                isViewable = true;
            }
        }
        
        // Validate required properties
        console.log('Rendering preview with:', { contentType, sasUrl, fileName, isViewable });

        // Special handling for images - render directly with CORS handling
        if (isViewable && contentType && contentType.startsWith('image/')) {
            console.log('Rendering image directly:', sasUrl);
            return (
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="relative w-full flex justify-center">
                        <img 
                            src={sasUrl} 
                            alt={fileName} 
                            className="max-w-full max-h-[70vh] object-contain"
                            crossOrigin="anonymous"
                            onError={(e) => {
                                console.error("Error loading image:", e);
                                setError("Không thể tải hình ảnh trực tiếp. Đang thử phương pháp khác...");
                                
                                // Try loading with iframe as fallback
                                const imgContainer = e.target.parentElement;
                                if (imgContainer) {
                                    const iframe = document.createElement('iframe');
                                    iframe.src = sasUrl;
                                    iframe.className = "w-full h-[70vh] border-0";
                                    iframe.title = fileName || "Document preview";
                                    imgContainer.innerHTML = '';
                                    imgContainer.appendChild(iframe);
                                }
                            }} 
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{fileName}</p>
                </div>
            );
        }

        // Special handler for Office documents - use Google Docs Viewer directly
        if (isViewable && contentType && isOfficeDocument(contentType)) {
            console.log('Using Google Docs viewer for Office document:', contentType);
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(sasUrl)}&embedded=true`;
            
            // Mark that we're using Google Docs viewer for Office documents
            if (!isOfficeDoc) {
                setIsOfficeDoc(true);
                setIsGoogleDocsViewer(true);
            }
            
            return (
                <div className="w-full">
                    <div className="text-center mb-3">
                        <p className="text-sm text-blue-600">
                            {gdocsLoaded ? 
                                'Tài liệu Office được hiển thị qua Google Docs Viewer' : 
                                'Đang tải tài liệu Office...'}
                        </p>
                    </div>
                    
                    {/* Show loading indicator while iframe is loading */}
                    {!gdocsLoaded && (
                        <div className="flex flex-col items-center justify-center h-[50vh]">
                            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                            <p className="text-gray-600">Đang tải tài liệu qua Google Docs...</p>
                            
                            {gdocsTimeout && (
                                <div className="mt-6 text-center">
                                    <p className="text-amber-600 mb-3">Quá trình tải mất nhiều thời gian hơn dự kiến.</p>
                                    <p className="text-sm text-gray-600 mb-2">Có thể tài liệu lớn hoặc Google Docs đang gặp vấn đề.</p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                                        <a 
                                            href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(sasUrl)}`}
                                            target="_blank"
                                            rel="noopener noreferrer" 
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                        >
                                            <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                                            Thử với Microsoft Office Online
                                        </a>
                                        <a 
                                            href={sasUrl}
                                            download={fileName}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                            Tải xuống tài liệu
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <iframe
                        src={googleViewerUrl}
                        className={`w-full border-0 ${gdocsLoaded ? 'h-[65vh]' : 'h-0'}`}
                        title={fileName || "Office Document"}
                        onLoad={(e) => {
                            console.log("Google Docs viewer for Office document loaded");
                            setGdocsLoaded(true);
                            setLoading(false);
                        }}
                    />
                    
                    {gdocsLoaded && (
                        <p className="mt-2 text-sm text-gray-600 text-center">{fileName}</p>
                    )}
                </div>
            );
        }
        
        // For PDFs, use iframe to avoid CORS issues
        if (isViewable && contentType === 'application/pdf') {
            console.log('Rendering PDF using iframe bypass:', sasUrl);
            
            // Mark that we're using Google Docs viewer but not for Office documents
            if (!isGoogleDocsViewer) {
                setIsGoogleDocsViewer(true);
            }
            
            // Create a blob: URL from the PDF content or use Google Docs Viewer as a proxy
            return (
                <div className="w-full h-[70vh] flex flex-col">
                    <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(sasUrl)}&embedded=true`}
                        className="w-full h-full border-0"
                        title={fileName || "PDF Document"}
                        onLoad={() => {
                            console.log("Google Docs viewer iframe loaded");
                            setLoading(false);
                            setIframeLoaded(true);
                        }}
                        onError={(e) => {
                            console.error("Google Docs viewer iframe error");
                            setError("Không thể tải PDF qua Google Docs Viewer");
                        }}
                    />
                    <p className="mt-2 text-sm text-gray-600 text-center">{fileName}</p>
                </div>
            );
        }
        
        // For other supported files, try DocViewer with fallbacks
        if (isViewable && isSupportedByDocViewer(contentType)) {
            try {
                return (
                    <>
                        {/* We'll wrap DocViewer in an error boundary-like structure */}
                        <div className="w-full" style={{height: '70vh'}}>
                            <DocViewer
                                documents={[{ uri: sasUrl, fileName: fileName }]}
                                pluginRenderers={DocViewerRenderers}
                                config={{
                                    header: {
                                        disableFileName: false,
                                        retainURLParams: true,
                                    },
                                    pdfZoom: {
                                        defaultZoom: 1.1,
                                        zoomJump: 0.2,
                                    }
                                }}
                                style={{height: '100%' }}
                                onError={(err) => {
                                    console.error("DocViewer error:", err);
                                    setError("Error displaying document: " + (err?.message || "Unknown error"));
                                }}
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-600 text-center">{fileName}</p>
                    </>
                );
            } catch (e) {
                console.error("Error rendering DocViewer:", e);
                
                // Try using Google Docs viewer as fallback for documents
                if (canUseGoogleViewer(contentType)) {
                    // Mark that we're using Google Docs viewer
                    if (!isGoogleDocsViewer) {
                        setIsGoogleDocsViewer(true);
                    }
                    
                    return (
                        <div className="w-full h-[70vh]">
                            <iframe
                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(sasUrl)}&embedded=true`}
                                className="w-full h-full border-0"
                                title={fileName || "Document"}
                                onLoad={() => {
                                    setLoading(false);
                                    setIframeLoaded(true);
                                }}
                            />
                            <p className="mt-2 text-sm text-gray-600 text-center">{fileName}</p>
                        </div>
                    );
                }
                
                // If all fails, show download option
                return (
                    <div className="p-6 text-center">
                        <p className="text-red-600 mb-4">Không thể hiển thị tài liệu trên trình duyệt</p>
                        <a 
                          href={sasUrl} 
                          download={fileName}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-2" />
                          Tải xuống thay vì xem
                        </a>
                    </div>
                );
            }
        }

        //Use Google Doc viewer for fallback (specifically for Office documents)
        if (isViewable && canUseGoogleViewer(contentType) && 
            (contentType.includes('word') || contentType.includes('excel') || 
             contentType.includes('powerpoint') || contentType.includes('text/plain'))) {
            console.log("Using Google Docs viewer with URL:", sasUrl);
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(sasUrl)}&embedded=true`;
            
            // Mark that we're using Google Docs viewer but not for Office documents
            if (!isGoogleDocsViewer) {
                setIsGoogleDocsViewer(true);
            }
            
            return (
                <div className="w-full h-[70vh]">
                    <iframe
                        src={googleViewerUrl}
                        className="w-full h-full border-0"
                        title={fileName}
                        onLoad={(e) => {
                            console.log("Google viewer iframe loaded");
                            setLoading(false);
                            setIframeLoaded(true);
                        }}
                        onError={(e) => {
                            console.error("Google viewer iframe error");
                            setError("Không thể tải trình xem Google Docs");
                        }}
                    />
                    <p className="mt-2 text-sm text-gray-600 text-center">{fileName}</p>
                </div>
            );
        }

        // Default case - download the file
    return (
      <div className="p-6 text-center">
        {error ? (
            <div className="text-red-600 mb-4">
                <p className="font-semibold">Lỗi khi xem trước tài liệu:</p>
                <p>{error}</p>
                
                {/* CORS troubleshooting information */}
                {error.includes('CORS') && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-100 p-4 rounded-md text-left">
                        <p className="font-medium text-yellow-800">Lỗi CORS (Cross-Origin Resource Sharing)</p>
                        <p className="text-sm text-yellow-700 mt-2">
                            Tài liệu không thể được hiển thị trực tiếp do cài đặt bảo mật trên Azure Storage. 
                            Vui lòng liên hệ với quản trị viên hệ thống để cấu hình CORS trên Azure Blob Storage với:
                        </p>
                        <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
                            <li>Allowed Origins: <code className="bg-yellow-100 px-1">http://localhost:5173, https://yourprodsite.com</code></li>
                            <li>Allowed Methods: <code className="bg-yellow-100 px-1">GET, HEAD, OPTIONS</code></li>
                            <li>Allowed Headers: <code className="bg-yellow-100 px-1">*</code></li>
                            <li>Exposed Headers: <code className="bg-yellow-100 px-1">Content-Length, Content-Type, Accept-Ranges, Content-Range</code></li>
                            <li>Max Age (seconds): <code className="bg-yellow-100 px-1">3600</code></li>
                        </ul>
                    </div>
                )}
                
                <div className="text-gray-600 text-sm mt-4">
                    <p>Content Type: {contentType || 'Không xác định'}</p>
                    <p>Có thể xem trước: {isViewable ? 'Có' : 'Không'}</p>
                </div>
            </div>
        ) : (
            <p className="text-gray-600 mb-4">Tài liệu này không thể xem trước trong trình duyệt</p>
        )}
        
        {/* Try direct link and download */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <a 
                href={sasUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center justify-center"
            >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                Thử mở trong tab mới
            </a>
            <a 
                href={sasUrl} 
                download={fileName}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Tải xuống
            </a>
        </div>
      </div>
    );  
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {previewData?.fileName || 'File Preview'}
            </h3>
            <div className="flex space-x-2">
              <a 
                href={previewData?.sasUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100"
                title="Open in new tab"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="h-5 w-5" />
              </a>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white">
            {renderPreviewContent()}
          </div>
          
          {/* Footer with back button */}
          <div className="bg-gray-50 border-t px-4 py-3 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại
            </button>
            <a
              href={previewData?.sasUrl}
              download={previewData?.fileName}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Tải xuống
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreviewModal;