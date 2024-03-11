import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, TextField, Card, Typography } from "@mui/material"; // Importerer Material-UI-komponenter
import { useAuth } from '../contexts/AuthContext';
import Navigation from "./Navigation";

const LoginForm = ({ onSwitchForm }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    authService.login(login, password).then(
      () => {
        navigate("/dashboard");
        setLoggedIn(true);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleRegister = () => {
    navigate("/register"); // Navigerer til "/register" ved klikk på knappen
  };

  return (
    <div>
      <Navigation />
      <Card variant="outlined" sx={{ maxWidth: 400, margin: "auto", marginTop: 20, padding: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Log In
        </Typography>
        <form onSubmit={handleLogin} className="space-y-6">
          <TextField
            id="login"
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Log In
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Don't have an account?{" "}
          <Button color="secondary" onClick={handleRegister}> 
            Register
          </Button>
        </Typography>
      </Card>
    </div>
  );
};

export default LoginForm;
