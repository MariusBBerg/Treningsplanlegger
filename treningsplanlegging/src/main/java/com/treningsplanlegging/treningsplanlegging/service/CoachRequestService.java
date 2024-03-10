package com.treningsplanlegging.treningsplanlegging.service;

import org.springframework.stereotype.Service;
import com.treningsplanlegging.treningsplanlegging.entity.CoachRequest;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.CoachRequestRepository;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class CoachRequestService {
    private final CoachRequestRepository coachRequestRepository;
    private final UserRepository userRepository;

    @Autowired
    public CoachRequestService(CoachRequestRepository coachRequestRepository, UserRepository userRepository) {
        this.coachRequestRepository = coachRequestRepository;
        this.userRepository = userRepository;
    }

    public void sendRequest(Long requesterId, Long requestedId) {
        User requester = userRepository.findById(requesterId)
                                       .orElseThrow(() -> new RuntimeException("User not found"));
        User requested = userRepository.findById(requestedId)
                                       .orElseThrow(() -> new RuntimeException("User not found"));
        CoachRequest request = new CoachRequest();
        request.setRequester(requester);
        request.setRequested(requested);
        request.setStatus("Pending");
        coachRequestRepository.save(request);
    }

    public void respondToRequest(Long requestId, String response) {
        CoachRequest request = coachRequestRepository.findById(requestId)
                                                   .orElseThrow(() -> new RuntimeException("Request not found"));
        /* 
        request.setStatus(response);
        coachRequestRepository.save(request);
        */      
        if ("Accepted".equals(response)) {
            User requester = request.getRequester();
            User requested = request.getRequested();

            requester.setCoach(requested);
            userRepository.save(requester);
            userRepository.save(requested);
            coachRequestRepository.delete(request);
        }
        else if ("Rejected".equals(response)) {
            coachRequestRepository.delete(request);
        }
        else{

        }
    }

    public List<CoachRequest> getPendingRequests(Long requestedId) {
        User requested = userRepository.findById(requestedId)
                                       .orElseThrow(() -> new RuntimeException("User not found"));
        return coachRequestRepository.findByRequestedAndStatus(requested, "Pending");
    }

    public CoachRequest findById(Long id) {
        return coachRequestRepository.findById(id)
                                     .orElseThrow(() -> new RuntimeException("Request not found"));
    }
}
