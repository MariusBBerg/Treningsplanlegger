import React from 'react';
import Navigation from './Navigation'; // Anta at denne komponenten inneholder lenkene

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-8">Velkommen til Treningsplanleggingsappen</h1>
      <Navigation />
      <p className="text-lg text-gray-700 text-center max-w-prose">
        Dette er en app som hjelper deg med å planlegge og holde styr på dine treningsøkter.
      </p>
    </div>
  );
};

export default HomePage;
 