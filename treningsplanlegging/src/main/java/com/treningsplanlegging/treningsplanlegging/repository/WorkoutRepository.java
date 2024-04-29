package com.treningsplanlegging.treningsplanlegging.repository;

import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.entity.Workout;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    // Eventuelle egendefinerte spørringer kommer her
    List<Workout> findByUserId(Long userId);
    List<Workout> findTop7ByUserAndDateAfterOrderByDateAsc(User user, Date date);


}
