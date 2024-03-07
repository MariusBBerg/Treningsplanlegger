// src/main/java/com/treningsplanlegging/treningsplanlegging/service/WorkoutService.java
package com.treningsplanlegging.treningsplanlegging.service;

import java.time.Duration;

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
        workout.setUser(user);
        workout.setType(workoutDto.getType());
        workout.setDescription(workoutDto.getDescription());
        workout.setDate(workoutDto.getDate());
        
        if ("Løping".equals(workoutDto.getType()) && workoutDto.getDistance() != null && workoutDto.getDurationSeconds() != null && workoutDto.getDistance() > 0 && workoutDto.getDurationSeconds() > 0 && workoutDto.getIntensityZone() >0) {
            workout.setDistance(workoutDto.getDistance());
            workout.setDurationSeconds(workoutDto.getDurationSeconds());
            workout.setIntensityZone(workoutDto.getIntensityZone());
        }
    
        return workoutRepository.save(workout);
    }
}
