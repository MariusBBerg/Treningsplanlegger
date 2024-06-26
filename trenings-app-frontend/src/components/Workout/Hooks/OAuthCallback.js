import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../../utils/api_url";
import { Navigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';


// Funksjon for å håndtere callback og sende koden til backend
const handleOAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authorizationCode = urlParams.get("code"); // Få koden fra URL-parametere
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  let encodedCode = {
    code: authorizationCode,
  }
    try {
      // Send autorisasjonskoden til backend for utveksling mot tokens
      const response = await axios.post(
        API_URL + `api/google-calendar/oauth2callback`,encodedCode, 
        {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },

        }
      );
      if (response.status === 200) {
        user.isGoogleAuthenticated=true;
        localStorage.setItem("user", JSON.stringify(user));

      }


    } catch (error) {
      console.error("Feil under Google OAuth callback:", error);
    }
  
};

const OAuthCallback = () => {
  const [redirect, setRedirect] = useState(false); // Bruk state for å styre omdirigering

  useEffect(() => {
    (async () => {
      await handleOAuthCallback(); // Kall funksjonen for å håndtere callback
      setRedirect(true); // Sett state for å utløse omdirigering
    })();
  }, []);
  if (redirect) {
    return <Navigate to="/dashboard" />; // Returner JSX-komponenten for å utløse omdirigering
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <CircularProgress />
    </div>
  );
};

export default OAuthCallback;
