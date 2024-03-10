package com.treningsplanlegging.treningsplanlegging.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.treningsplanlegging.treningsplanlegging.dto.SignUpDto;
import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {


    @Mapping(target = "coach", ignore = true)
    @Mapping(target = "clients", ignore = true)
    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    User signUpToUser(SignUpDto signUpDto);


    
}
