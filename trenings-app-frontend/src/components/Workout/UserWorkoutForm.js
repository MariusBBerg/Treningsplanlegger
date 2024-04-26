import React, { useState, useEffect } from "react";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Modal, Label, Select } from "flowbite-react";
import FullCalendarComponent from "./FullCalendarComponent.js";
import { Box } from "@mui/material";
import "moment/locale/nb";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import WeeklyRunningVolume from "./WeeklyRunningVolume.js";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { AiOutlineLoading } from "react-icons/ai";

import {
  fetchWorkouts,
  handleSubmitEdit,
  handleSubmit,
  exportToGoogleCalendar,
  deleteWorkout,
} from "./Hooks/workoutApi.js";
import authorizeGoogleOAuth from "../../services/GoogleServices/authorizeGoogleOAuth.js";
import { set } from "date-fns";

moment.locale("nb");

const UserWorkoutForm = () => {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [zone, setZone] = useState("");
  const [currentWeek, setCurrentWeek] = useState(moment().isoWeek());

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(""); // // Valgt treningsøkt i kalenderen

  const [exportingWorkout, setExportingWorkout] = useState(false); //for spinner/loader
  const [workoutExported, setWorkoutExported] = useState(false); //for å erstatte knap når ferdig'
  const [workoutNotExported, setWorkoutNotExported] = useState(false); //for å vise feilmelding

  const [exportingWeeklyWorkout, setExportingWeeklyWorkout] = useState(false);
  const [weeklyWorkoutExported, setWeeklyWorkoutExported] = useState(false);
  const [weeklyWorkoutNotExported, setWeeklyWorkoutNotExported] =
    useState(false);

  useEffect(() => {
    fetchWorkouts(null, user, setWorkouts);
  }, [user.login]); //ENDRES HVER GANG BRUKER-OBJEKTET

  const [openAddWorkoutModal, setOpenAddWorkoutModal] = useState(false);
  const [openViewWorkoutModal, setOpenViewWorkoutModal] = useState(false);
  const [openEditWorkoutModal, setOpenEditWorkoutModal] = useState(false);

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm");
  };

  useEffect(() => {
    if (openAddWorkoutModal) {
      // Reset standardverdiene når modalen for å legge til ny trening åpnes
      setTime("12:00"); // Standardverdien for tid
      setName("");
      setDescription("");
      setType("");
      setDistance("");
      setDuration("");
      setZone("");
    }
  }, [openAddWorkoutModal]);

  useEffect(() => {
    if (openEditWorkoutModal && selectedWorkout) {
      // Sett feltene basert på verdiene i valgt treningsøkt
      setDate(moment(selectedWorkout.date).format("YYYY-MM-DD"));
      setTime(moment(selectedWorkout.date).format("HH:mm"));
      setName(selectedWorkout.name || "");
      setDescription(selectedWorkout.description || "");
      setType(selectedWorkout.type || "");
      setDistance(selectedWorkout.distance || "");
      setDuration(selectedWorkout.duration || "");
      setZone(selectedWorkout.intensityZone || "");
    }
  }, [selectedWorkout, openEditWorkoutModal]);

  useEffect(() => {
    setExportingWorkout(false);
    setWorkoutExported(false);
    setWorkoutNotExported(false);
  }, [openViewWorkoutModal]);

  useEffect(() => {
    setExportingWeeklyWorkout(false);
    setWeeklyWorkoutExported(false);
    setWeeklyWorkoutNotExported(false);
  }, [currentWeek]);

  const exportWeekToGoogleCalendar = () => {
    const weekWorkouts = workouts.filter(
      (workout) => moment(workout.date).isoWeek() === currentWeek
    );

    weekWorkouts.forEach((workout) => {
      exportToGoogleCalendar(
        workout,
        user,
        setExportingWeeklyWorkout,
        setWeeklyWorkoutExported,
        setWeeklyWorkoutNotExported
      );
    });
  };

  return (
    <div>
      <label htmlFor="date">Date:</label>
      <FullCalendarComponent
        workouts={workouts}
        setDate={setDate}
        setTime={setTime}
        setOpenAddWorkoutModal={setOpenAddWorkoutModal}
        setOpenViewWorkoutModal={setOpenViewWorkoutModal}
        setSelectedWorkout={setSelectedWorkout}
        setCurrentWeek={setCurrentWeek}
      />

      <Modal
        show={openAddWorkoutModal}
        onClose={() => setOpenAddWorkoutModal(false)}
      >
        <Modal.Header>Add Workout</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const durationInSeconds =
                  type === "Løping" ? parseInt(duration, 10) * 60 : undefined;

                const dateTime = moment(
                  `${date} ${time}`,
                  "YYYY-MM-DD HH:mm"
                ).toISOString();

                const workoutData = {
                  date: dateTime,
                  name,
                  description,
                  type,
                  distance:
                    type === "Løping" ? parseFloat(distance) : undefined,
                  durationSeconds: durationInSeconds,
                  intensityZone:
                    type === "Løping" ? parseInt(zone, 10) : undefined,
                };

                handleSubmit(
                  e,
                  null,
                  user,
                  setWorkouts,
                  workoutData,
                  setOpenAddWorkoutModal
                );
              }}
            >
              {" "}
              <div className="max-w-md py-2">
                <div className="mb-2 block">
                  <Label htmlFor="type">Type:</Label>
                </div>
                <Select
                  id="type"
                  value={type}
                  required
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Choose a type</option>
                  <option value="Løping">Running</option>
                  <option value="Styrke">Strength</option>
                  <option value="Cardio">General Cardio</option>
                </Select>
                <div className="max-w-sm py-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    required
                    id="distance"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              {type === "Løping" && (
                <>
                  <div className="max-w-sm py-2">
                    <label
                      htmlFor="distance"
                      className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Distance (km):
                    </label>
                    <input
                      type="number"
                      id="distance"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </div>
                  <div className="max-w-sm py-2">
                    <label
                      htmlFor="duration"
                      className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Duration (minutes):
                    </label>
                    <input
                      type="number"
                      id="duration"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="max-w-sm py-2">
                    <label
                      htmlFor="zone"
                      className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Choose Zone
                    </label>
                    <Select
                      id="zone"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                    >
                      <option value="">Choose a zone</option>
                      <option value="1">Zone 1</option>
                      <option value="2">Zone 2</option>
                      <option value="3">Zone 3</option>
                      <option value="4">Zone 4</option>
                      <option value="5">Zone 5</option>
                    </Select>
                  </div>
                </>
              )}
              <div className="max-w-sm py-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="max-w-sm py-2">
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                >
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="max-w-sm py-2">
                <label
                  htmlFor="time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Time:
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setTime(e.target.value)} // Antar at du har en setTime-funksjon i din useState hooks
                />
              </div>
              <Button type="submit">Add Workout</Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openViewWorkoutModal}
        onClose={() => setOpenViewWorkoutModal(false)}
      >
        <IconButton
          aria-label="close"
          onClick={() => setOpenViewWorkoutModal(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Modal.Body>
          {selectedWorkout && (
            <div className="space-y-6">
              <div className="max-w-md py-2">
                <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  {selectedWorkout.name}
                </h2>
                <p className="text-sm text-gray-900 dark:text-white">
                  Dato: {formatDate(selectedWorkout.date)}
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  Type: {selectedWorkout.type}
                </p>
                {selectedWorkout.type === "Løping" && (
                  <>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Duration: {selectedWorkout.duration} minutes
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Distance: {selectedWorkout.distance} km
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Intensity: Zone {selectedWorkout.intensityZone}
                    </p>
                  </>
                )}
                <p className="text-sm text-gray-900 dark:text-white">
                  Description: {selectedWorkout.description}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="gray"
            onClick={() => {
              setOpenViewWorkoutModal(false);
              setOpenEditWorkoutModal(true);
            }}
          >
            Edit
          </Button>
          {exportingWorkout ? (
            <CircularProgress />
          ) : workoutExported ? (
            <Alert severity="success">Workout exported successfully!</Alert>
          ) : workoutNotExported ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to export workout
            </Alert>
          ) : (
            <Button
              color="blue"
              onClick={() => {
                if (selectedWorkout) {
                  exportToGoogleCalendar(
                    selectedWorkout,
                    user,
                    setExportingWorkout,
                    setWorkoutExported,
                    setWorkoutNotExported
                  ); // Kall eksportfunksjonen når knappen klikkes
                }
              }}
            >
              Export to Google Calendar
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={openEditWorkoutModal}
        onClose={() => setOpenEditWorkoutModal(false)}
      >
        <Modal.Header>Edit Workout</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const durationInSeconds =
                  type === "Løping" ? parseInt(duration, 10) * 60 : undefined;

                const dateTime = moment(
                  `${date} ${time}`,
                  "YYYY-MM-DD HH:mm"
                ).toISOString();

                const workoutData = {
                  date: dateTime,
                  name,
                  description,
                  type,
                  distance:
                    type === "Løping" ? parseFloat(distance) : undefined,
                  durationSeconds: durationInSeconds, // Bruk den konverterte varigheten i sekunder
                  intensityZone:
                    type === "Løping" ? parseInt(zone, 10) : undefined,
                };
                handleSubmitEdit(
                  e,
                  null,
                  user,
                  selectedWorkout,
                  setOpenEditWorkoutModal,
                  setWorkouts,
                  workoutData
                );
              }}
            >
              {" "}
              <div className="max-w-md py-2">
                <div className="mb-2 block">
                  <Label htmlFor="type">Type:</Label>
                </div>
                <Select
                  id="type"
                  defaultValue={selectedWorkout.type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Choose a type</option>
                  <option value="Løping">Running</option>
                  <option value="Styrke">Strength</option>
                  <option value="Cardio">General Cardio</option>
                </Select>
                <div className="max-w-sm py-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    required
                    id="distance"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              {type === "Løping" && (
                <>
                  <div className="max-w-sm py-2">
                    <label
                      htmlFor="distance"
                      className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Distance (km):
                    </label>
                    <input
                      type="number"
                      id="distance"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </div>
                  <div className="max-w-sm py-2">
                    <label
                      htmlFor="duration"
                      className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Duration (minutes):
                    </label>
                    <input
                      type="number"
                      id="duration"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="max-w-sm py-2">
                    <label
                      htmlFor="zone"
                      className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Choose Zone
                    </label>
                    <Select
                      id="zone"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                    >
                      <option value="">Choose a zone</option>
                      <option value="1">Zone 1</option>
                      <option value="2">Zone 2</option>
                      <option value="3">Zone 3</option>
                      <option value="4">Zone 4</option>
                      <option value="5">Zone 5</option>
                    </Select>
                  </div>
                </>
              )}
              <div className="max-w-sm py-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="max-w-sm py-2">
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                >
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="max-w-sm py-2">
                <label
                  htmlFor="time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Time:
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setTime(e.target.value)} // Antar at du har en setTime-funksjon i din useState hooks
                />
              </div>
              <Button type="submit">Submit Change</Button>
            </form>
            <Button
              color="red"
              onClick={() => {
                if (selectedWorkout) {
                  deleteWorkout(
                    selectedWorkout.id,
                    null,
                    user,
                    setOpenEditWorkoutModal,
                    setWorkouts
                  );
                }
              }}
            >
              Delete Workout
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        {exportingWeeklyWorkout ? (
          <Button
            size="md"
            isProcessing
            processingSpinner={
              <AiOutlineLoading className="h-6 w-6 animate-spin" />
            }
          >
            Export Selected Week to Google Calendar
          </Button>
        ) : weeklyWorkoutExported ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Workouts exported successfully!
          </Alert>
        ) : weeklyWorkoutNotExported ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to export workouts
          </Alert>
        ) : user.isGoogleAuthenticated ? (
          <Button onClick={() => exportWeekToGoogleCalendar()}>
            Export Selected Week to Google Calendar
          </Button>
        ) : null}
      </Box>

      <WeeklyRunningVolume
        client={user}
        week={currentWeek}
        workouts={workouts}
      />

      {user && !user.isGoogleAuthenticated && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button onClick={() => authorizeGoogleOAuth()}>Google Auth</Button>
        </Box>
      )}
    </div>
  );
};

export default UserWorkoutForm;
