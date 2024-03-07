package com.treningsplanlegging.treningsplanlegging.controller;

import com.treningsplanlegging.treningsplanlegging.dto.WorkoutDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.entity.Workout;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserRepository userRepository;

    @Autowired
    public WorkoutController(WorkoutService workoutService, UserRepository userRepository) {
        this.workoutService = workoutService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Workout> addWorkout(@RequestBody WorkoutDto workoutDto) {
        System.out.println(workoutDto.getDistance() + " " + workoutDto.getDurationSeconds() + " " + workoutDto.getType() + " " + workoutDto.getDescription() + " " + workoutDto.getDate());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName(); // Henter brukernavn fra autentiseringsobjektet
        User user = userRepository.findByLogin(login)
                                  .orElseThrow(() -> new RuntimeException("User not found with username: " + login));

        Workout newWorkout = workoutService.addWorkout(workoutDto, user);
        return ResponseEntity.ok(newWorkout);
    }
}
