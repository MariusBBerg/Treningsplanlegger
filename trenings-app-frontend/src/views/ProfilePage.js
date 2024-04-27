import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Modal,
  TextField,
} from "@mui/material";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Navigation from "../components/Navigation/Navigation";
import axios from "axios";
import Footer from "../components/Footer";
import { API_URL } from "../utils/api_url";

import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import revokeGoogleAccess from "../services/GoogleServices/revokeGoogleAccess";
import authorizeGoogleOAuth from "../services/GoogleServices/authorizeGoogleOAuth";
import FriendRequests from "./Socials/FriendsView";
import FriendsModal from "../components/FriendsModal";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const userStr = localStorage.getItem("user");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [login, setLogin] = useState(user.login);
  const [googleConfigOpen, setGoogleConfigOpen] = useState(false);
  const [creatingCalendar, setCreatingCalendar] = useState(false); //for spinner/loader
  const [calendarCreated, setCalendarCreated] = useState(false); //for å erstatte knap når ferdig'
  const [calendarNotCreated, setCalendarNotCreated] = useState(false); //for å vise feilmelding
  const [updateUserError, setUpdateUserError] = useState("");
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);

  const [autoExport, setAutoExport] = useState(
    user.autoExportToGoogleCalendar || false
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleAutoExportChange = async (event) => {
    setAutoExport(event.target.checked);
    const updatedUser = {
      ...user,
      autoExportToGoogleCalendar: event.target.checked,
    };
    setUser(updatedUser);
    try {
      const response = await axios.put(API_URL + "api/users/me", updatedUser, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");
    const userData = {
      firstName,
      lastName,
      email,
      login,
      autoExport,
    };
    try {
      const response = await axios.put(API_URL + "api/users/me", userData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      //Oppdaterer med ny token
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating user", error);
      if (error.response && error.response.data) {
        // If the server responds with a custom error message, display it
        console.error("Server response:", error.response.data.message);
        setUpdateUserError(error.response.data.message);
      }
    }
  };

  const handleCreateCalendar = async () => {
    //TODO, GJØRE DENNE FINERE
    const confirm = window.confirm(
      "Are you sure you want to create a new calendar?"
    );
    if (!confirm) {
      return;
    }
    setCreatingCalendar(true);

    try {
      const response = await axios.post(
        API_URL + "api/google-calendar/create-calendar",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Calendar created", response.data);
        setCalendarCreated(true);
      } else {
        setCalendarNotCreated(true);
      }
    } catch (error) {
      console.error("Error creating calendar", error);
      setCalendarNotCreated(true);
      setTimeout(() => {
        setCalendarNotCreated(false);
      }, 1000);
    } finally {
      setCreatingCalendar(false);
    }
  };



  

  return (
    <div className="theme-bg min-h-screen flex flex-col justify-between">
      <Navigation />
      <Container>
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

          {!user.isGoogleAuthenticated && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => authorizeGoogleOAuth()}
              sx={{ mt: 2 }}
            >
              Google authorization
            </Button>
          )}
                  <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setFriendsModalOpen(true)}
        >
          Manage Friends
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
            width: 400, // specify a fixed width
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
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
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setGoogleConfigOpen(true); // Open the second modal
              }}
            >
              Open Google Configuration
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: "30px" }}
            >
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal
        open={googleConfigOpen}
        onClose={() => setGoogleConfigOpen(false)}
        aria-labelledby="google-config-modal-title"
        aria-describedby="google-config-modal-description"
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
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setGoogleConfigOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="google-config-modal-title"
            variant="h6"
            component="h2"
            sx={{ alignSelf: "start", mb: 2 }} // Align title to the start
          >
            Google Calendar Configuration
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            More to come soon
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {user.isGoogleAuthenticated ? (
              <>
                <CheckCircleIcon color="success" />
                <Typography variant="body2" color="text.secondary">
                  Connected to Google
                </Typography>
              </>
            ) : (
              <>
                <CancelIcon color="error" />
                <Typography variant="body2" color="text.secondary">
                  Not connected to Google
                </Typography>
              </>
            )}
          </Box>
          {user.isGoogleAuthenticated && (
            <FormControlLabel
              control={
                <Switch
                  checked={autoExport}
                  onChange={handleAutoExportChange}
                  name="autoExport"
                  color="primary"
                />
              }
              label="Auto export future sessions to Google Calendar"
              sx={{ mb: 2 }}
            />
          )}

          <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
            Reconnect your account to google, or to another google account
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => authorizeGoogleOAuth()}
          >
            Google authorization
          </Button>

          {user.isGoogleAuthenticated && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={async () => {
                await revokeGoogleAccess();
                // Update user state to trigger re-render
                const updatedUser = { ...user, isGoogleAuthenticated: false };
                setUser(updatedUser);
              }}
            >
              Revoke access to your google account
            </Button>
          )}
          {creatingCalendar ? (
            <CircularProgress sx={{ mb: 2 }} />
          ) : calendarCreated ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Calendar created successfully!
            </Alert>
          ) : calendarNotCreated ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to create calendar
            </Alert>
          ) : user.isGoogleAuthenticated ? (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => handleCreateCalendar()}
              sx={{ mb: 2 }}
            >
              Create A new Calendar
            </Button>
          ) : null}
        </Box>
      </Modal>

      <FriendsModal
        open={friendsModalOpen}
        onClose={() => setFriendsModalOpen(false)}
        user={user}
      />

      <Snackbar
        open={!!updateUserError}
        autoHideDuration={4000}
        onClose={() => setUpdateUserError("")}
      >
        <Alert
          onClose={() => setUpdateUserError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {updateUserError}
        </Alert>
      </Snackbar>
      <Footer />

    </div>
  );
}
