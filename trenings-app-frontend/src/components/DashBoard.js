import React from 'react';
import { Link } from 'react-router-dom';


const DashBoard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Dette er beskyttet innhold kun tilgjengelig for autentiserte brukere.</p>
      <Link to="/logout">Logg Ut</Link> {/* Logg ut-link */}
    </div>
  );
};

export default DashBoard;
