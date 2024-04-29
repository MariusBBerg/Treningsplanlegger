import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { fetchWorkouts } from "../components/Workout/Hooks/workoutApi";
import { API_URL } from "../utils/api_url";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer";
import moment from "moment";
import { Refresh, RunCircle } from "@mui/icons-material";

const HomeFeed = () => {
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [friendsWorkouts, setFriendsWorkouts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);

  const fetchFriendsWorkouts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/workouts/friends/workouts/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setFriendsWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching friends' workouts", error);
    }
  };

  useEffect(() => {
    fetchWorkouts(null, user, setMyWorkouts);
    fetchFriendsWorkouts();
  }, [user.token]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsRefreshDisabled(true);
    fetchFriendsWorkouts();
    fetchWorkouts(null, user, setMyWorkouts);
    setTimeout(() => setIsRefreshing(false), 1500);
    setTimeout(() => setIsRefreshDisabled(false), 5000);
    
  };

  return (
    <div className="theme-bg min-h-screen flex flex-col">
      <Navigation />
      <Container sx={{ mt: 10, mb: 5, flex: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Typography variant="h4">Home Feed</Typography>
          <IconButton onClick={handleRefresh} disabled={isRefreshDisabled}>
            {isRefreshing ? <CircularProgress /> : <Refresh />}
          </IconButton>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
        {!isRefreshing && (
          <>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h3" gutterBottom>
              My Upcoming Workouts
            </Typography>
            {myWorkouts.slice(0,7).map((workout) => (
              <Card
                sx={{
                  mb: 3,
                  background: "linear-gradient(to right, #e1f5fe, #b3e5fc)", 
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="h6">{workout.name}</Typography>
                    <Typography variant="body1">
                      <RunCircle /> {workout.type}
                    </Typography>
                    <Typography variant="body2">
                      {workout.description || "No description provided"}
                    </Typography>
                    <Typography variant="body2">
                      Date: {moment(workout.date).format("YYYY-MM-DD HH:mm")}
                    </Typography>
                    {workout.type === "Running" && (
                      <>
                        <Typography variant="body2">
                          Distance: {workout.distance} km
                        </Typography>
                        <Typography variant="body2">
                          Intensity Zone: {workout.intensityZone}
                        </Typography>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h3" gutterBottom>
              Friends' Upcoming Workouts
            </Typography>
            {friendsWorkouts.map((workout) => (
              <Card
                sx={{
                  mb: 3,
                  background: "linear-gradient(to right, #e1f5fe, #b3e5fc)",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="h6">
                      {workout.name} - {workout.userLogin}
                    </Typography>
                    <Typography variant="body1">
                      <RunCircle /> {workout.type}
                    </Typography>
                    <Typography variant="body2">
                      Date: {moment(workout.date).format("YYYY-MM-DD HH:mm")}
                    </Typography>
                    {workout.type === "Running" && (
                      <>
                        <Typography variant="body2">
                          Distance: {workout.distance} km
                        </Typography>
                        <Typography variant="body2">
                          Intensity Zone: {workout.intensityZone}
                        </Typography>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
          </>
        )}
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default HomeFeed;
