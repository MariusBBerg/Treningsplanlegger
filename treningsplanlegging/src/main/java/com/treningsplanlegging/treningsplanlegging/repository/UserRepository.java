package com.treningsplanlegging.treningsplanlegging.repository;

import com.treningsplanlegging.treningsplanlegging.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByLogin(String login);
    List<User> findByLoginContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String login, String firstName, String lastName);
    Optional<User> findByLoginIgnoreCase(String login);
    Optional<User> findByEmailIgnoreCase(String email);

}
