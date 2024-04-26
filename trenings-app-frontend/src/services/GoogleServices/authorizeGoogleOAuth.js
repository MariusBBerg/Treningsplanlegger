import React from "react";



const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;


const authorizeGoogleOAuth = () => {
    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/auth?" +
      "access_type=offline" +
      "&client_id=" +
      clientId + // Bygg riktig URL
      "&redirect_uri=" +
      redirectUri +
      "&response_type=code" +
      "&scope=" +
      encodeURIComponent(
        "https://www.googleapis.com/auth/calendar.calendarlist.readonly " +
          "https://www.googleapis.com/auth/calendar.app.created"
      );

    window.location.href = googleAuthUrl; // Omdiriger til Google OAuth
  };



export default authorizeGoogleOAuth;
