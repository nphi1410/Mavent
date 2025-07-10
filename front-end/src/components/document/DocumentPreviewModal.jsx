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
    
    // Loading progress states
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingTime, setLoadingTime] = useState(0);
    
    // Track what type of content is being displayed to conditionally render things
    const [currentContentType, setCurrentContentType] = useState(null);
    const [isGoogleDocsViewer, setIsGoogleDocsViewer] = useState(false);
    const [isOfficeDoc, setIsOfficeDoc] = useState(false);
    const [isExcelDoc, setIsExcelDoc] = useState(false);
    const [useMicrosoftViewer, setUseMicrosoftViewer] = useState(false);
    const [googleViewerFailed, setGoogleViewerFailed] = useState(false);
    const [previewFailureMessage, setPreviewFailureMessage] = useState("");
    const [preferredViewer, setPreferredViewer] = useState("auto"); // Can be "auto", "google", "microsoft", or "download"

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
            setGoogleViewerFailed(false);
            setUseMicrosoftViewer(false);
            
            // Reset loading progress indicators
            setLoadingProgress(0);
            setLoadingTime(0);
            
            // Determine content type
            if (previewData.contentType) {
                setCurrentContentType(previewData.contentType);
                const isOffice = isOfficeDocument(previewData.contentType);
                setIsOfficeDoc(isOffice);
                
                // Detect if Excel document specifically
                const isExcel = isExcelDocument(previewData.contentType);
                setIsExcelDoc(isExcel);
                
                // For Excel files, skip Google Docs viewer and immediately use Microsoft Office Online Viewer
                if (isExcel) {
                    console.log("Excel document detected, using Microsoft Office Online Viewer directly");
                    setUseMicrosoftViewer(true);
                    setPreferredViewer("microsoft");
                }
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
    
    // Loading progress animation for better UX
    useEffect(() => {
        let progressInterval;
        let timeInterval;
        
        // Only start the progress animation if we're actually loading something
        if ((isOfficeDoc || isGoogleDocsViewer || currentContentType === 'application/pdf') && !iframeLoaded && !gdocsLoaded) {
            // Start progress animation - gradually increase to 90%
            progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    // Progress increment logic - slow at beginning, faster in middle, then slower near end
                    if (prev < 15) return prev + 1; // Starts slow
                    if (prev < 40) return prev + 0.8; // Medium speed
                    if (prev < 60) return prev + 0.6; // Slows down
                    if (prev < 80) return prev + 0.3; // Even slower
                    if (prev < 90) return prev + 0.1; // Very slow near end
                    return 90; // Never reach 100% until actually loaded
                });
            }, 300);
            
            // Track loading time in seconds
            timeInterval = setInterval(() => {
                setLoadingTime(prev => prev + 1);
            }, 1000);
        }
        
        // When loaded, jump to 100%
        if (iframeLoaded || gdocsLoaded) {
            setLoadingProgress(100);
        }
        
        return () => {
            if (progressInterval) clearInterval(progressInterval);
            if (timeInterval) clearInterval(timeInterval);
        };
    }, [isOfficeDoc, isGoogleDocsViewer, iframeLoaded, gdocsLoaded, currentContentType]);
    
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

    // Function to monitor Google Docs viewer for failures
    const monitorGoogleDocsViewer = () => {
        try {
            // Get all iframes in the document
            const iframes = document.querySelectorAll('iframe');
            
            // Look for Google Docs viewer iframes
            for (let i = 0; i < iframes.length; i++) {
                const iframe = iframes[i];
                if (iframe.src && iframe.src.includes('docs.google.com/viewer')) {
                    try {
                        // Try to access the iframe's content
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                        
                        // If we can access the content, check for error messages
                        if (iframeDoc) {
                            // Look for common Google Docs viewer error messages
                            const errorElements = iframeDoc.querySelectorAll('.error-title, .error-message');
                            const loadingElements = iframeDoc.querySelectorAll('.docs-preview-container, .docs-loading-screen');
                            const sheetsSpinners = iframeDoc.querySelectorAll('.docs-gm-spinner, .goog-inline-block');
                            const sheetsLoadingText = iframeDoc.querySelectorAll('div:contains("Connecting to Google Sheets")');
                            
                            // If we find error messages, trigger fallback
                            if (errorElements.length > 0) {
                                console.log("Google Docs viewer error detected in iframe content");
                                
                                // Get the error text
                                let errorText = "";
                                errorElements.forEach(el => {
                                    errorText += el.textContent + " ";
                                });
                                
                                console.log("Error text:", errorText);
                                
                                // If Excel document, switch to Microsoft viewer
                                if (isExcelDoc && !useMicrosoftViewer) {
                                    setGoogleViewerFailed(true);
                                    setUseMicrosoftViewer(true);
                                    setPreviewFailureMessage("Google Docs không thể hiển thị bảng tính Excel này. Đang chuyển sang Microsoft Office Online...");
                                }
                                return true;
                            }
                            
                            // Detect Excel-specific infinite loading
                            if (isExcelDoc && loadingTime > 12 && !useMicrosoftViewer && 
                                (sheetsSpinners.length > 0 || sheetsLoadingText.length > 0)) {
                                console.log("Detected possible Excel infinite loading in Google Sheets");
                                setGoogleViewerFailed(true);
                                setUseMicrosoftViewer(true);
                                setPreviewFailureMessage("Google Sheets đang mất quá nhiều thời gian để tải. Đang chuyển sang Microsoft Office Online...");
                                return true;
                            }
                        }
                    } catch (e) {
                        // CORS errors will happen here, which is normal for cross-origin iframes
                        // We can't detect failures by looking inside the iframe in these cases
                        console.log("Could not access iframe content due to CORS");
                    }
                }
            }
        } catch (e) {
            console.error("Error in monitorGoogleDocsViewer:", e);
        }
        return false;
    };

    // Automatically switch to Microsoft Viewer for Excel files when Google Docs times out
    useEffect(() => {
        if (gdocsTimeout && isExcelDoc && !useMicrosoftViewer) {
            console.log("Google Docs viewer timed out for Excel document, switching to Microsoft Office Online Viewer");
            setGoogleViewerFailed(true);
            setUseMicrosoftViewer(true);
            setPreviewFailureMessage("Google Docs không hiển thị được bảng tính Excel này sau khi chờ. Đang chuyển sang Microsoft Office Online...");
        }
        
        // Set up periodic checks for Google Docs viewer failures
        let checkInterval = null;
        if (isExcelDoc && !useMicrosoftViewer && isGoogleDocsViewer && !gdocsLoaded) {
            checkInterval = setInterval(() => {
                const failure = monitorGoogleDocsViewer();
                if (failure) {
                    clearInterval(checkInterval);
                }
            }, 2000); // Check every 2 seconds
        }
        
        return () => {
            if (checkInterval) clearInterval(checkInterval);
        };
    }, [gdocsTimeout, isExcelDoc, useMicrosoftViewer, isGoogleDocsViewer, gdocsLoaded]);

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
    
    // Helper to specifically identify Excel files
    const isExcelDocument = (contentType) => {
        if (!contentType) return false;
        
        // More comprehensive check for Excel files
        return (
            contentType.includes('spreadsheetml') ||
            contentType.includes('ms-excel') ||
            contentType.includes('csv') ||
            contentType.includes('xls') ||
            contentType.includes('xlsx') ||
            contentType.endsWith('.xlsx') ||
            contentType.endsWith('.xls') ||
            contentType.endsWith('.csv') ||
            // Common Excel MIME types
            contentType === 'application/vnd.ms-excel' ||
            contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            contentType === 'application/vnd.ms-excel.sheet.macroEnabled.12' ||
            contentType === 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' ||
            // Check filename if available
            (previewData?.fileName && qa
             (previewData.fileName.endsWith('.xlsx') || 
              previewData.fileName.endsWith('.xls') || 
              previewData.fileName.endsWith('.csv')))
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

        // Special Excel handler - immediately use Microsoft Office Online Viewer if explicitly requested
        if (isViewable && contentType && isExcelDocument(contentType) && useMicrosoftViewer) {
            console.log('Using Microsoft Office Online Viewer for Excel document:', contentType);
            // Use Microsoft Office Online Viewer for Excel files
            // The src parameter must be URL encoded
            const msOfficeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(sasUrl)}`;
            
            return (
                <div className="w-full">
                    <div className="text-center mb-3">
                        <p className="text-sm text-blue-600">
                            {iframeLoaded ? 
                                'Tài liệu Excel được hiển thị qua Microsoft Office Online Viewer' : 
                                'Đang tải bảng tính Excel qua Microsoft Office Online...'}
                        </p>
                    </div>
                    
                    {/* Show loading indicator while iframe is loading */}
                    {!iframeLoaded && (
                        <div className="flex flex-col items-center justify-center h-[60vh] bg-white">
                            <div className="flex flex-col items-center space-y-4 max-w-md mx-auto p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                                <h3 className="text-lg font-medium text-blue-600">Đang tải bảng tính Excel...</h3>
                                <p className="text-gray-600 text-center">Đang sử dụng Microsoft Office Online Viewer để hiển thị bảng tính</p>
                                
                                {/* Progress bar animation */}
                                <div className="w-full mt-2">
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                    Đang tải
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    {Math.min(Math.round(loadingProgress), 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                                            <div style={{ width: `${Math.min(loadingProgress, 100)}%` }} 
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-in-out">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-gray-500 text-sm text-center mt-2">
                                    Vui lòng đợi trong khi Microsoft Office Online tải bảng tính Excel của bạn.
                                    <br/>Quá trình này có thể mất từ 5-20 giây tùy thuộc vào kích thước file.
                                </p>
                                
                                {loadingTime > 25 && (
                                    <div className="mt-4 text-center">
                                        <p className="text-amber-600 mb-3">Quá trình tải kéo dài hơn dự kiến.</p>
                                        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2">
                                            <a 
                                                href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(sasUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer" 
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                                                Mở trong tab mới
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
                                )}
                            </div>
                        </div>
                    )}
                    
                    <iframe
                        src={msOfficeViewerUrl}
                        className={`w-full border-0 ${iframeLoaded ? 'h-[65vh]' : 'h-0'}`}
                        title={fileName || "Excel Document"}
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        onLoad={(e) => {
                            console.log("Microsoft Office Online viewer for Excel document loaded");
                            setIframeLoaded(true);
                            setLoading(false);
                        }}
                        onError={(e) => {
                            console.error("Microsoft Office Online viewer error:", e);
                            setError("Không thể tải tệp Excel qua Microsoft Office Online Viewer");
                            setPreviewFailureMessage("Microsoft Office Online không thể hiển thị bảng tính Excel này. Có thể do kích thước file lớn hoặc định dạng không được hỗ trợ.");
                        }}
                    />
                    
                    {iframeLoaded && (
                        <div className="mt-3 text-center">
                            <p className="text-sm text-gray-600">{fileName}</p>
                            <p className="text-xs text-blue-600 mt-1">Bảng tính được hiển thị qua Microsoft Office Online Viewer</p>
                        </div>
                    )}
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
                        <div className="flex flex-col items-center justify-center h-[60vh] bg-white">
                            <div className="flex flex-col items-center space-y-4 max-w-md mx-auto p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                                <h3 className="text-lg font-medium text-blue-600">Đang tải tài liệu Office...</h3>
                                <p className="text-gray-600 text-center">Đang sử dụng Google Docs Viewer để hiển thị tài liệu</p>
                                
                                {/* Progress bar animation */}
                                <div className="w-full mt-2">
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                    Đang tải
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    {Math.min(Math.round(loadingProgress), 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                                            <div style={{ width: `${Math.min(loadingProgress, 100)}%` }} 
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-in-out">
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-right">
                                            {loadingTime > 0 ? `${loadingTime} giây` : ''}
                                        </p>
                                    </div>
                                </div>
                                
                                <p className="text-gray-500 text-sm text-center">
                                    {loadingTime > 15 
                                        ? 'Tài liệu Office có kích thước lớn đang được tải, vui lòng đợi thêm...'
                                        : 'Vui lòng đợi. Tài liệu Office thường mất 10-30 giây để tải.'}
                                </p>
                                
                                {/* Timer animation */}
                                <div className="text-xs text-gray-500 mt-1">
                                    {gdocsTimeout ? `Đã tải ${loadingTime} giây` : `Vui lòng chờ (${loadingTime}s)...`}
                                </div>
                            </div>
                            
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
                        onError={(e) => {
                            console.error("Google Docs viewer error:", e);
                            // For Excel files, automatically switch to Microsoft Office Online
                            if (isExcelDocument(contentType)) {
                                setGoogleViewerFailed(true);
                                setUseMicrosoftViewer(true);
                            } else {
                                setError("Không thể tải tài liệu qua Google Docs Viewer");
                            }
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
                <div className="w-full h-[70vh] flex flex-col relative">
                    {/* Loading overlay for PDF */}
                    {!iframeLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 z-10">
                            <div className="flex flex-col items-center space-y-4 max-w-md mx-auto p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                                <div className="text-center">
                                    <p className="text-blue-600 font-medium text-lg">Đang tải PDF...</p>
                                    <p className="text-gray-600 mt-1">PDF đang được tải qua Google Docs Viewer</p>
                                    
                                    {/* Progress bar with actual progress value */}
                                    <div className="relative pt-1 w-64 mt-3">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                    Đang tải PDF
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    {Math.min(Math.round(loadingProgress), 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                                            <div style={{ width: `${Math.min(loadingProgress, 100)}%` }} 
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-in-out">
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-right">
                                            {loadingTime > 0 ? `${loadingTime} giây` : ''}
                                        </p>
                                    </div>
                                    
                                    <p className="text-gray-500 text-sm mt-4">
                                        {loadingTime > 15 
                                            ? 'PDF có kích thước lớn đang được tải, vui lòng đợi thêm...' 
                                            : 'Quá trình này có thể mất 10-15 giây tùy thuộc vào kích thước file'}
                                    </p>
                                </div>
                                
                                {/* Additional action buttons for long loads */}
                                {loadingTime > 20 && (
                                    <div className="mt-4 text-center">
                                        <p className="text-amber-600 mb-3">Quá trình tải PDF kéo dài hơn dự kiến.</p>
                                        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2">
                                            <a 
                                                href={sasUrl}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                                                Mở trong tab mới
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
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* PDF iframe */}
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
        {error || previewFailureMessage ? (
            <div className="mb-4">
                <p className="font-semibold text-red-600">Lỗi khi xem trước tài liệu:</p>
                <p className="text-red-600">{error || previewFailureMessage}</p>
                
                {/* Excel specific error guidance */}
                {isExcelDoc && (
                    <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-md text-left">
                        <p className="font-medium text-blue-800">Gợi ý cho tập tin Excel:</p>
                        <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                            <li>Bảng tính Excel thường khó hiển thị trực tiếp trên trình duyệt</li>
                            <li>Hãy thử tải xuống và mở bằng Microsoft Excel hoặc Google Sheets</li>
                            <li>Nếu bảng tính lớn (lớn hơn 5MB), việc xem trước có thể không khả thi</li>
                            <li>Đối với bảng tính phức tạp, ứng dụng Excel desktop sẽ hiển thị tốt hơn</li>
                        </ul>
                    </div>
                )}
                
                {/* CORS troubleshooting information */}
                {error && error.includes('CORS') && (
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
                    {isExcelDoc && <p className="text-blue-600">Loại file: Excel</p>}
                </div>
            </div>
        ) : (
            <p className="text-gray-600 mb-4">Tài liệu này không thể xem trước trong trình duyệt</p>
        )}
        
        {/* Try direct link and download */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            {/* For Excel files, offer alternative viewers */}
            {isExcelDoc && (
                <div className="flex flex-col w-full gap-3 mb-4">
                    <p className="text-gray-700 font-medium">Thử xem bảng tính với:</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
                        <a 
                            href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(sasUrl)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                            Microsoft Office Online
                        </a>
                        <a 
                            href={`https://docs.google.com/viewer?url=${encodeURIComponent(sasUrl)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                            Google Docs Viewer
                        </a>
                    </div>
                </div>
            )}
            
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