import React, { use } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faDownload, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import DocViewer, {DocViewerRenderers} from "react-doc-viewer";

const DocumentPreviewModal = ({isOpen, onClose, previewData}) => {
    const [loading, setloading] = useState(true);

    useEffect(() => {
        if (previewData) {
            setloading(false);
        }
    }, [previewData]);

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

    return supportedTypes.includes(contentType)
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


        const {contentType, sasUrl, fileName, isViewable} = previewData;

        if (isViewable && isSupportedByDocViewer(contentType)) {
            return (
                <DocViewer
                    documents={[{ uri: sasUrl }]}
                    pluginRenderers={DocViewerRenderers}
                    config={{
                        header: {
                            disableFileName: true,
                            retainURLParams: true,
                        }
                    }}
                    style={{height: '70vh' }}
                />
            );
        }

        //Use goole Doc viewer for fallback
        if (isViewable && canUseGoogleViewer(contentType)) {
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(sasUrl)}&embedded=true`;
            return (
                <div className="w-full h-[70vh]">
                    <iframe
                    src={googleViewerUrl}
                    className="w-full h-full border-0"
                    title={fileName}
                    onLoad={() => setloading(false)}
                    />

                    
                </div>
            );
        }

        // Default case - download the file
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">This file cannot be previewed in the browser</p>
        <a 
          href={sasUrl} 
          download={fileName}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Download File
        </a>
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
        </div>
      </div>
    </div>
  );

}

export default DocumentPreviewModal;