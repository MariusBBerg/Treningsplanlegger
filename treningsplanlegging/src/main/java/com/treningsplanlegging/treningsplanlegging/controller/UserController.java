package com.treningsplanlegging.treningsplanlegging.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.treningsplanlegging.treningsplanlegging.service.UserService;

@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Endepunkter for å håndtere brukere, f.eks., hente, opprette, oppdatere, slette
}
