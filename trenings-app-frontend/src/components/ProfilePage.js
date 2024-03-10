import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import Navigation from "./Navigation"; // Importer Navigation komponenten
import axios from "axios";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [login, setLogin] = useState(user.login);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Her kan du legge til logikk for å oppdatere brukerdata
    console.log("Form submitted");
    const userData = {
      firstName,
      lastName,
      email,
      login,
    };
    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/me",
        userData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      //Oppdaterer med ny token
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error updating user", error);
    }

    setOpen(false);
  };

  return (
    <div>
      <Navigation /> {/* Legg til Navigation komponenten */}
      <Container sx={{ mt: 15 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            alt={`${user.firstName} ${user.lastName}`}
            src={user.avatar}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {user.email}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </Button>
        </Box>
      </Container>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Profile
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Username"
              defaultValue={user.login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              defaultValue={user.firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              defaultValue={user.lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              defaultValue={user.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
