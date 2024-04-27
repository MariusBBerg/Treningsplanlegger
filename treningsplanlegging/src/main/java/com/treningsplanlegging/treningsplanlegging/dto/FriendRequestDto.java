package com.treningsplanlegging.treningsplanlegging.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestDto {
    private Long id;
    private UserDto sender;
    private UserDto receiver;
    private String status;


    public FriendRequestDto(Long id, UserDto sender, UserDto receiver, String status) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.status = status;
    }
    // constructor, getters, setters
}