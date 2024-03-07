import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Omdiriger til innloggingssiden hvis brukeren ikke er autentisert
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
