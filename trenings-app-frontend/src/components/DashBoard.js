import React from 'react';
import { Link } from 'react-router-dom';
import WorkoutForm from './WorkoutForm';

const DashBoard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>
      <p className="text-lg text-gray-700 mb-6">
        Dette er beskyttet innhold kun tilgjengelig for autentiserte brukere.
      </p>
      <WorkoutForm />
      <Link to="/logout" className="text-red-500 hover:underline mt-4">Logg Ut</Link>
    </div>
  );
};

export default DashBoard;
