package com.treningsplanlegging.treningsplanlegging.controller;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponseException;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleRefreshTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import org.springframework.beans.factory.annotation.Value;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.http.BasicAuthentication;
import com.google.api.client.http.HttpRequest;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.dto.WorkoutDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.http.ResponseEntity;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/google-calendar")
public class GoogleCalendarController {

    private static final String CLIENT_ID = "589841951698-k4dn8c07qbhmhqp50vhb428gpa36iup1.apps.googleusercontent.com";
    private static final String CLIENT_SECRET = "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";

    private static final String REDIRECT_URI = "http://localhost:3000/googlecalendar/callback";
    private static final String APPLICATION_NAME = "Treningsplanleggeren";

    private static final List<String> SCOPES = Arrays.asList(
            "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
            "https://www.googleapis.com/auth/calendar.app.created");

    private GoogleAuthorizationCodeFlow flow;
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private final UserService userService;
    private final UserRepository userRepository;
    private User currentUser;

    public GoogleCalendarController(UserService userService, UserRepository userRepository) throws Exception {
        this.flow = new GoogleAuthorizationCodeFlow.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                CLIENT_ID,
                CLIENT_SECRET,
                SCOPES)
                .setAccessType("offline").build();
        this.userService = userService;
        this.userRepository = userRepository;
    }

    private String refreshAccessToken(String refreshToken, User cuser) {
        try {
            GoogleTokenResponse tokenResponse = new GoogleRefreshTokenRequest(
                    new NetHttpTransport(),
                    JSON_FACTORY,
                    refreshToken,
                    CLIENT_ID,
                    CLIENT_SECRET)
                    .execute();

            return tokenResponse.getAccessToken(); // Return new access token
        } catch (TokenResponseException e) {
            if (e.getDetails() != null && "invalid_grant".equals(e.getDetails().getError())) {
                // Hvis det er en "invalid_grant" feil, er refresh token ugyldig
                cuser.setIsGoogleAuthenticated(false);
                userService.updateUser(cuser);
            }
            return null;
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @PostMapping("/oauth2callback")
    public ResponseEntity<?> oauth2Callback(@RequestBody Map<String, String> body) {

        String code = body.get("code");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("feil autentisering");
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        currentUser = user;

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        try {
            GoogleTokenResponse tokenResponse = flow.newTokenRequest(code)
                    .setRedirectUri(REDIRECT_URI)
                    .execute();

            String accessToken = tokenResponse.getAccessToken();
            String refreshToken = tokenResponse.getRefreshToken();

            currentUser.setGoogleAccessToken(accessToken);
            currentUser.setGoogleRefreshToken(refreshToken);
            currentUser.setIsGoogleAuthenticated(true);

            userService.updateUser(currentUser);

            if (currentUser.getCalendarId() == null) {
                ResponseEntity response = createCalendar(currentUser);
                if (response.getStatusCode() != HttpStatus.OK) {
                    return response;
                }
            }

            return ResponseEntity.ok("Google Calendar tokens lagret");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error handling OAuth2 callback. " + e);
        }
    }

    @PostMapping("/export-event")
    public ResponseEntity<?> exportEvent(@RequestBody WorkoutDto eventDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        currentUser = user;
        String accessToken = currentUser.getGoogleAccessToken();
        String refreshToken = currentUser.getGoogleRefreshToken();

        if (accessToken == null || refreshToken == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ingen gyldig Google Calendar token funnet");
        }

        try {

            String newAccessToken = isTokenExpired(accessToken) ? refreshAccessToken(refreshToken, currentUser)
                    : accessToken;
            if (!newAccessToken.equals(accessToken)) {
                currentUser.setGoogleAccessToken(newAccessToken);
                userService.updateUser(currentUser); // Update user's token in the database
            }
            // Create a HttpRequestInitializer that uses newAccessToken
            HttpRequestInitializer httpRequestInitializer = request -> {
                request.getHeaders().setAuthorization("Bearer " + newAccessToken);
            };
            Calendar calendar = new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    httpRequestInitializer).setApplicationName(APPLICATION_NAME).build();

            // ... resten av koden

            Event event = new Event()
                    .setSummary(eventDto.getName());

            Date startDate = eventDto.getDate();
            event.setStart(new EventDateTime().setDateTime(new DateTime(startDate)));

            Date endDate;
            if ("Løping".equals(eventDto.getType())) {
                // For løpetur, legg til distanse i beskrivelsen og sett varigheten til den
                // gitte varigheten i sekunder
                String description = "Distance: " + eventDto.getDistance() + "km" + "\n" + "Intensity Zone: "
                        + eventDto.getIntensityZone() + "\n" + eventDto.getDescription();
                event.setDescription(description);
                if (eventDto.getDurationSeconds() != null) {
                    endDate = DateUtils.addSeconds(startDate, eventDto.getDurationSeconds().intValue());
                } else {
                    // Hvis durationSeconds er null, sett varigheten til en time
                    endDate = DateUtils.addSeconds(startDate, 3600);
                }
            } else {
                // For andre typer workouts, sett varigheten til en time
                endDate = DateUtils.addSeconds(startDate, 3600);
            }
            event.setEnd(new EventDateTime().setDateTime(new DateTime(endDate)));

            try {
                // Prøv å hente kalenderen
                com.google.api.services.calendar.model.Calendar existingCalendar = calendar.calendars()
                        .get(currentUser.getCalendarId()).execute();
                System.err.println(existingCalendar.getSummary());
            } catch (GoogleJsonResponseException e) {
                if (e.getStatusCode() == 404) {
                    // Kalenderen eksisterer ikke, opprett en ny
                    ResponseEntity response = createCalendar(currentUser);
                    if (response.getStatusCode() != HttpStatus.OK) {
                        return response;
                    }
                } else {
                    // Noe annet gikk galt
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error checking calendar: " + e.getMessage());
                }
            }

            // Kalenderen eksisterer, fortsett med å opprette hendelsen
            Event createdEvent = calendar.events().insert(currentUser.getCalendarId(), event).execute();

            return ResponseEntity.ok(createdEvent);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error exporting to Google Calendar " + e);
        }
    }

    @PostMapping("/create-calendar")
    public ResponseEntity<?> createCalendar() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
        currentUser = user;
        return createCalendar(currentUser);
    }

    private ResponseEntity<?> createCalendar(User user) {
        String accessToken = currentUser.getGoogleAccessToken();
        String refreshToken = currentUser.getGoogleRefreshToken();

        if (accessToken == null || refreshToken == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ingen gyldig Google Calendar token funnet");
        }

        try {
            String newAccessToken = isTokenExpired(accessToken) ? refreshAccessToken(refreshToken, currentUser)
                    : accessToken;
            if (!newAccessToken.equals(accessToken)) {
                currentUser.setGoogleAccessToken(newAccessToken);
            }
            HttpRequestInitializer httpRequestInitializer = request -> {
                request.getHeaders().setAuthorization("Bearer " + newAccessToken);
            };

            Calendar calendarService = new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    httpRequestInitializer).setApplicationName(APPLICATION_NAME).build();

            // Opprett en ny kalender
            com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();
            calendar.setSummary("WorkoutPlanner");
            com.google.api.services.calendar.model.Calendar createdCalendar = calendarService.calendars()
                    .insert(calendar).execute();

            // Lagre kalender-IDen i brukerens data
            currentUser.setCalendarId(createdCalendar.getId());
            userService.updateUser(currentUser);

            return ResponseEntity.ok(createdCalendar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating calendar " + e);
        }
    }

    // Sjekker om et token er utløpt
    public static boolean isTokenExpired(String token) {
        if (token == null || token.isEmpty()) {
            return true; // Utløpt hvis tokenet er null eller tomt
        }

        try {
            DecodedJWT decodedJWT = JWT.decode(token); // Dekode JWT for å få utløpstiden
            long currentTimeInSeconds = System.currentTimeMillis() / 1000; // Nåværende tid i sekunder
            long tokenExpiryInSeconds = decodedJWT.getExpiresAt().getTime() / 1000; // Utløpstiden i sekunder

            return currentTimeInSeconds > tokenExpiryInSeconds; // Utløpt hvis nåværende tid er større enn utløpstiden
        } catch (Exception e) {
            // Hvis det oppstår en feil under dekoding, vurder tokenet som utløpt
            return true;
        }
    }

}
