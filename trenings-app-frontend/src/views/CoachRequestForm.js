import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CardActions from "@mui/material/CardActions";
import { API_URL } from "../utils/api_url";
import Navigation from "../components/Navigation/Navigation"; // Sørg for at denne linjen er korrekt importert
import Footer from "../components/Footer";

const CoachRequestForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;



  //Short polling for å hente requests hvert 5. sekund, sjekke om nye requests.
  useEffect(() => {
    fetchRequests();
  
    const intervalId = setInterval(fetchRequests, 5000);
  
    return () => clearInterval(intervalId);
  }, []);

  const searchUsers = async (searchTerm) => {
    try {
      const response = await axios.get(
        API_URL + `api/users/search`,
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
        API_URL + `api/coach-requests/user/${user.id}/requests`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  const sendRequest = async (userId) => {
    try {
      await axios.post(
        API_URL + `api/coach-requests/user/${user.id}/request/${userId}`,
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
        API_URL + `api/coach-requests/request/${requestId}/response`,
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
    <div className="theme-bg min-h-screen flex flex-col justify-between"> {/* For å få footer til å bli nederst */}
    <Container sx={{ mt: 15 }}>
      <Navigation />
      <Typography variant="h4" component="h1" gutterBottom>
        Coach Requests
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Find your coach
            </Typography>
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Search users"
              variant="outlined"
              fullWidth
            />
            {users.map((user) => (
              <Card key={user.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {user.firstName}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => sendRequest(user.id)}
                  >
                    Send Request
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Card>
        </Grid>
        
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 2, height: "100%" }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Requests
              </Typography>
              {requests.length < 1 && (

                <Typography variant="h6"  gutterBottom>
                    You have no requests
                </Typography>
                )}
              {requests.map((request) => (
                <Card key={request.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography >
                      {request.requester.firstName} wants you to coach him.
                    </Typography>
                  </CardContent>
                  <CardActions>
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
                  </CardActions>
                </Card>
              ))}
            </Card>
          </Grid>
        
      </Grid>
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
          <Footer />
    </div>
  );
};

export default CoachRequestForm;
