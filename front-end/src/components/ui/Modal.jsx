import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

/**
 * Modal component using only React and Tailwind CSS
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls whether the modal is visible
 * @param {function} props.onClose - Function called when modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 */
const Modal = ({ isOpen = false, onClose, title, children, footer }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(isOpen);
    
    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mx-4 transition-all">
        {/* Close button */}
        <button 
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faX} className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        {/* Header */}
        {title && (
          <div className="mb-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div>{children}</div>
        
        {/* Footer */}
        {footer && (
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// For backward compatibility
export const Dialog = Modal;
export const DialogContent = ({ children }) => <>{children}</>;
export const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const DialogFooter = ({ children }) => <div className="mt-4 flex justify-end">{children}</div>;
export const DialogTitle = ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>;
export const DialogDescription = ({ children }) => <p className="text-gray-500 text-sm">{children}</p>;

// Export named components for existing usage
export {
  Modal as DialogPortal,
  Modal as DialogOverlay,
  Modal as DialogTrigger,
  Modal as DialogClose,
};

export default Modal;
