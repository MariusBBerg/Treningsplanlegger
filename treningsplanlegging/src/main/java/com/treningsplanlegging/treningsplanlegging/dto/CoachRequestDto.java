package com.treningsplanlegging.treningsplanlegging.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoachRequestDto {
    private Long id;
    private UserDto requester;
    private UserDto requested;
    private String status;


    public CoachRequestDto(Long id, UserDto requester, UserDto requested, String status) {
        this.id = id;
        this.requester = requester;
        this.requested = requested;
        this.status = status;
    }
    
}
