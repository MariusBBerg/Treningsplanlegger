import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);