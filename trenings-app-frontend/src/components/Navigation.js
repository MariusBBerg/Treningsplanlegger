// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { loggedIn } = useAuth();

  return (
    <nav>
      {!loggedIn ? (
        <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      ) : (
        <Link to="/dashboard">Dashboard</Link>
      )}
    </nav>
  );
};

export default Navigation;
