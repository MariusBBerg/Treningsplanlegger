package com.treningsplanlegging.treningsplanlegging.controller;

import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.dto.WorkoutDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.entity.Workout;
import com.treningsplanlegging.treningsplanlegging.mappers.WorkoutMapper;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.repository.WorkoutRepository;
import com.treningsplanlegging.treningsplanlegging.service.WorkoutService;
import com.treningsplanlegging.treningsplanlegging.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserRepository userRepository;
    private final UserService userService; 
    private final WorkoutRepository workoutRepository;
    private final WorkoutMapper workoutMapper;

    @Autowired
    public WorkoutController(WorkoutService workoutService, UserRepository userRepository, UserService userService, WorkoutRepository workoutRepository, WorkoutMapper workoutMapper) {
        this.workoutService = workoutService;
        this.userRepository = userRepository;
        this.userService = userService; 
        this.workoutRepository = workoutRepository;
        this.workoutMapper = workoutMapper;
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

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutDto> updateWorkout(@PathVariable Long id, @RequestBody WorkoutDto workoutDto, @RequestParam String clientLogin) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        User client = userRepository.findByLogin(clientLogin).orElseThrow(() -> new RuntimeException("User not found with username: " + clientLogin));
        if(!user.equals(client.getCoach()) && !user.equals(client)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Workout currentWorkout = workoutService.findById(id);
        currentWorkout.setType(workoutDto.getType());
        currentWorkout.setDescription(workoutDto.getDescription());
        currentWorkout.setDate(workoutDto.getDate());
        currentWorkout.setName(workoutDto.getName());
        if ("Running".equals(workoutDto.getType()) && workoutDto.getDistance() != null && workoutDto.getDurationSeconds() != null && workoutDto.getDistance() > 0 && workoutDto.getDurationSeconds() > 0 ) {
            currentWorkout.setDistance(workoutDto.getDistance());
            currentWorkout.setDurationSeconds(workoutDto.getDurationSeconds());
            currentWorkout.setIntensityZone(workoutDto.getIntensityZone());
        }

        workoutRepository.save(currentWorkout);
        return ResponseEntity.ok(workoutDto);

    }

    @DeleteMapping("/{id}")
public ResponseEntity<?> deleteWorkout(@PathVariable Long id, @RequestParam String clientLogin) {
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

    Workout workout = workoutService.findById(id);
    if (workout == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    workoutService.deleteWorkout(id);
    return ResponseEntity.ok().build();
}
@GetMapping("/friends/workouts/upcoming")
public ResponseEntity<List<WorkoutDto>> getFriends7UpcomingWorkouts() {
    // Get the current user
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String login = authentication.getName();
    User currentUser = userRepository.findByLogin(login)
            .orElseThrow(() -> new RuntimeException("User not found with username: " + login));

    // Get the top 7 upcoming workouts of each friend
    List<WorkoutDto> allUpcomingWorkouts = new ArrayList<>();
    for (User friend : currentUser.getFriends()) {
        Date currentDate = java.sql.Date.valueOf(LocalDate.now());
        List<Workout> friendWorkouts = workoutRepository.findTop7ByUserAndDateAfterOrderByDateAsc(friend, currentDate);
        List<WorkoutDto> friendWorkoutDtos = friendWorkouts.stream()
            .map(workoutMapper::toWorkoutDto)
            .collect(Collectors.toList());
        allUpcomingWorkouts.addAll(friendWorkoutDtos);
    }

    // Sort all workouts by date and limit to 7
    List<WorkoutDto> upcomingWorkouts = allUpcomingWorkouts.stream()
        .sorted(Comparator.comparing(WorkoutDto::getDate))
        .limit(7)
        .collect(Collectors.toList());

    return ResponseEntity.ok(upcomingWorkouts);
}


}
