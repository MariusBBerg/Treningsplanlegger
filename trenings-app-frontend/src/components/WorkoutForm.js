// src/components/WorkoutForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WorkoutForm = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Sjekk at user og user.token eksisterer
    if (!user || !user.token) {
      console.error('Bruker er ikke autentisert.');
      // Legg til logikk for å håndtere ikke-autentiserte brukere, f.eks. omdiriger til login
      return;
    }
  
    try {
        console.log("Bearer ${user.token}")
      await axios.post('http://localhost:8080/api/workouts', {
        date,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}` // Bruker token fra auth context
        }
      });
      navigate('/dashboard'); // Naviger brukeren til dashboard etter suksessfull innsending
    } catch (error) {
      console.error('Det oppstod en feil ved innsending av treningsøkt', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">Dato:</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description">Beskrivelse:</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button type="submit">Legg til treningsøkt</button>
    </form>
  );
};

export default WorkoutForm;
