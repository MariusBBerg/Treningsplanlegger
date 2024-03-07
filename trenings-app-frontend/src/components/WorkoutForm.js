// src/components/WorkoutForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar"; // Importer Calendar
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Importer CSS
import { Button, Modal, Label, Select } from "flowbite-react";

const localizer = momentLocalizer(moment); // or globalizeLocalizer

const WorkoutForm = () => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [distance, setDistance] = useState(""); // Bare relevant for løping
  const [duration, setDuration] = useState(""); // Bare relevant for løping
  const [zone, setZone] = useState(""); // Bare relevant for løping


  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

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

    const workoutData = {
      date: formatDate(date),
      description,
      type,
      distance: type === "Løping" ? parseFloat(distance) : undefined,
      durationSeconds: durationInSeconds, // Bruk den konverterte varigheten i sekunder
      intensityZone: type === "Løping" ? parseInt(zone, 10) : undefined,
    };

    console.log(workoutData);

    try {
      await axios.post("http://localhost:8080/api/workouts", workoutData, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Bruker token fra auth context
        },
      });
      //navigate("/dashboard"); // Naviger brukeren til dashboard etter suksessfull innsending
      setOpenModal(false);
    } catch (error) {
      console.error("Det oppstod en feil ved innsending av treningsøkt", error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  };

  return (
    <div>
      <label htmlFor="date">Dato:</label>
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={[]}
        style={{ height: "500px" }}
        selectable={true}
        onSelectSlot={({ start }) => {
          setDate(start);
          setOpenModal(true);
        }}
      />

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
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
                  <div class="max-w-sm py-2">
                    <label
                      htmlFor="distance"
                      class="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Distanse (km):
                    </label>
                    <input
                      type="number"
                      id="distance"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </div>
                  <div class="max-w-sm py-2">
                    <label
                      htmlFor="duration"
                      class="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                    >
                      Varighet (minutter):
                    </label>
                    <input
                      type="number"
                      id="duration"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div class="max-w-sm py-2">
                    <label
                      htmlFor="zone"
                      class="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
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

              <div class="max-w-sm py-2">
                <label
                  htmlFor="description"
                  class="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                >
                  Beskrivelse:
                </label>
                <textarea
                  id="description"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div class="max-w-sm py-2">
                <label
                  htmlFor="date"
                  class="block mb-2 text-sm font-medium-text-gray-900 dark:text-white"
                >
                  Dato:
                </label>
                <input
                  type="date"
                  id="date"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={formatDate(date)}
                  onChange={(e) => setDate(new Date(e.target.value))}
                />
              </div>

              <Button type="submit">Add Workout</Button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkoutForm;
