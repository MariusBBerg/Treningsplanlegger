package com.treningsplanlegging.treningsplanlegging.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.treningsplanlegging.treningsplanlegging.entity.Message;
import com.treningsplanlegging.treningsplanlegging.entity.User;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiver(User sender, User receiver);

}
