/* eslint-disable no-unused-vars */
import React, { createContext, useState } from "react";

// 1. Create the context
export const UserContext = createContext();

// 2. Create the provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Update user state with new user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Clear user state on logout
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
