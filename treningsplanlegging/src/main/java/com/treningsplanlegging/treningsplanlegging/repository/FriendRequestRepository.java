package com.treningsplanlegging.treningsplanlegging.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.treningsplanlegging.treningsplanlegging.entity.CoachRequest;
import com.treningsplanlegging.treningsplanlegging.entity.FriendRequest;
import com.treningsplanlegging.treningsplanlegging.entity.User;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long>{
    List<FriendRequest> findByReceiverAndStatus(User requested, String status);
    FriendRequest findBySenderAndReceiver(User sender, User receiver);
}
