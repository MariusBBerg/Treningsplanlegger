import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { loggedIn } = useAuth();

  return (
    <nav className="mb-4">
      {!loggedIn ? (
        <div className="space-x-4">
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </div>
      ) : (
        <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
      )}
    </nav>
  );
};

export default Navigation;
