package com.treningsplanlegging.treningsplanlegging.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    private String email;

    private String password;

    private String login;

    private String GoogleAccessToken;

    private String GoogleRefreshToken;
    
    private Boolean isGoogleAuthenticated;

    private Boolean autoExportToGoogleCalendar;

    private String CalendarId;

    @ManyToOne
    @JoinColumn(name = "coach_id")
    @JsonManagedReference
    private User coach;

    @OneToMany(mappedBy = "coach")
    @JsonBackReference
    private List<User> clients = new ArrayList<>();



    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<Workout> workouts = new ArrayList<>();


    public User() {
    }

    public User(String login, String email, String password, String firstName, String lastName) {
        this.login = login;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public void addWorkout(Workout workout) {
        workouts.add(workout);
        workout.setUser(this);
    }

    public List<Workout> getWorkouts() {
        return new ArrayList<>(workouts);
    }

    public void setCoach(User coach) {
        /* 
        if(this.coach != null) {
            throw new  IllegalStateException("User already has a coach");
        }
        */
        this.coach = coach;
    }

    public void addClient(User client) {
        /* 
        if(this.clients.contains(client)) {
            throw new  IllegalStateException("User is already a client");
        }
        */
        clients.add(client);
        
    }
    public void removeClient(User client) {
        clients.remove(client);
        client.setCoach(null);
    }



    // Getters and setters
    // Lombok @Getter and @Setter annotations automatically generate these
}
