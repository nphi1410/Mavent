import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { classNames } from "../utils";

const DropdownMenu = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <div onClick={toggleDropdown}>
        {trigger}
      </div>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ className, onClick, children, ...props }) => (
  <button
    className={classNames(
      "text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100",
      className
    )}
    role="menuitem"
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const DropdownMenuSeparator = ({ className, ...props }) => (
  <div
    className={classNames("my-1 h-px bg-gray-200", className)}
    {...props}
  />
);

const DropdownMenuLabel = ({ className, children, ...props }) => (
  <span
    className={classNames("px-4 py-2 text-xs font-semibold text-gray-500", className)}
    {...props}
  >
    {children}
  </span>
);

// Export for compatibility with existing code
export { 
  DropdownMenu, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuLabel,
  // Legacy exports for backward compatibility
  DropdownMenu as DropdownMenuTrigger,
  DropdownMenu as DropdownMenuContent,
  DropdownMenuItem as DropdownMenuRadioItem,
  DropdownMenuItem as DropdownMenuCheckboxItem,
  DropdownMenuItem as DropdownMenuSubTrigger,
  DropdownMenuItem as DropdownMenuSubContent,
  DropdownMenuItem as DropdownMenuPortal,
  DropdownMenuSeparator as DropdownMenuGroup,
  DropdownMenuSeparator as DropdownMenuSub,
  DropdownMenuSeparator as DropdownMenuRadioGroup,
};

export default DropdownMenu;
