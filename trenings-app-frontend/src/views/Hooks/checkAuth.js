import axios from 'axios';
import { API_URL } from '../../utils/api_url';

const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > payload.exp;
};

const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
};

const refreshTokenApiCall = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}refresh-token`, refreshToken, { 
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },}
      
  );
    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to refresh token');
  } catch (error) {
    throw new Error('Refresh token request failed');
  }
};

const checkAuth = async () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return;
  const user = JSON.parse(userStr);
  const { token, refreshToken } = user;

  if (!token || isTokenExpired(token)) {
    if (refreshToken && !isTokenExpired(refreshToken)) {
      try {
        const newData = await refreshTokenApiCall(refreshToken);
        user.token = newData.accessToken;
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        localStorage.removeItem('user');
        console.error(error.message);
      }
    } else {
      localStorage.removeItem('user');
    }
  } else {
    // Optionally validate the non-expired token if your application requires this
    try {
      await axios.get(`${API_URL}validate-token`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      localStorage.removeItem('user');
      console.error('Token validation failed', error);
    }
  }
};

export default checkAuth;
