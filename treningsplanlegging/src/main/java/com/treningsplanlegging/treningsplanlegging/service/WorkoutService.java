// src/main/java/com/treningsplanlegging/treningsplanlegging/service/WorkoutService.java
package com.treningsplanlegging.treningsplanlegging.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.treningsplanlegging.treningsplanlegging.dto.WorkoutDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.entity.Workout;
import com.treningsplanlegging.treningsplanlegging.repository.WorkoutRepository;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;
    


    public Workout addWorkout(WorkoutDto workoutDto, User user) {
        
        
        Workout workout = new Workout();
        workout.setDate(workoutDto.getDate());
        workout.setDescription(workoutDto.getDescription());
        workout.setUser(user); // Koble treningsøkten til brukeren

        return workoutRepository.save(workout);
    }
}
