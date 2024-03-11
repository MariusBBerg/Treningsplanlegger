import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const WeeklyRunningVolume = ({ client, week }) => {
  const [weeklyVolume, setWeeklyVolume] = useState(0);
  // Legg til state for å holde på start- og sluttdatoene for uken
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchWeeklyVolume = async (week) => {
    // Beregn starten og slutten av uken basert på den valgte uken
    const startOfWeek = moment().isoWeek(week).startOf('isoWeek');
    const endOfWeek = moment().isoWeek(week).endOf('isoWeek');

    // Oppdaterer ukeområdet i tilstanden
    setWeekRange({
      start: startOfWeek.format('DD MMM'),
      end: endOfWeek.format('DD MMM'),
    });

    const response = await axios.get(`http://localhost:8080/api/workouts/user/${client.login}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const volume = response.data
      .filter(workout => {
        const workoutDate = moment(workout.date);
        return (
          workout.type === 'Løping' &&
          workoutDate.isBetween(startOfWeek, endOfWeek, null, '[]')
        );
      })
      .reduce((total, workout) => total + workout.distance, 0);

    setWeeklyVolume(volume);
  };

  useEffect(() => {
    if (client && week) {
      fetchWeeklyVolume(week);
    }
  }, [client, week]);

  return (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Ukentlig løpevolum
        </Typography>
        <Typography variant="h5" component="div">
          {weeklyVolume.toFixed(2)} km
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {weekRange.start} - {weekRange.end} {/* Bruk state-variablene for å vise datoer */}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WeeklyRunningVolume;
