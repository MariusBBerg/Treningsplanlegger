import React, { useState } from "react";
import authService from "../services/authService";
import { Link } from 'react-router-dom'; // Importer Link

import { useNavigate } from 'react-router-dom'; // Importer useNavigate

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Bruk useNavigate-kroken

  const handleLogin = (e) => {
    e.preventDefault();
    authService.login(login, password).then(
      () => {
        navigate('/dashboard'); // Omdiriger til /dashboard etter vellykket innlogging
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Log In</button>
      </form>
      <div>
        Har du ikke en konto? <Link to="/register">Registrer deg</Link>
      </div>
    </div>
  );
};

export default LoginForm;
