import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { exportToGoogleCalendar } from "./Hooks/workoutApi";

const FullCalendarComponent = ({
  setDate,
  setTime,
  setOpenAddWorkoutModal,
  setOpenViewWorkoutModal,
  workouts,
  setSelectedWorkout,
  setCurrentWeek,

}) => {
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');

  

   


  

  useEffect(() => {

    const events = workouts.map((workout) => {
    
      const start = moment(workout.date).format('YYYY-MM-DDTHH:mm:ss');
      const end = moment(workout.date)
        .add(workout.durationSeconds || 3600, 'seconds')
        .format('YYYY-MM-DDTHH:mm:ss');
      return {
        id: workout.id,
        title: workout.name,
        start: start,
        end: end,
        
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
      datesSet: handleDatesSet,

    });

    calendarInstance.render();
    setCalendar(calendarInstance);

    return () => {
      calendarInstance.destroy();
    };
  }, [workouts]);

  
useEffect(() => {
  if (calendar) {
    calendar.setOption('datesSet', handleDatesSet);
  }
}, [currentView]);

  const handleViewChange = (viewName) => {
    if (calendar) {
      calendar.changeView(viewName);
      setCurrentView(viewName);
    }
  };

  const handleDateClick = (info) => {
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
  const handleDatesSet = (info) => {
    if (currentView !== "timeGridWeek") {
      setCurrentWeek(moment().isoWeek());
    } else {
      setCurrentWeek(moment(info.start).isoWeek());
    }  };

  return (
    <div>
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end', // Aligns items to the right
      marginBottom: '10px' // Adds some space below the buttons
    }}>
      <button 
        onClick={() => handleViewChange("dayGridMonth")}
        className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mr-2 ${currentView === 'dayGridMonth' ? 'bg-slate-900' : ''}`}
      >
        Monthly
      </button>
      <button 
        onClick={() => handleViewChange("timeGridWeek")}
        className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mr-2 ${currentView === 'timeGridWeek' ? 'bg-slate-900' : ''}`}
      >
        Weekly
      </button>

      <button 
        onClick={() => handleViewChange("timeGridDay")}
        className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded ${currentView === 'timeGridDay' ? 'bg-slate-900' : ''}`}
        >

      
        Daily
      </button>
    </div>
    <div ref={calendarRef}></div>
  </div>
  );
};

export default FullCalendarComponent;
