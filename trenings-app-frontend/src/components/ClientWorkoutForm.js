import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar"; // Importer Calendar
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Importer CSS
import { Button, Modal, Label, Select } from "flowbite-react";

import "moment/locale/nb"; // Importer norsk lokaliseringsfil

import WeeklyRunningVolume from "./WeeklyRunningVolume.js"; // Importer komponenten

moment.locale("nb");
const localizer = momentLocalizer(moment); // or globalizeLocalizer

const ClientWorkoutForm = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [distance, setDistance] = useState(""); // Bare relevant for løping
  const [duration, setDuration] = useState(""); // Bare relevant for løping
  const [zone, setZone] = useState(""); // Bare relevant for løping
  const [currentWeek, setCurrentWeek] = useState(moment().isoWeek()); // Legg til denne tilstanden

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  console.log(user);

  const [client, setClient] = useState(""); // Legg til denne tilstanden for å holde styr på valgt klient
  const [clients, setClients] = useState([]); // Add this line at the top of your component

  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null); // Legg til denne linjen

  const fetchWorkouts = async () => {
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
      setWorkouts(response.data); // Anta at response.data er en array av treningsøkter
    } catch (error) {
      console.error("Det oppstod en feil ved henting av treningsøkter", error);
    }
  };

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
      setClients(response.data); // Anta at response.data er en array av klienter
    } catch (error) {
      console.error("Det oppstod en feil ved henting av klienter", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    fetchClients(); // Hent klienter når komponenten blir rendret
  }, [client]);

  const [openAddWorkoutModal, setOpenAddWorkoutModal] = useState(false);
  const [openViewWorkoutModal, setOpenViewWorkoutModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sjekk at user og user.token eksisterer
    if (!user || !user.token) {
      console.error("Bruker er ikke autentisert.");
      // Legg til logikk for å håndtere ikke-autentiserte brukere, f.eks. omdiriger til login
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
      durationSeconds: durationInSeconds, // Bruk den konverterte varigheten i sekunder
      intensityZone: type === "Løping" ? parseInt(zone, 10) : undefined,
    };
    const clientParsed = client ? JSON.parse(client) : user;
    console.log("set " + clientParsed.login);
    try {
      await axios.post("http://localhost:8080/api/workouts", workoutData, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Bruker token fra auth context
        },
        params: {
          clientLogin: clientParsed.login,
        },
      });
      //navigate("/dashboard"); // Naviger brukeren til dashboard etter suksessfull innsending
      setOpenAddWorkoutModal(false);
      fetchWorkouts();
    } catch (error) {
      console.error("Det oppstod en feil ved innsending av treningsøkt", error);
    }
  };

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm");
  };

  const calendarEvents = workouts.map((workout) => {
    // Konverter startdatoen til et moment-objekt for enklere håndtering.
    const startMoment = moment(workout.date);

    // Bestem sluttidspunktet ved å legge til `durationSeconds` eller, som standard, 3600 sekunder (1 time).
    const endMoment = workout.durationSeconds
      ? startMoment.clone().add(workout.durationSeconds, "seconds")
      : startMoment.clone().add(1, "hours"); // Legger til 1 time som standard hvis `durationSeconds` er null.

    return {
      start: startMoment.toDate(),
      end: endMoment.toDate(),
      title: workout.description,
      type: workout.type,
      duration: workout.durationSeconds ? workout.durationSeconds / 60 : 60, // Konverter sekunder til minutter eller bruk 60 minutter som standard.
      distance: workout.distance,
      intensity: workout.intensityZone,
      notes: workout.description,
    };
  });

  const handleRangeChange = (range) => {
    let startOfWeek;

    // Sjekk om 'range' er et array (som det ofte er for ukevisning/månedsvisning)
    if (Array.isArray(range)) {
      startOfWeek = moment(range[0]).startOf("isoWeek");
    } else if (range.start && range.end) {
      // For objekter som definerer et start- og sluttpunkt
      startOfWeek = moment(range.start).startOf("isoWeek");
    } else {
      // For enkeltstående datoobjekter (fallback)
      startOfWeek = moment(range).startOf("isoWeek");
    }

    // Oppdater tilstanden med ukenummeret fra starten av uken
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
        localizer={localizer}
        defaultDate={new Date()}
        onRangeChange={handleRangeChange}
        defaultView="week"
        events={calendarEvents} // Bruk den formaterte listen av treningsøkter her
        style={{ height: "500px" }}
        selectable={true}
        onSelectSlot={({ start }) => {
          if (moment(start).format("HH:mm") === "00:00") {
            // Sett standardtid til 12:00 midtpå dagen
            const formattedDate = moment(start).format("YYYY-MM-DD");
            const defaultTime = "12:00";
            setDate(formattedDate);
            setTime(defaultTime);
          } else {
            // Hvis en spesifikk tid allerede er valgt (for eksempel i dags- eller ukesvisning), bruk den valgte tiden
            const formattedDate = moment(start).format("YYYY-MM-DD");
            const formattedTime = moment(start).format("HH:mm");
            setDate(formattedDate);
            setTime(formattedTime);
          }
          setOpenAddWorkoutModal(true);
        }}
        onSelectEvent={(event) => {
          setSelectedWorkout(event);
          setOpenViewWorkoutModal(true); // Åpne modalen for å vise en eksisterende treningsøkt
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
        </Modal.Footer>
      </Modal>
      <WeeklyRunningVolume
        client={client ? JSON.parse(client) : user}
        week={currentWeek}
      />
    </div>
  );
};

export default ClientWorkoutForm;
