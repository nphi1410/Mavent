import Api from "../config/Api";

// Temporarily disabled API calls and using only local images
export const getImages = async () => {
  console.log("API call to /document disabled. Using local images.");
  
  // Skip real API call completely until backend is fixed
  // Return a response indicating we should use local images
  return {
    data: [],  // Empty data array will trigger the fallback in HomePage
    useLocalImages: true  // A flag to indicate we should use local images
  };
};
