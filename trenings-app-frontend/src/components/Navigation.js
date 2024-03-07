import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { loggedIn } = useAuth(); // Anta at dette er en hook som returnerer autentiseringsstatus
  const location = useLocation(); // Henter den nåværende stien

  // Funksjon for å sjekke om en lenke er aktiv basert på stien
  const isActive = (pathname) => location.pathname === pathname;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              {/* Nettstedslogo */}
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">Treningsplanlegger</span>
              </Link>
            </div>
            {/* Primære navigasjonslenker */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`${isActive('/') ? 'text-green-600 underline' : 'text-gray-500'} py-4 px-2 text-green-500 font-semibold hover:text-green-600 transition duration-300`}>Hjem</Link>
              {loggedIn && <Link to="/dashboard" className={`${isActive('/dashboard') ? 'text-green-600 underline' : 'text-gray-500'} py-4 px-2 font-semibold hover:text-green-600 transition duration-300`}>Dashboard</Link>}
            </div>
          </div>
          {/* Sekundære navigasjonslenker */}
          <div className="hidden md:flex items-center space-x-3">
            {!loggedIn ? (
              <>
                <Link to="/login" className={`${isActive('/login') ? 'underline' : ''} py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300`}>Logg inn</Link>
                <Link to="/register" className={`${isActive('/register') ? 'underline' : ''} py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300`}>Registrer</Link>
              </>
            ) : (
              <Link to="/logout" className="py-2 px-2 font-medium text-white bg-red-500 rounded hover:bg-red-400 transition duration-300">Logg ut</Link>
            )}
          </div>
          {/* Mobilmenyknapp */}
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button">
              <svg className="w-6 h-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Her kan du legge til logikk for en mobilmeny som vises når brukeren trykker på mobilmenyknappen */}
    </nav>
  );
};

export default Navigation;
