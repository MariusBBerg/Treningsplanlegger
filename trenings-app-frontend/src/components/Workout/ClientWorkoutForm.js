import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Whisper, Popover, Badge } from 'rsuite';
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

  const calendarEvents = workouts.map((workout) => {
    const startMoment = moment(workout.date);
    const endMoment = workout.durationSeconds
      ? startMoment.clone().add(workout.durationSeconds, "seconds")
      : startMoment.clone().add(1, "hours");

    return {
      start: startMoment.toDate(),
      end: endMoment.toDate(),
      title: workout.description,
      type: workout.type,
      duration: workout.durationSeconds ? workout.durationSeconds / 60 : 60,
      distance: workout.distance,
      intensity: workout.intensityZone,
      notes: workout.description,
    };
  });

  const handleRangeChange = (range) => {
    let startOfWeek;

    if (Array.isArray(range)) {
      startOfWeek = moment(range[0]).startOf("isoWeek");
    } else if (range.start && range.end) {
      startOfWeek = moment(range.start).startOf("isoWeek");
    } else {
      startOfWeek = moment(range).startOf("isoWeek");
    }

    setCurrentWeek(startOfWeek.isoWeek());
  };

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
      
      <label htmlFor="date">Dato:</label>
      <Calendar
        defaultDate={new Date()}
        onRangeChange={handleRangeChange}
        defaultView="week"
        events={calendarEvents}
        style={{ height: "500px" }}
        selectable={true}
        onSelectSlot={({ start }) => {
          if (moment(start).format("HH:mm") === "00:00") {
            const formattedDate = moment(start).format("YYYY-MM-DD");
            const defaultTime = "12:00";
            setDate(formattedDate);
            setTime(defaultTime);
          } else {
            const formattedDate = moment(start).format("YYYY-MM-DD");
            const formattedTime = moment(start).format("HH:mm");
            setDate(formattedDate);
            setTime(formattedTime);
          }
          setOpenAddWorkoutModal(true);
        }}
        onSelectEvent={(event) => {
          setSelectedWorkout(event);
          setOpenViewWorkoutModal(true);
        }}
        scrollToTime={moment().set({ h: 9, m: 0 }).toDate()}
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
                </Select>
              </div>
              {type === "Løping" && (
                <>
                  <div className="max-w-md py-2">
                    <Label htmlFor="distance">Distanse (km):</Label>
                    <input
                      type="number"
                      id="distance"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </div>
                  <div className="max-w-md py-2">
                    <Label htmlFor="duration">Varighet (min):</Label>
                    <input
                      type="number"
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="max-w-md py-2">
                    <Label htmlFor="zone">Intensitetssone:</Label>
                    <input
                      type="number"
                      id="zone"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="max-w-md py-2">
                <Label htmlFor="description">Beskrivelse:</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClientWorkoutForm;
