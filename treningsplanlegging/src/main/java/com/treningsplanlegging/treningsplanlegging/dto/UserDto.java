package com.treningsplanlegging.treningsplanlegging.dto;

import java.util.List;
import com.treningsplanlegging.treningsplanlegging.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {


    private Long id;
    private String firstName;
    private String lastName;
    private String login;
    private String token;
    private String email;

    private UserDto coach;
    
    private List <UserDto> clients;



}
