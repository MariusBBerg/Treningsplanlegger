package com.treningsplanlegging.treningsplanlegging.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.treningsplanlegging.treningsplanlegging.dto.MessageDto;
import com.treningsplanlegging.treningsplanlegging.entity.Message;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.mappers.UserMapper;
import com.treningsplanlegging.treningsplanlegging.repository.MessageRepository;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public MessageController(MessageRepository messageRepository,
            UserRepository userRepository, UserMapper userMapper) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @GetMapping("/messages/{receiverId}")
    public List<MessageDto> getMessagesBetweenUsers(@PathVariable Long receiverId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String login = authentication.getName();


        User sender = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));

        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Message> messagesFromSenderToReceiver = messageRepository.findBySenderAndReceiver(sender, receiver);
        List<Message> messagesFromReceiverToSender = messageRepository.findBySenderAndReceiver(receiver, sender);

        List<Message> allMessages = new ArrayList<>();
        allMessages.addAll(messagesFromSenderToReceiver);
        allMessages.addAll(messagesFromReceiverToSender);
        allMessages.sort(Comparator.comparing(Message::getDate));

        return allMessages.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    private MessageDto convertEntityToDto(Message message) {
        MessageDto messageDto = new MessageDto();
        messageDto.setId(message.getId());
        messageDto.setMessage(message.getMessage());
        messageDto.setSender(userMapper.toUserDto(message.getSender()));
        messageDto.setReceiver(userMapper.toUserDto(message.getReceiver()));
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        messageDto.setDate(format.format(message.getDate()));

        return messageDto;
    }

}