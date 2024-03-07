import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, TextInput, Card, Label } from "flowbite-react";
import { useAuth } from '../contexts/AuthContext'; // Importer useAuth
import { set } from "date-fns";


const LoginForm = ({ onSwitchForm }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth(); // Hent setLoggedIn funksjonen fra AuthContext


  const handleLogin = (e) => {
    e.preventDefault();
    authService.login(login, password).then(
      () => {
        navigate("/dashboard");
        setLoggedIn(true); // Sett loggedIn til true for å oppdatere innloggingsstatusen
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div>
      <Card>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="login">Login</Label>
            <TextInput
              id="login"
              type="text"
              placeholder="Your login"
              required={true}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              type="password"
              placeholder="Your password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit">Log In</Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-center mt-4">
            Har du ikke en konto?{" "}
            <Button color="gray" size="xs" onClick={onSwitchForm}>
              Registrer deg
            </Button>
          </p>{" "}
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
