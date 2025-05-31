import { useEffect, useRef } from 'react';

// Custom hook to handle click outside of specified element
const useClickOutside = (handler) => {
  // Create a ref that we add to the element for which we want to detect outside clicks
  const ref = useRef();
  
  useEffect(() => {
    // Function to check if click was outside the ref's element
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]);
  
  return ref;
};

export default useClickOutside;
