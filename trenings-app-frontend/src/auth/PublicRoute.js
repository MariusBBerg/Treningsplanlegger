import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { loggedIn } = useAuth();

  if (loggedIn) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default PublicRoute;
