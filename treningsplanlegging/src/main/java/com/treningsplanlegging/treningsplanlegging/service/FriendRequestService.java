package com.treningsplanlegging.treningsplanlegging.service;

import org.springframework.stereotype.Service;
import com.treningsplanlegging.treningsplanlegging.entity.CoachRequest;
import com.treningsplanlegging.treningsplanlegging.entity.FriendRequest;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.CoachRequestRepository;
import com.treningsplanlegging.treningsplanlegging.repository.FriendRequestRepository;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@Service
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    @Autowired
    public FriendRequestService(FriendRequestRepository friendRequestRepository, UserRepository userRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.userRepository = userRepository;
    }

    public void acceptFriendRequest(FriendRequest friendRequest) {
        User receiver = friendRequest.getReceiver();
        User sender = friendRequest.getSender();

        sender.getFriends().add(receiver);
        receiver.getFriends().add(sender);
    
    
        // Save the users and the friend request
        userRepository.save(sender);
        userRepository.save(receiver);

        friendRequestRepository.delete(friendRequest);
    }

    public FriendRequest findById(Long id) {
        return friendRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    public void sendFriendRequest(User sender, Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(receiver.equals(sender)) {
            throw new IllegalStateException("You cannot send a request to yourself");
        }
        FriendRequest existingRequest = friendRequestRepository.findBySenderAndReceiver(sender, receiver);
        if (existingRequest != null) {
            throw new IllegalStateException("A pending request already exists");
        }
        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("PENDING");
        friendRequestRepository.save(request);
    }
}
