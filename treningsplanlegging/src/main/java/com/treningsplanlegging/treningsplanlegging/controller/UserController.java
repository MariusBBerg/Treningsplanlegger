package com.treningsplanlegging.treningsplanlegging.controller;

import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import org.springframework.security.core.Authentication;
import com.treningsplanlegging.treningsplanlegging.mappers.UserMapper;


@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, UserMapper userMapper) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
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
        @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(@RequestBody UserDto updatedUserDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();

        User currentUser = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));

        // Update the user data
        currentUser.setFirstName(updatedUserDto.getFirstName());
        currentUser.setEmail(updatedUserDto.getEmail());
        currentUser.setLastName(updatedUserDto.getLastName());
        currentUser.setLogin(updatedUserDto.getLogin());
        // Add any other fields that the user is allowed to update

        userRepository.save(currentUser);

        // Convert the updated user to a UserDto
        UserDto updatedUser = userMapper.toUserDto(currentUser);

        return ResponseEntity.ok(updatedUser);
    }
}