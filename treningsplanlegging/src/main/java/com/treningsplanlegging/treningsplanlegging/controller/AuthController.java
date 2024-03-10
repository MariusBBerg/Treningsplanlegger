package com.treningsplanlegging.treningsplanlegging.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.treningsplanlegging.treningsplanlegging.config.UserAuthenticationProvider;
import com.treningsplanlegging.treningsplanlegging.dto.CredentialsDto;
import com.treningsplanlegging.treningsplanlegging.dto.SignUpDto;
import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.service.UserService;

import java.net.URI;

@RequiredArgsConstructor
@RestController
public class AuthController {

    private final UserService userService;
    private final UserAuthenticationProvider userAuthenticationProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody @Valid CredentialsDto credentialsDto) {
        UserDto userDto = userService.login(credentialsDto);
        userDto.setToken(userAuthenticationProvider.createToken(userDto.getLogin()));
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid SignUpDto user) {
        UserDto createdUser = userService.register(user);
        createdUser.setToken(userAuthenticationProvider.createToken(user.getLogin()));
        return ResponseEntity.created(URI.create("/users/" + createdUser.getId())).body(createdUser);
    }

    @PostMapping("/assign-coach")
    public ResponseEntity<UserDto> assignCoach(@RequestParam String userLogin, @RequestParam String coachLogin) {
        UserDto updatedUser = userService.assignCoach(userLogin, coachLogin);
        return ResponseEntity.ok(updatedUser);
    }

    
}
