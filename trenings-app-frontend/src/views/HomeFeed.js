import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Container } from "@mui/material";
import { fetchWorkouts } from "../components/Workout/Hooks/workoutApi";
import { API_URL } from "../utils/api_url";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer";
import moment from "moment";

const HomeFeed = () => {
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [friendsWorkouts, setFriendsWorkouts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchFriendsWorkouts = async () => {
    try {
      const response = await axios.get(
        API_URL + "api/workouts/friends/workouts/upcoming",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setFriendsWorkouts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching friends' workouts", error);
    }
  };

  useEffect(() => {
    fetchWorkouts(null, user, setMyWorkouts);
    fetchFriendsWorkouts();
  }, []);

  return (
    <div className="theme-bg min-h-screen flex flex-col">
      <Navigation />
      <Container sx={{ mt: 10, mb: 3, flex: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              My Upcoming Workouts
            </Typography>
            {myWorkouts.map((workout) => (
              <Card key={workout.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {workout.name}
                  </Typography>
                  <Typography variant="body2">{workout.type}</Typography>
                  <Typography variant="body2">{workout.description}</Typography>
                  <Typography variant="body2">
                    Date: {moment(workout.date).format("YYYY-MM-DD HH:mm")}
                  </Typography>
                  {workout.type === "Running" && (
                    <>
                      <Typography variant="body2">
                        Distance: {workout.distance}
                      </Typography>
                      <Typography variant="body2">
                        Intensity Zone: {workout.intensityZone}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Friends' Upcoming Workouts
            </Typography>
            {friendsWorkouts.map((workout) => (
              <Card key={workout.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {workout.name} - {workout.user.firstName} {workout.user.lastName}
                  </Typography>
                  <Typography variant="body2">{workout.type}</Typography>
                  <Typography variant="body2">{workout.description}</Typography>
                  <Typography variant="body2">
                    Date: {moment(workout.date).format("YYYY-MM-DD HH:mm")}
                  </Typography>
                  {workout.type === "Running" && (
                    <>
                      <Typography variant="body2">
                        Distance: {workout.distance}
                      </Typography>
                      <Typography variant="body2">
                        Intensity Zone: {workout.intensityZone}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default HomeFeed;
