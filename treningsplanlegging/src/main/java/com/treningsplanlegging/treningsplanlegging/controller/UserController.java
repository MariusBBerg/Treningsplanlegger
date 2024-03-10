package com.treningsplanlegging.treningsplanlegging.controller;

import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        User currentUser = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        List<User> users = userService.searchUsers(query);
        users = users.stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(users);
    }
}