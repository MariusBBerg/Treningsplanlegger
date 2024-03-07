import axios from 'axios';

const API_URL = 'http://localhost:8080/'; 

const register = (firstName, lastName, email, login, password) => {
  return axios.post(API_URL + 'register', {
    firstName,
    lastName,
    email,
    login,
    password,
  });
};

const login = (login, password) => {
  return axios.post(API_URL + 'login', {
    login,
    password,
  }).then((response) => {
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout,
};
