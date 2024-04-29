package com.treningsplanlegging.treningsplanlegging.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    private Long id;
    private String message;
    private UserDto sender;
    private UserDto receiver;
    private String date;



    
}
