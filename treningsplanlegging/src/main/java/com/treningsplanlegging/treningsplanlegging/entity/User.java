package com.treningsplanlegging.treningsplanlegging.entity;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @OneToMany(mappedBy = "user")
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



    // Getters and setters
    // Lombok @Getter and @Setter annotations automatically generate these
}
