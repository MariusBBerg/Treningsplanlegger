package com.treningsplanlegging.treningsplanlegging.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.treningsplanlegging.treningsplanlegging.entity.CoachRequest;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import java.util.List;

public interface CoachRequestRepository extends JpaRepository<CoachRequest, Long> {
    List<CoachRequest> findByRequestedAndStatus(User requested, String status);
}