import axios from "axios";
import API_URL from "../../services/apiService";
const fetchWorkouts = async (client, user, setWorkouts) => {
  const clientParsed = client ? JSON.parse(client) : user;

  try {
    const response = await axios.get(
      API_URL + `api/workouts/user/${clientParsed.login}`,
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



const handleSubmitEdit = async (e, client, user, selectedWorkout, setOpenEditWorkoutModal,setWorkouts, workoutData) => {
  e.preventDefault();
  const clientParsed = client ? JSON.parse(client) : user;


  if (!user || !user.token) {
    console.error("Bruker er ikke autentisert.");
    return;
  }

  try {
    await axios.put(
      API_URL + `api/workouts/${selectedWorkout.id}`, 
      workoutData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`, 
        },
        params: {
          clientLogin: clientParsed.login,
        },
      }
    );
    setOpenEditWorkoutModal(false);
    fetchWorkouts(client, user, setWorkouts);
  } catch (error) {
    console.error("Det oppstod en feil ved innsending av treningsøkt", error);
  }
};


const handleSubmit = async (e,client,user,setWorkouts,workoutData,setOpenAddWorkoutModal,) => {
  e.preventDefault();

  // Sjekk at user og user.token eksisterer
  if (!user || !user.token) {
    console.error("Bruker er ikke autentisert.");
    // Legg til logikk for å håndtere ikke-autentiserte brukere, f.eks. omdiriger til login
    return;
  }

  const clientParsed = client ? JSON.parse(client) : user;

  try {
    await axios.post(API_URL + "api/workouts", workoutData, {
      headers: {
        Authorization: `Bearer ${user.token}`, // Bruker token fra auth context
      },
      params: {
        clientLogin: clientParsed.login,
      },
    });
    setOpenAddWorkoutModal(false);
    fetchWorkouts(client, user, setWorkouts);
  } catch (error) {
    console.error("Det oppstod en feil ved innsending av treningsøkt", error);
  }
};

export { fetchWorkouts, handleSubmitEdit, handleSubmit };




