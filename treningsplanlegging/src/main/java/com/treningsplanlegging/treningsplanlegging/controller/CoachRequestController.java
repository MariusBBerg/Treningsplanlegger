package com.treningsplanlegging.treningsplanlegging.controller;

import com.treningsplanlegging.treningsplanlegging.dto.CoachRequestDto;
import com.treningsplanlegging.treningsplanlegging.dto.FriendRequestDto;
import com.treningsplanlegging.treningsplanlegging.entity.CoachRequest;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.mappers.UserMapper;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.service.CoachRequestService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coach-requests")
public class CoachRequestController {

    private final CoachRequestService coachRequestService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public CoachRequestController(CoachRequestService coachRequestService, UserRepository userRepository, UserMapper userMapper) {
        this.coachRequestService = coachRequestService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
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
    public ResponseEntity<List<CoachRequestDto>> getPendingRequests(@PathVariable Long userId) {
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

        List<CoachRequestDto> coachRequestDtos = requests.stream()
    .map(coachRequest -> new CoachRequestDto(
        coachRequest.getId(),
        userMapper.toUserDto(coachRequest.getRequester()),
        userMapper.toUserDto(coachRequest.getRequested()),
        coachRequest.getStatus()))
    .collect(Collectors.toList());
        return ResponseEntity.ok(coachRequestDtos);
    }
}
