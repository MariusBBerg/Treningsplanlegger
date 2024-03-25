import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import { Button, TextField, Card, Typography, Grid } from "@mui/material";
import Navigation from '../components/Navigation/Navigation';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Footer from "../components/Footer";

const RegisterForm = () => {
  const [login, setLogin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    authService.register(firstName, lastName, email, login, password).then(
      () => {
        navigate("/login", { state: { message: "You have successfully registered" } });
      },
      (error) => {
        setErrorMessage(error.response.data.message);
        console.log(error);
      }
    );
  };

  return (
    <div>
      <Navigation />
      <Card
        variant="outlined"
        sx={{ maxWidth: 400, margin: "auto", marginTop: 20, padding: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister} className="space-y-6">
          <TextField
            id="login"
            label="Login"
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
          <TextField
            id="firstName"
            label="First Name"
            variant="outlined"
            fullWidth
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            margin="normal"
          />
          <TextField
            id="lastName"
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            margin="normal"
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Make Account
          </Button>
        </form>
        <Grid container justifyContent="center" marginTop={2}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>
        </Grid>
        
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      </Card>
      <Footer />
    </div>
  );
};

export default RegisterForm;
