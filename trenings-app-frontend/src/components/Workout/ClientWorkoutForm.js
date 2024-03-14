import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from "moment";
import "moment/locale/nb"; 
import { Button, Modal, Label, Select } from "flowbite-react";
import WeeklyRunningVolume from "./WeeklyRunningVolume.js"; 
import fetchWorkouts from "./Hooks/workoutApi.js"; 

moment.locale("nb");

const ClientWorkoutForm = () => {
  const [date, setDate] = useState("");
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
  
  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/workouts/clients`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setClients(response.data);
    } catch (error) {
      console.error("An error occurred while fetching clients", error);
    }
  };

  useEffect(() => {
    fetchWorkouts(client,user,setWorkouts); 
  }, [client]); 

  useEffect(() => {
    fetchClients();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      console.error("User is not authenticated.");
      return;
    }

    const durationInSeconds =
      type === "Løping" ? parseInt(duration, 10) * 60 : undefined;

    const dateTime = moment(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm"
    ).toISOString();

    const workoutData = {
      date: dateTime,
      description,
      type,
      distance: type === "Løping" ? parseFloat(distance) : undefined,
      durationSeconds: durationInSeconds,
      intensityZone: type === "Løping" ? parseInt(zone, 10) : undefined,
    };
    const clientParsed = client ? JSON.parse(client) : user;
    console.log("set " + clientParsed.login);
    try {
      await axios.post("http://localhost:8080/api/workouts", workoutData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          clientLogin: clientParsed.login,
        },
      });
      setOpenAddWorkoutModal(false);
      fetchWorkouts();
    } catch (error) {
      console.error("An error occurred while submitting the workout", error);
    }
  };

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm");
  };

  const handleDateClick = (info) => {
    console.log('Clicked on date:', info.dateStr);
    // Perform any action you want here
    const start = moment(info.date).format("YYYY-MM-DD");
    const defaultTime = "12:00";
    setDate(start);
    setTime(defaultTime);
    setOpenAddWorkoutModal(true);
  };

  const handleEventClick = (info) => {
    console.log('Clicked on event:', info.event);
    setSelectedWorkout(info.event);
    setOpenViewWorkoutModal(true);
  };

  const events = workouts.map((workout) => {
    const start = moment(workout.date).format('YYYY-MM-DDTHH:mm:ss');
    const end = moment(workout.date)
      .add(workout.durationSeconds || 3600, 'seconds')
      .format('YYYY-MM-DDTHH:mm:ss');
  
    return {
      id: workout.id,
      title: workout.description,
      start: start,
      end: end,
      // Other event properties...
    };
  });

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-md py-2">
          <div className="mb-2">
            <Label htmlFor="client">Klient:</Label>
          </div>
          <Select
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            <option value="">Velg en klient</option>
            {clients.map((client) => (
              <option key={client.id} value={JSON.stringify(client)}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </Select>
        </div>
      </div>
      
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        dateClick={handleDateClick} // Add date click handler
        eventClick={handleEventClick} // Add event click handler
        
      />

<Modal
        show={openAddWorkoutModal}
        onClose={() => setOpenAddWorkoutModal(false)}
      >
        <Modal.Header>Add Workout</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="max-w-md py-2">
                <div className="mb-2 block">
                  <Label htmlFor="type">Type:</Label>
                </div>
                <Select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Velg en type</option>
                  <option value="Løping">Løping</option>
                  <option value="Styrke">Styrke</option>
                  <option value="Cardio">Cardio</option>
                </Select>
              </div>
              {type === "Løping" && (
                <>
                  <div className="max-w-sm py-2">
                    <label
                      htmlFor="distance"
                      className="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Distanse (km):
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
                      Varighet (minutter):
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
                  Beskrivelse:
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
                  Dato:
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
                  Tid:
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
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenAddWorkoutModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={openViewWorkoutModal}
        onClose={() => setOpenViewWorkoutModal(false)}
      >
        <Modal.Body>
          {selectedWorkout && (
            console.log(selectedWorkout),
            <div className="space-y-6">
              <div className="max-w-md py-2">
                <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  {selectedWorkout.title}
                </h2>
                <p className="text-sm text-gray-900 dark:text-white">
                  Dato: {formatDate(selectedWorkout.start)}
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  Type: {selectedWorkout.type}
                </p>
                {selectedWorkout.type === "Løping" && (
                  <>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Varighet: {selectedWorkout.duration} minutter
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Distanse: {selectedWorkout.distance} km
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Intensitet: Sone {selectedWorkout.intensity}
                    </p>
                  </>
                )}
                <p className="text-sm text-gray-900 dark:text-white">
                  Notater: {selectedWorkout.description}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenViewWorkoutModal(false)}>
            Close
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setOpenViewWorkoutModal(false);
            }}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
      <WeeklyRunningVolume client={user} week={currentWeek} />

      
    </div>
  );
};

export default ClientWorkoutForm;
