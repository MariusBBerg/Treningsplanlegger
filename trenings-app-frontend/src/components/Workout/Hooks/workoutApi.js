import axios from "axios";

const fetchWorkouts = async (client, user, setWorkouts) => {
  const clientParsed = client ? JSON.parse(client) : user;
  console.log("fetch " + clientParsed.login);

  try {
    const response = await axios.get(
      `http://localhost:8080/api/workouts/user/${clientParsed.login}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setWorkouts(response.data); // Assume response.data is an array of workouts
  } catch (error) {
    console.error("An error occurred while fetching workouts", error);
  }
};

export default fetchWorkouts;
