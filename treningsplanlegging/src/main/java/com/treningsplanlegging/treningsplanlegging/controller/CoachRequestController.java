package com.treningsplanlegging.treningsplanlegging.controller;

import com.treningsplanlegging.treningsplanlegging.entity.CoachRequest;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.service.CoachRequestService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coach-requests")
public class CoachRequestController {

    private final CoachRequestService coachRequestService;
    private final UserRepository userRepository;

    @Autowired
    public CoachRequestController(CoachRequestService coachRequestService, UserRepository userRepository) {
        this.coachRequestService = coachRequestService;
        this.userRepository = userRepository;
    }

    @PostMapping("/user/{requesterId}/request/{requestedId}")
    public ResponseEntity<Void> sendRequest(@PathVariable Long requesterId, @PathVariable Long requestedId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        if (!user.getId().equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        coachRequestService.sendRequest(requesterId, requestedId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request/{requestId}/response")
    public ResponseEntity<Void> respondToRequest(@PathVariable Long requestId, @RequestBody String response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        CoachRequest request = coachRequestService.findById(requestId);
        if (!user.getId().equals(request.getRequested().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        coachRequestService.respondToRequest(requestId, response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/requests")
    public ResponseEntity<List<CoachRequest>> getPendingRequests(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        if (!user.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<CoachRequest> requests = coachRequestService.getPendingRequests(userId);
        System.out.println("testerr" + requests);
        return ResponseEntity.ok(requests);
    }
}
