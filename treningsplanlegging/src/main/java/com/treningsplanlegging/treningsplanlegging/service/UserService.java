package com.treningsplanlegging.treningsplanlegging.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.treningsplanlegging.treningsplanlegging.dto.CredentialsDto;
import com.treningsplanlegging.treningsplanlegging.dto.SignUpDto;
import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.exceptions.AppException;
import com.treningsplanlegging.treningsplanlegging.mappers.UserMapper;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.nio.CharBuffer;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserDto register(SignUpDto userDto) {
        Optional<User> optionalUser = userRepository.findByLogin(userDto.getLogin());

        if (optionalUser.isPresent()) {
            throw new AppException("Username already exists", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.signUpToUser(userDto);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));

        User savedUser = userRepository.save(user);

        return userMapper.toUserDto(savedUser);
    }

    public UserDto findByLogin(String login) {
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByLogin(credentialsDto.getLogin())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto assignCoach(String userLogin, String coachLogin) {
        User user = userRepository.findByLogin(userLogin)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        User coach = userRepository.findByLogin(coachLogin)
                .orElseThrow(() -> new AppException("Coach not found", HttpStatus.NOT_FOUND));

        user.setCoach(coach);

        User updatedUser = userRepository.save(user);

        return userMapper.toUserDto(updatedUser);
    }

    public List<UserDto> getClients(String login) {
        User user = userRepository.findByLogin(login)
                                  .orElseThrow(() -> new RuntimeException("User not found with login: " + login));
        return user.getClients().stream()
                   .map(userMapper::toUserDto)
                   .collect(Collectors.toList());
    }

}
