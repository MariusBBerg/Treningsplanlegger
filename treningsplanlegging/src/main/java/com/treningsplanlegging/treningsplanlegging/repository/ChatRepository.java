package com.treningsplanlegging.treningsplanlegging.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import com.treningsplanlegging.treningsplanlegging.entity.Chat;
import com.treningsplanlegging.treningsplanlegging.entity.User;

public interface ChatRepository extends JpaRepository<Chat, Long>{
    @Query("SELECT c FROM Chat c JOIN c.users u WHERE u.id = :userId")
    List<Chat> findChatByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Chat c WHERE :user1 MEMBER OF c.users AND :user2 MEMBER OF c.users")
    Chat findSingleChatByUsers(@Param("user1") User user1, @Param("user2") User user2);
}