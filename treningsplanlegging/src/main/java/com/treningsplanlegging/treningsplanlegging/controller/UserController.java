package com.treningsplanlegging.treningsplanlegging.controller;

import com.treningsplanlegging.treningsplanlegging.config.UserAuthenticationProvider;
import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.exceptions.AppException;
import com.treningsplanlegging.treningsplanlegging.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.treningsplanlegging.treningsplanlegging.mappers.UserMapper;

@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserAuthenticationProvider userAuthenticationProvider;


    @Autowired
    public UserController(UserService userService, UserRepository userRepository, UserMapper userMapper, UserAuthenticationProvider userAuthenticationProvider) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.userAuthenticationProvider = userAuthenticationProvider;

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

    // Check if another user has the same email or login
    if (!currentUser.getEmail().equals(updatedUserDto.getEmail()) && userService.checkEmailExists(updatedUserDto.getEmail())) {
        throw new AppException("Email already exists", HttpStatus.BAD_REQUEST);
    }
    if (!currentUser.getLogin().equals(updatedUserDto.getLogin()) && userService.checkLoginExists(updatedUserDto.getLogin())) {
        throw new AppException("Username already exists", HttpStatus.BAD_REQUEST);
    }

    // Update the user data
    currentUser.setFirstName(updatedUserDto.getFirstName());
    currentUser.setEmail(updatedUserDto.getEmail());
    currentUser.setLastName(updatedUserDto.getLastName());
    currentUser.setLogin(updatedUserDto.getLogin());
    // Add any other fields that the user is allowed to update

    userRepository.save(currentUser);

    // Generate a new token, since the username is now changed.
    Authentication updatedAuthentication = new UsernamePasswordAuthenticationToken(updatedUserDto.getLogin(), null, authentication.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(updatedAuthentication);

    UserDto updatedUser = userMapper.toUserDto(currentUser);
    updatedUser.setToken(userAuthenticationProvider.createAccessToken(updatedUser.getLogin()));
    updatedUser.setRefreshToken(userAuthenticationProvider.createRefreshToken(updatedUser.getLogin()));
    // Return the object with the new token
    return ResponseEntity.ok(updatedUser);
}


    @DeleteMapping("/clients/{clientId}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long clientId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        User currentUser = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));

        // Check if the current user has permission to delete the client
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));
        if (!client.getCoach().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Delete the client
        currentUser.removeClient(client);
        userRepository.save(currentUser);
        userRepository.save(client);

        return ResponseEntity.ok().build();
    }
}