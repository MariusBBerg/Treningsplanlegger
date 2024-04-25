import React from 'react';
import axios from 'axios';
import { Button } from 'flowbite-react';
import { API_URL } from '../../../utils/api_url';


const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;
const clientId = '589841951698-k4dn8c07qbhmhqp50vhb428gpa36iup1.apps.googleusercontent.com';
const redirectUri = 'http://mariusberg.xyz/googlecalendar/callback';

const GoogleAuthButton = () => {
    const authorizeGoogleOAuth = () => {
        const googleAuthUrl = 'https://accounts.google.com/o/oauth2/auth?' +
        'access_type=offline' +
        '&client_id=' + clientId + // Bygg riktig URL
        '&redirect_uri=' + redirectUri +
        '&response_type=code' +
        '&scope=' + encodeURIComponent(
          'https://www.googleapis.com/auth/calendar.calendarlist.readonly ' +
          'https://www.googleapis.com/auth/calendar.app.created'
        );
      
        window.location.href = googleAuthUrl; // Omdiriger til Google OAuth
      };
      

  return (
    
    <Button
      color="blue"
      onClick={authorizeGoogleOAuth} // Kall funksjonen for å starte autentisering
      className="mt-5"
    >
      Authorize With Google Calendar
    </Button>
  );
};

export default GoogleAuthButton;
