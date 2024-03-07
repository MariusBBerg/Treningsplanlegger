import React from 'react';
import Navigation from './Navigation'; // Antar at denne komponenten inkluderer den oppdaterte NavBar
import LoginForm from './LoginForm';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { loggedIn } = useAuth(); // Anta at dette er en hook som returnerer autentiseringsstatus

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex flex-col justify-center items-center text-center pt-16 md:pt-32 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Velkommen til Treningsplanleggingsappen</h1>
        <p className="text-lg text-gray-700 max-w-prose">
          Dette er en app som hjelper deg med å planlegge og holde styr på dine treningsøkter. Perfekt for alle som ønsker å holde seg aktive og nå sine treningsmål.
        </p>
        <div className="mt-6">
          <a href="/register" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300">
            Bli med oss
          </a>
        </div>
        {!loggedIn ? (
        <div className="w-full max-w-xs m-auto mt-6 py-30">

          <LoginForm />
        </div>
        ): null} {/* Legg til denne linjen */}

      </div>
    </div>
  );
};

export default HomePage;
