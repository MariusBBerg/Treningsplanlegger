import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../utils/api_url.js";
import moment from "moment";
import "moment/locale/nb";
import { Button, Modal, Label, Select } from "flowbite-react";
import WeeklyRunningVolume from "./WeeklyRunningVolume.js";
import {
  fetchWorkouts,
  handleSubmitEdit,
  handleSubmit,
  deleteWorkout,
} from "./Hooks/workoutApi.js";

import FullCalendarComponent from "./FullCalendarComponent.js";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

moment.locale("nb");

const ClientWorkoutForm = () => {
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

  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [openAddWorkoutModal, setOpenAddWorkoutModal] = useState(false);
  const [openViewWorkoutModal, setOpenViewWorkoutModal] = useState(false);
  const [openEditWorkoutModal, setOpenEditWorkoutModal] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await axios.get(API_URL + `api/workouts/clients`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error("An error occurred while fetching clients", error);
    }
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
    fetchWorkouts(client, user, setWorkouts);
  }, [client]);

  useEffect(() => {
    fetchClients();
  }, []);

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm");
  };

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

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-md py-2">
          <div className="mb-2">
            <Label htmlFor="client">Client:</Label>
          </div>
          <Select
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            <option value="">Choose a client</option>
            {clients.map((client) => (
              <option key={client.id} value={JSON.stringify(client)}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </Select>
        </div>
      </div>

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
                  type === "Running" ? parseInt(duration, 10) * 60 : undefined;

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
                    type === "Running" ? parseFloat(distance) : undefined,
                  durationSeconds: durationInSeconds,
                  intensityZone:
                    type === "Running" ? parseInt(zone, 10) : undefined,
                };

                handleSubmit(
                  e,
                  client,
                  user,
                  setWorkouts,
                  workoutData,
                  setOpenAddWorkoutModal
                );
              }}
            >
              <div className="max-w-md py-2">
                <div className="mb-2 block">
                  <Label htmlFor="type">Type:</Label>
                </div>
                <Select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Choose a type</option>
                  <option value="Running">Running</option>
                  <option value="Strength">Strength</option>
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
              {type === "Running" && (
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
        <Modal.Body>
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
          {selectedWorkout && (
            <div className="space-y-6">
              <div className="max-w-md py-2">
                <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  {selectedWorkout.name}
                </h2>
                <p className="text-sm text-gray-900 dark:text-white">
                  Date: {formatDate(selectedWorkout.start)}
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  Type: {selectedWorkout.type}
                </p>
                {selectedWorkout.type === "Running" && (
                  <>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Duration: {selectedWorkout.duration} minutes
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Distance: {selectedWorkout.distance} km
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Intensity: Zone {selectedWorkout.intensity}
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
                  type === "Running" ? parseInt(duration, 10) * 60 : undefined;

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
                    type === "Running" ? parseFloat(distance) : undefined,
                  durationSeconds: durationInSeconds, // Bruk den konverterte varigheten i sekunder
                  intensityZone:
                    type === "Running" ? parseInt(zone, 10) : undefined,
                };
                handleSubmitEdit(
                  e,
                  client,
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
                <Select id="type" onChange={(e) => setType(e.target.value)}>
                  <option value="">Choose a type</option>
                  <option value="Running">Running</option>
                  <option value="Strength">Strength</option>
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
              {type === "Running" && (
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
                    client,
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

      <WeeklyRunningVolume
        client={client}
        week={currentWeek}
        workouts={workouts}
      />
    </div>
  );
};

export default ClientWorkoutForm;
