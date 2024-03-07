import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext'; // Importer useAuth


const LogOut = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth(); // Hent setLoggedIn funksjonen fra AuthContext


  useEffect(() => {
    authService.logout();
    setLoggedIn(false); // Sett loggedIn til false for å oppdatere innloggingsstatusen
    navigate('/');
  }, [navigate,setLoggedIn]);

  return null;
};

export default LogOut;
