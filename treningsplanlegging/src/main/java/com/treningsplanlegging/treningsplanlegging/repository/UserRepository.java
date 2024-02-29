package com.treningsplanlegging.treningsplanlegging.repository;

import com.treningsplanlegging.treningsplanlegging.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
