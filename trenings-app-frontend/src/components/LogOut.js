import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authService.logout();
    navigate('/');
  }, [navigate]);

  return null;
};

export default LogOut;
