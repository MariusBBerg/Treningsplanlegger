import axios from 'axios';
import { API_URL } from '../../utils/api_url';

// Hjelpefunksjon for å sjekke om token er utløpt
const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  console.log(currentTime, payload.exp)
  return currentTime > payload.exp;
};

// Hjelpefunksjon for å dekode JWT
const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
};

const checkAuth = async () => {
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    return; // Hvis ingen brukerdata, avslutt
  }

  const user = JSON.parse(userStr);
  const token = user?.token;
  const refreshToken = user?.refreshToken;

  if (!token) {
    localStorage.removeItem('user'); // Fjern bruker hvis ingen token
    return;
  }

  if (isTokenExpired(token)) {
    // Hvis token er utløpt, prøv å fornye med refresh-token
    if (refreshToken && !isTokenExpired(refreshToken)) {
      try {
        // Bruk refresh-token til å fornye JWT
        const response = await axios.post(API_URL + 'refresh-token', {
          refreshToken,
        });

        if (response.status === 200) {
          const newToken = response.data.accessToken;
          user.token = newToken;
          localStorage.setItem('user', JSON.stringify(user));
          return; // Fortsett hvis token er vellykket fornyet
        }
      } catch (error) {
        localStorage.removeItem('user'); // Fjern bruker hvis fornyelsen mislykkes
      }
    } else {
      localStorage.removeItem('user'); // Fjern bruker hvis refresh-token også er utløpt
    }
    return;
  }

  try {
    // Valider token hvis den ikke er utløpt
    const response = await axios.get(API_URL + 'validate-token', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) {
      localStorage.removeItem('user'); // Fjern bruker hvis validering feiler
    }
  } catch (error) {
    localStorage.removeItem('user'); // Fjern bruker hvis det oppstår en feil
  }
};

export default checkAuth;
