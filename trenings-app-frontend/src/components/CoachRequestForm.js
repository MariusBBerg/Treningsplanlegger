import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Navigation from "./Navigation"; // Sørg for at denne linjen er korrekt importert

const CoachRequestForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchRequests();
  }, []);

  const searchUsers = async (searchTerm) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/search`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            query: searchTerm,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      searchUsers(searchTerm);
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/coach-requests/user/${user.id}/requests`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRequests(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  const sendRequest = async (userId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/coach-requests/user/${user.id}/request/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      fetchRequests();
      setOpen(true);
    } catch (error) {
      console.error("Error sending request", error);
      setErrorMessage("Error sending request, can't send request twice.");
    }
  };

  const respondToRequest = async (requestId, response) => {
    try {
      await axios.post(
        `http://localhost:8080/api/coach-requests/request/${requestId}/response`,
        response,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Error responding to request", error);
    }
  };

  return (
    <Container sx={{ mt: 15 }}>
      <Navigation />
      <Typography variant="h4" component="h1" gutterBottom>
        Coach Requests
      </Typography>
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        label="Search users"
        variant="outlined"
        fullWidth
      />
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {user.firstName}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => sendRequest(user.id)}
                >
                  Send Request
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3 }}>
        {requests.map((request) => (
          <Box key={request.id} sx={{ mb: 2 }}>
            <Typography variant="body1">
              {request.requester && request.requester.firstName} to{" "}
              {request.requested && request.requested.firstName}
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => respondToRequest(request.id, "Accepted")}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => respondToRequest(request.id, "Rejected")}
            >
              Reject
            </Button>
          </Box>
        ))}
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Request sent successfully
        </Alert>
      </Snackbar>
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
    </Container>
  );
};

export default CoachRequestForm;
