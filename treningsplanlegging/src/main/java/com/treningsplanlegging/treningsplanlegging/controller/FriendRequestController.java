package com.treningsplanlegging.treningsplanlegging.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.treningsplanlegging.treningsplanlegging.dto.FriendRequestDto;
import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.entity.FriendRequest;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.mappers.UserMapper;
import com.treningsplanlegging.treningsplanlegging.repository.FriendRequestRepository;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.service.FriendRequestService;

@RestController
@RequestMapping("/api/friend-requests")
public class FriendRequestController {

    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final FriendRequestService friendRequestService;
    private final UserMapper userMapper;

    public FriendRequestController(FriendRequestService friendRequestService, UserRepository userRepository,
            FriendRequestRepository friendRequestRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.friendRequestRepository = friendRequestRepository;
        this.friendRequestService = friendRequestService;
        this.userMapper = userMapper;
    }

    @PostMapping("/{receiverId}")
    public ResponseEntity<?> sendFriendRequest(@PathVariable Long receiverId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();

        User sender = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));

        friendRequestService.sendFriendRequest(sender, receiverId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable Long requestId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();

        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found with id: " + requestId));

        User receiver = friendRequest.getReceiver();

        if (!receiver.getLogin().equals(login)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        friendRequestRepository.delete(friendRequest);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Long requestId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();

        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found with id: " + requestId));

        // Add each user to the other's friend list
        User receiver = friendRequest.getReceiver();

        if (!receiver.getLogin().equals(login)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        friendRequestService.acceptFriendRequest(friendRequest);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getFriendRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();

        User receiver = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));

        List<FriendRequest> friendRequests = friendRequestRepository.findByReceiverAndStatus(receiver, "PENDING");
        List<FriendRequestDto> friendRequestDtos = friendRequests.stream()
    .map(friendRequest -> new FriendRequestDto(
        friendRequest.getId(),
        userMapper.toUserDto(friendRequest.getSender()),
        userMapper.toUserDto(friendRequest.getReceiver()),
        friendRequest.getStatus()))
    .collect(Collectors.toList());

        return ResponseEntity.ok(friendRequestDtos);
    }
}
