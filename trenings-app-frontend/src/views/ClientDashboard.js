import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation/Navigation';
import ClientWorkoutForm from '../components/Workout/ClientWorkoutForm';
import Footer from '../components/Footer';

const ClientDashboard = () => {
  return (
    <div className="theme-bg min-h-screen flex flex-col ">
      <Navigation />
      <div className="flex flex-col items-center text-center pt-16 md:pt-24 px-4">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-6">Client Calendars</h2>
        <p className="text-lg text-gray-700 max-w-prose">
          Dette er beskyttet innhold kun tilgjengelig for autentiserte brukere. Her kan du administrere treningsøktene dine og se progresjonen din.
        </p>
        <div className="mt-6 w-full max-w-4xl">
          <ClientWorkoutForm />
        </div>
        <Link to="/logout" className="text-red-600 hover:text-red-800 mt-4 transition duration-300 ease-in-out">Logg Ut</Link>
      </div>
    <Footer />
    </div>
  );
};

export default ClientDashboard;
