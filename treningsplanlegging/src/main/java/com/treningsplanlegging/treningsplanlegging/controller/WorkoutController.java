package com.treningsplanlegging.treningsplanlegging.controller;

import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.dto.WorkoutDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.entity.Workout;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.service.WorkoutService;
import com.treningsplanlegging.treningsplanlegging.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserRepository userRepository;
    private final UserService userService; // Legg til UserService her

    @Autowired
    public WorkoutController(WorkoutService workoutService, UserRepository userRepository, UserService userService) {
        this.workoutService = workoutService;
        this.userRepository = userRepository;
        this.userService = userService; // Legg til userService her
    }

    @PostMapping
    public ResponseEntity<Workout> addWorkout(@RequestBody WorkoutDto workoutDto, @RequestParam String clientLogin) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        User client = userRepository.findByLogin(clientLogin)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + clientLogin));

        if (!user.equals(client.getCoach()) && !user.equals(client)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Workout newWorkout = workoutService.addWorkout(workoutDto, client);
        return ResponseEntity.ok(newWorkout);
    }

    @GetMapping("/user/{clientLogin}")
    public ResponseEntity<List<Workout>> getAllWorkoutsForAuthenticatedUser(@PathVariable String clientLogin) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        User client = userRepository.findByLogin(clientLogin)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + clientLogin));

        if (!user.equals(client.getCoach()) && !user.equals(client)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Workout> workouts = workoutService.findAllWorkoutsForUser(client.getId());
        return ResponseEntity.ok(workouts);
    }

    @GetMapping("/clients")
    public ResponseEntity<List<UserDto>> getClients() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();

        List<UserDto> clients = userService.getClients(login);
        return ResponseEntity.ok(clients);
    }

}
