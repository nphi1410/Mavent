import React, { createContext, useContext } from "react";

// Create the context
export const EventRoleContext = createContext({
  userRole: null,
});

// Custom hook for convenience
export const useEventRole = () => useContext(EventRoleContext);
