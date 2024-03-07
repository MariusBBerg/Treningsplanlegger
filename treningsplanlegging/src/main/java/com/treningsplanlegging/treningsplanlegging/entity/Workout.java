package com.treningsplanlegging.treningsplanlegging.entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "workouts")
@Getter
@Setter
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    private Date date;

    private String description;
    private String type;

    private Double distance; // Distanse i kilometer, kan være null for ikke-løpeaktiviteter
    private Long durationSeconds;
    private Integer intensityZone;

    public Workout() {
    }

    public Workout( User user, Date date, String description) {
        this.user = user;
        this.date = date;
        this.description = description;
    }
    
}
