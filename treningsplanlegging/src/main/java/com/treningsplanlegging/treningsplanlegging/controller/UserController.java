package com.treningsplanlegging.treningsplanlegging.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.treningsplanlegging.treningsplanlegging.service.UserService;
import com.treningsplanlegging.treningsplanlegging.entity.User;

@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        boolean result = userService.registerUser(userDto.getUsername(), userDto.getEmail(), userDto.getPassword());
        if(result) {
            return ResponseEntity.ok().body("User registered successfully");
        } else {
            return ResponseEntity.badRequest().body("User already exists");
        }
    }


    
    // En enkel DTO (Data Transfer Object) for brukerregistrering
    public static class UserDto {
        private String username;
        private String email;
        private String password;

        // Standard getters and setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }    
    }

    
}


