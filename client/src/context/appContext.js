import { io } from "socket.io-client";
import React, { useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const socket = io(backendUrl, {
  reconnectionAttempts: 3, // Try to reconnect up to 3 times
  timeout: 5000, // Set a timeout of 5 seconds
});
// App context
export const AppContext = React.createContext();

// App context provider component
export function AppContextProvider({ children }) {
  // State to store the userType
  const [userType, setUserType] = useState(null);

  // You can add other states and functions related to the context here if needed.

  return (
    // Provide the context values to the children components
    <AppContext.Provider value={{ userType, setUserType }}>
      {children}
    </AppContext.Provider>
  );
}
