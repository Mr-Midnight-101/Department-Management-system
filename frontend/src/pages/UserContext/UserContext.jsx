/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

// 1. Create the context
export const UserContext = createContext();

// 2. Create the provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

//   useEffect(() => {
//   axios.get("/api/teacher/user", { withCredentials: true })
//     .then(res => setUser(res.data.user))  // ✅ only called on app load
//     .catch(() => setUser(null));
// }, []);
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
