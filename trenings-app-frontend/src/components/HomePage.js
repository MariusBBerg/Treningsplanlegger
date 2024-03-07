import React from 'react';
import Navigation from './Navigation'; // Anta at denne komponenten inneholder lenkene

const HomePage = () => {
  return (
    <div>
      <h1>Velkommen til Treningsplanleggingsappen</h1>
      <Navigation />
      <p>Dette er en app som hjelper deg med å planlegge og holde styr på dine treningsøkter.</p>
    </div>
  );
};

export default HomePage;
