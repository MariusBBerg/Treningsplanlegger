package com.treningsplanlegging.treningsplanlegging.mappers;

import org.springframework.stereotype.Component;

import com.treningsplanlegging.treningsplanlegging.dto.WorkoutDto;
import com.treningsplanlegging.treningsplanlegging.entity.Workout;

@Component
public class WorkoutMapper {

    public WorkoutDto toWorkoutDto(Workout workout) {
        WorkoutDto workoutDto = new WorkoutDto();
        workoutDto.setId(workout.getId());
        workoutDto.setDate(workout.getDate());
        workoutDto.setDescription(workout.getDescription());
        workoutDto.setType(workout.getType());
        workoutDto.setUserLogin(workout.getUser().getLogin());
        workoutDto.setName(workout.getName());
        workoutDto.setDistance(workout.getDistance());
        workoutDto.setDurationSeconds(workout.getDurationSeconds());
        workoutDto.setIntensityZone(workout.getIntensityZone());
        
        return workoutDto;
    }

    public Workout toWorkout(WorkoutDto workoutDto) {
        Workout workout = new Workout();
        workout.setId(workoutDto.getId());
        workout.setDate(workoutDto.getDate());
        workout.setDescription(workoutDto.getDescription());
        workout.setType(workoutDto.getType());
        // You need to fetch the User entity from the database using the login
        // workout.setUser(userRepository.findByLogin(workoutDto.getUserLogin()).orElse(null));
        workout.setName(workoutDto.getName());
        workout.setDistance(workoutDto.getDistance());
        workout.setDurationSeconds(workoutDto.getDurationSeconds());
        workout.setIntensityZone(workoutDto.getIntensityZone());
        
        return workout;
    }
}
