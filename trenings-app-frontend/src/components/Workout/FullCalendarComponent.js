import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

const FullCalendarComponent = ({
  setDate,
  setTime,
  setOpenAddWorkoutModal,
  setOpenViewWorkoutModal,
  workouts,
  setSelectedWorkout,

}) => {
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);

  useEffect(() => {

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

    const calendarInstance = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      events: events,
      weekends: true,
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
      dateClick: handleDateClick,
      eventClick: handleEventClick,
      firstDay: 1,
    });

    calendarInstance.render();
    setCalendar(calendarInstance);

    return () => {
      calendarInstance.destroy();
    };
  }, [workouts]);

  const handleViewChange = (viewName) => {
    if (calendar) {
      calendar.changeView(viewName);
    }
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
    const tempWorkout = workouts.find(workout => workout.id === Number(info.event.id));
    setSelectedWorkout(tempWorkout);
    setOpenViewWorkoutModal(true);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleViewChange("dayGridMonth")}>
          Monthly
        </button>
        <button onClick={() => handleViewChange("timeGridWeek")}>Weekly</button>
        <button onClick={() => handleViewChange("timeGridDay")}>Daily</button>
      </div>
      <div ref={calendarRef}></div>
    </div>
  );
};

export default FullCalendarComponent;
