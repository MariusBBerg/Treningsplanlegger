import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate

import authService from '../services/authService';


const RegisterForm = () => {
  const [login, setLogin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Bruk useNavigate-kroken


  const handleRegister = (e) => {
    e.preventDefault();
    authService.register(firstName, lastName, email, login, password).then(
      () => {
        navigate('/login'); // Omdiriger til /login etter vellykket registrering
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        name="login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Login"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
        <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
        />
        <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
        />
        <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
